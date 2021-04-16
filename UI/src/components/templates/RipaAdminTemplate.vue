<template>
  <ripa-admin-wrapper
    :loading="loading"
    :beats="beats"
    :cities="cities"
    :schools="schools"
    :statutes="statutes"
    :on-add-beat="onAddBeat"
    :on-delete-beat="onDeleteBeat"
    :on-edit-beat="onEditBeat"
  ></ripa-admin-wrapper>
</template>

<script>
import RipaAdminWrapper from '@/components/organisms/RipaAdminWrapper'

export default {
  name: 'ripa-admin-template',

  components: {
    RipaAdminWrapper,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    beats: {
      type: Array,
      default: () => [],
    },
    cities: {
      type: Array,
      default: () => [],
    },
    schools: {
      type: Array,
      default: () => [],
    },
    statutes: {
      type: Array,
      default: () => [],
    },
    onAddBeat: {
      type: Function,
      default: () => {},
    },
    onDeleteBeat: {
      type: Function,
      default: () => {},
    },
    onEditBeat: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
