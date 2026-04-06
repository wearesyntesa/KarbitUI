import { defineComponent, h, onBeforeUnmount, onMounted, type PropType, ref, type Slots, type VNode, watch } from 'vue';
import type { KbCheckbox } from '../../components/forms/kb-checkbox.define.js';
import type { KbChangeCheckboxDetail } from '../../core/events.js';
import type { ColorScheme, ComponentSize } from '../../core/types.js';
import { renderElementSlotChildren } from '../render-slots.js';

type CheckboxSetupProps = {
  readonly checked: boolean;
  readonly size: ComponentSize;
  readonly disabled: boolean;
  readonly indeterminate: boolean;
  readonly invalid: boolean;
  readonly colorScheme?: ColorScheme | undefined;
  readonly name?: string | undefined;
  readonly value?: string | undefined;
};

type CheckboxSetupContext = {
  readonly attrs: Record<string, unknown>;
  readonly emit: (event: 'update:checked' | 'kb-change' | 'kb-focus' | 'kb-blur', ...args: unknown[]) => void;
  readonly expose: (exposed?: Record<string, unknown>) => void;
  readonly slots: Slots;
};

export const Checkbox: ReturnType<typeof defineComponent> = defineComponent({
  name: 'KarbitCheckbox',
  inheritAttrs: false,
  props: {
    checked: Boolean,
    size: {
      type: String as PropType<ComponentSize>,
      default: 'md',
    },
    disabled: Boolean,
    indeterminate: Boolean,
    invalid: Boolean,
    colorScheme: String as PropType<ColorScheme>,
    name: String,
    value: String,
  },
  emits: ['update:checked', 'kb-change', 'kb-focus', 'kb-blur'],
  setup(props: CheckboxSetupProps, context: CheckboxSetupContext): () => VNode {
    const { attrs, emit, expose, slots } = context;
    const elementRef = ref<KbCheckbox | null>(null);

    const handleKbChange = (event: Event): void => {
      const customEvent = event as CustomEvent<KbChangeCheckboxDetail>;
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
        'kb-checkbox',
        {
          ...attrs,
          ref: elementRef,
          checked: props.checked,
          size: props.size,
          disabled: props.disabled,
          indeterminate: props.indeterminate,
          invalid: props.invalid,
          colorScheme: props.colorScheme,
          name: props.name,
          value: props.value,
        },
        renderElementSlotChildren(slots, ['description']),
      );
  },
});

export type CheckboxProps = InstanceType<typeof Checkbox>['$props'];
export type { KbCheckbox };
