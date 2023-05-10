import type { ExtractPropTypes, PropType } from 'vue-demi';

export function buildProps<T extends object>() {
  return {
    modelValue: {
      type: String as PropType<string>,
      required: true
    },

    /**
     * Auth Access Token to use for request
     */
    accessToken: {
      type: String as PropType<string>,
      required: true
    },

    /**
     * Custom CDN links to use for specific element/component
     */
    cdn: {
      type: Object as PropType<{ js: string, css: string }>,
      required: false
    },

    /**
     * Options
     */
    options: {
      type: Object as PropType<T>,
      default: () => ({})
    },

    /**
     * Version of box-ui-elements to use.
     * It will have no effect when using custom cdn links
     */
    version: {
      type: String as PropType<string>,
      required: false
    },

    /**
     * Whether to dispose the Head on unmount
     */
    height: {
      type: String as PropType<CSSStyleDeclaration['height']>,
      default: '500px'
    },

    /**
     * Whether to dispose the Head on unmount
     */
    disposeOnUnmount: {
      type: Boolean as PropType<boolean>,
      default: true
    }
  };
}

export type BuiltBoxProps = ExtractPropTypes<ReturnType<typeof buildProps>>;
