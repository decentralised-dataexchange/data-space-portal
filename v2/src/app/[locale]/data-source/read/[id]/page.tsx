import DataSourceListingPage from "@/components/DataSources";

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export default function DataSourceReadPage({ params, searchParams }: Props) {
  return <DataSourceListingPage params={params} searchParams={searchParams} />;
}