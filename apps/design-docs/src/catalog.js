/**
 * One entry per documented component. `example` is the file name in ./examples without "Example.vue".
 * `group` is one of: Actions, Status and labels, Content, Forms, Overlays and feedback, Layout and navigation.
 */
export const catalog = [
  { slug: 'button', name: 'ApButton', group: 'Actions', example: 'Button', summary: 'The standard button, or a link when given `to` or `href`. Variants: primary, tonal (default), ghost, danger.', rules: ['One primary per view.', 'Danger only for removal, behind a confirmation that names what goes.', 'Labels are verbs in sentence case.'] },
  { slug: 'icon-button', name: 'ApIconButton', group: 'Actions', example: 'IconButton', summary: 'Round icon-only button, 40px or 48px (`size="lg"`). `label` is required: it\'s the accessible name and tooltip.' },
  { slug: 'status-chip', name: 'ApStatusChip', group: 'Status and labels', example: 'StatusChip', summary: 'One of two fixed statuses with a word and a dot: low, ok.', rules: ['The app decides the status; the chip only shows it.', 'In lists, leave Stocked out.'] },
  { slug: 'bin-tag', name: 'ApBinTag', group: 'Status and labels', example: 'BinTag', summary: 'A container\'s printed label: brass hairline, mono code. For bins and containers, not items.' },
  { slug: 'breadcrumb', name: 'ApBreadcrumb', group: 'Status and labels', example: 'Breadcrumb', summary: 'The location path. With `current`, the last crumb is the page you\'re on.' },
  { slug: 'list', name: 'ApList, ApListRow', group: 'Content', example: 'List', summary: 'A grouped list on a raised surface. Rows take name, sub, status, qty, to and selected; `#trailing` replaces the quantity.', rules: ['Don\'t put buttons in a row that has `to`: the whole row is a link.'] },
  { slug: 'location-tile', name: 'ApLocationTile, ApTileGrid', group: 'Content', example: 'LocationTile', summary: 'A place that holds things, under the arch, led by its count. The grid reflows, or mirrors real furniture with `columns`.', rules: ['Only places get the arch.'] },
  { slug: 'feature', name: 'ApFeature, ApStat', group: 'Content', example: 'Feature', summary: 'The one bottle-green surface per screen, holding headline numbers.', rules: ['Text only in on-bottle and brass-on-bottle.'] },
  { slug: 'panel', name: 'ApPanel', group: 'Content', example: 'Panel', summary: 'A raised surface for grouped controls or a detail pane.' },
  { slug: 'text-field', name: 'ApTextField', group: 'Forms', example: 'TextField', summary: 'Labelled input in a sunken well. Optional fields say so; an error replaces the hint.', rules: ['Placeholders are real examples.', 'Validate on submit and say what to do.'] },
  { slug: 'select', name: 'ApSelect', group: 'Forms', example: 'Select', summary: 'The same well around a native select. Put options and optgroups in the slot.' },
  { slug: 'checkbox', name: 'ApCheckbox', group: 'Forms', example: 'Checkbox', summary: 'A checkbox with its label; the whole row is a 44px target.' },
  { slug: 'search-field', name: 'ApSearchField', group: 'Forms', example: 'SearchField', summary: 'The search well. With `shortcut`, "/" focuses it on desktop.' },
  { slug: 'stepper', name: 'ApStepper', group: 'Forms', example: 'Stepper', summary: 'Adjust a count in place: raised buttons in a sunken track, the count as a large numeral.' },
  { slug: 'dialog', name: 'ApDialog', group: 'Overlays and feedback', example: 'Dialog', summary: 'A modal on the native dialog element: focus trapped, Escape closes it. A bottom sheet on phones.', rules: ['Primary action last; Cancel before it; destructive actions far left.'] },
  { slug: 'toast', name: 'ApToaster, useToast', group: 'Overlays and feedback', example: 'Toast', summary: 'Short confirmations with one optional action, usually Undo. Mount ApToaster once.' },
  { slug: 'page-head', name: 'ApPageHead', group: 'Layout and navigation', example: 'PageHead', summary: 'The large-title header with back (phones), eyebrow, meta and actions slots.' },
  { slug: 'section', name: 'ApSection', group: 'Layout and navigation', example: 'Section', summary: 'A titled section with an optional link or aside.' },
  { slug: 'split', name: 'ApSplit', group: 'Layout and navigation', example: 'Split', summary: 'List beside a sticky detail pane at 960px and up; the pane hides below that.' },
  { slug: 'sidebar', name: 'ApSidebar, ApNavItem', group: 'Layout and navigation', example: 'Sidebar', summary: 'Desktop navigation: brand, groups of links with counts, footer.' },
  { slug: 'tab-bar', name: 'ApTabBar, ApTab, ApFab', group: 'Layout and navigation', example: 'TabBar', summary: 'Floating phone navigation: four tabs around the add button.' },
  { slug: 'dock', name: 'ApDock', group: 'Layout and navigation', example: 'Dock', summary: 'Bottom action dock on phones, casting a shadow up over content.' },
];

export const groups = [...new Set(catalog.map((entry) => entry.group))];

const live = import.meta.glob('./examples/*Example.vue', { eager: true });
const source = import.meta.glob('./examples/*Example.vue', { eager: true, query: '?raw', import: 'default' });

export const exampleFor = (entry) => live[`./examples/${entry.example}Example.vue`]?.default;
export const sourceFor = (entry) => source[`./examples/${entry.example}Example.vue`] ?? '';
