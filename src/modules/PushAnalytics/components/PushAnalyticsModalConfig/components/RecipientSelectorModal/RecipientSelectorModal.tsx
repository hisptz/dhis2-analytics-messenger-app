import React from "react";
import i18n from "@dhis2/d2-i18n";
import {
	Button,
	ButtonStrip,
	Field,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import { RHFSingleSelectField } from "@hisptz/dhis2-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
	Contact,
	ToContactFormSchema,
} from "../../../../../../shared/interfaces";
import { useGatewayChannelOptions } from "../../hooks/gatewayChanelOptions";
import { ContactSelector } from "./components/ContactSelector";
import { SaveButton } from "../RHFRecipientSelector/components/SaveButton";

export interface RecipientSelectorModalConfigProps {
	hidden: boolean;
	onClose: (contact?: Contact) => void;
}

export type RecipientData = Omit<Contact, "type"> & {
	type:
		| "whatsappPhoneNumber"
		| "whatsappGroup"
		| "telegramPhoneNumber"
		| "telegramGroup"
		| "user";
};

export function RecipientSelectorModalConfig({
	hidden,
	onClose,
}: RecipientSelectorModalConfigProps) {
	const form = useForm<RecipientData>({
		reValidateMode: "onBlur",
		mode: "onBlur",
		shouldFocusError: false,
		resolver: zodResolver(ToContactFormSchema),
	});
	const gatewayChannelOptions = useGatewayChannelOptions();
	return (
		<FormProvider {...form}>
			<Modal
				small
				position="middle"
				onClose={() => onClose()}
				hide={hidden}
			>
				<ModalTitle>{i18n.t("Select recipients")}</ModalTitle>
				<ModalContent>
					<Field helpText="">
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr",
								gap: 16,
								alignItems: "start",
							}}
						>
							<RHFSingleSelectField
								label={i18n.t("Gateway")}
								options={gatewayChannelOptions}
								name={"gatewayId"}
							/>
							<ContactSelector />
						</div>
					</Field>
				</ModalContent>
				<ModalActions>
					<ButtonStrip>
						<Button
							onClick={() => {
								onClose();
							}}
						>
							{i18n.t("Cancel")}
						</Button>
						<SaveButton onClose={onClose} />
					</ButtonStrip>
				</ModalActions>
			</Modal>
		</FormProvider>
	);
}
