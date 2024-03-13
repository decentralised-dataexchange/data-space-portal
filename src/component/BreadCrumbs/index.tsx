/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

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

// const { isMobile } = getDevice();
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
  const { t } = useTranslation('translation');
  const location = useLocation();
  const { pathname } = location;
  const routesPath = pathname.split("/").splice(1, 3);

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

    }
]
  
  // logic for render the breadcrumb names based on route path
  const renderRouteName = (name) => {
    const filterBreadCrumb = menuList.filter(
      (breadCrumb) => breadCrumb.link == name
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
              to="/"
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
                i == routesPath.length - 1 ? "pe-none linkfont" : "linkfont"
              }`}
              to={i > 0 ? `${routesPath[i - 1]}/${route}` : route}
            >
            {renderRouteName(route)}
            </Link>
            </Typography>
        ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
