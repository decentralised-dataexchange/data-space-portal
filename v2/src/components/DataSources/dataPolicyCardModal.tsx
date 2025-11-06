"use client";
import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Drawer, Typography, Button, Box, useTheme, Avatar } from "@mui/material";

import { useTranslations } from "next-intl";
import { CaretLeftIcon, XIcon } from "@phosphor-icons/react";

import DataControllerCard from "./dataControllerCard";
import { AttributeTable, AttributeRow } from "@/components/common/AttributeTable";
import "./style.scss";

type SignatureDecodedLike = {
  name?: string;
  organizationName?: string;
  orgName?: string;
  country?: string;
  location?: string;
  addressCountry?: string;
  logo_url?: string;
  logoUrl?: string;
  organization_logo_url?: string;
  logo?: string;
  image?: string;
  timestamp?: string | number;
  [key: string]: unknown;
};

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  headerText: string;
  selectedData: unknown;
  handleCloseViewDDAModal: (open: boolean) => void;
  dataSourceSignatureDecoded?: SignatureDecodedLike;
  dataUsingServiceSignatureDecoded?: SignatureDecodedLike;
}

const titleAttrRestrictionStyle = {
  fontWeight: "normal",
  marginTop: "20px",
  lineHeight: "1.5rem",
  display: "grid",
  alignItems: "center",
  cursor: "pointer",
  border: "1px solid #DFE0E1",
  borderRadius: 5,
  padding: "12px",
};

