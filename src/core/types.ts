import type { LiteralUnion } from './utility-types.js';

export type SpacingValue = LiteralUnion<
  | '0'
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '14'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '36'
  | '40'
  | '44'
  | '48'
  | '52'
  | '56'
  | '60'
  | '64'
  | '72'
  | '80'
  | '96'
  | 'px'
  | 'auto'
>;

export type ColorValue = LiteralUnion<
  | 'black'
  | 'white'
  | 'transparent'
  | 'current'
  | `${
      | 'red'
      | 'blue'
      | 'green'
      | 'yellow'
      | 'gray'
      | 'slate'
      | 'zinc'
      | 'neutral'
      | 'stone'
      | 'orange'
      | 'amber'
      | 'lime'
      | 'emerald'
      | 'teal'
      | 'cyan'
      | 'sky'
      | 'indigo'
      | 'violet'
      | 'purple'
      | 'fuchsia'
      | 'pink'
      | 'rose'}-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950}`
  | `kb-${'black' | 'white' | 'red' | 'blue' | 'yellow' | 'green'}`
>;

export type DimensionValue = LiteralUnion<
  | SpacingValue
  | 'full'
  | 'screen'
  | 'svw'
  | 'lvw'
  | 'dvw'
  | 'svh'
  | 'lvh'
  | 'dvh'
  | 'min'
  | 'max'
  | 'fit'
  | '1/2'
  | '1/3'
  | '2/3'
  | '1/4'
  | '3/4'
  | '1/5'
  | '2/5'
  | '3/5'
  | '4/5'
  | '1/6'
  | '5/6'
  | '1/12'
  | '5/12'
  | '7/12'
  | '11/12'
>;

export type BorderWidthValue = LiteralUnion<'0' | '1' | '2' | '3' | '4' | '8'>;

export type ShadowValue = LiteralUnion<'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner'>;

export type DisplayValue = LiteralUnion<
  | 'block'
  | 'inline-block'
  | 'inline'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'hidden'
  | 'none'
  | 'contents'
  | 'flow-root'
>;

export type FlexAlignValue = LiteralUnion<'start' | 'end' | 'center' | 'baseline' | 'stretch'>;

export type FlexJustifyValue = LiteralUnion<'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'>;

export type FlexDirectionValue = LiteralUnion<'row' | 'row-reverse' | 'col' | 'col-reverse'>;

export type FlexWrapValue = LiteralUnion<'wrap' | 'wrap-reverse' | 'nowrap'>;

export type TextAlignValue = LiteralUnion<'left' | 'center' | 'right' | 'justify' | 'start' | 'end'>;

export type FontWeightValue = LiteralUnion<
  'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
>;

export type FontSizeValue = LiteralUnion<
  'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'
>;

export type PositionValue = LiteralUnion<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'>;

export type OverflowValue = LiteralUnion<'auto' | 'hidden' | 'visible' | 'scroll'>;

export type RoundedValue = LiteralUnion<'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'>;

export type OpacityValue = LiteralUnion<
  | '0'
  | '5'
  | '10'
  | '15'
  | '20'
  | '25'
  | '30'
  | '35'
  | '40'
  | '45'
  | '50'
  | '55'
  | '60'
  | '65'
  | '70'
  | '75'
  | '80'
  | '85'
  | '90'
  | '95'
  | '100'
>;

export type ZIndexValue = LiteralUnion<'0' | '10' | '20' | '30' | '40' | '50' | 'auto'>;

export type CursorValue = LiteralUnion<
  | 'auto'
  | 'default'
  | 'pointer'
  | 'wait'
  | 'text'
  | 'move'
  | 'help'
  | 'not-allowed'
  | 'none'
  | 'grab'
  | 'grabbing'
  | 'crosshair'
  | 'col-resize'
  | 'row-resize'
>;

export type FlexValue = LiteralUnion<'1' | 'auto' | 'initial' | 'none'>;

export type FlexGrowShrinkValue = LiteralUnion<'0' | '1'>;

export type GridTrackValue = LiteralUnion<
  '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'none' | 'subgrid'
>;

export type GridSpanValue = LiteralUnion<
  '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'auto' | 'full'
>;

export type FontFamilyValue = LiteralUnion<'sans' | 'serif' | 'mono'>;

export type LineHeightValue = LiteralUnion<
  '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'
>;

export type LetterSpacingValue = LiteralUnion<'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'>;

export type TextDecorationValue = LiteralUnion<'underline' | 'overline' | 'line-through' | 'no-underline'>;

export type TextTransformValue = LiteralUnion<'uppercase' | 'lowercase' | 'capitalize' | 'normal-case'>;

