import { useDataQuery } from "@dhis2/app-runtime";

const query = {
	customReports: {
		resource: "dataStore",
		id: "hisptz-dam-custom-reports",
		params: {
			fields: ["id", "name"],
			paging: false,
		},
	},
};

interface QueryResponse {
	customReports: Array<{
		id: string;
		name: string;
	}>;
}

export function useCustomReports() {
	const { data, loading, error } = useDataQuery<QueryResponse>(query);

	return {
		customReports: data?.customReports ?? [],
		loading,
		error,
	};
}
