<template>
  <div class="ripa-switch" :style="{ maxWidth: maxWidth + 'px' }">
    <v-switch
      v-model="model"
      inset
      class="v-input--reverse v-input--expand"
      :disabled="disabled"
      :hint="hint"
      :persistent-hint="hint.length > 0"
      :rules="rules"
      :hide-details="rules.length === 0"
      validate-on-blur
    >
      <template #label>
        <span class="main-label mr-3">
          {{ label }}
        </span>
        <span
          class="switch-label"
          :style="{ right: model ? '-27px' : '-45px' }"
        >
          {{ model ? 'Yes' : 'No' }}
        </span>
      </template>
    </v-switch>
  </div>
</template>

<script>
export default {
  name: 'ripa-switch',

  computed: {
    model: {
      get() {
        return this.value
      },

      set(newVal) {
        this.$emit('input', newVal)
      },
    },
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: 'no',
    },
    hint: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: Number,
      default: 300,
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss">
.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
  .v-application--is-ltr & {
    .v-input--selection-controls__input {
      margin-right: 0;
      margin-left: 8px;
    }
  }
  .v-application--is-rtl & {
    .v-input--selection-controls__input {
      margin-left: 0;
      margin-right: 8px;
    }
  }
}

.v-input--expand .v-input__slot {
  .v-label {
    display: block;
    flex: 1;
  }
}

.switch-label {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: 1000;
  pointer-events: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