export type UserSelectValue = LiteralUnion<'none' | 'text' | 'all' | 'auto'>;

export type PointerEventsValue = LiteralUnion<'none' | 'auto'>;

export type TransitionValue = LiteralUnion<'none' | 'all' | 'colors' | 'opacity' | 'shadow' | 'transform'>;

export type AlignSelfValue = LiteralUnion<'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch'>;

export type JustifySelfValue = LiteralUnion<'auto' | 'start' | 'end' | 'center' | 'stretch'>;

export type AspectRatioValue = LiteralUnion<'auto' | 'square' | 'video'>;

export type ObjectFitValue = LiteralUnion<'contain' | 'cover' | 'fill' | 'none' | 'scale-down'>;

export type VisibilityValue = LiteralUnion<'visible' | 'invisible' | 'collapse'>;

export type WhitespaceValue = LiteralUnion<'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'break-spaces'>;

export type BorderStyleValue = LiteralUnion<'solid' | 'dashed' | 'dotted' | 'double' | 'none'>;

export type InsetValue = SpacingValue;

export type OrderValue = LiteralUnion<
  '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'first' | 'last' | 'none'
>;

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type KnownColorScheme = 'black' | 'red' | 'blue' | 'green' | 'yellow';

export type ColorScheme = LiteralUnion<KnownColorScheme>;

export type Orientation = 'horizontal' | 'vertical';

export type SortDirection = 'asc' | 'desc';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type StyleValueCategory =
  | 'spacing'
  | 'color'
  | 'dimension'
  | 'borderWidth'
  | 'shadow'
  | 'display'
  | 'flexAlign'
  | 'flexJustify'
  | 'flexDirection'
  | 'flexWrap'
  | 'textAlign'
  | 'fontWeight'
  | 'fontSize'
  | 'position'
  | 'overflow'
  | 'rounded'
  | 'opacity'
  | 'zIndex'
  | 'cursor'
  | 'flex'
  | 'flexGrowShrink'
  | 'gridTrack'
  | 'gridSpan'
  | 'fontFamily'
  | 'lineHeight'
  | 'letterSpacing'
  | 'textDecoration'
  | 'textTransform'
  | 'userSelect'
  | 'pointerEvents'
  | 'transition'
  | 'alignSelf'
  | 'justifySelf'
  | 'aspectRatio'
  | 'objectFit'
  | 'visibility'
  | 'whitespace'
  | 'borderStyle'
  | 'inset'
  | 'order'
  | 'raw';

export interface StyleValueTypeMap {
  spacing: SpacingValue;
  color: ColorValue;
  dimension: DimensionValue;
  borderWidth: BorderWidthValue;
  shadow: ShadowValue;
  display: DisplayValue;
  flexAlign: FlexAlignValue;
  flexJustify: FlexJustifyValue;
  flexDirection: FlexDirectionValue;
  flexWrap: FlexWrapValue;
  textAlign: TextAlignValue;
  fontWeight: FontWeightValue;
  fontSize: FontSizeValue;
  position: PositionValue;
  overflow: OverflowValue;
  rounded: RoundedValue;
  opacity: OpacityValue;
  zIndex: ZIndexValue;
  cursor: CursorValue;
  flex: FlexValue;
  flexGrowShrink: FlexGrowShrinkValue;
  gridTrack: GridTrackValue;
  gridSpan: GridSpanValue;
  fontFamily: FontFamilyValue;
  lineHeight: LineHeightValue;
  letterSpacing: LetterSpacingValue;
  textDecoration: TextDecorationValue;
  textTransform: TextTransformValue;
  userSelect: UserSelectValue;
  pointerEvents: PointerEventsValue;
  transition: TransitionValue;
  alignSelf: AlignSelfValue;
  justifySelf: JustifySelfValue;
  aspectRatio: AspectRatioValue;
  objectFit: ObjectFitValue;
  visibility: VisibilityValue;
  whitespace: WhitespaceValue;
  borderStyle: BorderStyleValue;
  inset: InsetValue;
  order: OrderValue;
  raw: string;
}

export type ResolveValueType<C extends StyleValueCategory> = StyleValueTypeMap[C];

export interface StylePropDef {
  readonly prefix: string;
  readonly category: StyleValueCategory;
  readonly attribute?: string;
  readonly transform?: (value: string) => string;
}

/** Union of all `kb-*` tag names registered in `HTMLElementTagNameMap`. */
export type KbTagName = Extract<keyof HTMLElementTagNameMap, `kb-${string}`>;

/** Resolves a `kb-*` tag name to its element class via `HTMLElementTagNameMap`. */
export type ComponentOf<T extends KbTagName> = HTMLElementTagNameMap[T];
