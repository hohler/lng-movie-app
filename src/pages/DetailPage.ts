import { Img, Lightning, Router } from '@lightningjs/sdk';
import { MovieDatabaseService } from '../services/MovieDatabaseService';
import { Tag } from '../components/Tag';
import { Movie, MovieDetails } from '../models/tmdb';
import { Row } from '@lightningjs/ui-components';
import { SmallMovieBox } from '../components/SmallMovieBox';
import { Button } from '../components/Button';

interface DetailPageTemplateSpec extends Lightning.Component.TemplateSpec {
  Background: object;
  BackgroundFilter: object;
  Poster: object;
  Container: {
    Tags: object;
    Title: object;
    Description: object;
    ReleaseDate: object;
    Buttons: {
      Favorite: typeof Button;
    };
  };
  SimilarTitle: object;
  Similar: {
    Results: typeof Row;
  };
}

interface DetailPageTypeConfig extends Lightning.Component.TypeConfig {
  isPage: true;
}

export class DetailPage extends Lightning.Component<DetailPageTemplateSpec, DetailPageTypeConfig> implements Lightning.Component.ImplementTemplateSpec<DetailPageTemplateSpec> {
  readonly Background = this.getByRef('Background')!;
  readonly Similar = this.getByRef('Similar')!;
  readonly Results = this.Similar.getByRef('Results')!;
  readonly Container = this.getByRef('Container')!;
  readonly Buttons = this.Container.getByRef('Buttons')!;
  readonly FavoriteButton = this.Buttons.getByRef('Favorite')!;

  index = -1;
  dataId!: number;
  movie!: MovieDetails;
  similar: Movie[] = [];

  private buttonsFocused = false;
  private similarFocused = false;

  static override _template(): Lightning.Component.Template<DetailPageTemplateSpec> {
    return {
      Background: {
        alpha: 0,
        w: 1920,
        h: 1080,
      },
      BackgroundFilter: {
        colorLeft: 0xff000000,
        colorRight: 0x00000000,
        alpha: 1,
        rect: true,
        w: 1920,
        h: 1080,
      },
      Poster: {
        w: 250,
        rect: true,
        mountX: 0,
        x: 1400,
        y: 150,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: [8], stroke: 2, strokeColor: 0xfffafafa },
      },
      Container: {
        x: 100,
        y: 150,
        w: 1000,
        flex: {
          direction: 'column',
        },
        Tags: {
          flex: {
            direction: 'row',
          },
          flexItem: {
            marginBottom: 20,
          },
        },
        Title: {
          flexItem: {
            marginBottom: 30,
          },
          text: {
            fontSize: 58,
            letterSpacing: 1.5,
            textColor: 0xfffafafa,
            wordWrapWidth: 1000,
            fontStyle: 'bold',
            maxLines: 2,
            textOverflow: 'ellipsis',
            maxLinesSuffix: '...',
            text: '',
          },
        },
        Description: {
          flexItem: {
            marginBottom: 30,
          },
          text: {
            fontSize: 32,
            fontStyle: '300',
            textColor: 0xfffafafa,
            wordWrapWidth: 1000,
            maxLines: 4,
            textOverflow: 'ellipsis',
            maxLinesSuffix: '',
            text: '',
          },
        },
        ReleaseDate: {
          flexItem: {
            marginBottom: 30,
          },
          text: {
            fontSize: 18,
            fontStyle: '300',
            textColor: 0xfffafafa,
          },
        },
        Buttons: {
          flex: {},
          Favorite: {
            type: Button,
            label: 'Add favorite',
          }
        },
      },
      SimilarTitle: {
        x: 100,
        y: 625,
        text: {
          text: 'Similar',
          fontSize: 32,
          fontStyle: 'bold',
          textColor: 0xffffffff,
        },
      },
      Similar: {
        x: 100,
        y: 700,
        w: 1920 - 2 * 100,
        Results: {
          type: Row,
          style: {
            itemSpacing: 40,
          },
          lazyScroll: true,
          items: [],
        },
      },
    };
  }

  override _handleDown() {
    if (!this.buttonsFocused && !this.similarFocused) {
      this.buttonsFocused = true;
    } else {
      this.similarFocused = true;
    }
  }

  override _handleUp() {
    if (this.similarFocused) {
      this.buttonsFocused = true;
      this.similarFocused = false;
    } else {
      this.buttonsFocused = false;
      this.similarFocused = false;
    }
  }

  override _getFocused() {
    if (this.similarFocused) {
      return this.Results;
    } else if (this.buttonsFocused) {
      return this.FavoriteButton;
    }
  }

  override _disable() {
    this.Background.patch({
      alpha: 0,
      src: undefined,
    });
  }

  private async loadData() {
    if (!this.dataId) {
      return;
    }

    const service = new MovieDatabaseService();
    this.movie = await service.getMovie(this.dataId);
    this.updateMovieInfo();

    this.similar = await service.getSimilar(this.dataId);
    this.updateSimilar();
  }

  private updateMovieInfo() {
    const movie = this.movie;

    this.Background.patch({
      smooth: {
        alpha: 1,
        src: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
      },
    });

    const date = new Date(movie.release_date);

    const tags = [];
    tags.push({
      type: Tag,
      flexItem: {
        marginRight: 10,
      },
      label: date.getFullYear(),
    });
    tags.push({
      type: Tag,
      flexItem: {
        marginRight: 10,
      },
      label: movie.adult ? 'Explicit' : 'Kids',
    });

    if (movie.genres.length > 0) {
      tags.push({
        type: Tag,
        flexItem: {
          marginRight: 10,
        },
        label: movie.genres[0]?.name,
      });
    }

    if (movie.vote_average) {
      tags.push({
        type: Tag,
        FlexItem: {
          marginRight: 10,
        },
        label: movie.vote_average.toFixed(1),
      });
    }

    this.tag('Container')!.patch({
      Title: {
        text: {
          text: movie.title,
        },
      },
      Description: {
        text: {
          text: movie.overview,
        },
      },
      Tags: {
        children: tags,
      },
      ReleaseDate: {
        text: {
          text: `Release: ${date.toLocaleDateString()}`,
        },
      },
    });

    this.tag('Poster')!.patch({
      texture: Img(`https://image.tmdb.org/t/p/w500${movie.poster_path}`).contain(250, 800),
    });
  }

  private updateSimilar() {
    const data = this.similar.map(this.getSimilarTemplate);
    this.Results.items = data;
  }

  private getSimilarTemplate(entry: Movie): object {
    return {
      type: SmallMovieBox,
      dataId: entry.id,
      data: entry,
      posterPath: entry.poster_path,
      label: entry.title,
      onEnter: () => {
        Router.navigate(`movie/${entry.id}`);
      },
    };
  }

  override pageTransition(pageIn: Router.PageInstance, pageOut: Router.PageInstance | null): Router.PageTransition | Promise<void> {
    return 'fade';
  }

  override _onUrlParams(params: { id: string }) {
    this.buttonsFocused = false;
    this.similarFocused = false;

    this.dataId = Number(params.id);
    this.loadData();
  }
}
