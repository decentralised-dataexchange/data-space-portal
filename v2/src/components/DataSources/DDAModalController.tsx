"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/custom-hooks/store";
import { DataDisclosureAgreement } from "@/types/dataDisclosureAgreement";
import ViewDataAgreementModalInner from "./ViewDDAgreementModalInner";
import { clearSelectedDDAId } from "@/store/reducers/dataSourceReducers";
import { useBusinessWalletSigning } from "@/custom-hooks/businessWalletSigning";
import { useTranslations } from "next-intl";
// no i18n needed here

interface Props {
  dataSourceName: string;
  dataSourceLocation: string;
  dataSourceDescription: string;
  coverImage: string;
  logoImage: string;
  dataDisclosureAgreements: DataDisclosureAgreement[];
  trusted?: boolean;
}

export default function DDAModalController({
  dataSourceName,
  dataSourceLocation,
  dataSourceDescription,
  coverImage,
  logoImage,
  dataDisclosureAgreements,
  trusted,
}: Props) {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const selectedDDAId = useAppSelector((state) => state.dataSources.selectedDDAId);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const open = selectedDDAId !== "";
  const getDdaId = (dda: DataDisclosureAgreement): string | undefined => (
    dda.dataAgreementId || dda['@id'] || dda.templateId
  );
  const matchesSelected = (d: DataDisclosureAgreement, sel: string): boolean => (
    d.templateId === sel ||
    d['@id'] === sel ||
    d.dataAgreementId === sel ||
    d.dataAgreementRevisionId === sel ||
    getDdaId(d) === sel
  );
  const selectedData: DataDisclosureAgreement | undefined = dataDisclosureAgreements.find((d) => matchesSelected(d, selectedDDAId));

  const handleClose = () => dispatch(clearSelectedDDAId());
  // Hook: manage sign/unsign status and initiation; refetch status on window focus if user previously initiated
  const { signStatus, initiateSignOrUnsign, isInitiating } = useBusinessWalletSigning({
    selectedDDA: selectedData,
    // Auto-fetch on open to ensure status is available inside the modal
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
      // silent per spec
    }
  };

  return (
    <ViewDataAgreementModalInner
      open={open}
      setOpen={(val: boolean) => {
        if (!val) handleClose();
      }}
      mode="public"
      selectedData={selectedData}
      dataSourceName={dataSourceName}
      dataSourceLocation={dataSourceLocation}
      dataSourceDescription={dataSourceDescription}
      coverImage={coverImage}
      logoImage={logoImage}
      trusted={trusted}
      drawerWidth={580}
      signStatus={signStatus}
      onSignClick={handleSignClick}
      signButtonLoading={isInitiating}
      titleOverride={t('dataAgreements.viewModal.publicTitle')}
    />
  );
}
