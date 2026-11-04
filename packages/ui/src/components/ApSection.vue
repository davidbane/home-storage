<template>
  <section class="flex flex-col gap-3 md:gap-3.5">
    <div class="flex items-baseline justify-between gap-3">
      <component
        :is="as ?? 'h2'"
        class="m-0 type-title md:text-[1.625rem] md:leading-[1.875rem]"
      >
        {{ title }}
      </component>

      <slot name="aside">
        <RouterLink
          v-if="linkLabel && linkTo"
          :to="linkTo"
          class="text-[13px] leading-[18px] font-medium text-sapphire-ink no-underline hover:underline md:text-sm"
        >{{ linkLabel }}</RouterLink>
      </slot>
    </div>

    <slot />
  </section>
</template>

<script setup>
  import { RouterLink } from 'vue-router';

  /** A titled section with an optional link at the right ("See all"). */
  defineProps({
    title: { type: String, required: true },
    linkLabel: String,
    linkTo: [String, Object],
    as: { type: String, validator: (value) => ['h2', 'h3'].includes(value) },
  });
</script>
