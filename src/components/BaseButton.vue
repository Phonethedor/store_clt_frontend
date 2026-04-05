<template>
  <button 
    class="base-button" 
    :class="[
      `base-button--${variant}`, 
      `base-button--${size}`, 
      { 'base-button--loading': loading }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="base-button__loader"></span>
    <span class="base-button__content" :class="{ 'base-button__content--hidden': loading }">
        <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // 'primary' | 'outline' | 'text'
  size: { type: String, default: 'md' },        // 'sm' | 'md' | 'lg' | 'full'
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' }
});

defineEmits(['click']);
</script>

<style lang="scss" src="../assets/styles/base/_ui.scss" scoped></style>
