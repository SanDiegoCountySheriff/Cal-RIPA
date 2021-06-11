<template>
  <ripa-admin-wrapper
    :loading="loading"
    :beats="beats"
    :cities="cities"
    :schools="schools"
    :statutes="statutes"
    :stops="stops"
    :submissions="submissions"
    :currentSubmission="currentSubmission"
    :users="users"
    :errorCodeSearch="errorCodeSearch"
    :display-beat-input="displayBeatInput"
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
    @handleRedoItemsPerPage="handleRedoItemsPerPage"
    @handlePaginate="handlePaginate"
    @handleAdminFiltering="handleAdminFiltering"
    @handleSubmissionDetailItemsPerPage="handleSubmissionDetailItemsPerPage"
    @handleSubmissionDetailPaginate="handleSubmissionDetailPaginate"
    @handleSubmitStops="handleSubmitStops"
    @handleSubmitAll="handleSubmitAll"
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
    handleRedoItemsPerPage(pageData) {
      this.$emit('handleRedoItemsPerPage', pageData)
    },
    handlePaginate(pageData) {
      this.$emit('handlePaginate', pageData)
    },
    handleAdminFiltering(filterData) {
      this.$emit('handleAdminFiltering', filterData)
    },
    handleAdminSubmissionsItemsPerPage(pageData) {
      this.$emit('handleRedoItemsPerPage', pageData)
    },
    handleSubmissionDetailItemsPerPage(pageData) {
      this.$emit('handleSubmissionDetailItemsPerPage', pageData)
    },
    handleSubmissionDetailPaginate(pageData) {
      this.$emit('handleSubmissionDetailPaginate', pageData)
    },
    handleSubmitStops(stops) {
      this.$emit('handleSubmitStops', stops)
    },
    handleSubmitAll() {
      this.$emit('handleSubmitAll')
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
    displayBeatInput: {
      type: Boolean,
      default: false,
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
      type: Object,
      default: () => {},
    },
    submissions: {
      type: Object,
      default: () => {},
    },
    currentSubmission: {
      type: Object,
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
