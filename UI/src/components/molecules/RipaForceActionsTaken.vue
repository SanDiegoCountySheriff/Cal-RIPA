<template>
  <div>Force Actions Taken</div>
</template>

<script>
import { FORCE_ACTIONS_TAKEN } from '@/constants/form'

export default {
  name: 'ripa-force-actions-taken',

  data() {
    return {
      forceActionsTakenItems: FORCE_ACTIONS_TAKEN,
    }
  },
}
</script>
