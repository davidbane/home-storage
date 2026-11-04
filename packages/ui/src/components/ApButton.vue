<template>
  <ApLink
    :to="props.to"
    :href="props.href"
    as="button"
    :type="!props.to && !props.href ? props.type : undefined"
    :class="[
      'inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md px-5 text-[15px] leading-5 font-medium no-underline transition duration-150 select-none',
      variants[props.variant],
      props.block && 'w-full',
    ]"
  >
    <slot name="icon" />

    <slot />
  </ApLink>
</template>

<script setup>
  import ApLink from './ApLink.vue';

  /**
   * One `primary` per view: sapphire is the only action color.
   * `tonal` for secondary actions, `ghost` for low emphasis, `danger` for removal
   * (always behind a confirmation that names the item and its location).
   */
  const props = defineProps({
    variant: { type: String, default: 'tonal', validator: (value) => ['primary', 'tonal', 'ghost', 'danger'].includes(value) },
    to: [String, Object],
    href: String,
    type: { type: String, default: 'button', validator: (value) => ['button', 'submit', 'reset'].includes(value) },
    block: Boolean,
  });

  const variants = {
    primary:
      'bg-sapphire sheen-strong text-on-sapphire shadow-glow hover:-translate-y-px hover:brightness-110 active:translate-y-px',
    tonal:
      'bg-surface-2 text-ink shadow-[inset_0_1px_0_#ffffff12,0_1px_2px_#0000004d] hover:bg-line active:translate-y-px',
    ghost: 'bg-transparent text-ink-muted hover:bg-surface-2 hover:text-ink',
    danger: 'bg-oxblood text-on-sapphire shadow-[inset_0_1px_0_#ffffff26,0_6px_18px_-8px_#8e2f2a] active:translate-y-px',
  };
</script>
