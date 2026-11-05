export const storageTypes = [
  { id: 'type-chest', name: 'Drawer chest' },
  { id: 'type-drawer', name: 'Drawer' },
  { id: 'type-shelving', name: 'Shelving' },
  { id: 'type-shelf', name: 'Shelf' },
  { id: 'type-bin', name: 'Bin' },
  { id: 'type-closet', name: 'Closet' },
];

export const residence = { id: 'house', name: 'The House' };

// Sample data for running without the API. Shapes match ../models.js.
export const locations = [
  { id: 'kitchen', name: 'Kitchen', parent: null },
  { id: 'pantry', name: 'Pantry', parent: 'kitchen', code: 'P-01', type: 'type-shelving' },
  { id: 'pantry-top', name: 'Top shelf', parent: 'pantry', note: 'paper goods', type: 'type-shelf' },
  { id: 'pantry-mid', name: 'Middle shelf', parent: 'pantry', note: 'baking', type: 'type-shelf' },
  { id: 'pantry-low', name: 'Bottom shelf', parent: 'pantry', note: 'bulk', type: 'type-shelf' },

  { id: 'hall-closet', name: 'Hall closet', parent: null },
  { id: 'drawer-chest', name: 'Drawer chest', parent: 'hall-closet', code: 'C-07', note: 'Oak drawer chest', type: 'type-chest' },
  { id: 'drawer-a', name: 'Drawer A', parent: 'drawer-chest', code: 'C-07-A', note: 'tools, tape', type: 'type-drawer' },
  { id: 'drawer-b', name: 'Drawer B', parent: 'drawer-chest', code: 'C-07-B', type: 'type-drawer' },
  { id: 'drawer-c', name: 'Drawer C', parent: 'drawer-chest', code: 'C-07-C', note: 'chargers', type: 'type-drawer' },
  { id: 'drawer-d', name: 'Drawer D', parent: 'drawer-chest', code: 'C-07-D', note: 'gift wrap', type: 'type-drawer' },
  { id: 'drawer-e', name: 'Drawer E', parent: 'drawer-chest', code: 'C-07-E', type: 'type-drawer' },
  { id: 'drawer-f', name: 'Drawer F', parent: 'drawer-chest', code: 'C-07-F', note: 'first aid', type: 'type-drawer' },

  { id: 'garage', name: 'Garage', parent: null },
  { id: 'garage-shelves', name: 'Steel shelving', parent: 'garage', code: 'G-02', type: 'type-shelving' },
  { id: 'shelf-1', name: 'Shelf 1', parent: 'garage-shelves', type: 'type-shelf' },
  { id: 'shelf-2', name: 'Shelf 2', parent: 'garage-shelves', type: 'type-shelf' },
  { id: 'shelf-3', name: 'Shelf 3', parent: 'garage-shelves', note: 'overflow', type: 'type-shelf' },

  { id: 'basement', name: 'Basement', parent: null },
  { id: 'utility-rack', name: 'Utility rack', parent: 'basement', code: 'B-01', type: 'type-shelving' },
  { id: 'gear-shelf', name: 'Gear shelf', parent: 'utility-rack', note: 'camping', type: 'type-shelf' },
  { id: 'filters-bin', name: 'Filters bin', parent: 'utility-rack', type: 'type-bin' },

  { id: 'bedroom', name: 'Bedroom', parent: null },
  { id: 'closet', name: 'Closet', parent: 'bedroom', type: 'type-closet' },
  { id: 'closet-top', name: 'Top shelf', parent: 'closet', note: 'linens', type: 'type-shelf' },

  { id: 'attic', name: 'Attic', parent: null },
  { id: 'attic-bins', name: 'Storage bins', parent: 'attic', code: 'A-01', type: 'type-shelving' },
  { id: 'bin-4', name: 'Bin 4', parent: 'attic-bins', code: 'A-01-4', note: 'holiday', type: 'type-bin' },
  { id: 'bin-9', name: 'Bin 9', parent: 'attic-bins', code: 'A-01-9', note: 'keepsakes', type: 'type-bin' },
].map((place) => ({ residence: residence.id, ...place }));

const item = (fields) => ({
  id: fields.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  par: null,
  history: [],
  ...fields,
});

export const items = [
  item({
    name: '9V batteries', quantity: 1, par: 4, location: 'drawer-b', brand: 'Energizer',
    used_for: 'Smoke detectors, each spring', moved_from: 'Garage',
    history: [
      { date: '2026-10-26T12:00:00Z', text: 'Used 3 for smoke detectors' },
      { date: '2026-10-12T12:00:00Z', text: 'Moved to Drawer B' },
      { date: '2026-03-03T12:00:00Z', text: 'Added 4' },
    ],
  }),
  item({ name: 'AA batteries', quantity: 12, par: 8, location: 'drawer-b', brand: 'Duracell' }),
  item({ name: 'AAA batteries', quantity: 6, par: 4, location: 'drawer-b' }),
  item({ name: 'Headlamp', quantity: 2, location: 'drawer-b', used_for: 'Camping overflow' }),
  item({ name: 'Tea lights', quantity: 1, location: 'drawer-b', used_for: 'Box of 50' }),
  item({ name: 'Duct tape', quantity: 3, location: 'drawer-a' }),
  item({ name: 'Screwdriver set', quantity: 1, location: 'drawer-a' }),
  item({ name: 'Picture hooks', quantity: 40, location: 'drawer-a' }),
  item({ name: 'USB-C chargers', quantity: 4, location: 'drawer-c' }),
  item({ name: 'Wrapping paper', quantity: 5, location: 'drawer-d' }),
  item({ name: 'Bandages', quantity: 2, par: 1, location: 'drawer-f', used_for: 'Assorted box' }),

  item({ name: 'Paper towels', quantity: 14, par: 6, location: 'shelf-3' }),
  item({ name: 'Motor oil', quantity: 2, location: 'shelf-1' }),
  item({ name: 'Car wash soap', quantity: 1, location: 'shelf-2' }),
  item({ name: 'Coffee filters', quantity: 12, par: 50, location: 'pantry-top' }),
  item({ name: 'Flour', quantity: 2, par: 1, location: 'pantry-mid' }),
  item({ name: 'Rice', quantity: 3, location: 'pantry-low' }),
  item({ name: 'Furnace filters', quantity: 1, par: 2, location: 'filters-bin', used_for: '16×25×1' }),
  item({ name: 'Camping stove', quantity: 1, location: 'gear-shelf', moved_from: 'Garage / Bin 4' }),
  item({ name: 'Spare sheets', quantity: 3, location: 'closet-top' }),
  item({ name: 'Halloween decor', quantity: 1, location: 'bin-4' }),
  item({ name: 'Yearbooks', quantity: 6, location: 'bin-9' }),
];
