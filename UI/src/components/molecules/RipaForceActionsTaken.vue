<template>
  <div class="tw-pb-4">
    <ripa-form-header
      title="Force Actions Taken During Stop"
      required
      subtitle="§999.226(a)(12)"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.forceActionsTaken.anyForceActionsTaken"
            label="Any Force Actions Taken?"
            :max-width="200"
            @input="handleInput"
          ></ripa-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { FORCE_ACTIONS_TAKEN } from '@/constants/form'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-force-actions-taken',

  components: {
    RipaSwitch,
  },

  data() {
    return {
      forceActionsTakenItems: FORCE_ACTIONS_TAKEN,
    }
  },

  methods: {
    handleInput() {

    }
  }
}
</script>
