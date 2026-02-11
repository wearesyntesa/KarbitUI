import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbAccordion } from '../components/data-display/kb-accordion.js';
import { KbAccordionGroup } from '../components/data-display/kb-accordion-group.js';
// Data Display
import { KbCard } from '../components/data-display/kb-card.js';
import { KbList } from '../components/data-display/kb-list.js';
import { KbListItem } from '../components/data-display/kb-list-item.js';
import { KbTable } from '../components/data-display/kb-table.js';
import { KbTag } from '../components/data-display/kb-tag.js';
import { KbTagGroup } from '../components/data-display/kb-tag-group.js';
// Feedback
import { KbAlert } from '../components/feedback/kb-alert.js';
import { KbBadge } from '../components/feedback/kb-badge.js';
import { KbProgress } from '../components/feedback/kb-progress.js';
import { KbSpinner } from '../components/feedback/kb-spinner.js';
import { KbToast } from '../components/feedback/kb-toast.js';
// Forms
import { KbButton } from '../components/forms/kb-button.js';
import { KbButtonGroup } from '../components/forms/kb-button-group.js';
import { KbCheckbox } from '../components/forms/kb-checkbox.js';
import { KbCheckboxGroup } from '../components/forms/kb-checkbox-group.js';
import { KbFormControl } from '../components/forms/kb-form-control.js';
import { KbFormLabel } from '../components/forms/kb-form-label.js';
import { KbIconButton } from '../components/forms/kb-icon-button.js';
import { KbInput } from '../components/forms/kb-input.js';
import { KbRadio } from '../components/forms/kb-radio.js';
import { KbRadioGroup } from '../components/forms/kb-radio-group.js';
import { KbSelect } from '../components/forms/kb-select.js';
import { KbSwitch } from '../components/forms/kb-switch.js';
import { KbTextarea } from '../components/forms/kb-textarea.js';
// Layout
import { KbBox } from '../components/layout/kb-box.js';
import { KbContainer } from '../components/layout/kb-container.js';
import { KbDivider } from '../components/layout/kb-divider.js';
import { KbFlex } from '../components/layout/kb-flex.js';
import { KbGrid } from '../components/layout/kb-grid.js';
import { KbStack } from '../components/layout/kb-stack.js';
import { KbBreadcrumb } from '../components/navigation/kb-breadcrumb.js';
import { KbLink } from '../components/navigation/kb-link.js';
// Navigation
import { KbTabs } from '../components/navigation/kb-tabs.js';
import { KbDrawer } from '../components/overlay/kb-drawer.js';

// Overlay
import { KbModal } from '../components/overlay/kb-modal.js';
import { KbPopover } from '../components/overlay/kb-popover.js';
import { KbTooltip } from '../components/overlay/kb-tooltip.js';
import { KbCode } from '../components/typography/kb-code.js';
import { KbHeading } from '../components/typography/kb-heading.js';
// Typography
import { KbText } from '../components/typography/kb-text.js';
import type {
  KbChangeCheckboxDetail,
  KbChangeCheckedDetail,
  KbChangeGroupDetail,
  KbChangeRadioDetail,
  KbChangeValueDetail,
  KbClickLinkDetail,
  KbInputDetail,
  KbNavigateDetail,
  KbReorderDetail,
  KbRowClickDetail,
  KbSortDetail,
  KbTabChangeDetail,
  KbToggleDetail,
} from '../core/events.js';

// -- Layout --

export const Box = createComponent({
  react: React,
  tagName: 'kb-box',
  elementClass: KbBox,
});

export const Flex = createComponent({
  react: React,
  tagName: 'kb-flex',
  elementClass: KbFlex,
});

export const Grid = createComponent({
  react: React,
  tagName: 'kb-grid',
  elementClass: KbGrid,
});

export const Stack = createComponent({
  react: React,
  tagName: 'kb-stack',
  elementClass: KbStack,
});

