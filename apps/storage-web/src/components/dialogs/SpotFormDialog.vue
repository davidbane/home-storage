<template>
  <ApDialog
    v-model:open="open"
    :title="title"
    description="Furniture, a drawer or bin inside it, or a slot inside that."
  >
    <form
      id="spot-form"
      class="flex flex-col gap-4 pb-2"
      novalidate
      @submit.prevent="save"
    >
      <ApTextField
        v-model="form.name"
        label="Name"
        required
        :maxlength="75"
        placeholder="Drawer B"
        :error="errors.name"
        autofocus
      />
      <ApSelect
        v-model="form.parent"
        label="Inside"
        required
        :error="errors.parent"
      >
        <option
          :value="null"
          disabled
        >
          Choose a room or spot
        </option>
        <optgroup
          v-for="group in parentGroups"
          :key="group.room.id"
          :label="group.room.name"
        >
          <option
            v-for="option in group.options"
            :key="option.id"
            :value="option.id"
          >
            {{ option.label }}
          </option>
        </optgroup>
      </ApSelect>
      <ApSelect
        v-model="form.type"
        label="Type"
        required
        :error="errors.type"
      >
        <option
          :value="null"
          disabled
        >
          Choose a type
        </option>
        <option
          v-for="storageType in house.types"
          :key="storageType.id"
          :value="storageType.id"
        >
          {{ storageType.name }}
        </option>
        <option :value="NEW_TYPE">
          New type…
        </option>
      </ApSelect>
      <ApTextField
        v-if="form.type === NEW_TYPE"
        v-model="form.newType"
        label="New type name"
        required
        :maxlength="30"
        placeholder="Tote"
        :error="errors.newType"
      />
      <div class="grid grid-cols-2 gap-3">
        <ApTextField
          v-model="form.code"
          label="Label code"
          :maxlength="20"
          placeholder="C-07-B"
          hint="Printed on its label"
        />
        <ApTextField
          v-model="form.note"
          label="Note"
          placeholder="chargers"
          hint="Shown on its tile"
        />
      </div>
      <p
        v-if="house.saveError"
        role="alert"
        class="m-0 text-[13px] leading-[18px] text-oxblood-ink"
      >
        Couldn't save: {{ house.saveError }}
      </p>
    </form>
    <template #footer>
      <ApButton
        v-if="editing"
        variant="ghost"
        class="mr-auto text-oxblood-ink!"
        @click="ui.openRemovePlace(editing.id)"
      >
        Remove
      </ApButton>
      <ApButton
        variant="ghost"
        @click="ui.close()"
      >
        Cancel
      </ApButton>
      <ApButton
        variant="primary"
        type="submit"
        form="spot-form"
      >
        {{ editing ? 'Save changes' : 'Add storage' }}
      </ApButton>
    </template>
  </ApDialog>
</template>

<script setup>
  import { computed, reactive, watch } from 'vue';
  import { ApButton, ApDialog, ApSelect, ApTextField, useToast } from '@home/ui';
  import { useHouseStore } from '@/stores/house';
  import { useUiStore } from '@/stores/ui';

  /**
   * Add or edit a storage spot: furniture in a room, a drawer or bin inside it, or a slot
   * inside that. "Inside" lists rooms and spots, minus this spot and anything within it.
   */
  const house = useHouseStore();
  const ui = useUiStore();
  const { show } = useToast();

  const NEW_TYPE = '__new__';
  const editing = computed(() => (ui.dialog?.kind === 'spot-edit' ? house.location(ui.dialog.id) : undefined));
  const open = computed({
    get: () => ui.dialog?.kind === 'spot-add' || (ui.dialog?.kind === 'spot-edit' && Boolean(editing.value)),
    set: (isOpen) => !isOpen && ui.close(),
  });

  const form = reactive({ name: '', parent: null, type: null, newType: '', code: '', note: '' });
  const errors = reactive({});

  watch(open, (isOpen) => {
    if (!isOpen) {
      return;
    }
    Object.keys(errors).forEach((field) => delete errors[field]);
    const spot = editing.value;
    Object.assign(form, {
      name: spot?.name ?? '',
      parent: spot?.parent ?? (ui.dialog?.kind === 'spot-add' ? ui.dialog.parent : null),
      type: spot?.type ?? null,
      newType: '',
      code: spot?.code ?? '',
      note: spot?.note ?? '',
    });
  });

  /** Where this spot can go: each room, then the spots in it (indented by depth). */
  const parentGroups = computed(() => {
    const blocked = editing.value ? house.descendants(editing.value.id) : new Set();
    return house.rooms.map((room) => ({
      room,
      options: [
        { id: room.id, label: `Directly in ${room.name}` },
        ...house.places
          .find((group) => group.room.id === room.id)
          .options.filter((option) => !blocked.has(option.id))
          .map((option) => ({ id: option.id, label: `In ${option.label}` })),
      ],
    }));
  });

  const title = computed(() => {
    if (editing.value) {
      return `Edit ${editing.value.name}`;
    }
    const parent = form.parent ? house.location(form.parent) : undefined;
    return parent ? `Add storage to ${parent.name}` : 'Add storage';
  });

  async function save() {
    Object.keys(errors).forEach((field) => delete errors[field]);
    if (!form.name.trim()) {
      errors.name = 'Enter a name.';
    }
    if (!form.parent) {
      errors.parent = 'Choose where it is.';
    }
    if (!form.type) {
      errors.type = 'Choose a type.';
    }
    if (form.type === NEW_TYPE && !form.newType.trim()) {
      errors.newType = 'Name the new type.';
    }
    if (Object.keys(errors).length) {
      return;
    }

    let type = form.type;
    if (type === NEW_TYPE) {
      const created = await house.addType(form.newType);
      if (!created) {
        return void (errors.newType = `Couldn't add that type: ${house.saveError}`);
      }
      type = created.id;
    }
    const draft = { name: form.name.trim(), parent: form.parent, type, code: form.code.trim(), note: form.note.trim() };
    const spot = editing.value;
    if (spot) {
      await house.updateSpot(spot.id, draft);
      if (house.saveError) {
        return;
      }
      ui.close();
      show(`Saved ${draft.name}`);
    } else {
      const added = await house.addSpot(draft);
      if (!added) {
        return;
      }
      ui.close();
      show(`Added ${added.name} to ${house.location(draft.parent)?.name}`);
    }
  }
</script>
