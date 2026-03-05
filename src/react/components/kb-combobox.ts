import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbCombobox } from '../../components/forms/kb-combobox.define.js';
import type { SelectOption } from '../../components/forms/kb-select.js';
import type { KbChangeValueDetail, KbInputDetail } from '../../core/events.js';

export type ComboboxChangeDetail<V extends string = string> = Omit<KbChangeValueDetail, 'source' | 'value'> & {
  readonly source: 'combobox';
  readonly value: V;
};

const BaseCombobox = createComponent({
  react: React,
  tagName: 'kb-combobox',
  elementClass: KbCombobox,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<ComboboxChangeDetail>>,
    onKbInput: 'kb-input' as EventName<CustomEvent<KbInputDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
    onKbClear: 'kb-clear' as EventName<CustomEvent<undefined>>,
  },
});

type BaseComboboxProps = React.ComponentProps<typeof BaseCombobox>;

export interface ComboboxProps<V extends string = string>
  extends Omit<BaseComboboxProps, 'options' | 'value' | 'onKbChange'> {
  options?: readonly SelectOption<V>[];
  value?: V | '';
  onKbChange?: (event: CustomEvent<ComboboxChangeDetail<V>>) => void;
}

export const Combobox = BaseCombobox as <V extends string = string>(
  props: ComboboxProps<V> & React.RefAttributes<KbCombobox<V>>,
) => React.JSX.Element;

export type { KbCombobox };
