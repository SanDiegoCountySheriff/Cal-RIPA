<template>
  <div :class="[getMarginTop, getMarginLeft]">
    <template v-if="item.level === 1">
      {{ item.header }}
      <span class="tw-ml-2" :style="{ color: getPrimaryColor }">{{
        item.detail
      }}</span>
    </template>

    <template v-if="item.level === 2">
      <div>
        {{ item.header }}
      </div>
      <div class="tw-ml-8" v-for="child in item.children" :key="child.detail">
        <div :class="getChildMarginLeft(child)">
          <span :style="{ color: getPrimaryColor }">
            {{ child.detail }}
          </span>
        </div>
      </div>
    </template>

    <template v-if="item.level === 3">
      <div>
        {{ item.header }}
      </div>
      <div class="tw-ml-8" v-for="child in item.children" :key="child.header">
        {{ child.header }}
        <span class="tw-ml-2" :style="{ color: getPrimaryColor }">
          {{ child.detail }}
        </span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ripa-list',

  computed: {
    getPrimaryColor() {
      return this.$vuetify.theme.themes.dark.primary
    },

    getMarginTop() {
      return this.item.marginTop ? 'tw-mt-4' : ''
    },

    getMarginLeft() {
      return this.item.marginLeft ? 'tw-ml-4' : ''
    },
  },

  methods: {
    getChildMarginLeft(child) {
      return child.marginLeft ? 'tw-ml-4' : ''
    },
  },

  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
