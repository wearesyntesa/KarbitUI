import { defineComponent, h, onBeforeUnmount, onMounted, type PropType, ref, type Slots, type VNode, watch } from 'vue';
import type { KbInput } from '../../components/forms/kb-input.define.js';
import type { InputType } from '../../components/forms/kb-input.js';
import type { KbChangeValueDetailFor, KbInputDetail } from '../../core/events.js';
import type { FormVariant } from '../../core/form-tokens.js';
import type { ComponentSize } from '../../core/types.js';
import { renderElementSlotChildren } from '../render-slots.js';

type InputSetupProps = {
  readonly inputId?: string | undefined;
  readonly value: string;
  readonly type: InputType;
  readonly variant: FormVariant;
  readonly size: ComponentSize;
  readonly placeholder?: string | undefined;
  readonly name?: string | undefined;
  readonly maxLength?: number | undefined;
  readonly disabled: boolean;
  readonly invalid: boolean;
  readonly readonly: boolean;
  readonly required: boolean;
  readonly clearable: boolean;
  readonly loading: boolean;
};

type InputSetupContext = {
  readonly attrs: Record<string, unknown>;
  readonly emit: (
    event: 'update:value' | 'kb-input' | 'kb-change' | 'kb-focus' | 'kb-blur' | 'kb-clear',
    ...args: unknown[]
  ) => void;
  readonly expose: (exposed?: Record<string, unknown>) => void;
  readonly slots: Slots;
};

export const Input: ReturnType<typeof defineComponent> = defineComponent({
  name: 'KarbitInput',
  inheritAttrs: false,
  props: {
    inputId: String,
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String as PropType<InputType>,
      default: 'text',
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
    maxLength: Number,
    disabled: Boolean,
    invalid: Boolean,
    readonly: Boolean,
    required: Boolean,
    clearable: Boolean,
    loading: Boolean,
  },
  emits: ['update:value', 'kb-input', 'kb-change', 'kb-focus', 'kb-blur', 'kb-clear'],
  setup(props: InputSetupProps, context: InputSetupContext): () => VNode {
    const { attrs, emit, expose, slots } = context;
    const elementRef = ref<KbInput | null>(null);

    const handleKbInput = (event: Event): void => {
      const customEvent = event as CustomEvent<KbInputDetail>;
      emit('update:value', customEvent.detail.value);
      emit('kb-input', customEvent);
    };

    const handleKbChange = (event: Event): void => {
      emit('kb-change', event as CustomEvent<KbChangeValueDetailFor<'input'>>);
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

      element.addEventListener('kb-input', handleKbInput);
      element.addEventListener('kb-change', handleKbChange);
      element.addEventListener('kb-focus', handleKbFocus);
      element.addEventListener('kb-blur', handleKbBlur);
      element.addEventListener('kb-clear', handleKbClear);
    });

    onBeforeUnmount(() => {
      const element = elementRef.value;
      if (!element) return;

      element.removeEventListener('kb-input', handleKbInput);
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

    expose({ element: elementRef });

    return () =>
      h(
        'kb-input',
        {
          ...attrs,
          ref: elementRef,
          inputId: props.inputId,
          value: props.value,
          type: props.type,
          variant: props.variant,
          size: props.size,
          placeholder: props.placeholder,
          name: props.name,
          maxLength: props.maxLength,
          disabled: props.disabled,
          invalid: props.invalid,
          readonly: props.readonly,
          required: props.required,
          clearable: props.clearable,
          loading: props.loading,
        },
        renderElementSlotChildren(slots, ['addon-left', 'addon-right', 'icon-left', 'icon-right']),
      );
  },
});

export type InputProps = InstanceType<typeof Input>['$props'];
export type { KbInput };
export type { InputType } from '../../components/forms/kb-input.js';
