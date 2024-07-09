import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useConfig } from "@dhis2/app-runtime";
import Parse from "parse";
import { QueryKey, useQuery, UseQueryResult } from "@tanstack/react-query";
import { ParseClass } from "../constants/parse";
import { useBoolean } from "usehooks-ts";
import { AccessConfigModal } from "./AccessConfigModal";

const DamConfigContext = createContext<Parse.Object | null>(null);
const DamConfigRefreshContext = createContext<UseQueryResult["refetch"] | null>(
	null,
);

export function useDamConfig() {
	return useContext(DamConfigContext);
}

export function useRefreshDamConfig() {
	const refresh = useContext(DamConfigRefreshContext);
	if (!refresh) {
		throw new Error(
			"The useRefreshDamConfig must be used within the DamConfigProvider",
		);
	}

	return refresh;
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
	const {
		value: hide,
		setTrue: onClose,
		setFalse: onOpen,
	} = useBoolean(true);

	const systemId = useMemo(
		() => (systemInfo as Record<string, any>).systemId,
		[systemInfo],
	);

	const {
		isLoading,
		data: damConfig,
		refetch,
	} = useQuery({
		queryKey: [systemId],
		queryFn: getDamConfig,
		enabled: !!systemInfo,
		retry: false,
		retryOnMount: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (damConfig === null && Parse.User.current()) {
			//This means the user is logged in but doesn't have existing dhis2 configuration.
			//We need to prompt the user to enter the PAT and expiry date
			onOpen();
		}
	}, [damConfig]);

	if (isLoading) {
		return loadingComponent;
	}

	return (
		<DamConfigRefreshContext.Provider value={refetch}>
			<DamConfigContext.Provider value={damConfig ?? null}>
				{!hide && <AccessConfigModal hide={hide} onClose={onClose} />}
				{children}
			</DamConfigContext.Provider>
		</DamConfigRefreshContext.Provider>
	);
}
