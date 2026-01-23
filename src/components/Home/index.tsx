import {Locale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Box, Grid, Typography} from '@mui/material';
import PaginationControls from '@/components/common/PaginationControls';
import {apiService} from '@/lib/apiService/apiService';
import DataSourceCard from '@/components/Home/DataSource';
import {gridSpacing} from '@/constants/grid';
import HomeSearchControls from '@/components/Home/HomeSearchControls';
import HomeTabs from '@/components/Home/HomeTabs';
import TagChips from '@/components/common/TagChips';
import DDASearchCard from '@/components/Home/DDASearchCard';
import HomeDDAModalController from '@/components/Home/HomeDDAModalController';

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    tab?: string;
    orgPage?: string;
    ddaPage?: string;
    searchOrgName?: string;
    searchDdaPurpose?: string;
    searchDdaDescription?: string;
    searchDataset?: string;
  }>; 
};

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const limitParam = sp?.limit;
  const searchQuery = sp?.search?.trim?.() || '';

  const tabParam = sp?.tab;
  const activeTab: 'organisations' | 'ddas' = tabParam === 'ddas' ? 'ddas' : 'organisations';

  const rawOrgPageParam = sp?.orgPage ?? sp?.page;
  const rawDdaPageParam = sp?.ddaPage;

  const orgPage = rawOrgPageParam && !isNaN(parseInt(rawOrgPageParam, 10)) ? Math.max(1, parseInt(rawOrgPageParam, 10)) : 1;
  const ddaPage = rawDdaPageParam && !isNaN(parseInt(rawDdaPageParam, 10)) ? Math.max(1, parseInt(rawDdaPageParam, 10)) : 1;
  const activePage = activeTab === 'ddas' ? ddaPage : orgPage;

  const boolFromParam = (val: string | undefined, defaultValue: boolean): boolean => {
    if (val === undefined) return defaultValue;
    if (val === 'true') return true;
    if (val === 'false') return false;
    return defaultValue;
  };

  const searchOrgName = boolFromParam(sp?.searchOrgName, true);
  const searchDdaPurpose = boolFromParam(sp?.searchDdaPurpose, true);
  const searchDdaDescription = boolFromParam(sp?.searchDdaDescription, true);
  const searchDataset = boolFromParam(sp?.searchDataset, true);
  
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
  let totalItems = dataSourceItems.length;
  let ddas: Awaited<ReturnType<typeof apiService.serviceSearch>>['ddas'] = [];
  let organisationsTotalItems = totalItems;
  let ddasTotalItems = 0;
  let serviceSearchFailed = false;

  if (searchQuery) {
    try {
      const offset = (activePage - 1) * itemsPerPage;
      const searchResult = await apiService.serviceSearch({
        search: searchQuery,
        offset,
        limit: itemsPerPage,
        searchOrgName,
        searchDdaPurpose,
        searchDdaDescription,
        searchDataset,
        searchTags: true,
      });

      const orgs = searchResult?.organisations ?? [];
      // Map organisations into the card's expected shape
      (dataSourceItems as any).splice(0, dataSourceItems.length, ...orgs.map((item: any) => ({
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
      })));
      ddas = searchResult?.ddas ?? [];
      organisationsTotalItems = searchResult?.organisationsPagination?.totalItems;
      ddasTotalItems = searchResult?.ddasPagination?.totalItems;
    } catch (err) {
      serviceSearchFailed = true;
      console.warn('[HomePage] Failed to perform service search on Home page:', err);
    }
  } else {
    organisationsTotalItems = dataSourceItems.length;
  }

  const activeTotalItems = searchQuery
    ? (activeTab === 'ddas' ? ddasTotalItems : organisationsTotalItems)
    : organisationsTotalItems;

  // Get current page from search params, default to 1
  const currentPage = searchQuery ? activePage : orgPage;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, organisationsTotalItems);
  const currentItems = searchQuery ? dataSourceItems : dataSourceItems.slice(startIndex, endIndex);

  const orgHasResults = currentItems?.length > 0;
  const ddaHasResults = searchQuery && ddas.length > 0;
  const showOrgGrid = activeTab === 'organisations' && orgHasResults;
  const showDdaList = activeTab === 'ddas' && ddaHasResults;
  const hadBackendError = organisationLoadFailed || serviceSearchFailed;
  const showEmptyState = !hadBackendError && !showOrgGrid && !showDdaList;

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
            <HomeSearchControls searchQuery={searchQuery} />
          </Grid>
        </Grid>
      </Box>

      {searchQuery && (
        <Box sx={{ mt: 1 }}>
          <HomeTabs activeTab={activeTab} organisationsCount={organisationsTotalItems} ddasCount={ddasTotalItems} />
        </Box>
      )}

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

        {showDdaList && (
          <Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                  {ddas.map((dda) => (
                    <Grid size={{ xs: 12 }} key={dda.id}>
                      <DDASearchCard dda={dda} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
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
      {activeTotalItems > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <PaginationControls 
            totalItems={activeTotalItems} 
            defaultRowsPerPage={DEFAULT_LIMIT} 
            rowsPerPageOptions={[5, 12, 24, 48]}
            rowsPerPageLabel={t('common.itemsPerPage')}
            pageParamKey={searchQuery ? (activeTab === 'ddas' ? 'ddaPage' : 'orgPage') : 'orgPage'}
            limitParamKey={"limit"}
          />
        </Box>
      )}

      {/* DDA Modal Controller for search results */}
      {searchQuery && ddas.length > 0 && (
        <HomeDDAModalController ddas={ddas} />
      )}
    </Box>
  );
}
