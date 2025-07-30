"use client"
import React from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BREADCRUMB_ROUTES, BreadcrumbKey } from "@/constants/breadcrumbs";

type BreadCrumbProps = {
  readonly primaryRoute?: string;
  readonly sxStyles?: React.CSSProperties;
  readonly classNames?: string;
};

const customStyles: React.CSSProperties = {
  color: "#094c4a",
  fontSize: "1.1rem",
  fontWeight: 500,
  fontFamily: "openSansSemiBold",
  padding: '0 0.5rem', // Add small horizontal padding
};

const Breadcrumb: React.FC<BreadCrumbProps> = ({
  primaryRoute = "Home",
  sxStyles = customStyles,
  classNames = "breadCrumb",
}) => {
  const t = useTranslations();
  const pathname = usePathname();
  
  // Remove locale from pathname (e.g., /en/start -> /start)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
  
  // Split path into segments and filter out empty segments
  const routesPath = pathWithoutLocale.split('/').filter(Boolean);

  // Generate breadcrumb items based on the current path
  const generateBreadcrumbs = () => {
    const breadcrumbs: { path: string; name: string; isClickable: boolean }[] = [];
    let currentPath = '';

    routesPath.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const routeKey = segment as BreadcrumbKey;
      
      // Skip if this is not a known breadcrumb route
      if (!BREADCRUMB_ROUTES[routeKey]) return;
      
      const isLast = index === routesPath.length - 1;
      const route = BREADCRUMB_ROUTES[routeKey];
      
      breadcrumbs.push({
        path: currentPath,
        name: t(route.translationKey as any),
        isClickable: route.isClickable && !isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={sxStyles}
      className={classNames}
    >
      <Typography variant="caption" color="text.primary">
        <Link href="/" id="dashboard" className="link linkfont">
          {primaryRoute}
        </Link>
      </Typography>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <Typography key={index} variant="caption" color="inherit">
          {breadcrumb.isClickable ? (
            <Link 
              href={breadcrumb.path} 
              className="link linkfont"
            >
              {breadcrumb.name}
            </Link>
          ) : (
            <span className="pe-none">{breadcrumb.name}</span>
          )}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
