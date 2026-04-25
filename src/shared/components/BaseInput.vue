<script setup>
defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` }
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" src="../../assets/styles/base/_ui.scss" scoped></style>

<template>
  <div class="base-input" :class="{ 'base-input--error': error }">
    <label v-if="label" :for="id" class="base-input__label">
      {{ label }} <span v-if="required" class="base-input__required-mark">*</span>
    </label>

    <div class="base-input__wrapper">
      <input :id="id" :type="type" :value="modelValue" :placeholder="placeholder" :required="required"
        :disabled="disabled" class="base-input__field" @input="$emit('update:modelValue', $event.target.value)" />
    </div>

    <Transition name="slide-fade">
      <span v-if="error" class="base-input__error-message">{{ error }}</span>
    </Transition>
  </div>
</template>