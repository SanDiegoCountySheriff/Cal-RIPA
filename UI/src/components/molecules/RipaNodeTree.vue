<template>
  <li>
    <span class="label">{{ node.id }}. {{ node.text }}</span>

    <ul v-if="node.children && node.children.length">
      <node
        v-for="(child, index) in node.children"
        :node="child"
        :key="index"
      ></node>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'ripa-node-tree',

  props: {
    node: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