export const Container = createComponent({
  react: React,
  tagName: 'kb-container',
  elementClass: KbContainer,
});

export const Divider = createComponent({
  react: React,
  tagName: 'kb-divider',
  elementClass: KbDivider,
});

// -- Typography --

export const Text = createComponent({
  react: React,
  tagName: 'kb-text',
  elementClass: KbText,
});

export const Heading = createComponent({
  react: React,
  tagName: 'kb-heading',
  elementClass: KbHeading,
});

export const Code = createComponent({
  react: React,
  tagName: 'kb-code',
  elementClass: KbCode,
});

// -- Forms --

export const Button = createComponent({
  react: React,
  tagName: 'kb-button',
  elementClass: KbButton,
});

export const ButtonGroup = createComponent({
  react: React,
  tagName: 'kb-button-group',
  elementClass: KbButtonGroup,
});

export const IconButton = createComponent({
  react: React,
  tagName: 'kb-icon-button',
  elementClass: KbIconButton,
});

export const Input = createComponent({
  react: React,
  tagName: 'kb-input',
  elementClass: KbInput,
  events: {
    onKbInput: 'kb-input' as EventName<CustomEvent<KbInputDetail>>,
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
    onKbClear: 'kb-clear' as EventName<CustomEvent<undefined>>,
  },
});

export const Textarea = createComponent({
  react: React,
  tagName: 'kb-textarea',
  elementClass: KbTextarea,
  events: {
    onKbInput: 'kb-input' as EventName<CustomEvent<KbInputDetail>>,
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
    onKbClear: 'kb-clear' as EventName<CustomEvent<undefined>>,
  },
});

export const Select = createComponent({
  react: React,
  tagName: 'kb-select',
  elementClass: KbSelect,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
    onKbClear: 'kb-clear' as EventName<CustomEvent<undefined>>,
  },
});

export const Checkbox = createComponent({
  react: React,
  tagName: 'kb-checkbox',
  elementClass: KbCheckbox,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeCheckboxDetail>>,
  },
});

export const CheckboxGroup = createComponent({
  react: React,
  tagName: 'kb-checkbox-group',
  elementClass: KbCheckboxGroup,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeGroupDetail>>,
  },
});

export const Radio = createComponent({
  react: React,
  tagName: 'kb-radio',
  elementClass: KbRadio,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeRadioDetail>>,
  },
});

export const RadioGroup = createComponent({
  react: React,
  tagName: 'kb-radio-group',
  elementClass: KbRadioGroup,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
  },
});

export const Switch = createComponent({
  react: React,
  tagName: 'kb-switch',
  elementClass: KbSwitch,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeCheckedDetail>>,
  },
});

export const FormControl = createComponent({
  react: React,
  tagName: 'kb-form-control',
  elementClass: KbFormControl,
});

export const FormLabel = createComponent({
  react: React,
  tagName: 'kb-form-label',
  elementClass: KbFormLabel,
});

// -- Feedback --

export const Alert = createComponent({
  react: React,
  tagName: 'kb-alert',
  elementClass: KbAlert,
  events: {
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
    onKbToggle: 'kb-toggle' as EventName<CustomEvent<KbToggleDetail>>,
  },
});

