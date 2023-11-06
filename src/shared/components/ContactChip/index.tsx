import { Chip, IconUser24, IconUserGroup24 } from "@dhis2/ui";
import { find } from "lodash";
import React from "react";
import { useDHIS2Users } from "../../hooks/users";
import { useWhatsappData } from "../../hooks/whatsapp";
import { Contact } from "../../interfaces";

export interface ContactNameProps extends Contact {}

export function ContactName({ type, identifier }: ContactNameProps) {
	const { groups } = useWhatsappData();
	const { users } = useDHIS2Users();

	function getGroup(value: string) {
		return (
			find(groups, ({ id }: { id: string }) => id.includes(value))
				?.name ?? value
		);
	}

	function getUser(value: string) {
		return (
			find(users, ({ whatsApp }) => whatsApp.includes(value))
				?.displayName ?? value
		);
	}

	if (type === "group") {
		return <>{getGroup(identifier)}</>;
	}
	return <>{getUser(identifier)}</>;
}

export interface ContactChipProps extends Contact {
	onRemove?: () => void;
}

export function ContactChip({ onRemove, type, ...props }: ContactChipProps) {
	return (
		<Chip
			onRemove={onRemove}
			icon={type === "group" ? <IconUserGroup24 /> : <IconUser24 />}
		>
			<ContactName type={type} {...props} />
		</Chip>
	);
}
