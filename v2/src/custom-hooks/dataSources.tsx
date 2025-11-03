"use client";

import { apiService } from "@/lib/apiService/apiService";
import { useAppDispatch, useAppSelector } from "./store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setDataSources } from "@/store/reducers/dataSourceReducers";
import { ServiceOrganisationResponse, ServiceOrganisationItem } from "@/types/serviceOrganisation";
import { DataDisclosureAgreement, DataSource } from "@/types/dataDisclosureAgreement";

export const useGetDataSourceList = () => {
    const dispatch = useAppDispatch();
    const dataSourceItems = useAppSelector(
        (state) => state?.dataSources.list
    );
    const { data, isLoading, isError } = useQuery<ServiceOrganisationResponse>({
        queryKey: ['serviceOrganisations'],
        queryFn: () => apiService.getServiceOrganisations(),
    });

    useEffect(() => {
        if (isLoading || isError) return;

        if (data) {
            // Map service organisations to previous data-sources-like shape (array of items)
            const mapped = (data.organisations || []).map((item: ServiceOrganisationItem) => {
                const org = item.organisation;
                const trusted = Boolean(item.organisationIdentity?.isPresentationVerified);
                const dataSource: DataSource = {
                    id: org.id,
                    coverImageUrl: org.coverImageUrl,
                    logoUrl: org.logoUrl,
                    name: org.name,
                    sector: org.sector,
                    location: org.location,
                    policyUrl: org.policyUrl,
                    description: org.description,
                    openApiUrl: org.openApiUrl,
                    trusted
                } as unknown as DataSource; // description exists on our type; ensure compatibility

                return {
                    api: item.api,
                    dataSource,
                    dataDisclosureAgreements: (item.dataDisclosureAgreements || []) as DataDisclosureAgreement[],
                    verification: {
                        presentationState: item.organisationIdentity?.presentationRecord?.status || (trusted ? 'verified' : 'unverified')
                    }
                };
            });

            dispatch(setDataSources(mapped as any));
        }
    }, [data, isLoading, isError, dispatch])

    return {
        dataSourceItems
    }
}
