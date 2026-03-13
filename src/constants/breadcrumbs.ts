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
    isClickable: false
  },
  'dd-agreements': {
    path: '/dd-agreements',
    translationKey: 'breadcrumbs.dd-agreements',
    isClickable: true
  },
  'history': {
    path: '/dd-agreements/history',
    translationKey: 'breadcrumbs.dd-agreements-history',
    isClickable: true
  },
  'signed-agreements': {
    path: '/signed-agreements',
    translationKey: 'breadcrumbs.signed-agreements',
    isClickable: true
  },
  'knowledge': {
    path: '/knowledge',
    translationKey: 'breadcrumbs.knowledge',
    isClickable: true
  },
  'consent': {
    path: '/knowledge/consent',
    translationKey: 'breadcrumbs.knowledge-consent',
    isClickable: true
  },
  'guides': {
    path: '/knowledge/guides',
    translationKey: 'breadcrumbs.knowledge-guides',
    isClickable: true
  },
  'provider': {
    path: '/knowledge/guides/provider',
    translationKey: 'breadcrumbs.knowledge-guides-provider',
    isClickable: true
  },
  'citizen': {
    path: '/knowledge/guides/citizen',
    translationKey: 'breadcrumbs.knowledge-guides-citizen',
    isClickable: true
  },
  'mhe': {
    path: '/knowledge/guides/mhe',
    translationKey: 'breadcrumbs.knowledge-guides-mhe',
    isClickable: true
  },
  'caregiver': {
    path: '/knowledge/guides/caregiver',
    translationKey: 'breadcrumbs.knowledge-guides-caregiver',
    isClickable: true
  },
  'tools': {
    path: '/knowledge/tools',
    translationKey: 'breadcrumbs.knowledge-tools',
    isClickable: true
  },
  'faq': {
    path: '/knowledge/faq',
    translationKey: 'breadcrumbs.knowledge-faq',
    isClickable: true
  }
} as const;

// Type for valid breadcrumb keys
export type BreadcrumbKey = keyof typeof BREADCRUMB_ROUTES;
