import DataSourceListingPage from "@/components/DataSources";

export default function DataSourceReadPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <DataSourceListingPage params={params}   />
    )
}