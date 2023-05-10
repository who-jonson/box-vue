import uniqueId from 'lodash/uniqueId';
import type { ExtractPropTypes, PropType } from 'vue-demi';

export const accessibleSVGProps = {
  className: {
    type: [Array, Object, String] as PropType<string | { [p: string]: boolean } | Array<string | { [p: string]: boolean }>>,
    default: null
  },

  height: {
    type: Number as PropType<number>,
    default: 32
  },

  width: {
    type: Number as PropType<number>,
    default: 32
  },

  viewBox: {
    type: String as PropType<string>,
    default: '0 0 32 32'
  },

  role: {
    type: String as PropType<string>,
    default: 'presentation'
  },

  title: {
    type: String as PropType<string>,
    default: null
  }
};

export type SVGProps = ExtractPropTypes<typeof accessibleSVGProps>;

const AccessibleSVG = ({ title, ...props }: SVGProps, { attrs, slots }) => {
  const id = uniqueId('box__icon__');
  const titleID = `${id}-title`;

  // Make sure parent doesn't accidentally override these values
  const __svgProps = () => {
    const _props = { ...(attrs || {}) };

    // Accessibility fix for IE11, which treats all SVGs as focusable by default
    // _props.focusable = 'false';

    if (title?.length) {
      _props['aria-labelledby'] = titleID;
      _props.role = 'img';
    } else {
      _props['aria-hidden'] = 'true';
      _props.role = 'presentation';
    }

    return { ...props, ..._props };
  };

  const svgProps = __svgProps();

  return (
    <svg id={id} {...svgProps}>
      {title ? <title id={titleID}>{title}</title> : ''}
      {slots.default?.()}
    </svg>
  );
};

AccessibleSVG.inheritAttrs = false;
AccessibleSVG.props = accessibleSVGProps;
AccessibleSVG.displayName = 'AccessibleSVG';

export default AccessibleSVG;
