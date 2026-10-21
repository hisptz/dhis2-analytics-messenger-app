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

interface CustomReport {
	id: string;
	name: string;
}

interface QueryResponse {
	customReports: CustomReport[] | { entries: CustomReport[] };
}

export function useCustomReports() {
	const { data, loading, error } = useDataQuery<QueryResponse>(query);

	return {
		customReports: Array.isArray(data?.customReports)
			? data.customReports
			: (data?.customReports?.entries ?? []),
		loading,
		error,
	};
}
