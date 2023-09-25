<template>
  <div class="ripa-gender tw-pb-4">
    <template class="tw-mb-4">
      <ripa-form-header
        title="Perceived Gender"
        required
        :subtitle="
          model.stopVersion === 1 ? '§999.226(a)(5)' : '§999.226(a)(6)'
        "
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
              :rules="model.stopVersion === 1 ? genderRules : genderRulesV2"
              clear-selection
            >
            </ripa-radio-group>
          </v-col>

          <v-col cols="12" sm="12">
            <ripa-switch
              v-if="model.stopVersion === 1"
              v-model="model.person.genderNonconforming"
              label="Gender Nonconforming"
              :disabled="disabled"
              :rules="genderRules"
            ></ripa-switch>

            <ripa-switch
              v-if="model.stopVersion === 2"
              v-model="model.person.nonBinaryPerson"
              label="Nonbinary person"
              :disabled="disabled"
              :rules="genderRulesV2"
            ></ripa-switch>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-if="model.stopVersion === 1">
      <ripa-form-header
        class="tw-mt-8"
        title="Perceived LGB+"
        required
        :subtitle="
          model.stopVersion === 1 ? '§999.226(a)(6)' : '§999.226(a)(7)(1)'
        "
        v-on="$listeners"
      >
      </ripa-form-header>

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-switch
              v-model="model.person.perceivedLgbt"
              label="Perceived as LGBT"
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
        :subtitle="
          model.stopVersion === 1 ? '§999.226(a)(6)' : '§999.226(a)(7)'
        "
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
import {
  GENDERS,
  PERSON_GENDERS_V2,
  SEXUAL_ORIENTATIONS,
} from '@/constants/form'

export default {
  name: 'ripa-gender',

  components: {
    RipaFormHeader,
    RipaRadioGroup,
    RipaSwitch,
  },

  data() {
    return {
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

    genderItems() {
      if (this.model.stopVersion === 1) {
        return GENDERS
      }

      return PERSON_GENDERS_V2
    },

    genderRules() {
      const gender = this.model.person.perceivedGender
      const checked = this.model.person.genderNonconforming
      const isValid = !!gender || !!checked

      return [isValid !== false || 'A gender is required']
    },

    genderRulesV2() {
      const gender = this.model.person.perceivedGender
      const checked = this.model.person.nonBinaryPerson
      const isValid = !!gender || !!checked

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
