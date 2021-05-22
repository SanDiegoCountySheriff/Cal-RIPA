<template>
  <div>
    <ul>
      <ripa-node-tree :node="treeData"></ripa-node-tree>
    </ul>
  </div>
</template>

<script>
import RipaNodeTree from '@/components/molecules/RipaNodeTree'

export default {
  name: 'ripa_tree',

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
