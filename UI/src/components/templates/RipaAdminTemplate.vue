<template>
  <ripa-admin-wrapper
    :loading="loading"
    :beats="beats"
    :cities="cities"
    :schools="schools"
    :statutes="statutes"
    :stops="stops"
    :submissions="submissions"
    :users="users"
    :errorCodeSearch="errorCodeSearch"
    :on-delete-beat="onDeleteBeat"
    :on-delete-city="onDeleteCity"
    :on-delete-school="onDeleteSchool"
    :on-delete-statute="onDeleteStatute"
    :on-edit-beat="onEditBeat"
    :on-edit-city="onEditCity"
    :on-edit-school="onEditSchool"
    :on-edit-statute="onEditStatute"
    :on-edit-user="onEditUser"
    :on-tab-change="onTabChange"
    @handleCallErrorCodeSearch="handleCallErrorCodeSearch"
  ></ripa-admin-wrapper>
</template>

<script>
import RipaAdminWrapper from '@/components/organisms/RipaAdminWrapper'

export default {
  name: 'ripa-admin-template',

  components: {
    RipaAdminWrapper,
  },

  methods: {
    handleCallErrorCodeSearch(val) {
      this.$emit('handleCallErrorCodeSearch', val)
    },
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
    stops: {
      type: Array,
      default: () => [],
    },
    submissions: {
      type: Array,
      default: () => [],
    },
    users: {
      type: Array,
      default: () => [],
    },
    errorCodeSearch: {
      type: Object,
      default: () => {},
    },
    onDeleteBeat: {
      type: Function,
      default: () => {},
    },
    onDeleteCity: {
      type: Function,
      default: () => {},
    },
    onDeleteSchool: {
      type: Function,
      default: () => {},
    },
    onDeleteStatute: {
      type: Function,
      default: () => {},
    },
    onEditBeat: {
      type: Function,
      default: () => {},
    },
    onEditCity: {
      type: Function,
      default: () => {},
    },
    onEditSchool: {
      type: Function,
      default: () => {},
    },
    onEditStatute: {
      type: Function,
      default: () => {},
    },
    onEditUser: {
      type: Function,
      default: () => {},
    },
    onTabChange: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