export default function DataAgreementPolicyCardModal(props: Props) {
  const t = useTranslations();
  const theme = useTheme();
  const { open, setOpen, headerText, selectedData, handleCloseViewDDAModal, dataSourceSignatureDecoded, dataUsingServiceSignatureDecoded } =
    props;
  
  // Create ref for the container
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const SSIpolicyDetailsForContainer: AttributeRow[] = [
    { label: t('dataAgreements.policy.lawfulBasis'), value: String((selectedData as any)?.lawfulBasis ?? "") },
    { label: t('dataAgreements.policy.dataRetentionPeriod'), value: String((selectedData as any)?.dataSharingRestrictions?.dataRetentionPeriod ?? "") },
    { label: t('dataAgreements.policy.policyUrl'), value: String((selectedData as any)?.dataSharingRestrictions?.policyUrl ?? ""), href: (selectedData as any)?.dataSharingRestrictions?.policyUrl || undefined },
    { label: t('dataAgreements.policy.jurisdiction'), value: String((selectedData as any)?.dataSharingRestrictions?.jurisdiction ?? "") },
    // { label: t('dataAgreements.policy.industrySector'), value: String((selectedData as any)?.dataSharingRestrictions?.industrySector ?? "") },
    { label: t('dataAgreements.policy.geographicRestriction'), value: String((selectedData as any)?.dataSharingRestrictions?.geographicRestriction ?? "") },
    { label: t('dataAgreements.policy.storageLocation'), value: String((selectedData as any)?.dataSharingRestrictions?.storageLocation ?? "") },
    { label: t('dataAgreements.policy.agreementPeriodYears'), value: String((selectedData as any)?.agreementPeriod ?? "") },
  ];

  const formatLocalDateTime = (val?: string | number): string => {
    if (val == null || val === "") return "";
    const d = typeof val === 'number' ? new Date(val) : new Date(String(val));
    if (isNaN(d.getTime())) return "";
    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    const day = d.getDate();
    const suffix = (n: number) => {
      if (n % 100 >= 11 && n % 100 <= 13) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    const hours24 = d.getHours();
    const hours12 = hours24 % 12 || 12;
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    return `${months[d.getMonth()]} ${day}${suffix(day)} ${d.getFullYear()}, ${hours12}:${minutes}${ampm}`;
  };

  const getSignatureDisplay = (decoded?: SignatureDecodedLike | null) => {
    const sd = decoded || {};
    const name = sd.name || sd.organizationName || sd.orgName || (sd as any)?.org || (sd as any)?.issuer || (sd as any)?.iss || '';
    const country = sd.country || sd.location || sd.addressCountry || '';
    const logoUrl = sd.logo_url || sd.logoUrl || sd.organization_logo_url || sd.logo || sd.image || '';
    const timestamp = sd.timestamp as string | number | undefined;
    // Fallbacks from selectedData's dataController when decoded missing
    const fallbackName = (selectedData as any)?.dataController?.name || '';
    const fallbackCountry = (selectedData as any)?.dataController?.industrySector || '';
    return {
      name: String((name || fallbackName || '').toString()),
      country: String((country || fallbackCountry || '').toString()),
      logoUrl: String((logoUrl || '').toString()),
      timestamp,
    };
  };

  // Prepare signature card data outside JSX
  const dsInfo = getSignatureDisplay(props.dataSourceSignatureDecoded ?? ((selectedData as any)?.dataSourceSignatureDecoded as SignatureDecodedLike | undefined));
  const dusInfo = getSignatureDisplay(props.dataUsingServiceSignatureDecoded ?? ((selectedData as any)?.dataUsingServiceSignatureDecoded as SignatureDecodedLike | undefined));
  const dsSignedAt = (selectedData as any)?.dataSourceSignature?.timestamp ?? dsInfo.timestamp;
  const dusSignedAt = (selectedData as any)?.dataUsingServiceSignature?.timestamp ?? dusInfo.timestamp;

  // Visibility flags: only show when decoded props are provided explicitly by the parent
  const showDsSignature = Boolean(props.dataSourceSignatureDecoded);
  const showDusSignature = Boolean(props.dataUsingServiceSignatureDecoded);

  return (
    <React.Fragment>
      <Drawer 
        anchor="right" 
        open={open} 
        className="drawer-dda"
        style={{ zIndex: 9999 }}
        SlideProps={{
          style: { zIndex: 9999 }
        }}
      >

        <Box className="dd-modal-container">
          <Box className="dd-modal-header" sx={{paddingRight: 2}}>
            <Box pl={2} display={"flex"} alignItems={"center"}>
              <CaretLeftIcon
                size={22}
                className="dd-modal-header-icon"
                onClick={() => {
                  setOpen(false);
                }}
              />
              <Typography color="#F3F3F6" sx={{ fontSize: '16px' }}>{headerText}</Typography>
            </Box>
            <XIcon
              size={22}
              className="dd-modal-header-icon"
              onClick={() => {
                setOpen(false);
                handleCloseViewDDAModal(false);
              }}
            />
          </Box>

          <Box className="dd-modal-details" style={{ paddingBottom: "70px", backgroundColor: '#F7F6F6' }}>
            <Box m={1.5}>
              <Typography variant="subtitle1" sx={{ fontSize: '16px', mb: 1 }}>
                {t('dataAgreements.policy.dataControllerTitle')}
              </Typography>
              <DataControllerCard selectedData={selectedData} />
            </Box>
            <Box m={1.5}>
              <Typography variant="subtitle1" sx={{ fontSize: '16px', mb: 1 }}>
                {t('dataAgreements.policy.dataSharingRestrictionsTitle')}
              </Typography>
              <AttributeTable rows={SSIpolicyDetailsForContainer} showValues={true} hideEmptyDash={true} labelMinWidth={200} labelMaxPercent={40} />
            </Box>

            {/* Data Source Signature */}
            {showDsSignature && (
              <Box m={1.5}>
                <Typography mt={2} variant="subtitle1" sx={{ fontSize: '16px' }}>
                  {t('signedAgreements.signatures.dataSourceSignature')}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 1, bgcolor: '#FFFFFF', boxShadow: '0px 2px 6px rgba(0,0,0,0.08)', border: '1px solid #DFE0E1' }}>
                    {dsInfo.logoUrl ? (
                      <Avatar src={dsInfo.logoUrl} alt={dsInfo.name} sx={{ width: 50, height: 50 }} />
                    ) : (
                      <Avatar sx={{ width: 50, height: 50 }}>{(dsInfo.name || '?').slice(0,1).toUpperCase()}</Avatar>
                    )}
                    <Box>
                      <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>{dsInfo.name}</Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{dsInfo.country}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ textAlign: 'center', mt: 1.5, color: 'text.secondary', fontSize: '0.9rem' }}>
                    {t('common.signAction')}: {formatLocalDateTime(dsSignedAt)}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Data Using Service Signature */}
            {showDusSignature && (
              <Box m={1.5}>
                <Typography mt={2} variant="subtitle1" sx={{ fontSize: '16px' }}>
                  {t('signedAgreements.signatures.dataUsingServiceSignature')}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 1, bgcolor: '#FFFFFF', boxShadow: '0px 2px 6px rgba(0,0,0,0.08)', border: '1px solid #DFE0E1' }}>
                    {dusInfo.logoUrl ? (
                      <Avatar src={dusInfo.logoUrl} alt={dusInfo.name} sx={{ width: 50, height: 50 }} />
                    ) : (
                      <Avatar sx={{ width: 50, height: 50 }}>{(dusInfo.name || '?').slice(0,1).toUpperCase()}</Avatar>
                    )}
                    <Box>
                      <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>{dusInfo.name}</Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{dusInfo.country}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ textAlign: 'center', mt: 1.5, color: 'text.secondary', fontSize: '0.9rem' }}>
                    {t('common.signAction')}: {formatLocalDateTime(dusSignedAt)}
                  </Typography>
                </Box>
              </Box>
            )}
        
          </Box>
          <Box className="modal-footer" sx={{
            width: 580,
            [theme.breakpoints.down('sm')]: {
              width: '100%',
            },
          }}>
            <Button
              onClick={() => {
                setOpen(false);
                handleCloseViewDDAModal(false);
              }}
              className="delete-btn"
              variant="outlined"
            >
              {t("common.close")}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
