<template>
  <li>
    <RouterLink
      v-slot="{ href, navigate, isActive }"
      :to="props.to"
      custom
    >
      <a
        :href="href"
        :aria-current="(props.active ?? isActive) ? 'page' : undefined"
        :class="[
          'flex min-h-10 items-center gap-3 rounded-md px-3 text-sm leading-5 font-medium no-underline transition-colors duration-150',
          (props.active ?? isActive) ? 'bg-sapphire-tint text-sapphire-ink' : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
        ]"
        @click="navigate"
      >
        <slot name="icon" />

        <span class="min-w-0 flex-1 truncate">{{ props.label }}</span>

        <span
          v-if="props.count !== undefined"
          :class="['type-caption', props.alert ? 'text-oxblood-ink' : 'text-ink-muted']"
        >{{ props.count }}</span>
      </a>
    </RouterLink>
  </li>
</template>

<script setup>
  import { RouterLink } from 'vue-router';

  /** Sidebar link. `count` shows at the right; `alert` turns it oxblood (e.g. low stock). */
  // `active` defaults to undefined (not false) so the router decides unless you override it.
  const props = defineProps({
    to: { type: [String, Object], required: true },
    label: { type: String, required: true },
    count: Number,
    alert: Boolean,
    active: { type: Boolean, default: undefined },
  });
</script>
