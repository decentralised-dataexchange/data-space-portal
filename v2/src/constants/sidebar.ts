import { FilesIcon, HouseLineIcon, LockIcon } from "@phosphor-icons/react";
export interface SubMenuItem {
  name: string;
  translationKey: string; // Key for translation lookup
  link: string;
}

export interface SidebarMenuItem {
  name: string;
  translationKey: string; // Key for translation lookup
  icon: typeof HouseLineIcon;
  link: string;
  subMenu: SubMenuItem[];
}

export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    name: 'Getting Started',
    translationKey: 'gettingStarted',
    icon: HouseLineIcon,
    link: '/start',
    subMenu: []
  },
{
  name: 'Marketplace Listing',
    translationKey: 'dataAgreements.title',
      icon: FilesIcon,
        link: '/dd-agreements',
          subMenu: []
},
{
  name: 'Account',
    translationKey: 'account',
      icon: LockIcon,
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
            // {
            //   name: 'Business Wallet',
            //   translationKey: 'businessWallet',
            //   link: 'business-wallet',
            // }
          ]
}
];
