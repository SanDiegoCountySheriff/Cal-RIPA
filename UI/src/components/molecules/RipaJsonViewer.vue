<template>
  <vue-json-pretty
    :data="data"
    :show-line="false"
    :show-double-quotes="false"
  />
</template>

<script>
export default {
  name: 'ripa-json-viewer',

  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.vjs-tree {
  font-size: 12px;

  .vjs-tree__node:hover {
    color: #fff !important;
    background-color: inherit !important;
    font-weight: 600;
    border: 1px solid #2196f3 !important;
  }
}
</style>
