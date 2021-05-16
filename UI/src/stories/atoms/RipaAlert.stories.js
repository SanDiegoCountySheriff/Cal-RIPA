import RipaAlert from '@/components/atoms/RipaAlert'

export default {
  title: 'Atoms/RipaAlert',
  component: RipaAlert,
  parameters: {},
}

export const error = () => ({
  components: { RipaAlert },
  data() {
    return {
      getLabelText: 'no',
    }
  },
  template: `<ripa-alert alert-type="error">
    Oops, you may have missed something! Please review your selections
        above.
    </ripa-alert>`,
})

export const info = () => ({
  components: { RipaAlert },
  data() {
    return {
      getLabelText: 'no',
    }
  },
  template: `<ripa-alert alert-type="info">
    Oops, you may have missed something! Please review your selections
        above.
    </ripa-alert>`,
})

export const warning = () => ({
  components: { RipaAlert },
  data() {
    return {
      getLabelText: 'no',
    }
  },
  template: `<ripa-alert alert-type="warning">
    Oops, you may have missed something! Please review your selections
        above.
    </ripa-alert>`,
})

export const errorOutlined = () => ({
  components: { RipaAlert },
  data() {
    return {
      getLabelText: 'no',
    }
  },
  template: `<ripa-alert alert-outlined alert-type="error">
    Oops, you may have missed something! Please review your selections
        above.
    </ripa-alert>`,
})

export const infoOutlined = () => ({
  components: { RipaAlert },
  data() {
    return {
      getLabelText: 'no',
    }
  },
  template: `<ripa-alert alert-outlined alert-type="info">
    Oops, you may have missed something! Please review your selections
        above.
    </ripa-alert>`,
})

export const warningOutlined = () => ({
  components: { RipaAlert },
  data() {
    return {
      getLabelText: 'no',
    }
  },
  template: `<ripa-alert alert-outlined alert-type="warning">
    Oops, you may have missed something! Please review your selections
        above.
    </ripa-alert>`,
})
