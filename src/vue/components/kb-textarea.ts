import { defineComponent, h, onBeforeUnmount, onMounted, type PropType, ref, type Slots, type VNode, watch } from 'vue';
import type { KbTextarea } from '../../components/forms/kb-textarea.define.js';
import type { ResizeMode } from '../../components/forms/kb-textarea.js';
import type { KbChangeValueDetailFor, KbInputDetail } from '../../core/events.js';
import type { FormVariant } from '../../core/form-tokens.js';
import type { ComponentSize } from '../../core/types.js';

type TextareaSetupProps = {
  readonly inputId?: string | undefined;
  readonly value: string;
  readonly variant: FormVariant;
  readonly size: ComponentSize;
  readonly placeholder?: string | undefined;
  readonly name?: string | undefined;
  readonly rows: number;
  readonly maxLength?: number | undefined;
  readonly resize: ResizeMode;
  readonly disabled: boolean;
  readonly invalid: boolean;
  readonly readonly: boolean;
  readonly required: boolean;
  readonly clearable: boolean;
  readonly loading: boolean;
  readonly autoResize: boolean;
};

type TextareaSetupContext = {
  readonly attrs: Record<string, unknown>;
  readonly emit: (
    event: 'update:value' | 'kb-input' | 'kb-change' | 'kb-focus' | 'kb-blur' | 'kb-clear',
    ...args: unknown[]
  ) => void;
  readonly expose: (exposed?: Record<string, unknown>) => void;
  readonly slots: Slots;
};

export const Textarea: ReturnType<typeof defineComponent> = defineComponent({
  name: 'KarbitTextarea',
  inheritAttrs: false,
  props: {
    inputId: String,
    value: {
      type: String,
      default: '',
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
    rows: {
      type: Number,
      default: 4,
    },
    maxLength: Number,
    resize: {
      type: String as PropType<ResizeMode>,
      default: 'vertical',
    },
    disabled: Boolean,
    invalid: Boolean,
    readonly: Boolean,
    required: Boolean,
    clearable: Boolean,
    loading: Boolean,
    autoResize: Boolean,
  },
  emits: ['update:value', 'kb-input', 'kb-change', 'kb-focus', 'kb-blur', 'kb-clear'],
  setup(props: TextareaSetupProps, context: TextareaSetupContext): () => VNode {
    const { attrs, emit, expose } = context;
    const elementRef = ref<KbTextarea | null>(null);

    const handleKbInput = (event: Event): void => {
      const customEvent = event as CustomEvent<KbInputDetail>;
      emit('update:value', customEvent.detail.value);
      emit('kb-input', customEvent);
    };

    const handleKbChange = (event: Event): void => {
      emit('kb-change', event as CustomEvent<KbChangeValueDetailFor<'textarea'>>);
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
      h('kb-textarea', {
        ...attrs,
        ref: elementRef,
        inputId: props.inputId,
        value: props.value,
        variant: props.variant,
        size: props.size,
        placeholder: props.placeholder,
        name: props.name,
        rows: props.rows,
        maxLength: props.maxLength,
        resize: props.resize,
        disabled: props.disabled,
        invalid: props.invalid,
        readonly: props.readonly,
        required: props.required,
        clearable: props.clearable,
        loading: props.loading,
        autoResize: props.autoResize,
      });
  },
});

export type TextareaProps = InstanceType<typeof Textarea>['$props'];
export type { KbTextarea };
export type { ResizeMode } from '../../components/forms/kb-textarea.js';
