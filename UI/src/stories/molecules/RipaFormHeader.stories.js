import RipaFormHeader from '@/components/molecules/RipaFormHeader'

export default {
  title: 'Molecules/RipaFormHeader',
  component: RipaFormHeader,
  parameters: {},
}

export const required = () => ({
  components: { RipaFormHeader },
  data() {
    return {
      title: 'Reason for Stop',
      subtitle: '§999.226(a)(10)',
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-header :title="title" required :subtitle="subtitle"></ripa-form-header></div>',
})

export const notRequired = () => ({
  components: { RipaFormHeader },
  data() {
    return {
      title: 'Reason for Stop',
      subtitle: '§999.226(a)(10)',
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-header :title="title" :subtitle="subtitle"></ripa-form-header></div>',
})

export const requiredNoSubtitle = () => ({
  components: { RipaFormHeader },
  data() {
    return {
      title: 'Reason for Stop',
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-header :title="title" required></ripa-form-header></div>',
})

export const notRequiredNoSubtitle = () => ({
  components: { RipaFormHeader },
  data() {
    return {
      title: 'Reason for Stop',
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-header :title="title"></ripa-form-header></div>',
})
