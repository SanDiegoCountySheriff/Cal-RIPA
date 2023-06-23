<template>
  <div>
    <ripa-form-header
      title="Perceived Unhoused"
      required
      subtitle="§999.226(a)(5)"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col>
          <ripa-switch
            v-model="model.person.perceivedUnhoused"
            label="Perceived Unhoused"
            :max-width="200"
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
