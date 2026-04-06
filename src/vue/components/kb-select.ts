import { defineComponent, h, onBeforeUnmount, onMounted, type PropType, ref, type Slots, type VNode, watch } from 'vue';
import type { KbSelect } from '../../components/forms/kb-select.define.js';
import type { SelectOptionOrGroup } from '../../components/forms/kb-select.js';
import type { KbChangeValueDetailFor } from '../../core/events.js';
import type { FormVariant } from '../../core/form-tokens.js';
import type { ComponentSize } from '../../core/types.js';
import { renderElementSlotChildren } from '../render-slots.js';

type SelectSetupProps = {
  readonly inputId?: string | undefined;
  readonly value: string;
  readonly options: readonly SelectOptionOrGroup[];
  readonly variant: FormVariant;
  readonly size: ComponentSize;
  readonly placeholder?: string | undefined;
  readonly name?: string | undefined;
  readonly disabled: boolean;
  readonly invalid: boolean;
  readonly required: boolean;
  readonly clearable: boolean;
  readonly loading: boolean;
  readonly emptyText: string;
};

type SelectSetupContext = {
  readonly attrs: Record<string, unknown>;
  readonly emit: (
    event: 'update:value' | 'kb-change' | 'kb-focus' | 'kb-blur' | 'kb-clear',
    ...args: unknown[]
  ) => void;
  readonly expose: (exposed?: Record<string, unknown>) => void;
  readonly slots: Slots;
};

export const Select: ReturnType<typeof defineComponent> = defineComponent({
  name: 'KarbitSelect',
  inheritAttrs: false,
  props: {
    inputId: String,
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Array as PropType<readonly SelectOptionOrGroup[]>,
      default: () => [],
    },
    variant: {
      type: String as PropType<FormVariant>,
      default: 'outline',
    },
    size: {
      type: String as PropType<ComponentSize>,
      default: 'md',
    },
    placeholder: String,
    name: String,
    disabled: Boolean,
    invalid: Boolean,
    required: Boolean,
    clearable: Boolean,
    loading: Boolean,
    emptyText: {
      type: String,
      default: 'No results',
    },
  },
  emits: ['update:value', 'kb-change', 'kb-focus', 'kb-blur', 'kb-clear'],
  setup(props: SelectSetupProps, context: SelectSetupContext): () => VNode {
    const { attrs, emit, expose, slots } = context;
    const elementRef = ref<KbSelect | null>(null);

    const handleKbChange = (event: Event): void => {
      const customEvent = event as CustomEvent<KbChangeValueDetailFor<'select'>>;
      emit('update:value', customEvent.detail.value);
      emit('kb-change', customEvent);
    };

    const handleKbFocus = (event: Event): void => {
      emit('kb-focus', event as CustomEvent<undefined>);
    };

    const handleKbBlur = (event: Event): void => {
      emit('kb-blur', event as CustomEvent<undefined>);
    };

    const handleKbClear = (event: Event): void => {
      emit('update:value', '');
      emit('kb-clear', event as CustomEvent<undefined>);
    };

    onMounted(() => {
      const element = elementRef.value;
      if (!element) return;

      element.addEventListener('kb-change', handleKbChange);
      element.addEventListener('kb-focus', handleKbFocus);
      element.addEventListener('kb-blur', handleKbBlur);
      element.addEventListener('kb-clear', handleKbClear);
    });

    onBeforeUnmount(() => {
      const element = elementRef.value;
      if (!element) return;

      element.removeEventListener('kb-change', handleKbChange);
      element.removeEventListener('kb-focus', handleKbFocus);
      element.removeEventListener('kb-blur', handleKbBlur);
      element.removeEventListener('kb-clear', handleKbClear);
    });

    watch(
      () => props.value,
      (value: string) => {
        if (elementRef.value && elementRef.value.value !== value) {
          elementRef.value.value = value;
        }
      },
      { immediate: true },
    );

    watch(
      () => props.options,
      (options: readonly SelectOptionOrGroup[]) => {
        if (elementRef.value) {
          elementRef.value.options = options;
        }
      },
      { immediate: true },
    );

    expose({ element: elementRef });

    return () =>
      h(
        'kb-select',
        {
          ...attrs,
          ref: elementRef,
          inputId: props.inputId,
          value: props.value,
          options: props.options,
          variant: props.variant,
          size: props.size,
          placeholder: props.placeholder,
          name: props.name,
          disabled: props.disabled,
          invalid: props.invalid,
          required: props.required,
          clearable: props.clearable,
          loading: props.loading,
          emptyText: props.emptyText,
        },
        renderElementSlotChildren(slots, ['icon']),
      );
  },
});

export type SelectProps = InstanceType<typeof Select>['$props'];
export type { KbSelect };
export type { SelectOption, SelectOptionGroup, SelectOptionOrGroup } from '../../components/forms/kb-select.js';
export { isOptionGroup } from '../../components/forms/kb-select.js';
