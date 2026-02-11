import type { ResolveValueType, StylePropDef } from './types.js';

function displayTransform(value: string): string {
  return value === 'none' ? 'hidden' : value;
}

// biome-ignore lint/nursery/useExplicitType: typeof STYLE_PROP_DEFS is used downstream to derive StylePropName/StyleProps — an explicit annotation would widen the type
export const STYLE_PROP_DEFS = {
  p: { prefix: 'p', category: 'spacing', attribute: 'p' },
  px: { prefix: 'px', category: 'spacing', attribute: 'px' },
  py: { prefix: 'py', category: 'spacing', attribute: 'py' },
  pt: { prefix: 'pt', category: 'spacing', attribute: 'pt' },
  pr: { prefix: 'pr', category: 'spacing', attribute: 'pr' },
  pb: { prefix: 'pb', category: 'spacing', attribute: 'pb' },
  pl: { prefix: 'pl', category: 'spacing', attribute: 'pl' },

  m: { prefix: 'm', category: 'spacing', attribute: 'm' },
  mx: { prefix: 'mx', category: 'spacing', attribute: 'mx' },
  my: { prefix: 'my', category: 'spacing', attribute: 'my' },
  mt: { prefix: 'mt', category: 'spacing', attribute: 'mt' },
  mr: { prefix: 'mr', category: 'spacing', attribute: 'mr' },
  mb: { prefix: 'mb', category: 'spacing', attribute: 'mb' },
  ml: { prefix: 'ml', category: 'spacing', attribute: 'ml' },

  bg: { prefix: 'bg', category: 'color', attribute: 'bg' },
  color: { prefix: 'text', category: 'color', attribute: 'color' },
  opacity: { prefix: 'opacity', category: 'opacity', attribute: 'opacity' },

  w: { prefix: 'w', category: 'dimension', attribute: 'w' },
  h: { prefix: 'h', category: 'dimension', attribute: 'h' },
  minW: { prefix: 'min-w', category: 'dimension', attribute: 'min-w' },
  maxW: { prefix: 'max-w', category: 'dimension', attribute: 'max-w' },
  minH: { prefix: 'min-h', category: 'dimension', attribute: 'min-h' },
  maxH: { prefix: 'max-h', category: 'dimension', attribute: 'max-h' },

  border: { prefix: 'border', category: 'borderWidth', attribute: 'border' },
  borderColor: { prefix: 'border', category: 'color', attribute: 'border-color' },
  borderTop: { prefix: 'border-t', category: 'borderWidth', attribute: 'border-top' },
  borderRight: { prefix: 'border-r', category: 'borderWidth', attribute: 'border-right' },
  borderBottom: { prefix: 'border-b', category: 'borderWidth', attribute: 'border-bottom' },
  borderLeft: { prefix: 'border-l', category: 'borderWidth', attribute: 'border-left' },
  rounded: { prefix: 'rounded', category: 'rounded', attribute: 'rounded' },
  shadow: { prefix: 'shadow', category: 'shadow', attribute: 'shadow' },

  display: { prefix: '', category: 'display', attribute: 'display', transform: displayTransform },
  position: { prefix: '', category: 'position', attribute: 'position' },
  top: { prefix: 'top', category: 'spacing', attribute: 'top' },
  right: { prefix: 'right', category: 'spacing', attribute: 'right' },
  bottom: { prefix: 'bottom', category: 'spacing', attribute: 'bottom' },
  left: { prefix: 'left', category: 'spacing', attribute: 'left' },
  zIndex: { prefix: 'z', category: 'zIndex', attribute: 'z-index' },
  overflow: { prefix: 'overflow', category: 'overflow', attribute: 'overflow' },
  overflowX: { prefix: 'overflow-x', category: 'overflow', attribute: 'overflow-x' },
  overflowY: { prefix: 'overflow-y', category: 'overflow', attribute: 'overflow-y' },

  gap: { prefix: 'gap', category: 'spacing', attribute: 'gap' },
  gapX: { prefix: 'gap-x', category: 'spacing', attribute: 'gap-x' },
  gapY: { prefix: 'gap-y', category: 'spacing', attribute: 'gap-y' },
  alignItems: { prefix: 'items', category: 'flexAlign', attribute: 'align-items' },
  justifyContent: { prefix: 'justify', category: 'flexJustify', attribute: 'justify-content' },
  flexDir: { prefix: 'flex', category: 'flexDirection', attribute: 'flex-dir' },
  flexWrap: { prefix: 'flex', category: 'flexWrap', attribute: 'flex-wrap' },
  flexGrow: { prefix: 'grow', category: 'flexGrowShrink', attribute: 'flex-grow' },
  flexShrink: { prefix: 'shrink', category: 'flexGrowShrink', attribute: 'flex-shrink' },
  flex: { prefix: 'flex', category: 'flex', attribute: 'flex' },

  gridCols: { prefix: 'grid-cols', category: 'gridTrack', attribute: 'grid-cols' },
  gridRows: { prefix: 'grid-rows', category: 'gridTrack', attribute: 'grid-rows' },
  colSpan: { prefix: 'col-span', category: 'gridSpan', attribute: 'col-span' },
  rowSpan: { prefix: 'row-span', category: 'gridSpan', attribute: 'row-span' },

  fontSize: { prefix: 'text', category: 'fontSize', attribute: 'font-size' },
  fontWeight: { prefix: 'font', category: 'fontWeight', attribute: 'font-weight' },
  fontFamily: { prefix: 'font', category: 'fontFamily', attribute: 'font-family' },
  textAlign: { prefix: 'text', category: 'textAlign', attribute: 'text-align' },
  lineHeight: { prefix: 'leading', category: 'lineHeight', attribute: 'line-height' },
  letterSpacing: { prefix: 'tracking', category: 'letterSpacing', attribute: 'letter-spacing' },
  textDecoration: { prefix: '', category: 'textDecoration', attribute: 'text-decoration' },
  textTransform: { prefix: '', category: 'textTransform', attribute: 'text-transform' },

  cursor: { prefix: 'cursor', category: 'cursor', attribute: 'cursor' },
  userSelect: { prefix: 'select', category: 'userSelect', attribute: 'user-select' },
  pointerEvents: { prefix: 'pointer-events', category: 'pointerEvents', attribute: 'pointer-events' },
  transition: { prefix: 'transition', category: 'transition', attribute: 'transition' },
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
