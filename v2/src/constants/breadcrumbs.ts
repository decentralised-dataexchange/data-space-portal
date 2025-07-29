export interface BreadcrumbItem {
  path: string;
  translationKey: string;
  isClickable: boolean;
}

export const BREADCRUMB_ROUTES: Record<string, BreadcrumbItem> = {
  home: {
    path: '/',
    translationKey: 'breadcrumbs.home',
    isClickable: true
  },
  start: {
    path: '/start',
    translationKey: 'breadcrumbs.start',
    isClickable: true
  },
  login: {
    path: '/login',
    translationKey: 'breadcrumbs.login',
    isClickable: true
  },
  account: {
    path: '/account',
    translationKey: 'breadcrumbs.account',
    isClickable: false
  },
  'manage-admin': {
    path: '/account/manage-admin',
    translationKey: 'breadcrumbs.manage-admin',
    isClickable: true
  },
  'developer-apis': {
    path: '/account/developer-apis',
    translationKey: 'breadcrumbs.developer-apis',
    isClickable: true
  },
  'disp-connections': {
    path: '/account/disp-connections',
    translationKey: 'breadcrumbs.disp-connections',
    isClickable: true
  },
  'business-wallet': {
    path: '/account/business-wallet',
    translationKey: 'breadcrumbs.business-wallet',
    isClickable: true
  },
  'data-source': {
    path: '/data-source',
    translationKey: 'breadcrumbs.data-source',
    isClickable: true
  },
  'dd-agreements': {
    path: '/dd-agreements',
    translationKey: 'breadcrumbs.dd-agreements',
    isClickable: true
  },
  'open-api': {
    path: '/data-source/open-api',
    translationKey: 'breadcrumbs.open-api',
    isClickable: true
  }
} as const;

// Type for valid breadcrumb keys
export type BreadcrumbKey = keyof typeof BREADCRUMB_ROUTES;
