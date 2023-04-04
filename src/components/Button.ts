import { Lightning } from '@lightningjs/sdk';

interface ButtonTemplateSpec extends Lightning.Component.TemplateSpec {
  Background: {
    Label: object;
  };
  label: string;
  onEnter?: () => void;
}

export class Button extends Lightning.Component<ButtonTemplateSpec> implements Lightning.Component.ImplementTemplateSpec<ButtonTemplateSpec> {
  static bgColor = 0xcc1b1335;
  static bgColorFocus = 0xfffab401;
  static fontColor = 0xffffffff;
  static fontColorFocus = 0xff13001d;
  static shader = { type: Lightning.shaders.RoundedRectangle, radius: [8], stroke: 2, strokeColor: 0xff5a4d61 };
  static shaderFocus = { type: Lightning.shaders.RoundedRectangle, radius: [8] };

  onEnter?: () => void;

  static override _template(): Lightning.Component.Template<ButtonTemplateSpec> {
    return {
      flex: {},
      Background: {
        rect: true,
        color: Button.bgColor,
        shader: Button.shader,
        flex: {
          padding: 10,
          paddingLeft: 20,
          paddingRight: 20,
        },
        Label: {
          shader: null,
          text: {
            text: this.bindProp('label'),
            fontSize: 16,
            textColor: Button.fontColor,
          },
        },
      },
    };
  }

  override _focus() {
    this.patch({
      Background: {
        color: Button.bgColorFocus,
        shader: Button.shaderFocus,
        Label: {
          text: {
            textColor: Button.fontColorFocus,
          },
        },
      },
    });
  }

  override _unfocus() {
    this.patch({
      Background: {
        color: Button.bgColor,
        shader: Button.shader,
        Label: {
          text: {
            textColor: Button.fontColor,
          },
        },
      },
    });
  }

  override _handleEnter() {
    if (this.onEnter) {
      this.onEnter();
    }
  }
}
