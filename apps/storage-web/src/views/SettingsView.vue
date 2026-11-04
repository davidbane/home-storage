<template>
  <ApContainer>
    <ApPageHead title="Settings" />

    <div class="flex flex-col gap-10 md:max-w-2xl">
      <ApSection title="Storage types">
        <p class="m-0 type-meta text-ink-muted">
          The kinds of storage you use, like Drawer chest, Bin or Shelf. Every storage spot has one.
        </p>

        <ul class="m-0 list-none rounded-md bg-surface-1 p-0 shadow-raised">
          <li
            v-for="storageType in house.types"
            :key="storageType.id"
            class="flex flex-col gap-1 px-4 py-2 [&+&]:border-t [&+&]:border-line"
          >
            <div class="flex items-center gap-3">
              <input
                :value="drafts[storageType.id] ?? storageType.name"
                :aria-label="`Rename ${storageType.name}`"
                maxlength="30"
                class="h-11 min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 text-[15px] text-ink outline-none hover:border-line focus:border-sapphire-ink focus:bg-surface-0"
                @input="drafts[storageType.id] = $event.target.value"
                @blur="rename(storageType.id)"
                @keydown.enter.prevent="$event.target.blur()"
              >

              <span class="type-meta whitespace-nowrap text-ink-muted">{{ house.typeUsage(storageType.id) || 'unused' }}{{ house.typeUsage(storageType.id) ? (house.typeUsage(storageType.id) === 1 ? ' place' : ' places') : '' }}</span>

              <ApIconButton
                :label="`Remove ${storageType.name}`"
                @click="remove(storageType.id, storageType.name)"
              >
                <IconTrash
                  :size="18"
                  stroke="1.5"
                  aria-hidden="true"
                />
              </ApIconButton>
            </div>

            <p
              v-if="rowError?.id === storageType.id"
              role="alert"
              class="m-0 px-2 text-[13px] leading-[18px] text-oxblood-ink"
            >
              {{ rowError.message }}
            </p>
          </li>

          <li
            v-if="!house.types.length"
            class="px-4 py-4 text-[15px] text-ink-muted"
          >
            No storage types yet.
          </li>
        </ul>

        <form
          class="flex items-start gap-3"
          novalidate
          @submit.prevent="add"
        >
          <div class="flex-1">
            <ApTextField
              v-model="newType"
              label="New storage type"
              required
              :maxlength="30"
              placeholder="Tote"
              :error="addError"
            />
          </div>

          <ApButton
            type="submit"
            class="mt-6.5"
          >
            Add
          </ApButton>
        </form>
      </ApSection>

      <ApSection title="Appearance">
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface-1 px-4 py-3 shadow-raised">
          <span class="text-[15px]">{{ theme === 'night' ? 'Night theme' : 'Parchment theme' }}</span>

          <ApButton @click="toggle">
            <template #icon>
              <IconSun
                v-if="theme === 'night'"
                :size="18"
                stroke="1.5"
                aria-hidden="true"
              />

              <IconMoon
                v-else
                :size="18"
                stroke="1.5"
                aria-hidden="true"
              />
            </template>
            Switch to {{ theme === 'night' ? 'parchment' : 'night' }}
          </ApButton>
        </div>
      </ApSection>
    </div>
  </ApContainer>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import { IconMoon, IconSun, IconTrash } from '@tabler/icons-vue';
  import { ApButton, ApContainer, ApIconButton, ApPageHead, ApSection, ApTextField, useTheme, useToast } from '@home/ui';
  import { useHouseStore } from '@/stores/house';

  const house = useHouseStore();
  const { theme, toggle } = useTheme();
  const { show } = useToast();

  const newType = ref('');
  const addError = ref('');
  // Per-row draft names while renaming; saved on blur or Enter.
  const drafts = reactive({});
  /** { id, message } for the row whose remove failed. */
  const rowError = ref(null);

  async function add() {
    addError.value = '';
    const name = newType.value.trim();
    if (!name) {
      return void (addError.value = 'Enter a name.');
    }
    if (house.types.some((existing) => existing.name.toLowerCase() === name.toLowerCase())) {
      return void (addError.value = `${name} already exists.`);
    }
    const created = await house.addType(name);
    if (!created) {
      return void (addError.value = `Couldn't add it: ${house.saveError}`);
    }
    newType.value = '';
    show(`Added ${created.name}`);
  }

  async function rename(id) {
    const name = drafts[id];
    delete drafts[id];
    if (name === undefined) {
      return;
    }
    await house.renameType(id, name);
  }

  async function remove(id, name) {
    rowError.value = null;
    const removed = await house.removeType(id);
    if (!removed) {
      return void (rowError.value = { id, message: house.saveError ?? 'Couldn\'t remove it.' });
    }
    show(`Removed ${name}`);
  }
</script>
