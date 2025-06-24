// Sidebar menu configuration

export interface SubMenuItem {
  name: string;
  translationKey: string; // Key for translation lookup
  link: string;
}

export interface SidebarMenuItem {
  name: string;
  translationKey: string; // Key for translation lookup
  icon: string;
  link: string;
  subMenu: SubMenuItem[];
}

export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    name: 'Getting Started',
    translationKey: 'gettingStarted',
    icon: 'HouseOutlined',
    link: '/start',
    subMenu: []
  },
  {
    name: 'Marketplace Listing',
    translationKey: 'dataAgreements.title',
    icon: 'InsertDriveFileOutlined',
    link: '/dd-agreements',
    subMenu: []
  },
  {
    name: 'Account',
    translationKey: 'account',
    icon: 'LockOutlined',
    link: '/account',
    subMenu: [
      {
        name: 'Manage Admin',
        translationKey: 'manageAdmin',
        link: '/manage-admin',
      },
      {
        name: 'Developer APIs',
        translationKey: 'developerApis',
        link: '/developer-apis',
      },
      {
        name: 'Business Wallet',
        translationKey: 'businessWallet',
        link: '/business-wallet',
      }
    ]
  }
];
