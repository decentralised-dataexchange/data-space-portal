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

// Define menu items with direct translation keys
export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    name: 'Getting Started', // Fallback name if translation fails
    translationKey: 'gettingStarted',
    icon: 'HouseOutlined',
    link: '/start',
    subMenu: []
  },
  {
    name: 'Marketplace Listing', // Fallback name if translation fails
    translationKey: 'dataAgreements',
    icon: 'InsertDriveFileOutlined',
    link: '/dd-agreements',
    subMenu: []
  },
  {
    name: 'Account', // Fallback name if translation fails
    translationKey: 'account',
    icon: 'LockOutlined',
    link: '/account',
    subMenu: [
      {
        name: 'Manage Admin', // Fallback name if translation fails
        translationKey: 'manageAdmin',
        link: '/manage-admin',
      },
      {
        name: 'Developer APIs', // Fallback name if translation fails
        translationKey: 'developerApis',
        link: '/developer-apis',
      },
      {
        name: 'Business Wallet', // Fallback name if translation fails
        translationKey: 'businessWallet',
        link: '/business-wallet',
      }
    ]
  }
];
