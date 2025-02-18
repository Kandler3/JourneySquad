import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/template_pages/IndexPage/IndexPage';
import { InitDataPage } from '@/pages/template_pages/InitDataPage.tsx';
import { LaunchParamsPage } from '@/pages/template_pages/LaunchParamsPage.tsx';
import { ThemeParamsPage } from '@/pages/template_pages/ThemeParamsPage.tsx';
import {HomePage} from "@/pages/Home/Home.tsx";
import {ProfilePage} from "@/pages/Profile.tsx";
import {TravelPlanListPage} from "@/pages/TravelPlanList/TravelPlanList.tsx";
import {TravelPlanViewPage} from "@/pages/TravelPlanView.tsx";
import {TravelPlanEditPage} from "@/pages/TravelPlanEdit.tsx";

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
  { path: '/home', Component: HomePage, title: 'Home' },
  { path: '/profile/:id', Component: ProfilePage, title: 'Profile' },
  { path: '/travel-plans', Component: TravelPlanListPage, title: 'Travel Plans' },
  { path: '/travel-plans/:id', Component: TravelPlanViewPage, title: 'Travel Plan' },
  { path: '/travel-plans/:id/edit', Component: TravelPlanEditPage, title: 'Travel Plan' },
  { path: '/travel-plans/new', Component: TravelPlanEditPage, title: 'Travel Plan Creation' },
];
