import { DatastoreNamespaces } from "../../../../../shared/interfaces/datastore";
import {
	FetchError,
	useAlert,
	useDataEngine,
	useDataQuery,
} from "@dhis2/app-runtime";
import { DashboardsForm } from "../Dashboards";
import i18n from "@dhis2/d2-i18n";

const query = {
	dashboards: {
		resource: `dataStore/${DatastoreNamespaces.APP}/dashboards`,
	},
};

interface QueryResponse {
	dashboards: Array<{
		id: string;
		name: string;
	}>;
}

export function useGetDashboards() {
	const { refetch } = useDataQuery<QueryResponse>(query);

	const get = async () => {
		try {
			const response = (await refetch()) as unknown as QueryResponse;
			return response.dashboards;
		} catch (e) {
			return [];
		}
	};

	return {
		get,
	};
}

const createMutation = {
	type: "create" as const,
	resource: `dataStore/${DatastoreNamespaces.APP}/dashboards`,
	data: ({ data }: { data: Array<{ id: string; name: string }> }) => data,
};

const updateMutation = {
	type: "update" as const,
	resource: `dataStore/${DatastoreNamespaces.APP}`,
	id: "dashboards",
	data: ({ data }: { data: Array<{ id: string; name: string }> }) => data,
};

export function useSaveDashboards() {
	const engine = useDataEngine();
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);

	const save = async (data: DashboardsForm) => {
		try {
			await engine.mutate(updateMutation, {
				variables: {
					data: data.dashboards,
				},
			});
			show({
				message: i18n.t("Updates saved successfully"),
				type: { success: true },
			});
		} catch (error) {
			if (error instanceof FetchError) {
				if (error.details.httpStatusCode === 404) {
					await engine.mutate(createMutation, {
						variables: {
							data: data.dashboards,
						},
					});
					show({
						message: i18n.t("Updates saved successfully"),
						type: { success: true },
					});
					return;
				}
			}
			if (error instanceof Error) {
				show({
					message: `${i18n.t("Error saving updates")}: ${error.message}`,
					type: { critical: true },
				});
				return;
			}

			show({
				message: `${i18n.t("Error saving updates")}: ${i18n.t("Unknown error")}`,
				type: { critical: true },
			});
			console.error(error);
		}
	};

	return {
		save,
	};
}
