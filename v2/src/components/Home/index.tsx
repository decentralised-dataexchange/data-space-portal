import {Locale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Box, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography} from '@mui/material';
import Loader from '@/components/common/Loader';
import { apiService } from '@/lib/apiService/apiService';
import DataSourceCard from '@/components/Home/DataSource';
import { gridSpacing } from '@/constants/grid';


type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function HomePage({params}: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations();

  const dataSourceItems = (await apiService.dataSourceList())?.dataSources ?? [];

  return (
    <>
      {
        dataSourceItems?.length > 0 ? 
        <Box className="homeContainer">
            <Box component="div" className='dataSourceSelectionContainer'>
                <Grid container spacing={gridSpacing}>
                    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                        <Typography gutterBottom component="div" className="title">{t('home.title')}</Typography>
                    </Grid>
                    <Grid className='pt-0' size={{ xs: 12, sm: 12, md: 6, lg: 6 }} container justifyContent={'flex-end'}>
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
                            {dataSourceItems?.map((dataSourceItem) => {
                                return (
                                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={dataSourceItem.dataSource.id}>
                                        <DataSourceCard
                                            overviewLabel={t('common.overView')}
                                            signDataLabel={t('home.btn-signData')}
                                            dataSource={dataSourceItem.dataSource}
                                            dataDisclosureAgreements={dataSourceItem.dataDisclosureAgreements}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
        : 
        <Loader />
      }
    </>
  );
}
