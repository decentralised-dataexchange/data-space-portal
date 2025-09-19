"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/custom-hooks/store";
import { DataDisclosureAgreement } from "@/types/dataDisclosureAgreement";
import ViewDataAgreementModalInner from "./ViewDDAgreementModalInner";
import { clearSelectedDDAId } from "@/store/reducers/dataSourceReducers";

interface Props {
  dataSourceName: string;
  dataSourceLocation: string;
  dataSourceDescription: string;
  coverImage: string;
  logoImage: string;
  dataDisclosureAgreements: DataDisclosureAgreement[];
  trusted?: boolean;
  accessPointEndpoint?: string;
}

export default function DDAModalController({
  dataSourceName,
  dataSourceLocation,
  dataSourceDescription,
  coverImage,
  logoImage,
  dataDisclosureAgreements,
  trusted,
  accessPointEndpoint,
}: Props) {
  const dispatch = useAppDispatch();
  const selectedDDAId = useAppSelector((state) => state.dataSources.selectedDDAId);
  const open = selectedDDAId !== "";
  const selectedData = dataDisclosureAgreements.find(
    (d) => d.templateId === selectedDDAId
  );

  const handleClose = () => dispatch(clearSelectedDDAId());

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
      accessPointEndpoint={accessPointEndpoint}
      showAccessPointEndpoint={false}
      drawerWidth={580}
    />
  );
}
