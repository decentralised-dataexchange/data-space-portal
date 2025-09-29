"use client"
import React from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  padding: '0.75rem 1.25rem 0',
  margin: 0,
  backgroundColor: 'transparent',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
};

const Breadcrumb: React.FC<BreadCrumbProps> = ({
  primaryRoute = "Home",
  sxStyles = customStyles,
  classNames = "breadCrumb",
}) => {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewApiFor = searchParams?.get('viewApiFor');
  
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
      const route = BREADCRUMB_ROUTES[routeKey];

      // Only add if segment is known AND the accumulated path exactly matches the route path
      if (!route || currentPath !== route.path) return;

      const isLast = index === routesPath.length - 1;

      breadcrumbs.push({
        path: route.path, // use canonical route path
        name: t(route.translationKey as any),
        isClickable: route.isClickable && !isLast
      });
    });

    // Handle dynamic segment for /data-source/read/:id
    if (
      routesPath.length >= 3 &&
      routesPath[0] === 'data-source' &&
      routesPath[1] === 'read'
    ) {
      const slug = routesPath[2];
      if (slug) {
        const display = decodeURIComponent(slug)
          .replace(/-/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
        const isViewingApi = Boolean(viewApiFor)
        const readPath = `/data-source/read/${slug}`;
        // Always show the specific item name as the last crumb; do not append a generic "API" crumb
        breadcrumbs.push({
          path: readPath,
          name: display || slug,
          isClickable: isViewingApi,
        });
      }
    }

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
