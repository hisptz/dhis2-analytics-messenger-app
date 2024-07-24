import { useRef, useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { debounce } from "lodash";
import { SupportedChannels } from "../../../../../../../../../shared/interfaces";
import { useSelectedRecipientGateway } from "../../../../../hooks/gatewayChanelOptions";

const userQuery: any = {
	data: {
		resource: "users",
		params: ({
			keyword,
			channel,
		}: {
			keyword: string;
			channel: SupportedChannels;
		}) => ({
			query: keyword,
			filter: `${channel === SupportedChannels.WHATSAPP ? "whatsApp" : channel}:!null`,
			fields: [
				"id",
				"displayName",
				"whatsApp",
				"telegram",
				"firstName",
				"surname",
				"email",
				"phoneNumber",
				"username",
			],
		}),
	},
};

export type UserLookupResponse = {
	data: {
		users: Array<{
			id: string;
			username: string;
			firstName: string;
			surname: string;
			displayName: string;
			phoneNumber: string;
			email: string;
			telegram: string;
			whatsApp: string;
		}>;
	};
};

export function useSearchUser() {
	const gateway = useSelectedRecipientGateway();
	const [keyword, setKeyword] = useState<string | null>(null);
	const { refetch, data, loading } = useDataQuery<UserLookupResponse>(
		userQuery,
		{
			variables: {
				channel: gateway?.channel,
			},
			lazy: true,
		},
	);

	const search = useRef(
		debounce((keyword: string) => {
			refetch({ keyword });
		}, 1000),
	);

	const onChange = ({ value }: { value?: string }) => {
		setKeyword(value ?? null);
		if (value) {
			search.current(value);
		}
	};

	return {
		keyword,
		setKeyword,
		onChange,
		loading,
		results: data?.data?.users,
	};
}
