import { Lightning } from '@lightningjs/sdk';

interface TagTemplateSpec extends Lightning.Component.TemplateSpec {
  Background: {
    Label: object;
  };
  label: string;
}

export class Tag extends Lightning.Component<TagTemplateSpec> implements Lightning.Component.ImplementTemplateSpec<TagTemplateSpec> {
  static override _template(): Lightning.Component.Template<TagTemplateSpec> {
    return {
      flex: {},
      Background: {
        rect: true,
        color: 0xffffffff,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: [8] },
        flex: {
          padding: 7,
          paddingLeft: 15,
          paddingRight: 15,
        },
        Label: {
          shader: null,
          text: {
            text: this.bindProp('label'),
            fontSize: 16,
            textColor: 0xff000000,
          },
        },
      },
    };
  }
}
