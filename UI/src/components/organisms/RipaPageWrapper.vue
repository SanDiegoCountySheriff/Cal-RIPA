<template>
  <div class="ripa-page-wrapper">
    <ripa-app-bar
      v-on="$listeners"
      @handleLogOut="handleLogOut"
      @handleLogIn="handleLogIn"
    ></ripa-app-bar>

    <ripa-content-wrapper>
      <template v-if="loading">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            :size="100"
            :width="3"
          >
            Initializing
          </v-progress-circular>
        </div>
      </template>
      <template v-if="!loading">
        <slot></slot>
      </template>
    </ripa-content-wrapper>

    <v-footer padless fixed>
      <v-col class="text-center" cols="12">
        © {{ new Date().getFullYear() }} — CSSA — {{ getVersion }}
      </v-col>
    </v-footer>
  </div>
</template>

<script>
import RipaAppBar from '@/components/molecules/RipaAppBar'
import RipaContentWrapper from '@/components/organisms/RipaContentWrapper'
import { VERSION } from '@/constants/app'

export default {
  name: 'ripa-page-wrapper',

  components: {
    RipaAppBar,
    RipaContentWrapper,
  },

  computed: {
    getVersion() {
      return VERSION
    },
  },

  methods: {
    handleLogOut() {
      this.$emit('handleLogOut')
    },

    handleLogIn() {
      this.$emit('handleLogIn')
    },
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
@media only screen and (max-width: 600px) {
  .v-footer {
    max-height: 20px !important;

    .text-center {
      padding: 2px !important;
      font-size: 14px !important;
    }
  }
}
</style>
