import HomePage from "@/components/Home";

interface Props {
    params: Promise<{ locale: string }>;
    searchParams?:Promise<{ page?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
    return <HomePage params={params} searchParams={searchParams} />;
}
