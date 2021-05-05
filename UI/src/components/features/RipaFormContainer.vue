<template>
  <ripa-form-template
    :beats="mappedFormBeats"
    :county-cities="mappedFormCountyCities"
    :non-county-cities="mappedFormNonCountyCities"
    :schools="mappedFormSchools"
    :statutes="mappedFormStatutes"
  ></ripa-form-template>
</template>

<script>
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import { mapGetters } from 'vuex'

export default {
  name: 'ripa-form-container',

  components: {
    RipaFormTemplate,
  },

  computed: {
    ...mapGetters([
      'mappedFormBeats',
      'mappedFormCountyCities',
      'mappedFormNonCountyCities',
      'mappedFormSchools',
      'mappedFormStatutes',
    ]),
  },
}
</script>
