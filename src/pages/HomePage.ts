import { Lightning, Router } from '@lightningjs/sdk';
import { Input, Row } from '@lightningjs/ui-components';
import { MovieDatabaseService } from '../services/MovieDatabaseService';
import { Movie } from '../models/tmdb';
import { MovieBox } from '../components/MovieBox';

interface HomePageTemplateSpec extends Lightning.Component.TemplateSpec {
  Background: object;
  BackgroundFilter: object;
  Title: object;
  Container: {
    Results: typeof Row;
  };
  Search: typeof Input;
}

export class HomePage extends Lightning.Component<HomePageTemplateSpec> implements Lightning.Component.ImplementTemplateSpec<HomePageTemplateSpec> {
  readonly Background = this.getByRef('Background')!;
  readonly Container = this.getByRef('Container')!;
  readonly Results = this.Container.getByRef('Results')!;
  readonly Search = this.getByRef('Search')!;

  searchFocused = false;

  static override _template(): Lightning.Component.Template<HomePageTemplateSpec> {
    return {
      Background: {
        w: 1920,
        h: 1080,
        shader: { type: Lightning.shaders.Vignette, magnitude: 3, intensity: 0.3 },
      },
      Title: {
        mount: 0.5,
        x: 1920 / 2,
        y: 100,
        text: {
          text: 'Trending',
          fontStyle: 'bold',
          textColor: 0xffffffff,
        },
      },
      Container: {
        x: 40,
        y: 200,
        w: 1920 - 2 * 40,
        Results: {
          type: Row,
          style: {
            itemSpacing: 40,
          },
          lazyScroll: true,
          items: [],
        },
      },
      Search: {
        mount: 0.5,
        x: 1920 / 2,
        y: 950,
        type: Input,
      },
    };
  }

  override _getFocused() {
    if (this.searchFocused) {
      return this.Search;
    } else {
      return this.Results;
    }
  }

  override _focusChange(newFocusedComponent: Lightning.Component | undefined, prevFocusedComponent: Lightning.Component | undefined) {
    super._focusChange(newFocusedComponent, prevFocusedComponent);

    const path = (this.Results.selected as any)?.data.backdrop_path;
    this.Background!.patch({
      smooth: {
        src: `https://image.tmdb.org/t/p/original${path}`,
      },
    });
  }

  override async _setup() {
    const service = new MovieDatabaseService();

    const trending = await service.getTrending();
    const data = trending.map(this.getMovieTemplate);

    this.Results.items = data;
  }

  override _handleDown() {
    this.searchFocused = true;
    this.Search.patch({
      listening: true,
    });
  }

  override _handleUp() {
    this.searchFocused = false;
    this.Search.patch({
      listening: false,
    });
  }

  override _handleBack(event: KeyboardEvent) {
    if (this.searchFocused) {
      const { key } = event;

      if (key === 'Backspace') {
        this.Search.backspace();
      }

      return true;
    }

    return true;
  }

  override _handleKey(event: KeyboardEvent) {
    if (!this.searchFocused) {
      return false;
    }

    const { key } = event;
    if (key.length === 1) {
      this.Search.insert(key);
      return true;
    }

    return true;
  }

  override _handleEnter() {
    if (this.searchFocused) {
      // TODO search
    }
  }

  // TODO: this breaks the app?!
  // override pageTransition(pageIn: Router.PageInstance, pageOut: Router.PageInstance | null): Router.PageTransition | Promise<void> {
  //   return 'fade';
  // }

  private getMovieTemplate(entry: Movie): object {
    return {
      type: MovieBox,
      dataId: entry.id,
      data: entry,
      posterPath: entry.poster_path,
      label: entry.title,
      onEnter: () => {
        Router.navigate(`movie/${entry.id}`);
      },
    };
  }
}
