import type { Item, Location } from '@/models'

// Sample data until the DRF endpoints exist. Shapes match ./types.ts.
export const locations: Location[] = [
  { id: 'house', name: 'The House', kind: 'house', parent: null },

  { id: 'kitchen', name: 'Kitchen', kind: 'room', parent: 'house' },
  { id: 'pantry', name: 'Pantry', kind: 'furniture', parent: 'kitchen', code: 'P-01' },
  { id: 'pantry-top', name: 'Top shelf', kind: 'container', parent: 'pantry', note: 'paper goods' },
  { id: 'pantry-mid', name: 'Middle shelf', kind: 'container', parent: 'pantry', note: 'baking' },
  { id: 'pantry-low', name: 'Bottom shelf', kind: 'container', parent: 'pantry', note: 'bulk' },

  { id: 'hall-closet', name: 'Hall closet', kind: 'room', parent: 'house' },
  { id: 'drawer-chest', name: 'Drawer chest', kind: 'furniture', parent: 'hall-closet', code: 'C-07', note: 'Oak drawer chest' },
  { id: 'drawer-a', name: 'Drawer A', kind: 'container', parent: 'drawer-chest', code: 'C-07-A', note: 'tools, tape' },
  { id: 'drawer-b', name: 'Drawer B', kind: 'container', parent: 'drawer-chest', code: 'C-07-B' },
  { id: 'drawer-c', name: 'Drawer C', kind: 'container', parent: 'drawer-chest', code: 'C-07-C', note: 'chargers' },
  { id: 'drawer-d', name: 'Drawer D', kind: 'container', parent: 'drawer-chest', code: 'C-07-D', note: 'gift wrap' },
  { id: 'drawer-e', name: 'Drawer E', kind: 'container', parent: 'drawer-chest', code: 'C-07-E' },
  { id: 'drawer-f', name: 'Drawer F', kind: 'container', parent: 'drawer-chest', code: 'C-07-F', note: 'first aid' },

  { id: 'garage', name: 'Garage', kind: 'room', parent: 'house' },
  { id: 'garage-shelves', name: 'Steel shelving', kind: 'furniture', parent: 'garage', code: 'G-02' },
  { id: 'shelf-1', name: 'Shelf 1', kind: 'container', parent: 'garage-shelves' },
  { id: 'shelf-2', name: 'Shelf 2', kind: 'container', parent: 'garage-shelves' },
  { id: 'shelf-3', name: 'Shelf 3', kind: 'container', parent: 'garage-shelves', note: 'overflow' },

  { id: 'basement', name: 'Basement', kind: 'room', parent: 'house' },
  { id: 'utility-rack', name: 'Utility rack', kind: 'furniture', parent: 'basement', code: 'B-01' },
  { id: 'gear-shelf', name: 'Gear shelf', kind: 'container', parent: 'utility-rack', note: 'camping' },
  { id: 'filters-bin', name: 'Filters bin', kind: 'container', parent: 'utility-rack' },

  { id: 'bedroom', name: 'Bedroom', kind: 'room', parent: 'house' },
  { id: 'closet', name: 'Closet', kind: 'furniture', parent: 'bedroom' },
  { id: 'closet-top', name: 'Top shelf', kind: 'container', parent: 'closet', note: 'linens' },

  { id: 'attic', name: 'Attic', kind: 'room', parent: 'house' },
  { id: 'attic-bins', name: 'Storage bins', kind: 'furniture', parent: 'attic', code: 'A-01' },
  { id: 'bin-4', name: 'Bin 4', kind: 'container', parent: 'attic-bins', code: 'A-01-4', note: 'holiday' },
  { id: 'bin-9', name: 'Bin 9', kind: 'container', parent: 'attic-bins', code: 'A-01-9', note: 'keepsakes' },
]

const item = (p: Partial<Item> & Pick<Item, 'name' | 'quantity' | 'location'>): Item => ({
  id: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  par: null,
  storage_class: 'daily',
  history: [],
  ...p,
})

export const items: Item[] = [
  item({
    name: '9V batteries', quantity: 1, par: 4, location: 'drawer-b', brand: 'Energizer',
    used_for: 'Smoke detectors, each spring', moved_from: 'Garage',
    history: [
      { date: '2026-10-26', text: 'Used 3 for smoke detectors' },
      { date: '2026-10-12', text: 'Moved to Drawer B' },
      { date: '2026-03-03', text: 'Added 4' },
    ],
  }),
  item({ name: 'AA batteries', quantity: 12, par: 8, location: 'drawer-b', brand: 'Duracell' }),
  item({ name: 'AAA batteries', quantity: 6, par: 4, location: 'drawer-b' }),
  item({ name: 'Headlamp', quantity: 2, location: 'drawer-b', storage_class: 'surplus', used_for: 'Camping overflow' }),
  item({ name: 'Tea lights', quantity: 1, location: 'drawer-b', storage_class: 'long_term', used_for: 'Box of 50' }),
  item({ name: 'Duct tape', quantity: 3, location: 'drawer-a' }),
  item({ name: 'Screwdriver set', quantity: 1, location: 'drawer-a' }),
  item({ name: 'Picture hooks', quantity: 40, location: 'drawer-a' }),
  item({ name: 'USB-C chargers', quantity: 4, location: 'drawer-c' }),
  item({ name: 'Wrapping paper', quantity: 5, location: 'drawer-d' }),
  item({ name: 'Bandages', quantity: 2, par: 1, location: 'drawer-f', used_for: 'Assorted box' }),

  item({ name: 'Paper towels', quantity: 14, par: 6, location: 'shelf-3', storage_class: 'surplus' }),
  item({ name: 'Motor oil', quantity: 2, location: 'shelf-1' }),
  item({ name: 'Car wash soap', quantity: 1, location: 'shelf-2' }),
  item({ name: 'Coffee filters', quantity: 12, par: 50, location: 'pantry-top' }),
  item({ name: 'Flour', quantity: 2, par: 1, location: 'pantry-mid' }),
  item({ name: 'Rice', quantity: 3, location: 'pantry-low', storage_class: 'surplus' }),
  item({ name: 'Furnace filters', quantity: 1, par: 2, location: 'filters-bin', used_for: '16×25×1' }),
  item({ name: 'Camping stove', quantity: 1, location: 'gear-shelf', moved_from: 'Garage / Bin 4' }),
  item({ name: 'Spare sheets', quantity: 3, location: 'closet-top' }),
  item({ name: 'Halloween decor', quantity: 1, location: 'bin-4', storage_class: 'long_term' }),
  item({ name: 'Yearbooks', quantity: 6, location: 'bin-9', storage_class: 'long_term' }),
]
