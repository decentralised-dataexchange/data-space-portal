"use client"
import React from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BreadCrumb = {
  readonly link: string;
  readonly name: string;
  readonly icon: string;
};

type BreadCrumbProps = {
  readonly primaryRoute?: string;
  readonly BreadCrumbTitle?: BreadCrumb[];
  readonly sxStyles?: Object;
  readonly classNames?: string;
};

const customStyles: Object = {
  color: "#094c4a",
  fontSize: "1.1rem",
  fontWeight: 500,
  marginLeft: "0.9375rem",
  fontFamily: "openSansSemiBold",
};

const Breadcrumb: React.FC<BreadCrumbProps> = ({
  primaryRoute = "Home",
  sxStyles = customStyles,
  classNames = "breadCrumb",
}: BreadCrumbProps) => {
  const t = useTranslations();
  const pathname = usePathname();
  
  // Remove locale from pathname (e.g., /en/start -> /start)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
  
  // Split path into segments and filter out empty segments
  const routesPath = pathWithoutLocale.split('/').filter(Boolean);

  const menuList = [
    {
        'name': `${t('sideBar.gettingStarted')}`,
        'icon': 'CottageOutlined',
        'link': 'start'

    },
    {
        'name': `${t('sideBar.dataAgreements')}`,
        'icon': 'InsertDriveFileOutlined',
        'link': 'dd-agreements'

    },
    {
      'name': `${t('sideBar.account')}`,
      'icon': 'LockOutlined',
      'link': 'account'

    },
    {
      'name': `${t('sideBar.manageAdmin')}`,
      'link': `${t("common.manageAdmin")}`,
    },

    {
      'name': `${t('sideBar.developerApis')}`,
      'link': `${t("common.developerApis")}`,
    },

    {
      'name': `${t('sideBar.businessWallet')}`,
      'link': `${t("common.businessWallet")}`,
    },
]
  
  // logic for render the breadcrumb names based on route path
  const renderRouteName = (name: string) => {
    const filterBreadCrumb = menuList.filter(
      (breadCrumb) => (breadCrumb.link) == name
    );
    switch (name) {
      case `${filterBreadCrumb?.length && filterBreadCrumb[0].link}`:
        return filterBreadCrumb[0].name;
      default:
        return "";
    }
  };

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={sxStyles}
      className={classNames}
    > 
      <Typography variant="caption" color="text.primary">
          <Link
              href="/"
              id="dashboard"
              className='link linkfont'>
                  {primaryRoute}
          </Link>
      </Typography>
      {routesPath[0] != "" &&
        routesPath.map((route, i) => (
            <Typography variant="caption" color="inherit">
            <Link
              key={`${route}-${i}`}
              className={`${
                (i == routesPath.length - 1 || route == 'account') ? "pe-none linkfont" : "linkfont"
              }`}
              href={i > 0 ? `${routesPath[i - 1]}/${route}` : route}
            >
            {renderRouteName(route)}
            </Link>
            </Typography>
        ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
