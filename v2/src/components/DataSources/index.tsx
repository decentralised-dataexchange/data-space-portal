import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React from 'react';
import { getTranslations } from "next-intl/server";
import { gridSpacing } from '@/constants/grid';
import { apiService } from '@/lib/apiService/apiService';
import DDAActions from '@/components/DataSources/DDAActions';
import DDAModalController from '@/components/DataSources/DDAModalController';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedBadge from '../common/VerifiedBadge';

export default async function DataSourceListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations();
    const dataSourceItem = ((await apiService.dataSourceList())?.dataSources ?? []).find(item => item.dataSource.id === id);
    const isVerified = dataSourceItem?.verification?.presentationState === "verified";
    return (
        <Box className="dataListContainer">
            <Grid container spacing={gridSpacing}>
                <Grid size={{ xs: 12 }}>
                    <Grid container spacing={gridSpacing}>
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
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold">
                                        {dataSourceItem?.dataSource?.name}
                                        {/* <CheckCircleIcon className="verify" /> */}
                                    </Typography>
                                    <Typography variant="body2" className="datasource-location" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, paddingTop: "3px" }}>
                                        {isVerified ? t('common.trustedServiceProvider') : t('common.untrustedServiceProvider')}
                                        <VerifiedBadge trusted={isVerified} size="small" />
                                    </Typography>
                                    <Typography className='datasource-location'>
                                        {dataSourceItem?.dataSource?.location}
                                    </Typography>
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
                            {dataSourceItem?.dataDisclosureAgreements?.map((dataDisclosureAgreement, index) => {
                                return (
                                    <Card key={index} className='cardContainerList'>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontSize: "20px", paddingBottom: "20px" }}>
                                                {dataDisclosureAgreement.purpose}
                                            </Typography>
                                            <Typography sx={{ fontSize: "14px" }}>
                                                {dataDisclosureAgreement.purposeDescription}
                                            </Typography>
                                            <DDAActions
                                                dataDisclosureAgreement={dataDisclosureAgreement}
                                                openApiUrl={dataSourceItem?.dataSource.openApiUrl || ''}
                                            />
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </Grid>
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