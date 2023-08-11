<template>
  <div class="tw-pb-4">
    <ripa-form-header
      title="Perceived Unhoused"
      required
      :subtitle="model.stopVersion === 1 ? '§999.226(a)(5)' : '§999.226(a)(11)'"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.person.perceivedUnhoused"
            label="Perceived Unhoused"
          ></ripa-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-perceived-unhoused',

  components: {
    RipaFormHeader,
    RipaSwitch,
  },

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },
  },

  watch: {
    model: {
      handler: function (newVal) {
        this.model = newVal
      },
      deep: true,
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
