import { Contact } from "../../../interfaces";
import { useGateways } from "../../../../modules/Configuration/components/Gateways/components/GatewayConfigurationsTable/hooks/data";
import { useMemo } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { head } from "lodash";
import { useGatewayGroups } from "../../../hooks/groups";

const query = {
	user: {
		resource: "users",
		params: ({ identifier, channel }: any) => {
			return {
				filter: `${channel === "whatsapp" ? "whatsApp" : channel}:like:${identifier}`,
				fields: ["displayName", "id", "whatsApp", "telegram", "email"],
			};
		},
	},
};

type UserResponse = {
	user: {
		users: [
			{
				displayName: string;
				id: string;
				whatsApp: string;
				telegram: string;
				email: string;
			},
		];
	};
};

export function useDHIS2User(contact: Contact) {
	const { loading, data, error } = useDataQuery<UserResponse>(query, {
		variables: {
			...contact,
		},
	});
	const user = head(data?.user.users);

	return {
		user,
		loading,
		error,
	};
}

export function useContactDetails(contact: Contact) {
	const { type, channel, gatewayId, identifier } = contact;
	const { data: gateways, loading: gatewayLoading } = useGateways();
	const gateway = useMemo(() => {
		return gateways?.find((gateway) => gateway?.data.id === gatewayId);
	}, [gateways, gatewayId]);
	const { data: groups, isLoading: gatewayGroupsLoading } = useGatewayGroups({
		gateway: gateway?.data,
	});

	const { loading: userLoading, user } = useDHIS2User(contact);

	const loading = gatewayLoading || gatewayGroupsLoading || userLoading;

	const name = useMemo(() => {
		if (type === "group") {
			const group = groups?.find((group) => group.id === identifier);
			if (group) {
				return group.name;
			} else {
				return identifier;
			}
		} else {
			if (user) {
				return user.displayName;
			} else {
				return identifier;
			}
		}
	}, [groups, contact, user]);

	return {
		loading,
		type: contact.type,
		name,
	};
}
