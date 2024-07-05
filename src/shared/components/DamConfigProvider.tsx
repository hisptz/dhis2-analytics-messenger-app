import React, { createContext, useContext, useMemo } from "react";
import { useConfig } from "@dhis2/app-runtime";
import Parse from "parse";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { ParseClass } from "../constants/parse";

const DamConfigContext = createContext<Parse.Object | null>(null);

export function useDamConfig() {
	return useContext(DamConfigContext);
}

async function getDamConfig({
	queryKey,
}: {
	queryKey: QueryKey;
}): Promise<Parse.Object | null> {
	const [systemId] = queryKey;
	const query = new Parse.Query(ParseClass.DHIS2_INSTANCE);
	query.equalTo("systemId", systemId);
	return (await query.first()) ?? null;
}

export function DamConfigProvider({
	children,
	loadingComponent,
}: {
	children: React.ReactNode;
	loadingComponent: React.ReactNode;
}) {
	const { systemInfo } = useConfig();

	const systemId = useMemo(
		() => (systemInfo as Record<string, any>).systemId,
		[systemInfo],
	);

	const {
		isLoading,
		data: damConfig,
		error: damConfigError,
	} = useQuery({
		queryKey: [systemId],
		queryFn: getDamConfig,
		enabled: !!systemInfo,
	});

	if (isLoading) {
		return loadingComponent;
	}

	if (damConfigError) {
		throw damConfigError;
	}

	if (damConfig === undefined) {
		throw "Error getting analytics messenger configuration";
	}

	return (
		<DamConfigContext.Provider value={damConfig}>
			{children}
		</DamConfigContext.Provider>
	);
}
