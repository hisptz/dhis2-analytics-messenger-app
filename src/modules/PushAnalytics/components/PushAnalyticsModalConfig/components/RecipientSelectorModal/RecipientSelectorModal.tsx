import React, { useCallback } from "react";
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
import { useForm, FormProvider } from "react-hook-form";
import { useUpdateEffect } from "usehooks-ts";
import {
	Contact,
	ContactType,
	ToContactFormSchema,
} from "../../../../../../shared/interfaces";
import { useRecipientOptions } from "../../hooks/recipientOptions";
import { Group } from "../RHFRecipientSelector/components/Group/Group";
import { PhoneNumber } from "../RHFRecipientSelector/components/PhoneNumber";
import { useGatewayChannelOptions } from "../../hooks/gatewayChanelOptions";

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
	const recipientOptions = useRecipientOptions(form.watch("channel"));
	const gatewayChannelOptions = useGatewayChannelOptions();

	const [type, channel] = form.watch(["type", "channel"]);

	const onSubmit = useCallback(
		(data: RecipientData) => {
			onClose({
				channel: data.channel,
				identifier: data.identifier,
				type: data.type.includes("group")
					? ContactType.GROUP
					: ContactType.INDIVIDUAL,
			});
			form.reset({});
		},
		[form, onClose],
	);

	useUpdateEffect(() => {
		form.unregister("identifier");
		form.clearErrors("identifier");
		form.resetField("identifier");
	}, [type]);

	return (
		<FormProvider {...form}>
			<Modal
				large
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
								label={i18n.t("Channel")}
								options={gatewayChannelOptions}
								name={"channel"}
							/>

							<RHFSingleSelectField
								disabled={!channel}
								label={i18n.t("Type")}
								options={recipientOptions}
								name={"type"}
							/>

							{type === "user" && <></>}
							{type === "whatsappGroup" && (
								<Group gatewayType="whatsapp" />
							)}
							{type === "telegramGroup" && (
								<Group gatewayType="telegram" />
							)}
							{type === "whatsappPhoneNumber" && (
								<PhoneNumber gatewayType="whatsapp" />
							)}
							{type === "telegramPhoneNumber" && (
								<PhoneNumber gatewayType="telegram" />
							)}
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
						<Button onClick={() => form.handleSubmit(onSubmit)()}>
							{i18n.t("Add")}
						</Button>
					</ButtonStrip>
				</ModalActions>
			</Modal>
		</FormProvider>
	);
}
