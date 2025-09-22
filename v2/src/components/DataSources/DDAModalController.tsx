"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/custom-hooks/store";
import { DataDisclosureAgreement } from "@/types/dataDisclosureAgreement";
import ViewDataAgreementModalInner from "./ViewDDAgreementModalInner";
import { clearSelectedDDAId } from "@/store/reducers/dataSourceReducers";
import { apiService } from "@/lib/apiService/apiService";
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
  const selectedDDAId = useAppSelector((state) => state.dataSources.selectedDDAId);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const open = selectedDDAId !== "";
  const getDdaId = (dda: any): string | undefined => (dda?.dataAgreementId || dda?.['@id'] || dda?.templateId);
  const matchesSelected = (d: any, sel: string) => {
    return (
      d?.templateId === sel ||
      d?.['@id'] === sel ||
      d?.dataAgreementId === sel ||
      d?.dataAgreementRevisionId === sel ||
      getDdaId(d) === sel
    );
  };
  const selectedData = dataDisclosureAgreements.find((d) => matchesSelected(d, selectedDDAId));

  const handleClose = () => dispatch(clearSelectedDDAId());

  const [signStatus, setSignStatus] = React.useState<"sign" | "unsign" | string>("");

  // Helper to initiate sign/unsign with ID fallback attempts (prefers templateId)
  const initiateWithFallback = async (d: any) => {
    const candidates = [d?.templateId, d?.['@id'], d?.dataAgreementId, d?.dataAgreementRevisionId].filter(Boolean) as string[];
    let lastErr: any = null;
    for (const cid of candidates) {
      try {
        return await apiService.initiateOrganisationDDA(cid);
      } catch (e: any) {
        const status = e?.response?.status;
        lastErr = e;
        if (status === 404) continue; // try next candidate
        throw e; // non-404 -> surface immediately
      }
    }
    throw lastErr || new Error('Failed to initiate organisation DDA');
  };

  // Fetch initial status and verification URL when modal opens (auth only)
  React.useEffect(() => {
    let cancelled = false;
    const fetchInit = async () => {
      if (!open || !selectedData || !isAuthenticated) return;
      try {
        const res = await initiateWithFallback(selectedData as any);
        if (!cancelled) {
          setSignStatus(res.status);
        }
      } catch (e) {
        if (!cancelled) {
          setSignStatus("");
        }
      }
    };
    fetchInit();
    return () => { cancelled = true; };
  }, [open, selectedData, isAuthenticated]);

  const handleSignClick = async () => {
    if (!selectedData || !isAuthenticated) return;
    try {
      const res = await initiateWithFallback(selectedData as any);
      const url = res.verificationRequest;
      if (url) {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (win) {
          win.opener = null;
        }
      }
    } catch (e) {
      // Optionally show a message; keeping silent per spec
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
    />
  );
}
