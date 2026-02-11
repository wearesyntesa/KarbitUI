export type SpacingValue =
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
  | (string & {});

export type ColorValue =
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
  | (string & {});

export type DimensionValue =
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
  | (string & {});

export type BorderWidthValue = '0' | '1' | '2' | '3' | '4' | '8' | (string & {});

export type ShadowValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | (string & {});

export type DisplayValue =
  | 'block'
  | 'inline-block'
  | 'inline'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'hidden'
  | 'none'
  | (string & {});

export type FlexAlignValue = 'start' | 'end' | 'center' | 'baseline' | 'stretch' | (string & {});

export type FlexJustifyValue = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | (string & {});

export type FlexDirectionValue = 'row' | 'row-reverse' | 'col' | 'col-reverse' | (string & {});

export type FlexWrapValue = 'wrap' | 'wrap-reverse' | 'nowrap' | (string & {});

export type TextAlignValue = 'left' | 'center' | 'right' | 'justify' | (string & {});

export type FontWeightValue =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black'
  | (string & {});

export type FontSizeValue = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | (string & {});

export type PositionValue = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | (string & {});

export type OverflowValue = 'auto' | 'hidden' | 'visible' | 'scroll' | (string & {});

export type RoundedValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | (string & {});

export type OpacityValue =
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
  | (string & {});

export type ZIndexValue = '0' | '10' | '20' | '30' | '40' | '50' | 'auto' | (string & {});

export type CursorValue =
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
  | (string & {});

export type FlexValue = '1' | 'auto' | 'initial' | 'none' | (string & {});

export type FlexGrowShrinkValue = '0' | '1' | (string & {});

export type GridTrackValue =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | 'none'
  | 'subgrid'
  | (string & {});

export type GridSpanValue =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | 'auto'
  | 'full'
  | (string & {});

export type FontFamilyValue = 'sans' | 'serif' | 'mono' | (string & {});

export type LineHeightValue =
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'none'
  | 'tight'
  | 'snug'
  | 'normal'
  | 'relaxed'
  | 'loose'
  | (string & {});

export type LetterSpacingValue = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest' | (string & {});

export type TextDecorationValue = 'underline' | 'overline' | 'line-through' | 'no-underline' | (string & {});

export type TextTransformValue = 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case' | (string & {});

export type UserSelectValue = 'none' | 'text' | 'all' | 'auto' | (string & {});

export type PointerEventsValue = 'none' | 'auto' | (string & {});

export type TransitionValue = 'none' | 'all' | 'colors' | 'opacity' | 'shadow' | 'transform' | (string & {});

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type KnownColorScheme = 'black' | 'red' | 'blue' | 'green' | 'yellow';

export type ColorScheme = KnownColorScheme | (string & {});

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
