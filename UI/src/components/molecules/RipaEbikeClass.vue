<template>
  <div class="tw-pb-4">
    <template class="tw-mb-4">
      <ripa-form-header title="E-Bike Class" required v-on="$listeners" />

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-check-group
              v-model="model.ebikeInfo.ebikeClass"
              :items="ebikeClasses"
              @input="handleInput"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'

export default {
  name: 'ripa-ebike',

  components: {
    RipaFormHeader,
  },

  data() {
    return {
      ebikeClasses: [1, 2, 3],
    }
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
