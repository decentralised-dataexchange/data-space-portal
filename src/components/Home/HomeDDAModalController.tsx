"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/custom-hooks/store";
import ViewDataAgreementModalInner from "@/components/DataSources/ViewDDAgreementModalInner";
import { clearSelectedDDAId } from "@/store/reducers/dataSourceReducers";
import { useBusinessWalletSigning } from "@/custom-hooks/businessWalletSigning";
import { useTranslations } from "next-intl";
import { loader as monacoLoader } from "@monaco-editor/react";
import { setMessage } from "@/store/reducers/authReducer";
import type { ServiceSearchDdaItem } from "@/types/serviceSearch";
import { apiService } from "@/lib/apiService/apiService";

interface Props {
  ddas: ServiceSearchDdaItem[];
}

export default function HomeDDAModalController({ ddas }: Props) {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const selectedDDAId = useAppSelector((state) => state.dataSources.selectedDDAId);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const open = selectedDDAId !== "";
  const [monacoReady, setMonacoReady] = React.useState(false);
  const [orgData, setOrgData] = React.useState<any>(null);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (open) {
        try { await monacoLoader.init(); } catch {}
        if (!cancelled) setMonacoReady(true);
      } else {
        setMonacoReady(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [open]);

  const matchesSelected = (d: ServiceSearchDdaItem, sel: string): boolean => {
    const record: any = d.dataDisclosureAgreementRecord || {};
    return (
      record.templateId === sel ||
      record['@id'] === sel ||
      record.dataAgreementId === sel ||
      record.dataAgreementRevisionId === sel ||
      d.id === sel
    );
  };

  const selectedDda = ddas.find((d) => matchesSelected(d, selectedDDAId));
  const selectedData = selectedDda?.dataDisclosureAgreementRecord;
  const orgName = selectedDda?.organisationName || '';
  const orgId = selectedDda?.organisationId;

  // Fetch org data to get logo, banner, and verification status
  React.useEffect(() => {
    const fetchOrgData = async () => {
      if (!orgId) return;
      try {
        const resp = await apiService.getServiceOrganisationById(orgId);
        const org = resp.organisations?.[0];
        if (org) {
          setOrgData(org);
        }
      } catch (err) {
        console.error('Failed to fetch org data:', err);
      }
    };

    if (open && orgId) {
      fetchOrgData();
    }
  }, [open, orgId]);

  const handleClose = () => dispatch(clearSelectedDDAId());

  const { signStatus, initiateSignOrUnsign, isInitiating } = useBusinessWalletSigning({
    selectedDDA: selectedData as any,
    enabled: true,
    enableFocusRefresh: true,
  });

  const handleSignClick = async () => {
    if (!selectedData || !isAuthenticated) return;
    try {
      const res = await initiateSignOrUnsign();
      const url = res?.verificationRequest;
      if (url) {
        const win = window.open(url, "_blank", "noopener,noreferrer");
        if (win) win.opener = null;
      }
    } catch {
      dispatch(setMessage(t('dataAgreements.signWithBusinessWalletInitiateError')));
    }
  };

  const trusted = Boolean(orgData?.organisationIdentity?.presentationRecord?.verified);
  const logoUrl = orgData?.organisation?.logoUrl || '';
  const coverUrl = orgData?.organisation?.coverImageUrl || '';
  const location = orgData?.organisation?.location || '';
  const description = orgData?.organisation?.description || '';

  return (
    <ViewDataAgreementModalInner
      open={open && monacoReady}
      setOpen={(val: boolean) => {
        if (!val) handleClose();
      }}
      mode="public"
      selectedData={selectedData as any}
      dataSourceName={orgName}
      dataSourceLocation={location}
      dataSourceDescription={description}
      coverImage={coverUrl}
      logoImage={logoUrl}
      trusted={trusted}
      drawerWidth={580}
      signStatus={signStatus}
      onSignClick={handleSignClick}
      signButtonLoading={isInitiating}
      titleOverride={t('dataAgreements.viewModal.publicTitle')}
    />
  );
}
