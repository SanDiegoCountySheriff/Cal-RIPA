<template>
  <div class="ripa-officer tw-pb-4">
    <ripa-form-header
      title="Officer Years of Experience"
      required
      subtitle="§999.226(a)(15)"
      class="tw-mb-4"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <v-alert outlined dense type="info">
            <v-row align="center">
              <v-col class="grow">
                <template v-if="isValidUser && version === 1">
                  {{ getOfficerInfo }}
                </template>
                <template v-if="isValidUser && version === 2">
                  {{ getOfficerInfoV2 }}
                </template>
                <template v-if="!isValidUser">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </template>
              </v-col>
              <v-col class="shrink">
                <v-btn color="primary" small @click="handleUpdateUser">
                  Update
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import { OFFICER_ASSIGNMENTS, OFFICER_ASSIGNMENTS_V2 } from '@/constants/form'

export default {
  name: 'ripa-officer',

  components: {
    RipaFormHeader,
  },

  data() {
    return {
      viewModelUser: this.user,
    }
  },

  inject: ['user', 'version'],

  computed: {
    isValidUser() {
      return this.user && this.user.assignment
    },

    getOfficerInfo() {
      if (this.user) {
        const otherType =
          this.user.assignment === 10 ? this.user.otherType : null
        const otherTypeText = otherType ? ` - ${otherType} - ` : ' - '
        return `${this.getOfficerAssignmentText()} ${otherTypeText} ${
          this.user.yearsExperience
        } Years`
      }

      return 'Officer information is missing. Please open user dialog and update.'
    },

    getOfficerInfoV2() {
      if (this.user) {
        const otherType =
          this.user.assignment === 10 ? this.user.otherType : null
        const otherTypeText = otherType ? ` - ${otherType} - ` : ' - '
        return `${this.getOfficerAssignmentTextV2()} ${otherTypeText} ${
          this.user.yearsExperience
        } Years`
      }

      return 'Officer information is missing. Please open user dialog and update.'
    },
  },

  methods: {
    getOfficerAssignmentText() {
      if (this.user && this.user.assignment) {
        const [assignment] = OFFICER_ASSIGNMENTS.filter(
          item => item.value === this.user.assignment,
        )
        return assignment.name
      }

      return ''
    },

    getOfficerAssignmentTextV2() {
      if (this.user && this.user.assignment) {
        const [assignment] = OFFICER_ASSIGNMENTS_V2.filter(
          item => item.value === this.user.assignment,
        )
        return assignment.name
      }

      return ''
    },

    handleUpdateUser() {
      this.$emit('on-update-user')
    },
  },

  watch: {
    user(newValue) {
      this.viewModelUser = newValue
    },
  },
}
</script>
