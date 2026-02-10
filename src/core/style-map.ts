import type { StylePropDef, ResolveValueType } from './types.js';

function displayTransform(value: string): string {
  return value === 'none' ? 'hidden' : value;
}

export const STYLE_PROP_DEFS = {
  p:    { prefix: 'p',    category: 'spacing',   attribute: 'p' },
  px:   { prefix: 'px',   category: 'spacing',   attribute: 'px' },
  py:   { prefix: 'py',   category: 'spacing',   attribute: 'py' },
  pt:   { prefix: 'pt',   category: 'spacing',   attribute: 'pt' },
  pr:   { prefix: 'pr',   category: 'spacing',   attribute: 'pr' },
  pb:   { prefix: 'pb',   category: 'spacing',   attribute: 'pb' },
  pl:   { prefix: 'pl',   category: 'spacing',   attribute: 'pl' },

  m:    { prefix: 'm',    category: 'spacing',   attribute: 'm' },
  mx:   { prefix: 'mx',   category: 'spacing',   attribute: 'mx' },
  my:   { prefix: 'my',   category: 'spacing',   attribute: 'my' },
  mt:   { prefix: 'mt',   category: 'spacing',   attribute: 'mt' },
  mr:   { prefix: 'mr',   category: 'spacing',   attribute: 'mr' },
  mb:   { prefix: 'mb',   category: 'spacing',   attribute: 'mb' },
  ml:   { prefix: 'ml',   category: 'spacing',   attribute: 'ml' },

  bg:          { prefix: 'bg',     category: 'color',       attribute: 'bg' },
  color:       { prefix: 'text',   category: 'color',       attribute: 'color' },
  opacity:     { prefix: 'opacity', category: 'raw',         attribute: 'opacity' },

  w:     { prefix: 'w',     category: 'dimension',   attribute: 'w' },
  h:     { prefix: 'h',     category: 'dimension',   attribute: 'h' },
  minW:  { prefix: 'min-w', category: 'dimension',   attribute: 'min-w' },
  maxW:  { prefix: 'max-w', category: 'dimension',   attribute: 'max-w' },
  minH:  { prefix: 'min-h', category: 'dimension',   attribute: 'min-h' },
  maxH:  { prefix: 'max-h', category: 'dimension',   attribute: 'max-h' },

  border:       { prefix: 'border',   category: 'borderWidth', attribute: 'border' },
  borderColor:  { prefix: 'border',   category: 'color',       attribute: 'border-color' },
  borderTop:    { prefix: 'border-t', category: 'borderWidth', attribute: 'border-top' },
  borderRight:  { prefix: 'border-r', category: 'borderWidth', attribute: 'border-right' },
  borderBottom: { prefix: 'border-b', category: 'borderWidth', attribute: 'border-bottom' },
  borderLeft:   { prefix: 'border-l', category: 'borderWidth', attribute: 'border-left' },
  rounded:      { prefix: 'rounded',  category: 'raw',         attribute: 'rounded' },
  shadow:       { prefix: 'shadow',   category: 'shadow',      attribute: 'shadow' },

  display:  { prefix: '',       category: 'display',  attribute: 'display', transform: displayTransform },
  position: { prefix: '',       category: 'position', attribute: 'position', transform: (v: string) => v },
  top:      { prefix: 'top',    category: 'spacing',  attribute: 'top' },
  right:    { prefix: 'right',  category: 'spacing',  attribute: 'right' },
  bottom:   { prefix: 'bottom', category: 'spacing',  attribute: 'bottom' },
  left:     { prefix: 'left',   category: 'spacing',  attribute: 'left' },
  zIndex:   { prefix: 'z',      category: 'raw',      attribute: 'z-index' },
  overflow:  { prefix: 'overflow',   category: 'overflow', attribute: 'overflow' },
  overflowX: { prefix: 'overflow-x', category: 'overflow', attribute: 'overflow-x' },
  overflowY: { prefix: 'overflow-y', category: 'overflow', attribute: 'overflow-y' },

  gap:            { prefix: 'gap',     category: 'spacing',       attribute: 'gap' },
  gapX:           { prefix: 'gap-x',   category: 'spacing',       attribute: 'gap-x' },
  gapY:           { prefix: 'gap-y',   category: 'spacing',       attribute: 'gap-y' },
  alignItems:     { prefix: 'items',   category: 'flexAlign',     attribute: 'align-items' },
  justifyContent: { prefix: 'justify', category: 'flexJustify',   attribute: 'justify-content' },
  flexDir:        { prefix: 'flex',    category: 'flexDirection',  attribute: 'flex-dir' },
  flexWrap:       { prefix: 'flex',    category: 'flexWrap',       attribute: 'flex-wrap' },
  flexGrow:       { prefix: 'grow',    category: 'raw',            attribute: 'flex-grow' },
  flexShrink:     { prefix: 'shrink',  category: 'raw',            attribute: 'flex-shrink' },
  flex:           { prefix: 'flex',    category: 'raw',            attribute: 'flex' },

  gridCols: { prefix: 'grid-cols', category: 'raw', attribute: 'grid-cols' },
  gridRows: { prefix: 'grid-rows', category: 'raw', attribute: 'grid-rows' },
  colSpan:  { prefix: 'col-span',  category: 'raw', attribute: 'col-span' },
  rowSpan:  { prefix: 'row-span',  category: 'raw', attribute: 'row-span' },

  fontSize:      { prefix: 'text',     category: 'fontSize',   attribute: 'font-size' },
  fontWeight:    { prefix: 'font',     category: 'fontWeight',  attribute: 'font-weight' },
  fontFamily:    { prefix: 'font',     category: 'raw',         attribute: 'font-family' },
  textAlign:     { prefix: 'text',     category: 'textAlign',   attribute: 'text-align' },
  lineHeight:    { prefix: 'leading',  category: 'raw',         attribute: 'line-height' },
  letterSpacing: { prefix: 'tracking', category: 'raw',         attribute: 'letter-spacing' },
  textDecoration: { prefix: '',        category: 'raw',         attribute: 'text-decoration', transform: (v: string) => v },
  textTransform:  { prefix: '',        category: 'raw',         attribute: 'text-transform', transform: (v: string) => v },

  cursor:        { prefix: 'cursor',          category: 'raw', attribute: 'cursor' },
  userSelect:    { prefix: 'select',          category: 'raw', attribute: 'user-select' },
  pointerEvents: { prefix: 'pointer-events',  category: 'raw', attribute: 'pointer-events' },
  transition:    { prefix: 'transition',       category: 'raw', attribute: 'transition' },
} as const satisfies Record<string, StylePropDef>;

export type StylePropName = keyof typeof STYLE_PROP_DEFS;

export type StyleProps = {
  [K in StylePropName]?: ResolveValueType<(typeof STYLE_PROP_DEFS)[K]['category']>;
};

export const STYLE_PROP_KEYS: readonly StylePropName[] = Object.keys(STYLE_PROP_DEFS) as StylePropName[];

export function mapPropToClass<K extends StylePropName>(prop: K, value: string): string {
  const def: StylePropDef = STYLE_PROP_DEFS[prop];

  if (def.transform) {
    return def.transform(value);
  }

  if (!def.prefix) return value;

  if (value === 'true' || value === '') {
    return def.prefix;
  }

  return `${def.prefix}-${value}`;
}
