import {Locale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Box, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography} from '@mui/material';
import ClientPagination from './ClientPagination';
import Loader from '@/components/common/Loader';
import {apiService} from '@/lib/apiService/apiService';
import DataSourceCard from '@/components/Home/DataSource';
import {gridSpacing} from '@/constants/grid';

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{ page?: string }>;
};

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const pageParam = (await searchParams)?.page;
  

  
  setRequestLocale(locale);

  const t = await getTranslations();

  // Fetch organisations; be resilient to network timeouts in local/dev
  let organisationList: Awaited<ReturnType<typeof apiService.organisationList>> | null = null;
  try {
    organisationList = await apiService.organisationList();
  } catch (err) {
    console.error('Failed to fetch organisations on Home page:', err);
  }

  // Map organisations into the card's expected shape
  const dataSourceItems = (organisationList?.organisations ?? []).map(item => ({
    dataSource: {
      description: item.organisation?.description ?? '',
      logoUrl: item.organisation?.logoUrl ?? '',
      id: item.organisation?.id ?? '',
      coverImageUrl: item.organisation?.coverImageUrl ?? '',
      name: item.organisation?.name ?? '',
      sector: item.organisation?.sector ?? '',
      location: item.organisation?.location ?? '',
      policyUrl: item.organisation?.policyUrl ?? '',
      accessPointEndpoint: item.organisation?.accessPointEndpoint ?? null,
      // Map org verification to trusted
      trusted: item.organisationIdentity?.isPresentationVerified ?? false,
    },
    // Carry extra fields used by the ViewCredentialsController modal
    organisationIdentity: item.organisationIdentity,
    softwareStatement: (item as any)?.organisation?.softwareStatement ?? {},
    dataDisclosureAgreements: item.dataDisclosureAgreements ?? [],
  }));

  // Server-side pagination
  const itemsPerPage = 12;
  const totalItems = dataSourceItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page from search params, default to 1
  const currentPage = pageParam && !isNaN(parseInt(pageParam, 10)) ? parseInt(pageParam, 10) : 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = dataSourceItems.slice(startIndex, endIndex);

  return (
    <>
      {
        currentItems?.length > 0 ? 
        <Box className="homeContainer">
            <Box component="div" className='dataSourceSelectionContainer'>
                <Grid container className='datasources-header-container'>
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Typography gutterBottom component="div" className="title">{t('home.title')}</Typography>
                    </Grid>
                    <Grid 
                        className='datasources-filter-container' 
                        size={{ xs: 12, sm: 12, md: 6, lg: 6 }}
                        sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center', ml: { md: 'auto' }, justifySelf: { md: 'end' } }}
                    >
                        <Box component="div">
                            <FormControl component="fieldset">
                                <RadioGroup row value={1}>
                                    <FormControlLabel value={1} control={<Radio  size='small' />} label={t('home.check-box-all')} labelPlacement='end' />
                                    <FormControlLabel value={2} disabled className="data-source-filter" control={<Radio size='small'  />} label={t('home.check-box-org')} labelPlacement='end' />
                                    <FormControlLabel value={3} disabled className="data-source-filter" control={<Radio size='small'  />} label={t('home.check-box-devices')} labelPlacement='end' />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box className="landingPageContainer">
                <Grid container spacing={gridSpacing}>
                    <Grid size={{ xs: 12 }}>
                        <Grid container spacing={gridSpacing}>
                            {currentItems?.map((dataSourceItem, idx) => {
                                return (
                                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={dataSourceItem.dataSource.id + idx}>
                                        <DataSourceCard
                                            overviewLabel={t('common.overView')}
                                            signDataLabel={t('home.btn-signData')}
                                            dataSource={dataSourceItem.dataSource}
                                            dataDisclosureAgreements={dataSourceItem.dataDisclosureAgreements}
                                            organisationIdentity={dataSourceItem.organisationIdentity}
                                            softwareStatement={dataSourceItem.softwareStatement}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                    <ClientPagination currentPage={currentPage} totalPages={totalPages} />
                </Box>
            )}
        </Box>
        : 
        <Loader />
      }
    </>
  );
}
