export type SpacingValue =
  | '0' | '0.5' | '1' | '1.5' | '2' | '2.5' | '3' | '3.5' | '4' | '5'
  | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '14' | '16' | '20'
  | '24' | '28' | '32' | '36' | '40' | '44' | '48' | '52' | '56' | '60'
  | '64' | '72' | '80' | '96' | 'px' | 'auto'
  | (string & {});

export type ColorValue =
  | 'black' | 'white' | 'transparent' | 'current'
  | `${'red' | 'blue' | 'green' | 'yellow' | 'gray'}-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`
  | `kb-${'black' | 'white' | 'red' | 'blue' | 'yellow' | 'green'}`
  | (string & {});

export type DimensionValue =
  | SpacingValue
  | 'full' | 'screen' | 'svw' | 'lvw' | 'dvw' | 'svh' | 'lvh' | 'dvh'
  | 'min' | 'max' | 'fit'
  | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5'
  | '1/6' | '5/6' | '1/12' | '5/12' | '7/12' | '11/12'
  | (string & {});

export type BorderWidthValue = '0' | '1' | '2' | '3' | '4' | '8' | (string & {});

export type ShadowValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | (string & {});

export type DisplayValue = 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'hidden' | 'none' | (string & {});

export type FlexAlignValue = 'start' | 'end' | 'center' | 'baseline' | 'stretch' | (string & {});

export type FlexJustifyValue = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | (string & {});

export type FlexDirectionValue = 'row' | 'row-reverse' | 'col' | 'col-reverse' | (string & {});

export type FlexWrapValue = 'wrap' | 'wrap-reverse' | 'nowrap' | (string & {});

export type TextAlignValue = 'left' | 'center' | 'right' | 'justify' | (string & {});

export type FontWeightValue = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black' | (string & {});

export type FontSizeValue = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | (string & {});

export type PositionValue = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | (string & {});

export type OverflowValue = 'auto' | 'hidden' | 'visible' | 'scroll' | (string & {});

export type RoundedValue =
  | 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  | (string & {});

export type OpacityValue =
  | '0' | '5' | '10' | '15' | '20' | '25' | '30' | '35' | '40' | '45'
  | '50' | '55' | '60' | '65' | '70' | '75' | '80' | '85' | '90' | '95' | '100'
  | (string & {});

export type ZIndexValue = '0' | '10' | '20' | '30' | '40' | '50' | 'auto' | (string & {});

export type CursorValue =
  | 'auto' | 'default' | 'pointer' | 'wait' | 'text' | 'move'
  | 'help' | 'not-allowed' | 'none' | 'grab' | 'grabbing'
  | 'crosshair' | 'col-resize' | 'row-resize'
  | (string & {});

export type FlexValue = '1' | 'auto' | 'initial' | 'none' | (string & {});

export type FlexGrowShrinkValue = '0' | '1' | (string & {});

export type GridTrackValue =
  | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'
  | 'none' | 'subgrid'
  | (string & {});

export type GridSpanValue =
  | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'
  | 'auto' | 'full'
  | (string & {});

export type FontFamilyValue = 'sans' | 'serif' | 'mono' | (string & {});

export type LineHeightValue =
  | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'
  | (string & {});

export type LetterSpacingValue = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest' | (string & {});

export type TextDecorationValue = 'underline' | 'overline' | 'line-through' | 'no-underline' | (string & {});

export type TextTransformValue = 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case' | (string & {});

export type UserSelectValue = 'none' | 'text' | 'all' | 'auto' | (string & {});

export type PointerEventsValue = 'none' | 'auto' | (string & {});

export type TransitionValue = 'none' | 'all' | 'colors' | 'opacity' | 'shadow' | 'transform' | (string & {});

export type ComponentVariant = 'solid' | 'outline' | 'ghost' | 'link';

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ColorScheme = 'black' | 'red' | 'blue' | 'green' | 'yellow' | (string & {});

export type KnownColorScheme = 'black' | 'red' | 'blue' | 'green' | 'yellow';

export type Orientation = 'horizontal' | 'vertical';

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

export type ResolveValueType<C extends StyleValueCategory> =
  C extends 'spacing' ? SpacingValue :
  C extends 'color' ? ColorValue :
  C extends 'dimension' ? DimensionValue :
  C extends 'borderWidth' ? BorderWidthValue :
  C extends 'shadow' ? ShadowValue :
  C extends 'display' ? DisplayValue :
  C extends 'flexAlign' ? FlexAlignValue :
  C extends 'flexJustify' ? FlexJustifyValue :
  C extends 'flexDirection' ? FlexDirectionValue :
  C extends 'flexWrap' ? FlexWrapValue :
  C extends 'textAlign' ? TextAlignValue :
  C extends 'fontWeight' ? FontWeightValue :
  C extends 'fontSize' ? FontSizeValue :
  C extends 'position' ? PositionValue :
  C extends 'overflow' ? OverflowValue :
  C extends 'rounded' ? RoundedValue :
  C extends 'opacity' ? OpacityValue :
  C extends 'zIndex' ? ZIndexValue :
  C extends 'cursor' ? CursorValue :
  C extends 'flex' ? FlexValue :
  C extends 'flexGrowShrink' ? FlexGrowShrinkValue :
  C extends 'gridTrack' ? GridTrackValue :
  C extends 'gridSpan' ? GridSpanValue :
  C extends 'fontFamily' ? FontFamilyValue :
  C extends 'lineHeight' ? LineHeightValue :
  C extends 'letterSpacing' ? LetterSpacingValue :
  C extends 'textDecoration' ? TextDecorationValue :
  C extends 'textTransform' ? TextTransformValue :
  C extends 'userSelect' ? UserSelectValue :
  C extends 'pointerEvents' ? PointerEventsValue :
  C extends 'transition' ? TransitionValue :
  C extends 'raw' ? string :
  never;

export interface StylePropDef {
  readonly prefix: string;
  readonly category: StyleValueCategory;
  readonly attribute?: string;
  readonly transform?: (value: string) => string;
}
