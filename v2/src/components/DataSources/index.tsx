import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React from 'react';
import { getTranslations } from "next-intl/server";
import { gridSpacing } from '@/constants/grid';
import { apiService } from '@/lib/apiService/apiService';
import DDAActions from '@/components/DataSources/DDAActions';
import DDAModalController from '@/components/DataSources/DDAModalController';
import VerifiedBadge from '../common/VerifiedBadge';

import ClientPagination from '../Home/ClientPagination';
import ApiDoc from '@/components/ApiDocs';
import './style.scss';
import OrgConfigCard from '@/components/DataSources/OrgConfigCard';

type Props = {
    params: Promise<{ id?: string; slug?: string }>;
    searchParams?: Promise<{ page?: string; viewApiFor?: string }>;
};

export default async function DataSourceListingPage({ params, searchParams }: Props) {
    const { id, slug } = await params;
    const t = await getTranslations();
    const slugify = (s: string) => s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    // Helper to determine if a string is likely a UUID (v4-style). If not, it's a slug.
    const isUuid = (s?: string) => !!s && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);

    // Use unauthenticated service endpoints
    let serviceItem: import('@/types/serviceOrganisation').ServiceOrganisationItem | undefined;
    // Try by ID only if the param looks like a UUID; otherwise it's a slug and by-ID call would 400
    if (id && isUuid(id)) {
        try {
            const resp = await apiService.getServiceOrganisationById(id);
            serviceItem = resp.organisations?.[0];
        } catch (e) {
            // Swallow 4xx and fall back to list fetch
            console.error('[DataSourceListingPage] getServiceOrganisationById failed; falling back to list', e);
        }
    }
    if (!serviceItem) {
        // Fallback: fetch all and try to match by slug first, then by raw ID
        const allResp = await apiService.getServiceOrganisations();
        const list = allResp.organisations ?? [];
        const paramSlug = slug ?? id ?? '';
        if (paramSlug) {
            serviceItem = list.find(item => slugify(item.organisation.name) === paramSlug)
                || list.find(item => item.organisation.id === paramSlug);
        }
    }
    const dataSourceItem = serviceItem; // maintain name for downstream usage
    if (!dataSourceItem) {
        return (
            <Box className="dataListContainer" sx={{ width: '100%', p: 3 }}>
                <Card className='cardContainerList' sx={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <CardContent sx={{ padding: '24px' }}>
                        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 'bold', mb: 1 }}>
                            {t('common.notFound')}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#666' }}>
                            {t('common.tryAgain')}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }
    const trusted = Boolean(dataSourceItem?.organisationIdentity?.presentationRecord?.verified);
    const sp = await searchParams;
    const ddas = dataSourceItem?.dataDisclosureAgreements ?? [];
    const viewApiFor = sp?.viewApiFor;
    const dataSourceSlug = slugify(dataSourceItem?.organisation?.name || '');
    // pagination setup (disabled when viewing API for a specific DDA)
    const itemsPerPage = 4;
    const totalItems = ddas.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const pageParam = sp?.page;
    const currentPage = pageParam && !isNaN(parseInt(pageParam, 10)) ? parseInt(pageParam, 10) : 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const getDdaId = (dda: any): string | undefined => dda?.dataAgreementId || dda?.['@id'] || dda?.templateId;
    const currentDdas = (viewApiFor
        ? ddas.filter(dda => (getDdaId(dda) === viewApiFor || dda.templateId === viewApiFor))
        : ddas.slice(startIndex, endIndex)
    );

    return (
        <Box className="dataListContainer" sx={{ width: '100%' }}>
            <Grid container spacing={gridSpacing} sx={{ width: '100%', margin: 0 }}>
                <Grid size={{ xs: 12 }}>
                    <Grid container spacing={gridSpacing} justifyContent="center">
                        {/* Left info box */}
                        <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }} className='leftContainer'>
                            <Card className='leftSection'>
                                <CardMedia component="div" className='card-header' image={dataSourceItem?.organisation?.coverImageUrl}>
                                    <CardMedia
                                        component="img"
                                        image={dataSourceItem?.organisation?.logoUrl}
                                        alt="symbiome"
                                        className='logo'
                                    />
                                </CardMedia>
                                {/* <Box className='policyUrl'>
                                    {dataSourceItem?.policyUrl}
                                </Box> */}
                                <CardContent sx={{ minHeight: "229px" }}>
                                    <Box sx={{
                                        // Always use compact (mobile) styling regardless of screen size
                                        marginLeft: 0,
                                        paddingTop: "48px",
                                        transform: "none"
                                    }}>
                                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
                                            {dataSourceItem?.organisation?.name}
                                        </Typography>
                                        <Typography variant="body2" className="datasource-location" sx={{ fontSize: '14px', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1, paddingTop: "3px", color: trusted ? '#2e7d32' : '#d32f2f' }}>
                                            {trusted ? t('common.trustedServiceProvider') : t('common.untrustedServiceProvider')}
                                            <VerifiedBadge trusted={trusted} />
                                        </Typography>
                                        {/* Access Point Endpoint is intentionally hidden on this page's left panel */}
                                        <Typography className='datasource-location'>
                                            {dataSourceItem?.organisation?.location}
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" className='datasource-overview-label'>
                                        {t("common.overView")}
                                    </Typography>
                                    <Typography gutterBottom component="div" className="card-body datasource-overview" sx={{ fontSize: "14px" }}>
                                        {/* {moreOrLessTxt === 'Read Less....' ? dataSourceItem?.organisation?.description : dataSourceItem?.organisation?.description.slice(0, 275)} */}
                                        {dataSourceItem?.organisation?.description}
                                        {/* read more button to be added here */}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* Right wide cards list */}
                        <Grid size={{ lg: 8, md: 12, sm: 12, xs: 12 }} className='rightContainer'>
                            <Grid container spacing={2}>
                                {/* Wallet/Org configuration card */}
                                <Grid size={{ xs: 12 }}>
                                    <OrgConfigCard serviceItem={dataSourceItem} />
                                </Grid>
                                {currentDdas.map((dataDisclosureAgreement, index) => {
                                    return (
                                        <Grid
                                            key={index}
                                            size={{ xs: 12 }}
                                            sx={{ width: '100%' }}
                                        >
                                            <Card className='cardContainerList' sx={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                <CardContent sx={{ padding: '24px' }}>
                                                    <Typography variant="h6" sx={{ fontSize: "20px", paddingBottom: "20px", fontWeight: 'bold' }}>
                                                        {dataDisclosureAgreement.purpose}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "14px", paddingBottom: "20px", color: '#666666' }}>
                                                        {dataDisclosureAgreement.purposeDescription}
                                                    </Typography>
                                                    <DDAActions
                                                        dataDisclosureAgreement={dataDisclosureAgreement}
                                                        openApiUrl={dataSourceItem?.organisation.openApiUrl || ''}
                                                        dataSourceSlug={dataSourceSlug}
                                                        apiViewMode={!!viewApiFor}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                            {/* Render API docs below the selected card when viewApiFor is present */}
                            {viewApiFor && (dataSourceItem?.organisation?.openApiUrl) && (
                                <Box sx={{ mt: 2 }}>
                                    <Card className='cardContainerList' sx={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        <CardContent sx={{ padding: '24px' }}>
                                            <ApiDoc openApiUrl={dataSourceItem.organisation.openApiUrl} />
                                        </CardContent>
                                    </Card>
                                </Box>
                            )}
                        </Grid>
                        {/* Pagination */}
                        {!viewApiFor && totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2, width: '100%' }}>
                                <ClientPagination currentPage={currentPage} totalPages={totalPages} />
                            </Box>
                        )}
                    </Grid>
                </Grid>
                <DDAModalController
                    dataSourceName={dataSourceItem?.organisation?.name || ''}
                    dataSourceLocation={dataSourceItem?.organisation?.location || ''}
                    dataSourceDescription={dataSourceItem?.organisation?.description || ''}
                    coverImage={dataSourceItem?.organisation?.coverImageUrl || ''}
                    logoImage={dataSourceItem?.organisation?.logoUrl || ''}
                    dataDisclosureAgreements={dataSourceItem?.dataDisclosureAgreements ?? []}
                    trusted={trusted}
                />
            </Grid>
        </Box>
    )
}