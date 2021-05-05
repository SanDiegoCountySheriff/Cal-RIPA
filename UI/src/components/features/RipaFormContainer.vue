<template>
  <ripa-form-template
    :beats="mappedFormBeats"
    :cities="mappedFormCities"
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
      'mappedFormCities',
      'mappedFormSchools',
      'mappedFormStatutes',
    ]),
  },
}
</script>
