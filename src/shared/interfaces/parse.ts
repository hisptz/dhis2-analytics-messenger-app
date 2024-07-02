import Parse from "parse";

export type ParseUser = Parse.User & {
	authDataResponse: { dhis2Auth: { instance: { objectId: string } } };
};
