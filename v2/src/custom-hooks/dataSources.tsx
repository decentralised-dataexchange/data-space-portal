import { apiService } from "@/lib/apiService/apiService";
import { useAppDispatch, useAppSelector } from "./store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setDataSources } from "@/store/reducers/dataSourceReducers";

export const useGetDataSourceList = () => {
    const dispatch = useAppDispatch();
    const dataSourceItems = useAppSelector(
        (state) => state?.dataSources.list
    );
    const { data, isLoading, isError } = useQuery({
        queryKey: ['dataSourceList'],
        queryFn: () => apiService.dataSourceList(),
    });

    useEffect(() => {
        if (isLoading || isError) return;

        if (data) {
            dispatch(setDataSources(data))
        }
    }, [data, isLoading, isError])

    return {
        dataSourceItems
    }
}
