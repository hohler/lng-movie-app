import { Lightning } from '@lightningjs/sdk';
import { Movie } from '../models/tmdb';

interface SmallMovieBoxTemplateSpec extends Lightning.Component.TemplateSpec {
  dataId: number;
  data?: Movie;
  posterPath: string;
  Background: {
    Poster: {
      Filter: {
        Label: object;
      };
    };
  };
  label: string;
  onEnter?: () => void;
}

export class SmallMovieBox extends Lightning.Component<SmallMovieBoxTemplateSpec> implements Lightning.Component.ImplementTemplateSpec<SmallMovieBoxTemplateSpec> {
  static bgColor = 0x00000000;
  static bgColorFocus = 0xfffab401;
  static fontColor = 0xffffffff;
  static shader = { type: Lightning.shaders.RoundedRectangle, radius: [8], stroke: 0, strokeColor: 0x00000000 };
  static shaderFocus = { type: Lightning.shaders.RoundedRectangle, radius: [8], stroke: 4, strokeColor: this.bgColorFocus };

  onEnter?: () => void;
  data?: Movie;

  static width = 185;
  static height = 308;

  static override _template(): Lightning.Component.Template<SmallMovieBoxTemplateSpec> {
    return {
      h: this.height,
      w: this.width,
      flex: {
        direction: 'column',
      },
      Background: {
        shader: SmallMovieBox.shader,
        flex: {
          direction: 'column',
        },
        Poster: {
          h: this.height,
          w: this.width,
          rect: true,
          flex: {
            direction: 'column',
          },
          flexItem: {
            grow: 1,
            shrink: 1,
          },
          Filter: {
            flex: {
              direction: 'column',
              justifyContent: 'flex-end',
            },
            flexItem: {
              grow: 1,
            },
            rect: true,
            colorTop: 0x00000000,
            colorBottom: 0x90000000,
            Label: {
              flexItem: {
                marginLeft: 15,
                marginBottom: 15,
              },
              shader: null,
              text: {
                text: this.bindProp('label'),
                fontSize: 16,
                textOverflow: 'ellipsis',
                wordWrapWidth: this.width - 2 * 15,
                maxLines: 2,
                maxLinesSuffix: '...',
                textColor: SmallMovieBox.fontColor,
              },
            },
          },
        },
      },
    };
  }

  override _setup() {
    const poster = this.tag('Background.Poster')!;
    if (this.data?.poster_path === null) {
      poster.patch({
        color: 0xff1e012c,
      });
    } else {
      poster.patch({
        src: `https://image.tmdb.org/t/p/w185${this.data!.poster_path}`,
      });
    }
  }

  override _focus() {
    this.patch({
      smooth: {
        scale: 1.1,
      },
      Background: {
        shader: SmallMovieBox.shaderFocus,
      },
    });
  }

  override _unfocus() {
    this.patch({
      smooth: {
        scale: 1.0,
      },
      Background: {
        shader: SmallMovieBox.shader,
      },
    });
  }

  override _handleEnter() {
    if (this.onEnter) {
      this.onEnter();
    }
  }
}