export const Badge = createComponent({
  react: React,
  tagName: 'kb-badge',
  elementClass: KbBadge,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export const Spinner = createComponent({
  react: React,
  tagName: 'kb-spinner',
  elementClass: KbSpinner,
});

export const Progress = createComponent({
  react: React,
  tagName: 'kb-progress',
  elementClass: KbProgress,
});

export const Toast = createComponent({
  react: React,
  tagName: 'kb-toast',
  elementClass: KbToast,
  events: {
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

// -- Data Display --

export const Card = createComponent({
  react: React,
  tagName: 'kb-card',
  elementClass: KbCard,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent<undefined>>,
  },
});

export const Table = createComponent({
  react: React,
  tagName: 'kb-table',
  elementClass: KbTable,
  events: {
    onKbRowClick: 'kb-row-click' as EventName<CustomEvent<KbRowClickDetail>>,
    onKbSort: 'kb-sort' as EventName<CustomEvent<KbSortDetail>>,
  },
});

export const Accordion = createComponent({
  react: React,
  tagName: 'kb-accordion',
  elementClass: KbAccordion,
  events: {
    onKbToggle: 'kb-toggle' as EventName<CustomEvent<KbToggleDetail>>,
  },
});

export const AccordionGroup = createComponent({
  react: React,
  tagName: 'kb-accordion-group',
  elementClass: KbAccordionGroup,
});

export const List = createComponent({
  react: React,
  tagName: 'kb-list',
  elementClass: KbList,
});

export const ListItem = createComponent({
  react: React,
  tagName: 'kb-list-item',
  elementClass: KbListItem,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent<undefined>>,
  },
});

export const Tag = createComponent({
  react: React,
  tagName: 'kb-tag',
  elementClass: KbTag,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export const TagGroup = createComponent({
  react: React,
  tagName: 'kb-tag-group',
  elementClass: KbTagGroup,
  events: {
    onKbReorder: 'kb-reorder' as EventName<CustomEvent<KbReorderDetail>>,
  },
});

// -- Overlay --

export const Modal = createComponent({
  react: React,
  tagName: 'kb-modal',
  elementClass: KbModal,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export const Drawer = createComponent({
  react: React,
  tagName: 'kb-drawer',
  elementClass: KbDrawer,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export const Tooltip = createComponent({
  react: React,
  tagName: 'kb-tooltip',
  elementClass: KbTooltip,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export const Popover = createComponent({
  react: React,
  tagName: 'kb-popover',
  elementClass: KbPopover,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

// -- Navigation --

export const Tabs = createComponent({
  react: React,
  tagName: 'kb-tabs',
  elementClass: KbTabs,
  events: {
    onKbTabChange: 'kb-tab-change' as EventName<CustomEvent<KbTabChangeDetail>>,
  },
});

export const Breadcrumb = createComponent({
  react: React,
  tagName: 'kb-breadcrumb',
  elementClass: KbBreadcrumb,
  events: {
    onKbNavigate: 'kb-navigate' as EventName<CustomEvent<KbNavigateDetail>>,
  },
});

export const Link = createComponent({
  react: React,
  tagName: 'kb-link',
  elementClass: KbLink,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent<KbClickLinkDetail>>,
  },
});

// -- Re-export public types for single-source React imports --

export type { CardVariant } from '../components/data-display/kb-card.js';
export type { ListSpacing, ListVariant } from '../components/data-display/kb-list.js';
export type { TableSize, TableVariant } from '../components/data-display/kb-table.js';
export type { TagSize, TagVariant } from '../components/data-display/kb-tag.js';
export type { TagGroupGap } from '../components/data-display/kb-tag-group.js';
export type { AlertStatus, AlertVariant } from '../components/feedback/kb-alert.js';
export type { BadgeSize, BadgeVariant } from '../components/feedback/kb-badge.js';
export type { ProgressSize } from '../components/feedback/kb-progress.js';
export type { SpinnerSpeed, SpinnerVariant } from '../components/feedback/kb-spinner.js';
export type { ToastPosition, ToastStatus } from '../components/feedback/kb-toast.js';

// Component variant/size types
export type { ButtonSize, ButtonVariant } from '../components/forms/kb-button.js';
export type { ButtonGroupDirection } from '../components/forms/kb-button-group.js';
export type { IconButtonVariant } from '../components/forms/kb-icon-button.js';
export type { InputType } from '../components/forms/kb-input.js';
export type { SelectOption, SelectOptionGroup, SelectOptionOrGroup } from '../components/forms/kb-select.js';
export { isOptionGroup } from '../components/forms/kb-select.js';
export type { SwitchLabelPosition } from '../components/forms/kb-switch.js';
export type { ResizeMode } from '../components/forms/kb-textarea.js';
export type { ContainerSize } from '../components/layout/kb-container.js';
export type { DividerThickness, DividerVariant } from '../components/layout/kb-divider.js';
export type { SeparatorType } from '../components/navigation/kb-breadcrumb.js';
export type { LinkVariant } from '../components/navigation/kb-link.js';
export type {
  TabsAlign,
  TabsColorScheme,
  TabsOrientation,
  TabsSize,
  TabsVariant,
} from '../components/navigation/kb-tabs.js';
export type { DrawerPlacement } from '../components/overlay/kb-drawer.js';
export type { ModalPlacement } from '../components/overlay/kb-modal.js';
export type { PopoverPlacement, PopoverSize, PopoverTrigger } from '../components/overlay/kb-popover.js';
export type { TooltipPlacement, TooltipSize, TooltipVariant } from '../components/overlay/kb-tooltip.js';
export type { CodeHighlighter } from '../components/typography/kb-code.js';
export type { HeadingLevel, HeadingSize, HeadingTone, HeadingWeight } from '../components/typography/kb-heading.js';
export type { TextAs, TextTone, TextVariant } from '../components/typography/kb-text.js';
export type { HostDisplay } from '../core/base-element.js';
// Event types
export type {
  KbChangeCheckboxDetail,
  KbChangeCheckedDetail,
  KbChangeDetail,
  KbChangeGroupDetail,
  KbChangeRadioDetail,
  KbChangeSource,
  KbChangeValueDetail,
  KbClickLinkDetail,
  KbCustomEvent,
  KbEventDetailMap,
  KbEventHandler,
  KbEventName,
  KbInputDetail,
  KbNavigateDetail,
  KbReorderDetail,
  KbRowClickDetail,
  KbSortDetail,
  KbTabChangeDetail,
  KbToggleDetail,
} from '../core/events.js';
export type { FormVariant } from '../core/form-tokens.js';
export type { OverlayBackdrop, OverlaySize } from '../core/overlay-base.js';
export type {
  CompoundVariant,
  InferAllVariants,
  InferRecipeProps,
  InferVariant,
  RecipeConfig,
  RecipeFunction,
  RecipeVariantProps,
  RecipeVariantRecord,
} from '../core/recipe.js';
// Core types
export type { StylePropName, StyleProps } from '../core/style-props.js';
export type { KbClasses, Theme } from '../core/theme.js';
export type {
  BorderWidthValue,
  BreadcrumbItem,
  ColorScheme,
  ColorValue,
  ComponentOf,
  ComponentSize,
  CursorValue,
  DimensionValue,
  DisplayValue,
  FlexAlignValue,
  FlexDirectionValue,
  FlexGrowShrinkValue,
  FlexJustifyValue,
  FlexValue,
  FlexWrapValue,
  FontFamilyValue,
  FontSizeValue,
  FontWeightValue,
  GridSpanValue,
  GridTrackValue,
  KbTagName,
  KnownColorScheme,
  LetterSpacingValue,
  LineHeightValue,
  OpacityValue,
  Orientation,
  OverflowValue,
  PointerEventsValue,
  PositionValue,
  ResolveValueType,
  RoundedValue,
  ShadowValue,
  SortDirection,
  SpacingValue,
  StylePropDef,
  StyleValueCategory,
  StyleValueTypeMap,
  TextAlignValue,
  TextDecorationValue,
  TextTransformValue,
  TransitionValue,
  UserSelectValue,
  ZIndexValue,
} from '../core/types.js';
export type { OptionalKeys, RequiredKeys, Simplify, StrictOmit, ValueOf } from '../core/utility-types.js';
export type { ClassInput } from '../utils/cx.js';

// -- Per-component React prop types (use: React.ComponentProps<typeof Button>) --

export type BoxProps = React.ComponentProps<typeof Box>;
export type FlexProps = React.ComponentProps<typeof Flex>;
export type GridProps = React.ComponentProps<typeof Grid>;
export type StackProps = React.ComponentProps<typeof Stack>;
export type ContainerProps = React.ComponentProps<typeof Container>;
export type DividerProps = React.ComponentProps<typeof Divider>;
export type TextProps = React.ComponentProps<typeof Text>;
export type HeadingProps = React.ComponentProps<typeof Heading>;
export type CodeProps = React.ComponentProps<typeof Code>;
export type ButtonProps = React.ComponentProps<typeof Button>;
export type ButtonGroupProps = React.ComponentProps<typeof ButtonGroup>;
export type IconButtonProps = React.ComponentProps<typeof IconButton>;
export type InputProps = React.ComponentProps<typeof Input>;
export type TextareaProps = React.ComponentProps<typeof Textarea>;
export type SelectProps = React.ComponentProps<typeof Select>;
export type CheckboxProps = React.ComponentProps<typeof Checkbox>;
export type CheckboxGroupProps = React.ComponentProps<typeof CheckboxGroup>;
export type RadioProps = React.ComponentProps<typeof Radio>;
export type RadioGroupProps = React.ComponentProps<typeof RadioGroup>;
export type SwitchProps = React.ComponentProps<typeof Switch>;
export type FormControlProps = React.ComponentProps<typeof FormControl>;
export type FormLabelProps = React.ComponentProps<typeof FormLabel>;
export type AlertProps = React.ComponentProps<typeof Alert>;
export type BadgeProps = React.ComponentProps<typeof Badge>;
export type SpinnerProps = React.ComponentProps<typeof Spinner>;
export type ProgressProps = React.ComponentProps<typeof Progress>;
export type ToastProps = React.ComponentProps<typeof Toast>;
export type CardProps = React.ComponentProps<typeof Card>;
export type TableProps = React.ComponentProps<typeof Table>;
export type AccordionProps = React.ComponentProps<typeof Accordion>;
export type AccordionGroupProps = React.ComponentProps<typeof AccordionGroup>;
export type ListProps = React.ComponentProps<typeof List>;
export type ListItemProps = React.ComponentProps<typeof ListItem>;
export type TagProps = React.ComponentProps<typeof Tag>;
export type TagGroupProps = React.ComponentProps<typeof TagGroup>;
export type ModalProps = React.ComponentProps<typeof Modal>;
export type DrawerProps = React.ComponentProps<typeof Drawer>;
export type TooltipProps = React.ComponentProps<typeof Tooltip>;
export type PopoverProps = React.ComponentProps<typeof Popover>;
export type TabsProps = React.ComponentProps<typeof Tabs>;
export type BreadcrumbProps = React.ComponentProps<typeof Breadcrumb>;
export type LinkProps = React.ComponentProps<typeof Link>;

// -- Re-export element classes for useRef<KbButton>() typing --

export type {
  KbBox,
  KbFlex,
  KbGrid,
  KbStack,
  KbContainer,
  KbDivider,
  KbText,
  KbHeading,
  KbCode,
  KbButton,
  KbButtonGroup,
  KbIconButton,
  KbInput,
  KbTextarea,
  KbSelect,
  KbCheckbox,
  KbCheckboxGroup,
  KbRadio,
  KbRadioGroup,
  KbSwitch,
  KbFormControl,
  KbFormLabel,
  KbAlert,
  KbBadge,
  KbSpinner,
  KbProgress,
  KbToast,
  KbCard,
  KbTable,
  KbAccordion,
  KbAccordionGroup,
  KbList,
  KbListItem,
  KbTag,
  KbTagGroup,
  KbModal,
  KbDrawer,
  KbTooltip,
  KbPopover,
  KbTabs,
  KbBreadcrumb,
  KbLink,
};
