import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbColorPicker } from '../../components/forms/kb-color-picker.define.js';
import type { KbChangeValueDetail, KbColorChangeDetail } from '../../core/events.js';

export const ColorPicker = createComponent({
  react: React,
  tagName: 'kb-color-picker',
  elementClass: KbColorPicker,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbColorChange: 'kb-color-change' as EventName<CustomEvent<KbColorChangeDetail>>,
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
    onKbClear: 'kb-clear' as EventName<CustomEvent<undefined>>,
  },
});

export type ColorPickerProps = React.ComponentProps<typeof ColorPicker>;
export type { KbColorPicker };
