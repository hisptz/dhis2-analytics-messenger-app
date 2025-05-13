import { DatastoreNamespaces } from "../../../../../shared/interfaces/datastore";
import { useDataQuery } from "@dhis2/app-runtime";

const query = {
	dashboards: {
		resource: `dataStore/${DatastoreNamespaces.APP}`,
		id: "dashboards",
	},
};

interface QueryResponse {
	dashboards: Array<{
		id: string;
		name: string;
	}>;
}

export function useDashboards() {
	const { data, loading, error } = useDataQuery<QueryResponse>(query);

	return {
		dashboards: data?.dashboards ?? [],
		loading,
		error,
	};
}
