import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbSegment } from '../../components/forms/kb-segment.define.js';
import type { SegmentOption } from '../../components/forms/kb-segment.js';
import type { KbChangeValueDetail } from '../../core/events.js';

export type SegmentChangeDetail<V extends string = string> = Omit<KbChangeValueDetail, 'source' | 'value'> & {
  readonly source: 'segment';
  readonly value: V;
};

const BaseSegment = createComponent({
  react: React,
  tagName: 'kb-segment',
  elementClass: KbSegment,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<SegmentChangeDetail>>,
  },
});

type BaseSegmentProps = React.ComponentProps<typeof BaseSegment>;

export interface SegmentProps<V extends string = string>
  extends Omit<BaseSegmentProps, 'options' | 'value' | 'onKbChange'> {
  options?: readonly SegmentOption<V>[];
  value?: V | '';
  onKbChange?: (event: CustomEvent<SegmentChangeDetail<V>>) => void;
}

export const Segment = BaseSegment as <V extends string = string>(
  props: SegmentProps<V> & React.RefAttributes<KbSegment<V>>,
) => React.JSX.Element;

export type { KbSegment };
export type { SegmentOption } from '../../components/forms/kb-segment.js';
