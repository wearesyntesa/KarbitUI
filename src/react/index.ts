import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import type {
  KbInputDetail, KbChangeValueDetail, KbChangeCheckedDetail,
  KbChangeCheckboxDetail, KbChangeRadioDetail, KbChangeGroupDetail,
  KbToggleDetail, KbSortDetail, KbRowClickDetail,
  KbTabChangeDetail, KbNavigateDetail, KbClickLinkDetail, KbReorderDetail,
} from '../core/events.js';

// Layout
import { KbBox } from '../components/layout/kb-box.js';
import { KbFlex } from '../components/layout/kb-flex.js';
import { KbGrid } from '../components/layout/kb-grid.js';
import { KbStack } from '../components/layout/kb-stack.js';
import { KbContainer } from '../components/layout/kb-container.js';
import { KbDivider } from '../components/layout/kb-divider.js';

// Typography
import { KbText } from '../components/typography/kb-text.js';
import { KbHeading } from '../components/typography/kb-heading.js';
import { KbCode } from '../components/typography/kb-code.js';

// Forms
import { KbButton } from '../components/forms/kb-button.js';
import { KbButtonGroup } from '../components/forms/kb-button-group.js';
import { KbIconButton } from '../components/forms/kb-icon-button.js';
import { KbInput } from '../components/forms/kb-input.js';
import { KbTextarea } from '../components/forms/kb-textarea.js';
import { KbSelect } from '../components/forms/kb-select.js';
import { KbCheckbox } from '../components/forms/kb-checkbox.js';
import { KbCheckboxGroup } from '../components/forms/kb-checkbox-group.js';
import { KbRadio } from '../components/forms/kb-radio.js';
import { KbRadioGroup } from '../components/forms/kb-radio-group.js';
import { KbSwitch } from '../components/forms/kb-switch.js';
import { KbFormControl } from '../components/forms/kb-form-control.js';
import { KbFormLabel } from '../components/forms/kb-form-label.js';

// Feedback
import { KbAlert } from '../components/feedback/kb-alert.js';
import { KbBadge } from '../components/feedback/kb-badge.js';
import { KbSpinner } from '../components/feedback/kb-spinner.js';
import { KbProgress } from '../components/feedback/kb-progress.js';
import { KbToast } from '../components/feedback/kb-toast.js';

// Data Display
import { KbCard } from '../components/data-display/kb-card.js';
import { KbTable } from '../components/data-display/kb-table.js';
import { KbAccordion } from '../components/data-display/kb-accordion.js';
import { KbAccordionGroup } from '../components/data-display/kb-accordion-group.js';
import { KbList } from '../components/data-display/kb-list.js';
import { KbListItem } from '../components/data-display/kb-list-item.js';
import { KbTag } from '../components/data-display/kb-tag.js';
import { KbTagGroup } from '../components/data-display/kb-tag-group.js';

// Overlay
import { KbModal } from '../components/overlay/kb-modal.js';
import { KbDrawer } from '../components/overlay/kb-drawer.js';
import { KbTooltip } from '../components/overlay/kb-tooltip.js';
import { KbPopover } from '../components/overlay/kb-popover.js';

// Navigation
import { KbTabs } from '../components/navigation/kb-tabs.js';
import { KbBreadcrumb } from '../components/navigation/kb-breadcrumb.js';
import { KbLink } from '../components/navigation/kb-link.js';

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
    onKbFocus: 'kb-focus' as EventName<CustomEvent>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent>,
    onKbClear: 'kb-clear' as EventName<CustomEvent>,
  },
});

export const Textarea = createComponent({
  react: React,
  tagName: 'kb-textarea',
  elementClass: KbTextarea,
  events: {
    onKbInput: 'kb-input' as EventName<CustomEvent<KbInputDetail>>,
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent>,
    onKbClear: 'kb-clear' as EventName<CustomEvent>,
  },
});

export const Select = createComponent({
  react: React,
  tagName: 'kb-select',
  elementClass: KbSelect,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent>,
    onKbClear: 'kb-clear' as EventName<CustomEvent>,
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
    onKbClose: 'kb-close' as EventName<CustomEvent>,
    onKbToggle: 'kb-toggle' as EventName<CustomEvent<KbToggleDetail>>,
  },
});

export const Badge = createComponent({
  react: React,
  tagName: 'kb-badge',
  elementClass: KbBadge,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent>,
    onKbClose: 'kb-close' as EventName<CustomEvent>,
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
    onKbClose: 'kb-close' as EventName<CustomEvent>,
  },
});

// -- Data Display --

export const Card = createComponent({
  react: React,
  tagName: 'kb-card',
  elementClass: KbCard,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent>,
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
    onKbClick: 'kb-click' as EventName<CustomEvent>,
  },
});

export const Tag = createComponent({
  react: React,
  tagName: 'kb-tag',
  elementClass: KbTag,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent>,
    onKbClose: 'kb-close' as EventName<CustomEvent>,
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
    onKbOpen: 'kb-open' as EventName<CustomEvent>,
    onKbClose: 'kb-close' as EventName<CustomEvent>,
  },
});

