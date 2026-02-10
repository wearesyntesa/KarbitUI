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
  | `${1 | 2 | 3}/${2 | 3 | 4 | 5 | 6 | 12}`
  | (string & {});

export type BorderWidthValue = '0' | '2' | '3' | '4' | '8' | (string & {});

export type ShadowValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | (string & {});

export type DisplayValue = 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'hidden' | 'none' | (string & {});

export type FlexAlignValue = 'start' | 'end' | 'center' | 'baseline' | 'stretch' | (string & {});

export type FlexJustifyValue = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | (string & {});

export type FlexDirectionValue = 'row' | 'row-reverse' | 'col' | 'col-reverse' | (string & {});

export type FlexWrapValue = 'wrap' | 'wrap-reverse' | 'nowrap' | (string & {});

export type TextAlignValue = 'left' | 'center' | 'right' | 'justify' | (string & {});

export type FontWeightValue = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black' | (string & {});

export type FontSizeValue = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | (string & {});

export type PositionValue = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

export type OverflowValue = 'auto' | 'hidden' | 'visible' | 'scroll' | (string & {});

export type ComponentVariant = 'solid' | 'outline' | 'ghost' | 'link';

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ColorScheme = 'black' | 'red' | 'blue' | 'green' | 'yellow' | (string & {});

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
  C extends 'raw' ? string :
  never;

export interface StylePropDef {
  readonly prefix: string;
  readonly category: StyleValueCategory;
  readonly attribute?: string;
  readonly transform?: (value: string) => string;
}
