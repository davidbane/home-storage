<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ApButton, ApDialog, ApSelect, ApTextField, useToast } from '@home/ui'
import PlaceSelect from '@/components/PlaceSelect.vue'
import { useHouseStore } from '@/stores/house'
import { useUiStore } from '@/stores/ui'

const house = useHouseStore()
const ui = useUiStore()
const router = useRouter()
const { show } = useToast()

const editing = computed(() => (ui.dialog?.kind === 'edit' ? house.item(ui.dialog.itemId) : undefined))
const open = computed({
  get: () => ui.dialog?.kind === 'add' || (ui.dialog?.kind === 'edit' && Boolean(editing.value)),
  set: (isOpen) => !isOpen && ui.close(),
})

// Text inputs bind strings; convert on save.
const form = reactive({ name: '', quantity: '1', par: '', storage_class: 'daily', location: null, brand: '', used_for: '' })
const errors = reactive({})
const saving = ref(false)

watch(open, (isOpen) => {
  if (!isOpen) return
  Object.keys(errors).forEach((field) => delete errors[field])
  const item = editing.value
  Object.assign(form, {
    name: item?.name ?? '',
    quantity: String(item?.quantity ?? 1),
    par: item?.par != null ? String(item.par) : '',
    storage_class: item?.storage_class ?? 'daily',
    location: item?.location ?? (ui.dialog?.kind === 'add' ? (ui.dialog.location ?? null) : null),
    brand: item?.brand ?? '',
    used_for: item?.used_for ?? '',
  })
})

const whole = (text) => /^\d+$/.test(text.trim())

/** The form as an ItemDraft, or undefined (with `errors` filled in) when it isn't valid. */
function validate() {
  Object.keys(errors).forEach((field) => delete errors[field])
  if (!form.name.trim()) errors.name = 'Enter a name.'
  if (!whole(form.quantity)) errors.quantity = 'Enter a whole number, 0 or more.'
  if (form.par.trim() && !whole(form.par)) errors.par = 'Enter a whole number, or leave it empty.'
  if (!form.location) errors.location = 'Choose where it lives.'
  if (Object.keys(errors).length) return
  return {
    name: form.name.trim(),
    quantity: Number(form.quantity),
    par: form.par.trim() ? Number(form.par) : null,
    storage_class: form.storage_class,
    location: form.location,
    brand: form.brand.trim() || undefined,
    used_for: form.used_for.trim() || undefined,
  }
}

async function save() {
  const draft = validate()
  if (!draft) return
  saving.value = true
  const target = editing.value
  try {
    if (target) {
      await house.updateItem(target.id, draft)
      if (!house.saveError) {
        ui.close()
        show(`Saved ${draft.name}`)
      }
    } else {
      const added = await house.addItem(draft)
      if (added) {
        ui.close()
        const place = house.location(added.location)?.name ?? 'the house'
        show(`Added ${added.name} to ${place}`, {
          action: { label: 'View', run: () => router.push({ path: `/rooms/${house.roomOf(added.location)?.id}`, query: { in: added.location, item: added.id } }) },
        })
      }
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <ApDialog v-model:open="open" :title="editing ? `Edit ${editing.name}` : 'Add an item'">
    <form id="item-form" class="flex flex-col gap-4 pb-2" novalidate @submit.prevent="save">
      <ApTextField v-model="form.name" label="Name" required :maxlength="30" placeholder="AA batteries" :error="errors.name" autofocus />
      <div class="grid grid-cols-2 gap-3">
        <ApTextField v-model="form.quantity" label="On hand" required inputmode="numeric" :error="errors.quantity" />
        <ApTextField v-model="form.par" label="Par" inputmode="numeric" placeholder="4" hint="Low below this" :error="errors.par" />
      </div>
      <PlaceSelect v-model="form.location" label="Where it lives" :error="errors.location" />
      <ApSelect v-model="form.storage_class" label="Kept as" required>
        <option value="daily">Daily use</option>
        <option value="surplus">Surplus store</option>
        <option value="long_term">Long-term</option>
      </ApSelect>
      <ApTextField v-model="form.brand" label="Brand" :maxlength="20" placeholder="Energizer" />
      <ApTextField v-model="form.used_for" label="Used for" placeholder="Smoke detectors, each spring" />
      <p v-if="house.saveError" role="alert" class="m-0 text-[13px] leading-[18px] text-oxblood-ink">Couldn't save: {{ house.saveError }}</p>
    </form>
    <template #footer>
      <ApButton variant="ghost" @click="ui.close()">Cancel</ApButton>
      <ApButton variant="primary" type="submit" form="item-form" :disabled="saving">{{ editing ? 'Save changes' : 'Add item' }}</ApButton>
    </template>
  </ApDialog>
</template>
