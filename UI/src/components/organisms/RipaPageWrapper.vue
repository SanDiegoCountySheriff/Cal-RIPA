<template>
  <div class="ripa-page-wrapper">
    <ripa-app-bar
      :admin="admin"
      :online="online"
      :authenticated="authenticated"
      :invalidUser="invalidUser"
      :dark="dark"
      :on-update-dark="onUpdateDark"
      @handleLogOut="handleLogOut"
      @handleLogIn="handleLogIn"
    ></ripa-app-bar>

    <ripa-content-wrapper>
      <slot></slot>
    </ripa-content-wrapper>

    <ripa-speed-dial v-if="!invalidUser && authenticated"></ripa-speed-dial>
  </div>
</template>

<script>
import RipaAppBar from '@/components/molecules/RipaAppBar'
import RipaContentWrapper from '@/components/organisms/RipaContentWrapper'
import RipaSpeedDial from '@/components/molecules/RipaSpeedDial'

export default {
  name: 'ripa-page-wrapper',

  components: {
    RipaAppBar,
    RipaContentWrapper,
    RipaSpeedDial,
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
    admin: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    online: {
      type: Boolean,
      default: false,
    },
    onUpdateDark: {
      type: Function,
      default: () => {},
    },
    invalidUser: {
      type: Boolean,
      default: false,
    },
    authenticated: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
