<template>
  <div class="ripa-tree">
    <ul>
      <ripa-node-tree :node="treeData"></ripa-node-tree>
    </ul>
  </div>
</template>

<script>
import RipaNodeTree from '@/components/molecules/RipaNodeTree'

export default {
  name: 'ripa-tree',

  components: {
    RipaNodeTree,
  },

  props: {
    treeData: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.ripa-tree {
  margin-left: -24px;
}
</style>
