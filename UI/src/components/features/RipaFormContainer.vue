<template>
  <ripa-form-template
    :beats="mappedBeats"
    :cities="mappedCities"
    :schools="mappedSchools"
    :offense-codes="mappedStatutes"
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
      'mappedBeats',
      'mappedCities',
      'mappedSchools',
      'mappedStatutes',
    ]),
  },
}
</script>
