import { Lightning, Router } from '@lightningjs/sdk';

interface BootPageTemplateSpec extends Lightning.Component.TemplateSpec {
  //
}

interface BootPageTypeConfig extends Lightning.Component.TypeConfig {
  isPage: true;
}

export class BootPage extends Lightning.Component<BootPageTemplateSpec, BootPageTypeConfig> implements Lightning.Component.ImplementTemplateSpec<BootPageTemplateSpec> {
  static override _template(): Lightning.Component.Template<BootPageTemplateSpec> {
    return {
      //
    };
  }

  override pageTransition(pageIn: Router.PageInstance, pageOut: Router.PageInstance | null): Router.PageTransition | Promise<void> {
    return 'fade';
  }

  override _handleBack() {
    //
  }

  override _enable() {
    Router.resume();
  }
}
