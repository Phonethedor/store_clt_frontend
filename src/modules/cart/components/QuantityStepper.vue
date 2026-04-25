<script setup>
const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
  size: { type: String, default: 'md' }, // 'sm' | 'md'
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'change']);

const increase = () => {
  if (props.modelValue < props.max) {
    const newVal = props.modelValue + 1;
    emit('update:modelValue', newVal);
    emit('change', newVal);
  }
};

const decrease = () => {
  if (props.modelValue > props.min) {
    const newVal = props.modelValue - 1;
    emit('update:modelValue', newVal);
    emit('change', newVal);
  }
};
</script>

<style lang="scss" src="../../../assets/styles/components/_quantity-stepper.scss" scoped></style>

<template>
  <div class="quantity-stepper" :class="[`quantity-stepper--${size}`]">
    <button class="quantity-stepper__btn" @click="decrease" :disabled="modelValue <= min || disabled"
      aria-label="Disminuir cantidad">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14" />
      </svg>
    </button>

    <span class="quantity-stepper__display">{{ modelValue }}</span>

    <button class="quantity-stepper__btn" @click="increase" :disabled="modelValue >= max || disabled"
      aria-label="Aumentar cantidad">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  </div>
</template>
