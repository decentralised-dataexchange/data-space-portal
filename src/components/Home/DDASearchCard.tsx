"use client";

import React from "react";
import { Box, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/custom-hooks/store";
import { setSelectedDDAId } from "@/store/reducers/dataSourceReducers";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useBusinessWalletSigning } from "@/custom-hooks/businessWalletSigning";
import TagChips from "@/components/common/TagChips";
import type { ServiceSearchDdaItem } from "@/types/serviceSearch";

interface DDASearchCardProps {
  dda: ServiceSearchDdaItem;
}

export default function DDASearchCard({ dda }: DDASearchCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const record = dda.dataDisclosureAgreementRecord || {};
  const purpose = record?.purpose || '';
  const purposeDescription = record?.purposeDescription || '';
  const version = record?.version || '';
  const tags = dda.tags || [];
  const orgName = dda.organisationName || record?.dataController?.name || '';
  const updatedAt = dda.updatedAt || record?.updatedAt;

  React.useEffect(() => {
    if (tags && tags.length > 0) {
      console.log('DDASearchCard tags:', tags);
    }
  }, [tags]);

  const { refetchStatus } = useBusinessWalletSigning({
    selectedDDA: record as any,
    enabled: false,
  });
  const [isPrefetchingStatus, setIsPrefetchingStatus] = React.useState(false);

  const handleViewDDAClick = async () => {
    const templateId = (record as any)?.templateId;
    if (!templateId) return;
    try {
      if (isAuthenticated) {
        setIsPrefetchingStatus(true);
        try {
          await refetchStatus();
        } finally {
          setIsPrefetchingStatus(false);
        }
      }
    } catch {
      // Silent per spec
    } finally {
      dispatch(setSelectedDDAId(templateId));
    }
  };

  const handleViewApiClick = () => {
    const ddaId = (record as any)?.dataAgreementId || (record as any)?.['@id'] || (record as any)?.templateId;
    const orgId = dda.organisationId;
    if (ddaId && orgId) {
      window.open(`/${locale}/data-source/read/${orgId}?viewApiFor=${ddaId}`, '_blank');
    }
  };

  const hasEmbeddedSpec = React.useMemo(() => {
    const specHasContent = (value: any): boolean => {
      if (!value) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return true;
    };
    const src: any = record as any;
    try {
      if (src && Object.prototype.hasOwnProperty.call(src, "openApiSpecification") && specHasContent(src.openApiSpecification)) return true;
      const objData = src?.objectData;
      if (objData && typeof objData === 'string') {
        try {
          const parsed = JSON.parse(objData);
          if (parsed && specHasContent(parsed?.openApiSpecification)) return true;
        } catch {}
      }
      const revObjData = src?.dataDisclosureAgreementTemplateRevision?.objectData;
      if (revObjData && typeof revObjData === 'string') {
        try {
          const parsed2 = JSON.parse(revObjData);
          if (parsed2 && specHasContent(parsed2?.openApiSpecification)) return true;
        } catch {}
      }
    } catch {}
    return false;
  }, [record]);

  const formatRelativeTime = (val?: string) => {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d.getTime())) return "";
    const diffMs = d.getTime() - Date.now();
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    const absMs = Math.abs(diffMs);
    const sec = Math.round(diffMs / 1000);
    const min = Math.round(diffMs / (60 * 1000));
    const hr = Math.round(diffMs / (60 * 60 * 1000));
    const day = Math.round(diffMs / (24 * 60 * 60 * 1000));
    if (absMs < 60 * 1000) return rtf.format(sec, 'second');
    if (absMs < 60 * 60 * 1000) return rtf.format(min, 'minute');
    if (absMs < 24 * 60 * 60 * 1000) return rtf.format(hr, 'hour');
    return rtf.format(day, 'day');
  };

  return (
    <Card className='cardContainerList' sx={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF !important', borderRadius: '7px', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 4px' }}>
      <CardContent sx={{ padding: '24px' }}>
        <Typography variant="h6" sx={{ fontSize: "20px", paddingBottom: "20px", fontWeight: 'bold' }}>
          {purpose || 'Data Disclosure Agreement'}
        </Typography>
        <Typography sx={{ fontSize: "14px", paddingBottom: "20px", color: '#666666' }}>
          {purposeDescription}
        </Typography>
        {tags && tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <TagChips tags={tags} maxDisplay={5} />
          </Box>
        )}
        <Box className="actionListingBtn" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, marginTop: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, width: '100%' }}>
            <Typography variant="body2" sx={{ color: '#666666' }}>
              {version ? `${t('dataAgreements.version')}: ${version}` : ''}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                size="medium"
                sx={{
                  fontSize: "14px",
                  textTransform: "none",
                  fontWeight: "medium",
                  border: '1px solid rgb(223, 223, 223)',
                  backgroundColor: 'white',
                  borderRadius: '0px',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: 'black',
                    color: 'white',
                    borderColor: 'black',
                  },
                  '&.Mui-disabled': { opacity: 0.6, cursor: 'not-allowed', pointerEvents: 'auto' },
                }}
                onClick={handleViewApiClick}
                disabled={!hasEmbeddedSpec}
              >
                {t("home.btn-viewMetadata")}
              </Button>
              <Button
                variant="outlined"
                size="medium"
                sx={{
                  fontSize: "14px",
                  textTransform: "none",
                  fontWeight: "medium",
                  position: 'relative',
                  border: '1px solid rgb(223, 223, 223)',
                  backgroundColor: 'white',
                  borderRadius: '0px',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: 'black',
                    color: 'white',
                    borderColor: 'black',
                  },
                }}
                onClick={handleViewDDAClick}
                disabled={Boolean(isPrefetchingStatus)}
              >
                {isPrefetchingStatus && (
                  <CircularProgress
                    size={18}
                    sx={{
                      color: 'inherit',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-9px',
                      marginLeft: '-9px'
                    }}
                  />
                )}
                <Box component="span" sx={{ visibility: isPrefetchingStatus ? 'hidden' : 'visible' }}>
                  {t("home.btn-signData")}
                </Box>
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
            {(() => {
              const rel = formatRelativeTime(updatedAt);
              if (!rel) return null;
              return (
                <Typography variant="caption" sx={{ color: '#888888', fontSize: '12px' }}>
                  {`Last Modified: ${rel}`}
                </Typography>
              );
            })()}
            {orgName && (
              <Typography variant="caption" sx={{ color: '#888888', fontSize: '12px', fontWeight: 'medium' }}>
                {`Publisher: ${orgName}`}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
