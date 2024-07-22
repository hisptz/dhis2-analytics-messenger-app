import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Contact, ContactType } from "../../../../../../../shared/interfaces";
import { RecipientData } from "../../RecipientSelectorModal/RecipientSelectorModal";
import { useSelectedRecipientGateway } from "../../../hooks/gatewayChanelOptions";

export function SaveButton({
	onClose,
}: {
	onClose: (contact?: Contact) => void;
}) {
	const selectedGateway = useSelectedRecipientGateway();
	const { handleSubmit, reset } = useFormContext<RecipientData>();
	const onSubmit = useCallback(
		(data: RecipientData) => {
			onClose({
				channel: selectedGateway!.channel,
				gatewayId: data.gatewayId,
				identifier: data.identifier,
				type: data.type.toLowerCase().includes("group")
					? ContactType.GROUP
					: ContactType.INDIVIDUAL,
			});
			reset();
		},
		[onClose, selectedGateway],
	);

	return (
		<Button primary onClick={() => handleSubmit(onSubmit)()}>
			{i18n.t("Add")}
		</Button>
	);
}
