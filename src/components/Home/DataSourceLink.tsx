"use client";

import React from 'react';
import { Link } from '@/i18n/navigation';
import CookieService from '@/utils/cookieService';

type Props = {
    href: string;
    orgId: string;
    children: React.ReactNode;
};

export default function DataSourceLink({ href, orgId, children }: Props) {
    const handleClick = () => {
        CookieService.setSelectedOrgId(orgId);
    };

    return (
        <Link href={href} onClick={handleClick}>
            {children}
        </Link>
    );
}
