import { IJobs } from "@app-models";
import { useCallback, useEffect, useState } from "react";
import axiosClient from '../config/axiosClient';
import settings from "../config/settings";
import { capitalizeEachWord } from "../Utils/Generic";
import { useFocusEffect } from "expo-router";

const APP_BASE = settings.api.rest;

export default function useVarious() {
    const [jobsData, setJobsData] = useState<IJobs | null>(null);
    const [jobError, setJobError] = useState<string>('');
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axiosClient.get(`${APP_BASE}/read-jobs`);
                const data = response.data.results;
                const filteredAndModifiedData = data
                // .filter((item: IJobs) => item.status === "active" )
                .map((item: IJobs) => ({
                    label: capitalizeEachWord(item.name),
                    value: item.name
                }));
                setJobsData(filteredAndModifiedData);
            } catch (error: any) {
                setJobError(error.message);
            }
        };

        fetchJobs();
    }, [reload])

    return {
        jobsData,
        jobError,
        setReload
    };
}
