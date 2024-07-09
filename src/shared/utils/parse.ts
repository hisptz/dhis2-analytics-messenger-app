import Parse from "parse";

export function initializeParse() {
	Parse.initialize(process.env.REACT_APP_SAAS_APP_ID ?? "DAM-AUTH");
	Parse.serverURL =
		process.env.REACT_APP_SAAS_BASE_URL ?? "http://localhost:3001/api";
}

export async function logoutParseUser() {
	return await Parse.User.logOut();
}

export async function loginParseUser(username: string, password: string) {
	return await Parse.User.logIn(username, password);
}
