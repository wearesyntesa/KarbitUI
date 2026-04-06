import { defineComponent, h, onBeforeUnmount, onMounted, type PropType, ref, type Slots, type VNode, watch } from 'vue';
import type { KbSwitch } from '../../components/forms/kb-switch.define.js';
import type { SwitchLabelPosition } from '../../components/forms/kb-switch.js';
import type { KbChangeCheckedDetail } from '../../core/events.js';
import type { ColorScheme, ComponentSize } from '../../core/types.js';
import { renderElementSlotChildren } from '../render-slots.js';

type SwitchSetupProps = {
  readonly checked: boolean;
  readonly size: ComponentSize;
  readonly disabled: boolean;
  readonly invalid: boolean;
  readonly loading: boolean;
  readonly showIcons: boolean;
  readonly colorScheme?: ColorScheme | undefined;
  readonly labelPosition: SwitchLabelPosition;
  readonly name?: string | undefined;
};

type SwitchSetupContext = {
  readonly attrs: Record<string, unknown>;
  readonly emit: (event: 'update:checked' | 'kb-change' | 'kb-focus' | 'kb-blur', ...args: unknown[]) => void;
  readonly expose: (exposed?: Record<string, unknown>) => void;
  readonly slots: Slots;
};

export const Switch: ReturnType<typeof defineComponent> = defineComponent({
  name: 'KarbitSwitch',
  inheritAttrs: false,
  props: {
    checked: Boolean,
    size: {
      type: String as PropType<ComponentSize>,
      default: 'md',
    },
    disabled: Boolean,
    invalid: Boolean,
    loading: Boolean,
    showIcons: Boolean,
    colorScheme: String as PropType<ColorScheme>,
    labelPosition: {
      type: String as PropType<SwitchLabelPosition>,
      default: 'right',
    },
    name: String,
  },
  emits: ['update:checked', 'kb-change', 'kb-focus', 'kb-blur'],
  setup(props: SwitchSetupProps, context: SwitchSetupContext): () => VNode {
    const { attrs, emit, expose, slots } = context;
    const elementRef = ref<KbSwitch | null>(null);

    const handleKbChange = (event: Event): void => {
      const customEvent = event as CustomEvent<KbChangeCheckedDetail>;
      emit('update:checked', customEvent.detail.checked);
      emit('kb-change', customEvent);
    };

    const handleKbFocus = (event: Event): void => {
      emit('kb-focus', event as CustomEvent<undefined>);
    };

    const handleKbBlur = (event: Event): void => {
      emit('kb-blur', event as CustomEvent<undefined>);
    };

    onMounted(() => {
      const element = elementRef.value;
      if (!element) return;

      element.addEventListener('kb-change', handleKbChange);
      element.addEventListener('kb-focus', handleKbFocus);
      element.addEventListener('kb-blur', handleKbBlur);
    });

    onBeforeUnmount(() => {
      const element = elementRef.value;
      if (!element) return;

      element.removeEventListener('kb-change', handleKbChange);
      element.removeEventListener('kb-focus', handleKbFocus);
      element.removeEventListener('kb-blur', handleKbBlur);
    });

    watch(
      () => props.checked,
      (checked: boolean) => {
        if (elementRef.value && elementRef.value.checked !== checked) {
          elementRef.value.checked = checked;
        }
      },
      { immediate: true },
    );

    expose({ element: elementRef });

    return () =>
      h(
        'kb-switch',
        {
          ...attrs,
          ref: elementRef,
          checked: props.checked,
          size: props.size,
          disabled: props.disabled,
          invalid: props.invalid,
          loading: props.loading,
          showIcons: props.showIcons,
          colorScheme: props.colorScheme,
          labelPosition: props.labelPosition,
          name: props.name,
        },
        renderElementSlotChildren(slots, ['description']),
      );
  },
});

export type SwitchProps = InstanceType<typeof Switch>['$props'];
export type { KbSwitch };
export type { SwitchLabelPosition } from '../../components/forms/kb-switch.js';
