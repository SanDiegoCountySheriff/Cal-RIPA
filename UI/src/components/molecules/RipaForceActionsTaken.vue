<template>
  <div class="tw-pb-4">
    <ripa-form-header
      title="Force-Related Actions Taken During Stop"
      required
      subtitle="§999.226(a)(15)"
      :on-open-statute="onOpenStatute"
    >
    </ripa-form-header>

    <v-container>
      <v-row>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.actionsTaken.anyForceActionsTaken"
            label="Any Actions Taken?"
            :max-width="200"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.actionsTaken.anyForceActionsTaken">
            <ripa-check-group
              v-model="model.actionsTaken.forceActionsTakenDuringStop"
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
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { FORCE_ACTIONS_TAKEN } from '@/constants/form'

export default {
  name: 'ripa-force-actions-taken',

  mixins: [RipaModelMixin],

  components: {
    RipaFormHeader,
    RipaSwitch,
    RipaCheckGroup,
  },

  data() {
    return {
      forceActionsTakenItems: FORCE_ACTIONS_TAKEN,
      viewModel: this.syncModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    forceActionsTakenRules() {
      const checked = this.viewModel.actionsTaken.anyForceActionsTaken
      const options =
        this.viewModel.actionsTaken.forceActionsTakenDuringStop.filter(
          item => item !== 13,
        )

      return [
        (checked && options.length > 0) ||
          'At least one force-related action taken is required',
      ]
    },
  },

  methods: {
    handleInput() {
      this.updateModel()
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.syncModel(newVal)
      this.updateModel()
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
