/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2022 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Lightning, Utils } from '@lightningjs/sdk';
import { Button } from './components/Button';

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
  Background: {
    Button: typeof Button;
  };
}

export class App extends Lightning.Component<AppTemplateSpec> implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec> {
  /*
   * The following properties exist to make it more convenient to access elements
   * below in a type-safe way. They are optional.
   *
   * See https://lightningjs.io/docs/#/lightning-core-reference/TypeScript/Components/TemplateSpecs?id=using-a-template-spec
   * for more information.
   */
  readonly Background = this.getByRef('Background')!;
  readonly Button = this.Background.getByRef('Button')!;

  static override _template(): Lightning.Component.Template<AppTemplateSpec> {
    return {
      w: 1920,
      h: 1080,
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: 0xff1e012c,
        Button: {
          x: 760,
          y: 550,
          type: Button,
          label: 'Click me',
        },
      },
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

  override _getFocused() {
    return this.Button;
  }

  override _handleEnter() {}

  override _init() {}
}
