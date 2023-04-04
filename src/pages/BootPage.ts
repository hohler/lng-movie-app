import { Lightning, Router } from '@lightningjs/sdk';

interface BootPageTemplateSpec extends Lightning.Component.TemplateSpec {
  //
}

export class BootPage extends Lightning.Component<BootPageTemplateSpec> implements Lightning.Component.ImplementTemplateSpec<BootPageTemplateSpec> {
  static override _template(): Lightning.Component.Template<BootPageTemplateSpec> {
    return {
      //
    };
  }

  override pageTransition(pageIn: Router.PageInstance, pageOut: Router.PageInstance | null): Router.PageTransition | Promise<void> {
    return 'fade';
  }

  override async _init() {
    Router.navigate('home');
  }
}
