import DataSourceListingPage from "@/components/DataSources";

export default function DataSourceReadPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <DataSourceListingPage params={params} />
        </div>
    )
}