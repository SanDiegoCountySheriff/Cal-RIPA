<template>
  <div class="tw-pb-4">
    <template class="tw-mb-4">
      <ripa-form-header title="E-Bike" required v-on="$listeners" />

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-switch
              v-model="model.ebike"
              label="This stop involved an E-Bike"
            ></ripa-switch>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-ebike',

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
      type: Boolean,
      default: false,
    },
  },
}
</script>
