import RipaFormSubheader from '@/components/molecules/RipaFormSubheader'

export default {
  title: 'Molecules/RipaFormSubheader',
  component: RipaFormSubheader,
  parameters: {},
}

export const required = () => ({
  components: { RipaFormSubheader },
  data() {
    return {
      title: 'Basis for Search',
      subtitle: '§999.226(a)(10)',
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-subheader :title="title" required :subtitle="subtitle"></ripa-form-subheader></div>',
})

export const notRequired = () => ({
  components: { RipaFormSubheader },
  data() {
    return {
      title: 'Basis for Search',
      subtitle: '§999.226(a)(10)',
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-subheader :title="title" :subtitle="subtitle"></ripa-form-subheader></div>',
})

export const requiredNoSubtitle = () => ({
  components: { RipaFormSubheader },
  data() {
    return {
      title: 'Reason for Stop',
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-subheader :title="title" required></ripa-form-subheader></div>',
})

export const notRequiredNoSubtitle = () => ({
  components: { RipaFormSubheader },
  data() {
    return {
      title: 'Reason for Stop',
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-subheader :title="title"></ripa-form-subheader></div>',
})
