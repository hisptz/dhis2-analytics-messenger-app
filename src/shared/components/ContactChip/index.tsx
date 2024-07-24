import { Chip, IconUser24, IconUserGroup24 } from "@dhis2/ui";
import React from "react";
import classNames from "classnames";
import { Contact } from "../../interfaces";
import "./ContactChip.css";
import { useContactDetails } from "./hooks/data";

export interface ContactNameProps extends Contact {}

export function ContactName({ contact }: { contact: ContactNameProps }) {
	const { loading, name } = useContactDetails(contact);

	if (loading) {
		return "...";
	}

	return <>{name}</>;
}

export interface ContactChipProps {
	onRemove?: () => void;
	contact: Contact;
}

export function ContactChip({ onRemove, contact }: ContactChipProps) {
	const { channel, type } = contact;

	const chipStyle = classNames({
		"chip--telegram": (channel ?? "").toLowerCase() === "telegram",
		"chip--whatsapp": (channel ?? "").toLowerCase() === "whatsapp",
	});

	return (
		<Chip
			className={chipStyle}
			onRemove={onRemove}
			icon={type === "group" ? <IconUserGroup24 /> : <IconUser24 />}
		>
			<ContactName contact={contact} />
		</Chip>
	);
}
