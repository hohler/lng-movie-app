import { Router } from '@lightningjs/sdk';
import { HomePage } from '../pages/HomePage';
import { BootPage } from '../pages/BootPage';
import { DetailPage } from '../pages/DetailPage';

export const routes: Router.Config = {
  root: 'home',
  routes: [
    {
      path: '$',
      component: BootPage,
    },
    {
      path: 'home',
      component: HomePage,
    },
    {
      path: 'movie/:id',
      component: DetailPage,
    },
  ],
};
