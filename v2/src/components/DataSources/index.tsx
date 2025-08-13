import { Box, Card, CardContent, CardMedia, Grid, Typography, Button } from '@mui/material';
import React from 'react';
import { getTranslations, getLocale } from "next-intl/server";
import { gridSpacing } from '@/constants/grid';
import { apiService } from '@/lib/apiService/apiService';
import DDAActions from '@/components/DataSources/DDAActions';
import DDAModalController from '@/components/DataSources/DDAModalController';
import VerifiedBadge from '../common/VerifiedBadge';

import ClientPagination from '../Home/ClientPagination';
import ApiDoc from '@/components/DataSources/ApiDoc';
import Link from 'next/link';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

type Props = {
    params: Promise<{ id?: string; slug?: string }>;
    searchParams?: Promise<{ page?: string; viewApiFor?: string }>;
};

export default async function DataSourceListingPage({ params, searchParams }: Props) {
    const { id, slug } = await params;
    const t = await getTranslations();
    const locale = await getLocale();
    const slugify = (s: string) => s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    // Fetch list; be resilient to local/dev timeouts
    let listResp: Awaited<ReturnType<typeof apiService.dataSourceList>> | null = null;
    try {
        listResp = await apiService.dataSourceList();
    } catch (err) {
        console.error('Failed to fetch data sources on DataSources page:', err);
    }
    const list = ((listResp)?.dataSources ?? []);
    // Try to match by exact ID first, then fall back to slug match if needed
    let dataSourceItem = list.find(item => (id ? item.dataSource.id === id : false));
    if (!dataSourceItem) {
        const paramSlug = slug ?? id ?? '';
        if (paramSlug) {
            dataSourceItem = list.find(item => slugify(item.dataSource.name) === paramSlug);
        }
    }
    const isVerified = dataSourceItem?.verification?.presentationState === "verified";
    const sp = await searchParams;
    const ddas = dataSourceItem?.dataDisclosureAgreements ?? [];
    const viewApiFor = sp?.viewApiFor;
    const dataSourceSlug = slugify(dataSourceItem?.dataSource?.name || '');
    // pagination setup (disabled when viewing API for a specific DDA)
    const itemsPerPage = 4;
    const totalItems = ddas.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const pageParam = sp?.page;
    const currentPage = pageParam && !isNaN(parseInt(pageParam, 10)) ? parseInt(pageParam, 10) : 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentDdas = (viewApiFor
        ? ddas.filter(dda => dda.templateId === viewApiFor)
        : ddas.slice(startIndex, endIndex)
    );

    return (
        <Box className="dataListContainer" sx={{ width: '100%' }}>
            <Grid container spacing={gridSpacing} sx={{ width: '100%', margin: 0 }}>
                <Grid size={{ xs: 12 }}>
                    <Grid container spacing={gridSpacing} justifyContent="center">
                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }} className='leftContainer'>
                            <Card className='leftSection'>
                                <CardMedia component="div" className='card-header' image={dataSourceItem?.dataSource?.coverImageUrl}>
                                    <CardMedia
                                        component="img"
                                        image={dataSourceItem?.dataSource?.logoUrl}
                                        alt="symbiome"
                                        className='logo'
                                    />
                                </CardMedia>
                                {/* <Box className='policyUrl'>
                                    {dataSourceItem?.policyUrl}
                                </Box> */}
                                <CardContent sx={{ minHeight: "229px" }}>
                                    <Box sx={{
                                        marginLeft: { xs: 0, sm: "180px" },
                                        paddingTop: { xs: "40px", sm: "0px" },
                                        transform: { xs: 0, sm: "translateY(-40px)" }
                                    }}>
                                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
                                            {dataSourceItem?.dataSource?.name}
                                        </Typography>
                                        <Typography variant="body2" className="datasource-location" sx={{ fontSize: '14px', mb: 1, display: 'flex', alignItems: 'center', gap: 1, paddingTop: "3px", color: isVerified ? '#2e7d32' : '#d32f2f' }}>
                                            {isVerified ? t('common.trustedServiceProvider') : t('common.untrustedServiceProvider')}
                                            <VerifiedBadge trusted={isVerified} />
                                        </Typography>
                                        <Typography className='datasource-location'>
                                            {dataSourceItem?.dataSource?.location}
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" className='datasource-overview-label'>
                                        {t("common.overView")}
                                    </Typography>
                                    <Typography gutterBottom component="div" className="card-body datasource-overview" sx={{ fontSize: "14px" }}>
                                        {/* {moreOrLessTxt === 'Read Less....' ? dataSourceItem?.dataSource?.description : dataSourceItem?.dataSource?.description.slice(0, 275)} */}
                                        {dataSourceItem?.dataSource?.description}
                                        {/* read more button to be added here */}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }} className='rightContainer'>
                            {viewApiFor && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, textAlign: 'center' }}>
                                    <Button
                                        component={Link}
                                        href={`/${locale}/data-source/read/${dataSourceSlug}`}
                                        variant="text"
                                        sx={{ color: '#000', "&:hover": { color: "rgba(0, 0, 0, 0.8)" }, display: 'flex', alignItems: 'center', gap: 1 }}
                                    >
                                        <KeyboardArrowLeftIcon fontSize="small" />
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', paddingTop: '3px' }}>
                                            {t('common.back')}
                                        </Typography>
                                    </Button>
                                </Box>
                            )}
                            <Grid container spacing={2}>
                                {currentDdas.map((dataDisclosureAgreement, index) => {
                                    return (
                                        <Grid
                                            key={index}
                                            size={viewApiFor ? { xs: 12 } : { xs: 12, sm: 4, md: 3 }}
                                            sx={{ minWidth: viewApiFor ? 'auto' : 400, width: '100%' }}
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
                                                        openApiUrl={dataSourceItem?.dataSource.openApiUrl || ''}
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
                            {viewApiFor && (dataSourceItem?.dataSource?.openApiUrl) && (
                                <Box sx={{ mt: 2 }}>
                                    <ApiDoc openApiUrl={dataSourceItem.dataSource.openApiUrl} />
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
                    dataSourceName={dataSourceItem?.dataSource?.name || ''}
                    dataSourceLocation={dataSourceItem?.dataSource?.location || ''}
                    dataSourceDescription={dataSourceItem?.dataSource?.description || ''}
                    coverImage={dataSourceItem?.dataSource?.coverImageUrl || ''}
                    logoImage={dataSourceItem?.dataSource?.logoUrl || ''}
                    dataDisclosureAgreements={dataSourceItem?.dataDisclosureAgreements ?? []}
                />
            </Grid>
        </Box>
    )
}