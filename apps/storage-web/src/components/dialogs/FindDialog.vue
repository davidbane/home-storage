<template>
  <ApDialog
    v-model:open="open"
    title="Find a bin"
    description="Type the code from its label, like C-07-B."
  >
    <form
      id="find-form"
      class="pb-2"
      novalidate
      @submit.prevent="go"
    >
      <ApTextField
        v-model="code"
        label="Label code"
        required
        placeholder="C-07-B"
        :error="error"
        autofocus
      />
    </form>

    <template #footer>
      <ApButton
        variant="ghost"
        @click="ui.close()"
      >
        Cancel
      </ApButton>

      <ApButton
        variant="primary"
        type="submit"
        form="find-form"
      >
        Go
      </ApButton>
    </template>
  </ApDialog>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { ApButton, ApDialog, ApTextField } from '@home/ui';
  import { useHouseStore } from '@/stores/house';
  import { useUiStore } from '@/stores/ui';

  /** Jump to a bin by the code printed on its label. Camera scanning can replace the field later. */
  const house = useHouseStore();
  const ui = useUiStore();
  const router = useRouter();

  const open = computed({ get: () => ui.dialog?.kind === 'find', set: (isOpen) => !isOpen && ui.close() });
  const code = ref('');
  const error = ref('');
  watch(open, (isOpen) => isOpen && ((code.value = ''), (error.value = '')));

  function go() {
    const place = house.findByCode(code.value);
    if (!place) {
      return void (error.value = code.value.trim() ? `No bin with the code "${code.value.trim()}".` : 'Enter a code.');
    }
    ui.close();
    if (place.kind === 'room') {
      return void router.push(`/rooms/${place.id}`);
    }
    router.push({ path: `/rooms/${house.roomOf(place.id)?.id}`, query: { in: place.id } });
  }
</script>
