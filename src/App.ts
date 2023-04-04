import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { routes } from './lib/routes';

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
  //
}

export class App extends Router.App implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec> {
  private static w = 1920;
  private static h = 1080;

  static override _template(): Lightning.Component.Template<AppTemplateSpec> {
    return {
      w: this.w,
      h: this.h,
      rect: true,
      color: 0xff1e012c,
      ...super._template(),
    };
  }

  static getFonts() {
    return [
      {
        family: 'Regular',
        url: Utils.asset('fonts/Roboto-Regular.ttf') as string,
      },
    ];
  }

  override _setup() {
    Router.startRouter(routes, this);
  }
}
