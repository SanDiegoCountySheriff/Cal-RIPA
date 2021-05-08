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
    :on-delete-beat="onDeleteBeat"
    :on-delete-city="onDeleteCity"
    :on-delete-school="onDeleteSchool"
    :on-delete-statute="onDeleteStatute"
    :on-delete-user="onDeleteUser"
    :on-edit-beat="onEditBeat"
    :on-edit-city="onEditCity"
    :on-edit-school="onEditSchool"
    :on-edit-statute="onEditStatute"
    :on-edit-user="onEditUser"
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
    onDeleteUser: {
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
  },
}
</script>
