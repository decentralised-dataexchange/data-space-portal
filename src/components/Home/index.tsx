import {Locale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Box, Grid, Typography} from '@mui/material';
import PaginationControls from '@/components/common/PaginationControls';
import {apiService} from '@/lib/apiService/apiService';
import DataSourceCard from '@/components/Home/DataSource';
import {gridSpacing} from '@/constants/grid';

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{
    page?: string;
    limit?: string;
  }>; 
};

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const limitParam = sp?.limit;
  const pageParam = sp?.page;
  
  setRequestLocale(locale);

  const t = await getTranslations();

  // Fetch organisations; be resilient to network timeouts in local/dev
  let organisationList: Awaited<ReturnType<typeof apiService.organisationList>> | null = null;
  let organisationLoadFailed = false;
  try {
    organisationList = await apiService.organisationList();
  } catch (err) {
    organisationLoadFailed = true;
    console.warn('[HomePage] Failed to fetch organisations on Home page:', err);
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

  // Server-side pagination (align with client control's limit param)
  const DEFAULT_LIMIT = 12;
  const itemsPerPage = limitParam && !isNaN(parseInt(limitParam, 10)) ? Math.max(1, parseInt(limitParam, 10)) : DEFAULT_LIMIT;
  const totalItems = dataSourceItems.length;
  const currentPage = pageParam && !isNaN(parseInt(pageParam, 10)) ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = dataSourceItems.slice(startIndex, endIndex);
  const showOrgGrid = currentItems?.length > 0;
  const hadBackendError = organisationLoadFailed;
  const showEmptyState = !hadBackendError && !showOrgGrid;

  return (
    <Box className="homeContainer">
      <Box component="div" className='dataSourceSelectionContainer'>
        <Grid container className='datasources-header-container'>
          <Grid 
            size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
            sx={{ order: { xs: 2, md: 1 } }}
          >
            <Typography gutterBottom component="div" className="title">{t('home.title')}</Typography>
          </Grid>
          <Grid 
            className='datasources-filter-container' 
            size={{ xs: 12, sm: 12, md: 6, lg: 6 }}
            sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'flex-start', md: 'flex-end' }, 
              alignItems: 'center', 
              ml: { md: 'auto' }, 
              justifySelf: { md: 'end' },
              order: { xs: 1, md: 2 }
            }}
          >
          </Grid>
        </Grid>
      </Box>

      <Box className="landingPageContainer">
        {showOrgGrid && (
          <Grid container spacing={gridSpacing}>
            <Grid size={{ xs: 12 }}>
              <Grid container spacing={gridSpacing}>
                {currentItems?.map((dataSourceItem, idx) => (
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
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}

        {(hadBackendError || showEmptyState) && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2">
              {hadBackendError ? t('common.errorOccurred') : t('common.noResultsFound')}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {totalItems > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <PaginationControls 
            totalItems={totalItems} 
            defaultRowsPerPage={DEFAULT_LIMIT} 
            rowsPerPageOptions={[5, 12, 24, 48]}
            rowsPerPageLabel={"Items per page"}
            pageParamKey={"page"}
            limitParamKey={"limit"}
          />
        </Box>
      )}
    </Box>
  );
}