export const Drawer = createComponent({
  react: React,
  tagName: 'kb-drawer',
  elementClass: KbDrawer,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent>,
    onKbClose: 'kb-close' as EventName<CustomEvent>,
  },
});

export const Tooltip = createComponent({
  react: React,
  tagName: 'kb-tooltip',
  elementClass: KbTooltip,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent>,
    onKbClose: 'kb-close' as EventName<CustomEvent>,
  },
});

export const Popover = createComponent({
  react: React,
  tagName: 'kb-popover',
  elementClass: KbPopover,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent>,
    onKbClose: 'kb-close' as EventName<CustomEvent>,
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

// Core types
export type { StyleProps, StylePropName } from '../core/style-props.js';
export type {
  SpacingValue, ColorValue, DimensionValue, BorderWidthValue,
  ShadowValue, DisplayValue, FlexAlignValue, FlexJustifyValue,
  FlexDirectionValue, FlexWrapValue, TextAlignValue, FontWeightValue,
  FontSizeValue, PositionValue, OverflowValue,
  RoundedValue, OpacityValue, ZIndexValue, CursorValue,
  FlexValue, FlexGrowShrinkValue, GridTrackValue, GridSpanValue,
  FontFamilyValue, LineHeightValue, LetterSpacingValue,
  TextDecorationValue, TextTransformValue,
  UserSelectValue, PointerEventsValue, TransitionValue,
  ComponentVariant, ComponentSize, ColorScheme, KnownColorScheme, Orientation,
  StyleValueCategory, ResolveValueType, StylePropDef,
} from '../core/types.js';
export type { FormVariant } from '../core/form-tokens.js';
export type { OverlaySize, OverlayBackdrop } from '../core/overlay-base.js';
export type { RecipeConfig, RecipeFunction, RecipeVariantRecord, CompoundVariant } from '../core/recipe.js';
export type { Theme, KbClasses } from '../core/theme.js';
export type { ClassInput } from '../utils/cx.js';
export type { Simplify } from '../core/utility-types.js';

// Event types
export type {
  KbChangeValueDetail, KbChangeCheckedDetail, KbChangeCheckboxDetail,
  KbChangeRadioDetail, KbChangeGroupDetail, KbChangeSource, KbInputDetail,
  KbClickLinkDetail, KbToggleDetail, KbSortDetail, KbRowClickDetail,
  KbTabChangeDetail, KbNavigateDetail, KbReorderDetail,
  KbEventDetailMap, KbCustomEvent,
} from '../core/events.js';

// Component variant/size types
export type { ButtonVariant, ButtonSize } from '../components/forms/kb-button.js';
export type { ButtonGroupDirection } from '../components/forms/kb-button-group.js';
export type { IconButtonVariant } from '../components/forms/kb-icon-button.js';
export type { InputType } from '../components/forms/kb-input.js';
export type { ResizeMode } from '../components/forms/kb-textarea.js';
export type { SelectOption, SelectOptionGroup, SelectOptionOrGroup } from '../components/forms/kb-select.js';
export type { SwitchLabelPosition } from '../components/forms/kb-switch.js';
export type { AlertStatus, AlertVariant } from '../components/feedback/kb-alert.js';
export type { BadgeVariant, BadgeSize } from '../components/feedback/kb-badge.js';
export type { SpinnerVariant, SpinnerSpeed } from '../components/feedback/kb-spinner.js';
export type { ProgressSize } from '../components/feedback/kb-progress.js';
export type { ToastStatus, ToastPosition } from '../components/feedback/kb-toast.js';
export type { CardVariant } from '../components/data-display/kb-card.js';
export type { TableVariant, TableSize, SortDirection } from '../components/data-display/kb-table.js';
export type { ListVariant, ListSpacing } from '../components/data-display/kb-list.js';
export type { TagVariant, TagSize } from '../components/data-display/kb-tag.js';
export type { TagGroupGap } from '../components/data-display/kb-tag-group.js';
export type { ContainerSize } from '../components/layout/kb-container.js';
export type { DividerVariant, DividerThickness } from '../components/layout/kb-divider.js';
export type { TextVariant, TextTone, TextAs } from '../components/typography/kb-text.js';
export type { HeadingLevel, HeadingSize, HeadingWeight, HeadingTone } from '../components/typography/kb-heading.js';
export type { CodeHighlighter } from '../components/typography/kb-code.js';
export type { ModalPlacement } from '../components/overlay/kb-modal.js';
export type { DrawerPlacement } from '../components/overlay/kb-drawer.js';
export type { TooltipPlacement, TooltipSize, TooltipVariant } from '../components/overlay/kb-tooltip.js';
export type { PopoverPlacement, PopoverTrigger, PopoverSize } from '../components/overlay/kb-popover.js';
export type { TabsVariant, TabsSize, TabsOrientation, TabsColorScheme, TabsAlign } from '../components/navigation/kb-tabs.js';
export type { BreadcrumbItem, SeparatorType } from '../components/navigation/kb-breadcrumb.js';
export type { LinkVariant } from '../components/navigation/kb-link.js';
