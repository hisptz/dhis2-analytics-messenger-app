import {useDataQuery} from "@dhis2/app-runtime";
import {VisualizationGroup} from "../../../../../shared/interfaces";
import {ANALYTICS_GROUPS_DATASTORE_KEY} from "../../../../../shared/constants/dataStore";
import {ActionButton} from "../../../../../shared/components/CustomDataTable/components/ActionButton";
import React from "react";
import i18n from '@dhis2/d2-i18n';
// TODO add mechanism for pagination
const query = {
    visualizationGroups: {
        resource: `dataStore/${ANALYTICS_GROUPS_DATASTORE_KEY}`,
        params: ({page, pageSize}: any) => ({
            fields: [
                "id",
                "name",
                "created",
                "lastUpdated",
                "createdBy",
                "visualizations",
            ],
            page: page ?? 1,
            pageSize: pageSize ?? 10,
        }),
    },
};

export function useVisualizationGroups(): {
    loading: boolean;
    error: any;
    refetch: any;
    pager: { page: number; pageSize: number };
    visualizationGroups: VisualizationGroup[];
} {
    const {data, loading, error, refetch} = useDataQuery(query);

    const {entries, pager} = data?.visualizationGroups ?? {};

    const visualizationGroups: VisualizationGroup[] = (entries ?? []).map(
        (
            entry: any,
            index: number
        ): any => {
            const {id, name, created, visualizations, lastUpdated, createdBy} = entry ?? {}
            return {
                index: index + 1,
                id: id ?? "" as string,
                name: name ?? "",
                created: created ?? "N/A",
                lastUpdated: lastUpdated ?? "N/A",
                createdBy: createdBy ?? "N/A",
                visualizations: (visualizations ?? []).map(({id, name}: any) => ({
                    id: id ?? "",
                    name: name ?? "",
                })),
                action: (<ActionButton actions={[{
                    label: i18n.t("Edit"), key: id, onClick: () => {
                    }
                }]} row={entry}/>)
            };
        }
    );

    return {
        loading,
        error,
        refetch,
        pager,
        visualizationGroups,
    };
}
