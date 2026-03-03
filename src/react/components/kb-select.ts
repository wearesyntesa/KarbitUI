import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbSelect } from '../../components/forms/kb-select.define.js';
import type { SelectOptionOrGroup } from '../../components/forms/kb-select.js';
import type { KbChangeValueDetail } from '../../core/events.js';

/** Narrowed change detail that preserves the generic value type `V` while remaining structurally coherent with `KbChangeValueDetail`. */
export type SelectChangeDetail<V extends string = string> = Omit<KbChangeValueDetail, 'source' | 'value'> & {
  readonly source: 'select';
  readonly value: V;
};

/**
 * Non-generic base created by `@lit/react`. Event types are widened to `string`.
 * Use the generic {@link Select} alias for narrowed value inference.
 */
const BaseSelect = createComponent({
  react: React,
  tagName: 'kb-select',
  elementClass: KbSelect,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<SelectChangeDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
    onKbClear: 'kb-clear' as EventName<CustomEvent<undefined>>,
  },
});

type BaseSelectProps = React.ComponentProps<typeof BaseSelect>;

/** Props for `<Select>` with the generic value type `V` threaded through options & events. */
export interface SelectProps<V extends string = string>
  extends Omit<BaseSelectProps, 'options' | 'value' | 'onKbChange'> {
  options?: readonly SelectOptionOrGroup<V>[];
  value?: V | '';
  onKbChange?: (event: CustomEvent<SelectChangeDetail<V>>) => void;
}

/**
 * Generic React wrapper for `<kb-select>`.
 *
 * The value type `V` flows from the `options` array into the `onKbChange`
 * event detail so consumers get fully narrowed types without manual casting.
 *
 * @example
 * ```tsx
 * type Status = 'active' | 'inactive';
 * const options: SelectOption<Status>[] = [
 *   { value: 'active', label: 'Active' },
 *   { value: 'inactive', label: 'Inactive' },
 * ];
 *
 * <Select
 *   options={options}
 *   onKbChange={(e) => {
 *     // e.detail.value is inferred as Status
 *     setStatus(e.detail.value);
 *   }}
 * />
 * ```
 */
export const Select = BaseSelect as <V extends string = string>(
  props: SelectProps<V> & React.RefAttributes<KbSelect<V>>,
) => React.JSX.Element;

export type { KbSelect };
export type { SelectOption, SelectOptionGroup, SelectOptionOrGroup } from '../../components/forms/kb-select.js';
export { isOptionGroup } from '../../components/forms/kb-select.js';
