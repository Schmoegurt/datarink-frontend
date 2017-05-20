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
    line-height: $lh-1;
    color: $gray-80;
    padding: $ws-lg;
    height: 100%;
    position: relative;
    box-sizing: border-box;
  }

  h1 {
    font-size: $fs-4;
    line-height: $lh-4;
    font-weight: 400;
    margin: 0 0 $ws-md 0;
  }

  h2 {
    font-size: $fs-3;
    line-height: $lh-3;
    font-weight: 400;
    margin: 0 0 $ws-md 0;
  }

  h3 {
    font-size: $fs-2;
    line-height: $lh-2;
    font-weight: 400;
    margin: 0 0 $ws-md 0;
  }

  h4 {
    font-size: $fs-1;
    line-height: $lh-1;
    font-weight: 700;
    margin: 0 0 $ws-md 0;
  }

  p,
  a {
    font-size: $fs-1;
    line-height: $lh-0;
    font-weight: 400;
    margin: 0 0 $ws-md 0;
  }

  a {
    text-decoration: none;
    color: $blue-50;
  }

  a:hover {
    text-decoration: underline;
  }

  label {
    font-size: $fs-0;
    line-height: $lh-0;
    padding-bottom: $ws-xs;
  }

  /**
   * Buttons, text fields, selects
   */

  button,
  input[type="text"],
  input[type="number"],
  select {
    -moz-appearance: none;
    -webkit-appearance: none;

    display: inline-block;
    vertical-align: top;

    box-sizing: border-box;
    height: $sz-md;
    line-height: $lh-0;
    border: 1px solid $gray-20;
    padding: 0 $ws-sm;

    font-family: $font-stack;
    font-size: $fs-0;
    color: $gray-80;
    background: #fff;
    border-radius: 2px;
  }

  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance:textfield;
  }

  button.selected,
  button.selected:hover,
  button.selected:active {
    background: $gray-20;
  }

  select,
  button {
    cursor: pointer;
  }

  button {
    background: $white-4;
  }

  select:hover,
  button:hover {
    background: $gray-10;
  }

  select:active,
  button:active {
    background: $gray-20;
  }

  input[type="text"]:focus,
  input[type="number"]:focus,
  select:focus,
  button:focus {
    outline: 0;
    border-color: $blue-40;
    box-shadow: 0 0 0 1px $blue-40;
  }

  select {
    display: block;
    padding-right: $ws-lg; /* right-padding used for caret */
  }

  select::-ms-expand {
    display: none;
  }

  .select-container {
    display: inline-block;
    vertical-align: top;
    height: $sz-md;
    position: relative;
  }

  .select-container::after {
    position: absolute;
    right: $ws-sm;
    top: 14px;
    content: "";
    border: 4px solid $gray-80;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
  }

  .button-set {
    display: inline-block;
    vertical-align: top;
  }

  .button-set button {
    border-radius: 0;
  }

  .button-set button:first-child {
    border-right: 0;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  .button-set button:last-child {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  /**
   * Checkboxes
   */

  .checkbox-group {
    line-height: 0;
  }

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
  }

  input[type="checkbox"] + label.checkbox-container {
    display: inline-block;
    vertical-align: top;
    position: relative;

    box-sizing: border-box;
    height: 20px;
    width: 20px;
    margin-right: $ws-sm;

    border: 1px solid $gray-20;
    border-radius: 2px;
    background: #fff;
    cursor: pointer;
  }

  input[type="checkbox"] + label.checkbox-container:hover {
    background: $gray-10;
  }

  input[type="checkbox"]:checked + label.checkbox-container span.checkbox-checkmark {
    content: "";
    display: block;

    width: 4px;
    height: 8px;
    border: solid $gray-80;
    border-width: 0 2px 2px 0;

    transform: rotate(45deg);
    margin-top: 3px;
    margin-left: 6px;
  }

  input[type="checkbox"] ~ label.checkbox-text {
    display: inline-block;
    vertical-align: top;
    padding: 0;
  }

  input[type="checkbox"]:focus ~ label.checkbox-container {
    border-color: $blue-40;
    box-shadow: 0 0 0 1px $blue-40;
  }

  /**
   * Form groups displayed above tables
   */

  .form-group {
    display: inline-block;
    vertical-align: bottom;
    margin: 0 $ws-md $ws-md 0;
  }

  .form-group label,
  .form-group input {
    display: block;
  }

  .form-group .checkbox-group {
    padding: (($sz-md - $lh-0) / 2) 0;
  }
</style>
