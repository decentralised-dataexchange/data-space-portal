import React from "react";
import { AttributeTable, AttributeRow } from "@/components/common/AttributeTable";

const DataControllerCard = ({ selectedData }) => {
  const dc = selectedData?.dataController || {};
  const rows: AttributeRow[] = [
    { label: "Name", value: String(dc.name ?? "") },
    { label: "DID", value: String(dc.did ?? "") },
    { label: "Legal ID", value: String(dc.legalId ?? "") },
    { label: "URL", value: String(dc.url ?? ""), href: dc.url || undefined },
    { label: "Industry Sector", value: String(dc.industrySector ?? "") },
  ];
  return (
    <AttributeTable rows={rows} showValues={true} hideEmptyDash={true} labelMinWidth={200} labelMaxPercent={40} />
  );
};

export default DataControllerCard;
