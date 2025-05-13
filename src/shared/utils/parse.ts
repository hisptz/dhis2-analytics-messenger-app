import Parse from "parse";

export function initializeParse() {
	Parse.initialize(import.meta.env.DHIS2_SAAS_APP_ID ?? "DAM-AUTH");
	Parse.serverURL =
		import.meta.env.DHIS2_SAAS_BASE_URL ?? "http://localhost:3001/api";
}

export async function logoutParseUser() {
	return await Parse.User.logOut();
}

export async function loginParseUser(username: string, password: string) {
	return await Parse.User.logIn(username, password);
}
