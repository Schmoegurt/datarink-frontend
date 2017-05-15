<template>
  <div class="fixed-table-container">
    <table>
      <thead>
        <tr>
          <th v-for="c in columns" :class="{ 'left-aligned': c.leftAligned }">{{ c.display }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows">
          <td v-for="c in columns" :class="{ 'left-aligned': c.leftAligned }">{{ r[c.id] }}</td>
        </tr>
      </tbody>
    </table>
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
    };
  },
  mounted() {
    const self = this;
    const container = this.$el;
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
    }, 50));
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
      const widthBuffer = 5;
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

<style>
  .fixed-table-container {
    box-sizing: border-box;
    border: 1px solid #ccc;
    overflow: auto;
    position: relative;
  }
  .fixed-table-container table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }
  .fixed-table-container th,
  .fixed-table-container td {
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 6px;
    text-align: right;
    vertical-align: top;
    font-size: 14px;
    line-height: 18px;

    /**
      * Current implementation doesn't work when
      * cells in a row have different heights
      */
    white-space: nowrap !important;
  }
  .fixed-table-container th {
    background: #eee;
    font-size: 12px;
  }
  .fixed-table-container td:first-child {
    background: #eee;
  }
  .fixed-table-container th.left-aligned,
  .fixed-table-container td.left-aligned {
    text-align: left;
  }
  .fixed-table-container tbody tr:hover td:not(:first-child) {
    background: #f4f4f4;
  }
</style>
