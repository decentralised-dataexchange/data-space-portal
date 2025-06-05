"use client"
import ApiDoc from "@/components/DataSources/ApiDoc";
import { useAppSelector } from "@/custom-hooks/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ApiDocPage() {
    const router = useRouter();
    const openApiUrl = useAppSelector(
        (state) => state.dataSources.selectedOpenApiUrl
    );
    useEffect(() => {
        if (!openApiUrl) router.push('/');
    }, [openApiUrl, router]);

    return (
        <ApiDoc openApiUrl={openApiUrl} />
    )
}