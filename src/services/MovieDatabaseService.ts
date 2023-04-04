import axios from 'axios';
import { MovieDetails, MovieList, Recommendations, SimilarMovies, TrendingResults } from '../models/tmdb';
import { Settings } from '@lightningjs/sdk';

export class MovieDatabaseService {

  private API_KEY = Settings.get('app', 'tmdbApiKey');
  private API_URL = 'https://api.themoviedb.org/3';

  async getTrending() {
    const result = await axios.get<TrendingResults<'movie'>>(`${this.API_URL}/trending/movie/week`, {
      params: {
        api_key: this.API_KEY,
      },
    });
    return result.data.results;
  }

  async getMovie(id: number) {
    const result = await axios.get<MovieDetails>(`${this.API_URL}/movie/${id}`, {
      params: {
        api_key: this.API_KEY,
      },
    });

    return result.data;
  }

  async getSimilar(id: number) {
    const result = await axios.get<SimilarMovies>(`${this.API_URL}/movie/${id}/similar`, {
      params: {
        api_key: this.API_KEY,
      },
    });

    return result.data.results;
  }
}
