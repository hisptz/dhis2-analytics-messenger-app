import { useDataQuery } from "@dhis2/app-runtime";
import { useEffect } from "react";
import { GATEWAY_DATASTORE_KEY } from "../../../../../shared/constants/dataStore";
import { Gateway } from "../../../../../shared/interfaces";

// TODO add mechanism for pagination
const query = {
  gateways: {
    resource: `dataStore/${GATEWAY_DATASTORE_KEY}`,
    params: ({ page, pageSize }: any) => ({
      fields: [
        "id",
        "name",
        "created",
        "lastUpdated",
        "createdBy",
        "url",
        "secretKey",
      ],
      page: page ?? 1,
      pageSize: pageSize ?? 10,
    }),
  },
};

export function useGatewayConfiguration(): any {
  const { data, loading, error, refetch } = useDataQuery(query);

  const { entries, pager } = data.gateways ?? {};

  const gateways: Gateway[] = (entries ?? []).map(
    ({
      id,
      name,
      created,
      secretKey,
      url,
      lastUpdated,
      createdBy,
    }: any): Gateway => {
      return {
        id: id ?? "",
        name: name ?? "",
        created: created ?? "N/A",
        url: url ?? "",
        lastUpdated: lastUpdated ?? "N/A",
        createdBy: createdBy ?? "N/A",
        secretKey: secretKey ?? "",
      };
    }
  );

  return {
    loading,
    error,
    refetch,
    pager,
    gateways,
  };
}
