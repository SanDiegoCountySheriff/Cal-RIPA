<template>
  <div class="tw-pb-4">
    <ripa-form-header
      title="Force Actions Taken During Stop"
      required
      :subtitle="
        model.stopVersion === 1 ? '§999.226(a)(12)' : '§999.226(a)(17)'
      "
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.forceActionsTaken.anyForceActionsTaken"
            label="Use Of Force?"
            :max-width="200"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.forceActionsTaken.anyForceActionsTaken">
            <ripa-check-group
              v-model="model.forceActionsTaken.forceActionsTakenDuringStop"
              :items="forceActionsTakenItems"
              :rules="forceActionsTakenRules"
              @input="handleInput"
            >
            </ripa-check-group>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { FORCE_ACTIONS_TAKEN } from '@/constants/form'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'

export default {
  name: 'ripa-force-actions-taken',

  components: {
    RipaSwitch,
    RipaCheckGroup,
    RipaFormHeader,
  },

  data() {
    return {
      forceActionsTakenItems: FORCE_ACTIONS_TAKEN,
    }
  },

  computed: {
    model: {
      get() {
        return this.value
      },
    },

    forceActionsTakenRules() {
      const checked = this.model.forceActionsTaken.anyForceActionsTaken
      return [
        (checked &&
          this.model.forceActionsTaken.forceActionsTakenDuringStop.length >
            0) ||
          'At least one force action taken is required',
      ]
    },
  },

  methods: {
    handleInput() {
      if (!this.model.forceActionsTaken.anyForceActionsTaken) {
        this.model.forceActionsTaken.forceActionsTakenDuringStop = []
      }

      this.$emit('input', this.model)
    },
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },
}
</script>
