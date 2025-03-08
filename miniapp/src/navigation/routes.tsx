import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/template_pages/IndexPage/IndexPage';
import { InitDataPage } from '@/pages/template_pages/InitDataPage.tsx';
import { LaunchParamsPage } from '@/pages/template_pages/LaunchParamsPage.tsx';
import { ThemeParamsPage } from '@/pages/template_pages/ThemeParamsPage.tsx';
import {HomePage} from "@/pages/Home/Home.tsx";
import {UserProfilePage} from "@/pages/Profile/Profile.tsx";
import {TravelPlanListPage} from "@/pages/TravelPlanList/TravelPlanList.tsx";
import {TravelPlanViewPage} from "@/pages/TravelPlanView/TravelPlanView.tsx";
import {TravelPlanValidateEditPage} from "@/pages/TravelPlanEdit.tsx";
import {TravelPlanCreatePage} from "@/pages/TravelPlanCreate.tsx";

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
  { path: '/profile/:id', Component: UserProfilePage, title: 'Profile' },
  { path: '/travel-plans', Component: TravelPlanListPage, title: 'Travel Plans' },
  { path: '/travel-plans/:id', Component: TravelPlanViewPage, title: 'Travel Plan' },
  { path: '/travel-plans/:id/edit', Component: TravelPlanValidateEditPage, title: 'Travel Plan' },
  { path: '/travel-plans/new', Component: TravelPlanCreatePage, title: 'Travel Plan Creation' },
];
