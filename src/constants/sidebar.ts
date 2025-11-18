// Sidebar configuration (no JSX here; icons are resolved in the SideBar component)
export interface SubMenuItem {
  name: string;
  translationKey: string; // Key for translation lookup
  link: string;
}

export interface SidebarMenuItem {
  name: string;
  translationKey: string; // Key for translation lookup
  iconId: 'home' | 'market' | 'signed' | 'b2b' | 'account';
  link: string;
  subMenu: SubMenuItem[];
}

export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    name: 'Getting Started',
    translationKey: 'gettingStarted',
    iconId: 'home',
    link: '/start',
    subMenu: []
  },
  {
    name: 'Marketplace Listing',
    translationKey: 'dataAgreements.title',
    iconId: 'market',
    link: '/dd-agreements',
    subMenu: []
  },
  {
    name: 'Signed Agreements',
    translationKey: 'signedAgreements.title',
    iconId: 'signed',
    link: '/signed-agreements',
    subMenu: []
  },
  {
    name: 'Account',
    translationKey: 'account',
    iconId: 'account',
    link: '/account',
    subMenu: [
      {
        name: 'Manage Admin',
        translationKey: 'manageAdmin',
        link: 'manage-admin',
      },
      {
        name: 'Developer APIs',
        translationKey: 'developerApis',
        link: 'developer-apis',
      },
    ]
  }
];
