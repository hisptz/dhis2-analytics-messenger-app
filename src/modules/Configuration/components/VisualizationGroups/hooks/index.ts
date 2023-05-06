import { useDataQuery } from "@dhis2/app-runtime";
import { useEffect } from "react";
import { VisualizationGroup } from "../../../../../shared/interfaces";
import { ANALYTICS_GROUPS_DATASTORE_KEY } from "../../../../../shared/constants/dataStore";

// TODO add mechanism for pagination
const query = {
  visualizationGroups: {
    resource: `dataStore/${ANALYTICS_GROUPS_DATASTORE_KEY}`,
    params: ({ page, pageSize }: any) => ({
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
  const { data, loading, error, refetch } = useDataQuery(query);

  const { entries, pager } = data?.visualizationGroups ?? {};

  const visualizationGroups: VisualizationGroup[] = (entries ?? []).map(
    (
      { id, name, created, visualizations, lastUpdated, createdBy }: any,
      index: number
    ): VisualizationGroup => {
      return {
        index: index + 1,
        id: id ?? "",
        name: name ?? "",
        created: created ?? "N/A",
        lastUpdated: lastUpdated ?? "N/A",
        createdBy: createdBy ?? "N/A",
        visualizations: (visualizations ?? []).map(({ id, name }: any) => ({
          id: id ?? "",
          name: name ?? "",
        })),
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
