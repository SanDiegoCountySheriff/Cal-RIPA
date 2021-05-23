<template>
  <div class="ripa-page-wrapper">
    <ripa-app-bar
      :admin="admin"
      :display-environment="displayEnvironment"
      :environment-name="environmentName"
      :online="online"
      :invalidUser="invalidUser"
      :dark="dark"
      :on-update-dark="onUpdateDark"
      :on-update-user="onUpdateUser"
    ></ripa-app-bar>
    <ripa-content-wrapper>
      <slot></slot>
    </ripa-content-wrapper>

    <ripa-speed-dial v-if="!invalidUser"></ripa-speed-dial>
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

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    displayEnvironment: {
      type: Boolean,
      default: false,
    },
    environmentName: {
      type: String,
      default: '',
    },
    online: {
      type: Boolean,
      default: false,
    },
    onUpdateDark: {
      type: Function,
      default: () => {},
    },
    onUpdateUser: {
      type: Function,
      default: () => {},
    },
    invalidUser: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
