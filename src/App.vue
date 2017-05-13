<template>
  <div style="height: 100%; position: relative;">
    <nav>
      <router-link to='/skaters'>Skaters</router-link>
      <router-link to='/teams'>Teams</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  @import '~normalize.css/normalize.css';
  @import "variables";

  html {
    height: 100%;
  }

  body {
    font-family: $font-stack;
    font-size: $fs-1;
    line-height: $lh-copy;
    color: $gray-dk;
    padding: $ws-lg;
    height: 100%;
    position: relative;
    box-sizing: border-box;
  }

  h1 {
    font-size: $fs-4;
    font-weight: 400;
    line-height: $lh-title;
    margin: 0 0 $ws-md 0;
  }

  h2 {
    font-size: $fs-3;
    font-weight: 400;
    line-height: $lh-title;
    margin: 0 0 $ws-md 0;
  }

  h3 {
    font-size: $fs-2;
    font-weight: 400;
    line-height: $lh-title;
    margin: 0 0 $ws-md 0;
  }

  h4 {
    font-size: $fs-1;
    font-weight: 700;
    line-height: $lh-title;
    margin: 0 0 $ws-md 0;
  }

  p,
  a {
    font-size: $fs-1;
    font-weight: 400;
    line-height: $lh-copy;
    margin: 0 0 $ws-md 0;
  }

  a {
    text-decoration: none;
    color: $blue-md;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
