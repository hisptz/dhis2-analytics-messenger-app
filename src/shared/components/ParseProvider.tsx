import React from "react";
import { useSetting } from "@dhis2/app-service-datastore";
import Parse from "parse";
import { Authentication } from "../../modules/Authentication";

export function useParseLogin() {
	const [config] = useSetting("gatewayConfig", { global: true });
	return async () => {
		// TODO fix this dependency
		// return loginToParse(config.token);
	};
}

export function ParseProvider({ children }: { children: React.ReactNode }) {
	const user = Parse.User.current();
	return user ? children : <Authentication />;
}
