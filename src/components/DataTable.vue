<template>
  <div style="height: 70%; position: relative;">
    <div class="fixed-table-container" style="height: calc(100% - 40px);">
      <table>
        <thead>
          <tr>
            <th v-for="c in columns" :class="{ 'left-aligned': c.leftAligned }">{{ c.display }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in pageRows">
            <td v-for="c in columns" :class="{ 'left-aligned': c.leftAligned }">{{
              c.hasOwnProperty('decimalPlaces') ?
              r[c.id].toFixed(c.decimalPlaces) :
              r[c.id]
            }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="fixed-table-pagination" v-if="pageCount > 0">
      <div class="button-set">
        <button @click="pageNum = pageNum <= 1 ? 1 : pageNum - 1">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"><path d="M10,3,5,8l5,5L11,12,7,8,11,4Z"></path></svg>
        </button
        ><button @click="pageNum = pageNum === pageCount ? pageCount : pageNum + 1">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"><path d="M10,3,5,8l5,5L11,12,7,8,11,4Z" transform="rotate(180 8 8)"></path></svg>
        </button>
      </div
      ><span>{{ 1 + ((pageNum - 1) * pageSize) }}-{{ Math.min(pageNum * pageSize, rows.length) }}</span>
    </div>
  </div>
</template>

<script>
const _ = require('lodash');

module.exports = {
  name: 'DataTable',
  props: {
    columns: Array,
    rows: Array,
  },
  data() {
    return {
      // Store references to table elements
      thead: null,
      tbody: null,

      // Pagination variables
      pageNum: 1,
      pageSize: 50,
    };
  },
  computed: {
    pageRows() {
      const self = this;
      return this.rows.filter((r, i) =>
        (i >= (self.pageNum - 1) * self.pageSize && i < self.pageNum * self.pageSize));
    },
    pageCount() {
      return Math.ceil(this.rows.length / this.pageSize);
    },
  },
  mounted() {
    const self = this;
    const container = this.$el.querySelector('.fixed-table-container');
    this.thead = container.querySelector('thead');
    this.tbody = container.querySelector('tbody');

    // On resize, update table cell dimensions
    window.addEventListener('resize', _.debounce(self.relayout, 250));

    // On scroll, reposition table header and first column
    container.addEventListener('scroll', _.debounce(() => {
      self.thead.style.transform = `translate3d(0,${container.scrollTop}px,0)`;
      const hTransform = `translate3d(${container.scrollLeft}px,0,0)`;
      self.thead.querySelector('th').style.transform = hTransform;
      [].slice.call(self.tbody.querySelectorAll('tr > td:first-child'))
        // eslint-disable-next-line no-param-reassign
        .forEach(td => (td.style.transform = hTransform));
    }, 250));
  },
  updated() {
    this.relayout();
  },
  methods: {
    // Add inline styles to fix the header row and leftmost column
    relayout() {
      // Allow parameter reassignment so we can set element styles
      /* eslint-disable no-param-reassign */
      const thead = this.thead;
      const tbody = this.tbody;
      const ths = [].slice.call(thead.querySelectorAll('th'));
      const tbodyTrs = [].slice.call(tbody.querySelectorAll('tr'));

      /**
       * Remove inline styles so we resort to the default table layout algorithm
       * For thead, th, and td elements, don't remove the 'transform' styles applied
       * by the scroll event listener
       */
      tbody.setAttribute('style', '');
      thead.style.width = '';
      thead.style.position = '';
      thead.style.top = '';
      thead.style.left = '';
      thead.style.zIndex = '';
      ths.forEach((th) => {
        th.style.float = '';
        th.style.width = '';
        th.style.position = '';
        th.style.top = '';
        th.style.left = '';
      });
      tbodyTrs.forEach(tr => (tr.setAttribute('style', '')));
      [].slice.call(tbody.querySelectorAll('td'))
        .forEach((td) => {
          td.style.width = '';
          td.style.position = '';
          td.style.left = '';
        });

      /**
       * Store width and height of each th
       * getBoundingClientRect()'s dimensions include paddings and borders
       *
       * For FF and Safari, sometimes setting a th's width to 20px results
       * in an actual width of 20.99px - a possible reason for this might
       * be that the body tds require a larger width than 20px. To fix this,
       * artificially increase the hardcoded width by widthBuffer
       */
      const widthBuffer = 4;
      const thStyles = ths.map((th) => {
        const rect = th.getBoundingClientRect();
        const style = document.defaultView.getComputedStyle(th, '');
        return {
          boundingWidth: Math.ceil(rect.width) + widthBuffer,
          boundingHeight: Math.ceil(rect.height),
          width: Math.ceil(parseInt(style.width, 10)) + widthBuffer,
          paddingLeft: parseInt(style.paddingLeft, 10),
        };
      });

      // Set widths of thead and tbody
      const totalWidth = thStyles.reduce((sum, cur) => sum + cur.boundingWidth, 0);
      tbody.style.display = 'block';
      tbody.style.width = `${totalWidth}px`;
      thead.style.width = `${totalWidth - thStyles[0].boundingWidth}px`;

      // Position thead
      thead.style.position = 'absolute';
      thead.style.top = '0';
      thead.style.left = `${thStyles[0].boundingWidth}px`;
      thead.style.zIndex = 10;

      // Set widths of the th elements in thead. For the fixed th, set its position
      ths.forEach((th, i) => {
        th.style.width = `${thStyles[i].width}px`;
        th.style.float = 'left';
        if (i === 0) {
          th.style.position = 'absolute';
          th.style.top = '0';
          th.style.left = `${-thStyles[0].boundingWidth}px`;
        }
      });

      // Set margin-top for tbody - the fixed header is displayed in this margin
      tbody.style.marginTop = `${thStyles[0].boundingHeight}px`;

      // Set widths of the td elements in tbody. For the fixed td, set its position
      tbodyTrs.forEach((tr) => {
        tr.style.display = 'block';
        tr.style.paddingLeft = `${thStyles[0].boundingWidth}px`;
        [].slice.call(tr.querySelectorAll('td'))
          .forEach((td, j) => {
            td.style.width = `${thStyles[j].width}px`;
            if (j === 0) {
              td.style.position = 'absolute';
              td.style.left = '0';
            }
          });
      });
      /* eslint-enable */
    },
  },
};
</script>

<style lang="scss">
  @import "../variables";

  .fixed-table-container {
    box-sizing: border-box;
    border: 1px solid $gray-20;
    overflow: auto;
    position: relative;
    border-radius: 2px;
  }
  .fixed-table-container table {
    border-collapse: collapse;
    width: 100%;
  }
  .fixed-table-container th,
  .fixed-table-container td {
    border-right: 1px solid $gray-10;
    border-bottom: 1px solid $gray-10;
    padding: ($ws-xs / 2) $ws-sm (($ws-xs / 2) - 1) $ws-sm;
    line-height: $lh-1;

    text-align: right;
    vertical-align: top;
    font-size: $fs-0;
    font-weight: 400;
    white-space: nowrap !important;
  }
  .fixed-table-container th.left-aligned,
  .fixed-table-container td.left-aligned {
    text-align: left;
  }
  .fixed-table-container th,
  .fixed-table-container td:first-child {
    background: $white-4;
  }
  .fixed-table-container tbody tr:hover td {
    background: $gray-1;
  }

  /**
   * Pagination
   */
  .fixed-table-pagination {
    padding-top: $ws-sm;
    font-size: $fs-0;
  }
  .fixed-table-pagination span {
    display: inline-block;
    vertical-align: top;
    line-height: $sz-md;
    margin-left: $ws-md;
    box-sizing: border-box;
  }
  .fixed-table-pagination button {
    line-height: 0;
  }
  .fixed-table-pagination button svg {
    width: $sz-sm;
    height: $sz-sm;
    fill: $gray-80;
  }
</style>
