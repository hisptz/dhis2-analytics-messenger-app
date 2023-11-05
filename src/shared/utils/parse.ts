import Parse from "parse";


export function initializeParse() {

    Parse.initialize(process.env.REACT_APP_SAAS_APP_ID ?? "DAM-AUTH");
    Parse.serverURL = process.env.REACT_APP_SAAS_BASE_URL ?? "http://localhost:3001/api";

}

export async function loginToParse(token: string) {
    if ((await Parse.User.currentAsync())) {
        return;
    }
    const [userId, authToken] = token.split("/");
    return await Parse.User.logInWith("dhis2Auth", {
        authData: {
            id: userId,
            token: authToken
        }
    });
}
