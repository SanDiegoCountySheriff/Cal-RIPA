<template>
  <ripa-page-wrapper :admin="admin">
    <slot></slot>
    <ripa-interval
      :delay="stopInternalMs"
      @tick="checkLocalStorage"
    ></ripa-interval>
  </ripa-page-wrapper>
</template>

<script>
import RipaInterval from '@/components/atoms/RipaInterval'
import RipaPageWrapper from '@/components/organisms/RipaPageWrapper'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'

export default {
  name: 'ripa-page-container',

  mixins: [RipaApiStopJobMixin],

  components: {
    RipaInterval,
    RipaPageWrapper,
  },

  data() {
    return {
      stopInternalMs: 5000,
      isOnline: true,
      isAuthenticated: true,
    }
  },

  methods: {
    runApiStopsJob(apiStops) {
      console.log('RUN API STOPS', apiStops)
    },
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
