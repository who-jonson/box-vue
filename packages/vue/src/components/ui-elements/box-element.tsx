import type {
  ComponentOptionsMixin,
  ObjectEmitsOptions,
  PropType
} from 'vue-demi';
import { capitalize } from '@vue/shared';
import { objectKeys, template } from '@whoj/utils';
import { useVModel } from '@vueuse/core';
import { defineComponent, readonly, watchEffect } from 'vue-demi';

import { BoxUiElements, useBoxElement } from './useBoxElement';
import type { BoxUiElementName } from './useBoxElement';
import type { BaseEl, CdnOption } from '../../types';

let _counter = 0;

/**
 * @class BoxElementFactory
 */
class BoxElementFactory<El extends BaseEl<Opt, Evt>, Opt extends object, Evt extends ObjectEmitsOptions> {
  readonly props = {
    /**
     * File/Folder ID depending on the Element you're using
     */
    modelValue: {
      type: String as PropType<string | null>,
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
      type: Object as PropType<CdnOption>,
      required: false
    },

    /**
     * Options
     */
    options: {
      type: null as unknown as PropType<Opt>,
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
      default: '350px'
    },

    /**
     * Whether to dispose the Head on unmount
     */
    disposeOnUnmount: {
      type: Boolean as PropType<boolean>,
      default: true
    },

    /**
     * Whether to render the component immediately after load
     */
    immediate: {
      type: Boolean as PropType<boolean>,
      default: true
    },

    /**
     * Whether to dispose the Head on unmount
     */
    show: {
      type: Boolean as PropType<boolean>,
      default: true
    }
  };

  constructor(private readonly name: string) {}

  create<UiName extends BoxUiElementName>(name: UiName, events: Evt) {
    type _Props = typeof this.props;

    return defineComponent<_Props, { instance: Readonly<El> }, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, Evt>({
      name: this.name,
      props: this.props,
      emits: events,
      expose: ['instance'],
      setup(props, { attrs, emit, expose }) {
        const fid = useVModel(props, 'modelValue', emit);

        const id = (attrs.id || `box__${name}__wrapper${++_counter}`) as string;

        const { getInstance, instance, loaded } = useBoxElement<El, Opt, Evt>(
          fid,
          props.accessToken,
          // @ts-ignore
          {
            ...(props.options || {}),
            cdn: props.cdn,
            el: name,
            disposeOnUnmount: props.disposeOnUnmount,
            immediate: props.immediate,
            container: `#${id}`,
            version: props.version,
            style: `.box-ui-element-wrapper > :first-child { height: ${props.height}; }`,
            listeners: objectKeys(events)
              .filter(name => !['update:model-value'].includes(name as string))
              .reduce((evt, name) => ({
                ...evt,
                [name]: (args) => {
                // @ts-ignore
                  emit(name, args);
                }
              }), {})
          }
        );

        expose({ instance: readonly(instance.value) });

        watchEffect(() => {
          if (loaded && getInstance()?.show) {
            emit('initiated', getInstance());
            try {
              if (fid.value?.length) {
                getInstance().show(fid.value, props.accessToken, { ...props.options, container: `#${id}` } as any);
              } else {
                getInstance().hide();
              }
            } catch (e) {}
          }
        });

        return () => (<div { ...attrs } id={id} class="box-ui-element-wrapper"></div>);
      }
    });
  }
}

export function GenericBoxElement<El extends BaseEl<Opt, Evt>, Opt extends object, Evt extends ObjectEmitsOptions, T extends BoxUiElementName = BoxUiElementName>(
  name: T,
  // useElement: typeof useBoxElement<El, Opt, Evt>,
  events: Evt
) {
  const _events = {
    ...events,
    'initiated': (args: El) => true,
    'update:model-value': (args: string | null) => true
  };

  type _Events = typeof _events & Evt;

  const component = new BoxElementFactory<El, Opt, _Events>(template('Box{0}', BoxUiElements[name]));

  return component.create(name, _events);
}
