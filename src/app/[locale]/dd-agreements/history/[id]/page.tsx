import React from "react";
import DDAHistoryClient from "@/components/ddaAgreements/DDAHistoryClient";

export default async function DDAHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DDAHistoryClient id={id} />;
}
