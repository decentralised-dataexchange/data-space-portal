import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React from 'react';
import { getTranslations } from "next-intl/server";
import { gridSpacing } from '@/constants/grid';
import { apiService } from '@/lib/apiService/apiService';
import DDAActions from '@/components/DataSources/DDAActions';
import DDAModalController from '@/components/DataSources/DDAModalController';
import VerifiedBadge from '../common/VerifiedBadge';

import ClientPagination from '../Home/ClientPagination';

type Props = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ page?: string }>;
};

export default async function DataSourceListingPage({ params, searchParams }: Props) {
    const { id } = await params;
    const t = await getTranslations();
    const dataSourceItem = ((await apiService.dataSourceList())?.dataSources ?? []).find(item => item.dataSource.id === id);
    const isVerified = dataSourceItem?.verification?.presentationState === "verified";
    // pagination setup
    const itemsPerPage = 4;
    const totalItems = dataSourceItem?.dataDisclosureAgreements?.length ?? 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const pageParam = (await searchParams)?.page;
    const currentPage = pageParam && !isNaN(parseInt(pageParam, 10)) ? parseInt(pageParam, 10) : 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentDdas = dataSourceItem?.dataDisclosureAgreements?.slice(startIndex, endIndex) ?? [];

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
                                        marginLeft: { xs: 0, sm: "px" },
                                        paddingTop: { xs: "40px", sm: "0px" },
                                        transform: { xs: 0, sm: "translateY(-25px)" }
                                    }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {dataSourceItem?.dataSource?.name}
                                        </Typography>
                                        <Typography variant="body2" className="datasource-location" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, paddingTop: "3px", color: isVerified ? '#2e7d32' : '#d32f2f' }}>
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
                            <Grid container spacing={2}>
                                {currentDdas.map((dataDisclosureAgreement, index) => {
                                    return (
                                        <Grid key={index} size={{ xs: 12, sm: 4, md: 3 }} sx={{ minWidth: 400 }}>
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
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Grid>
                        {/* Pagination */}
                        {totalPages > 1 && (
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