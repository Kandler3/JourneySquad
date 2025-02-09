import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/template_pages/IndexPage/IndexPage';
import { InitDataPage } from '@/pages/template_pages/InitDataPage.tsx';
import { LaunchParamsPage } from '@/pages/template_pages/LaunchParamsPage.tsx';
import { ThemeParamsPage } from '@/pages/template_pages/ThemeParamsPage.tsx';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/init-data', Component: InitDataPage, title: 'Init Data' },
  { path: '/theme-params', Component: ThemeParamsPage, title: 'Theme Params' },
  { path: '/launch-params', Component: LaunchParamsPage, title: 'Launch Params' },
];
