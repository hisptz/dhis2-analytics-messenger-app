import Parse from "parse";

export function useGroups({
	type,
	session,
}: {
	type: "whatsapp" | "telegram";
	session: string;
}) {
	const response = Parse.Cloud.run("getGroups", {
		channel: type,
	});
}
