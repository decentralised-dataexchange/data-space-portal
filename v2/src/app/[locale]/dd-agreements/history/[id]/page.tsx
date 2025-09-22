import React from "react";
import DDAHistoryClient from "@/components/ddaAgreements/DDAHistoryClient";

export default function DDAHistoryPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <DDAHistoryClient id={id} />;
}
