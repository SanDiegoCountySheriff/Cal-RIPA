<template>
  <div :class="[getMarginTop, getMarginLeft]">
    <template v-if="item.level === 1">
      {{ item.header }}
      <span class="tw-ml-2" :style="{ color: getPrimaryColor() }">{{
        item.detail
      }}</span>
    </template>

    <template v-if="item.level === 2">
      <div>
        {{ item.header }}
      </div>
      <div class="tw-ml-8" v-for="(child, index) in item.children" :key="index">
        <div :class="getChildMarginLeft(child)">
          <span :style="{ color: getPrimaryColor(child.repealed) }">
            <v-tooltip v-if="child.repealed" color="error" bottom>
              <template #activator="{ on }">
                <v-icon v-on="on" color="error">mdi-alert</v-icon>
              </template>
              <span>Statute Expired</span>
            </v-tooltip>

            {{ child.detail }}
          </span>
        </div>
      </div>
    </template>

    <template v-if="item.level === 3">
      <div>
        {{ item.header }}
      </div>
      <div class="tw-ml-8" v-for="(child, index) in item.children" :key="index">
        {{ child.header }}
        <span class="tw-ml-2" :style="{ color: getPrimaryColor() }">
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

    getPrimaryColor(repealed = false) {
      return repealed
        ? this.$vuetify.theme.themes.dark.error
        : this.$vuetify.theme.themes.dark.primary
    },
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>
