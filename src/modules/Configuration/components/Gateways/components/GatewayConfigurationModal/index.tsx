import {
	Button,
	ButtonStrip,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import React from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseGatewayInfoForm } from "./components/BaseGatewayInfoForm";
import i18n from "@dhis2/d2-i18n";
import { ChannelButtonSelector } from "./components/ChannelButtonSelector";
import { uid } from "@hisptz/dhis2-utils";
import Parse from "parse";
import { channels } from "../../constants/channels";
import { useAlert } from "@dhis2/app-runtime";

export interface GatewayConfigurationModalProps {
	onClose: () => void;
	hide: boolean;
}

const gatewayConfigFormDataSchema = z.object({
	name: z.string(),
	channel: z.enum(["whatsapp", "telegram"]),
	sessionId: z.string(),
	enabled: z.boolean(),
});

type GatewayConfigFormData = z.infer<typeof gatewayConfigFormDataSchema>;

export function GatewayConfigurationModal({
	onClose,
	hide,
}: GatewayConfigurationModalProps) {
	const form = useForm<GatewayConfigFormData>({
		resolver: zodResolver(gatewayConfigFormDataSchema),
		shouldFocusError: false,
		defaultValues: {
			sessionId: uid(),
			enabled: true,
		},
	});

	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);

	const onSave = async (data: GatewayConfigFormData) => {
		try {
			const channel = channels.find(({ name }) => name === data.channel);

			if (!channel) {
				show({
					message: i18n.t("Invalid channel {{channel}}", {
						channel: data.channel,
					}),
					type: { critical: true },
				});
				return;
			}
			const gateway = new Parse.Object(channel.className);
			await gateway.save({
				...data,
			});

			onClose();
		} catch (e) {}
	};

	return (
		<FormProvider {...form}>
			<Modal onClose={onClose} position="middle" hide={hide}>
				<ModalTitle>{i18n.t("Setup Gateway")}</ModalTitle>
				<ModalContent>
					<div className="column gap-16">
						<BaseGatewayInfoForm />
					</div>
				</ModalContent>
				<ModalActions>
					<ButtonStrip>
						<Button onClick={onClose}>{i18n.t("Cancel")}</Button>
						<ChannelButtonSelector
							onComplete={form.handleSubmit(onSave)}
						/>
					</ButtonStrip>
				</ModalActions>
			</Modal>
		</FormProvider>
	);
}
