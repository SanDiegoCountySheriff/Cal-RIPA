<script>
export default {
  name: 'ripa-interval',

  render: () => null,

  mounted() {
    this.id = window.setInterval(() => this.$emit('tick'), this.delay)
  },

  beforeDestroy() {
    window.clearInterval(this.id)
  },

  props: {
    delay: {
      type: Number,
      required: true,
    },
  },
}
</script>
