<template>
  <div class="ripa-gender tw-pb-4">
    <template class="tw-mb-4">
      <ripa-form-header
        title="Perceived Gender"
        required
        subtitle="§999.226(a)(5)"
        v-on="$listeners"
      >
      </ripa-form-header>

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-radio-group
              v-model="model.person.perceivedGender"
              :disabled="disabled"
              :items="genderItems"
              :rules="genderRules"
              clear-selection
            >
            </ripa-radio-group>
          </v-col>

          <v-col cols="12" sm="12">
            <ripa-switch
              v-model="model.person.genderNonconforming"
              label="Gender Nonconforming"
              :disabled="disabled"
              :max-width="250"
              :rules="genderRules"
            ></ripa-switch>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-if="model.stopVersion === 1">
      <ripa-form-header
        class="tw-mt-8"
        title="Perceived LGBT"
        required
        subtitle="§999.226(a)(6)"
        v-on="$listeners"
      >
      </ripa-form-header>

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-switch
              v-model="model.person.perceivedLgbt"
              label="Perceived as LGBT"
              :max-width="200"
              :disabled="isPerceivedLgbtDisabled"
            ></ripa-switch>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-else>
      <ripa-form-header
        class="tw-mt-8"
        title="Perceived Sexual Orientation"
        required
        subtitle="§999.226(a)(6)"
        v-on="$listeners"
      >
      </ripa-form-header>

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-radio-group
              v-model="model.person.perceivedSexualOrientation"
              :items="orientationItems"
              :rules="orientationRules"
              label="Perceived Sexual Orientation"
            ></ripa-radio-group>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { GENDERS, SEXUAL_ORIENTATIONS } from '@/constants/form'

export default {
  name: 'ripa-gender',

  components: {
    RipaFormHeader,
    RipaRadioGroup,
    RipaSwitch,
  },

  data() {
    return {
      genderItems: GENDERS,
      orientationItems: SEXUAL_ORIENTATIONS,
    }
  },

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        if (newVal.stopVersion === 1) {
          newVal.person.perceivedSexualOrientation = null
          if (
            newVal.person.perceivedGender === 3 ||
            newVal.person.perceivedGender === 4
          ) {
            newVal.person.perceivedLgbt = true
          }
          if (
            newVal.person.perceivedGender === 1 ||
            newVal.person.perceivedGender === 2
          ) {
            newVal.person.perceivedLgbt = false
          }
        } else {
          newVal.person.perceivedLgbt = null
        }

        this.$emit('input', newVal)
      },
    },

    genderRules() {
      const gender = this.model.person.perceivedGender
      const checked = this.model.person.genderNonconforming
      const isValid = gender !== null || checked

      return [isValid !== false || 'A gender is required']
    },

    orientationRules() {
      return [
        !!this.model.person.perceivedSexualOrientation ||
          'A perceived orientation is required',
      ]
    },

    isPerceivedLgbtDisabled() {
      return (
        this.disabled ||
        this.model.person.perceivedGender === 3 ||
        this.model.person.perceivedGender === 4
      )
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
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
