import i18n from "@dhis2/d2-i18n";
import {
	Button,
	ButtonStrip,
	FlyoutMenu,
	MenuItem,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
	SplitButton,
} from "@dhis2/ui";
import { RHFTextInputField, useConfirmDialog } from "@hisptz/dhis2-ui";
import { uid } from "@hisptz/dhis2-utils";
import React, { useCallback, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
	PushAnalyticsJobFormData,
	pushAnalyticsJobFormDataSchema,
} from "../../../../shared/interfaces";
import { RHFRecipientSelector } from "./components/RHFRecipientSelector/RHFRecipientSelector";
import { useManageConfig } from "./hooks/save";
import { useSendAnalytics } from "./hooks/send";
import { zodResolver } from "@hookform/resolvers/zod";
import Parse from "parse";
import { useQueryClient } from "@tanstack/react-query";
import { RHFGatewaySelector } from "./components/RHFGatewaySelector";
import { RHFVisualizationSelector } from "./components/RHFVisualizationSelector/RHFVisualizationSelector";

export interface PushAnalyticsModalConfigProps {
	config?: Parse.Object | null;
	hidden: boolean;
	onClose: () => void;
}

function SendActions({
	actions,
}: {
	actions: { label: string; action: () => void }[];
}) {
	return (
		<FlyoutMenu>
			{actions.map(({ label, action }) => (
				<MenuItem
					suffix={null}
					key={`${label}-menu-item`}
					label={label}
					onClick={action}
				/>
			))}
		</FlyoutMenu>
	);
}

function getButtonLabel(
	creating: boolean,
	updating: boolean,
	sending: boolean,
	config?: Parse.Object | null,
) {
	if (config) {
		if (updating) {
			return i18n.t("Updating...");
		}
		if (sending) {
			return i18n.t("Sending...");
		}
		return i18n.t("Update and send");
	} else {
		if (creating) {
			return i18n.t("Saving...");
		}
		if (sending) {
			return i18n.t("Sending...");
		}
		return i18n.t("Save and send");
	}
}

export function PushAnalyticsModalConfig({
	hidden,
	onClose,
	config,
}: PushAnalyticsModalConfigProps) {
	const id = useMemo(() => uid(), []);
	const { confirm } = useConfirmDialog();
	const queryClient = useQueryClient();
	const form = useForm<PushAnalyticsJobFormData>({
		defaultValues:
			{
				...(config?.attributes ?? {}),
				gateways: config
					?.get("gateways")
					?.map(
						(gateway: {
							data: Parse.Object;
							channel: "whatsapp" | "telegram";
						}) => gateway.data.id,
					),
			} || {},
		shouldFocusError: false,
		resolver: zodResolver(pushAnalyticsJobFormDataSchema),
	});
	const { send, loading: sending } = useSendAnalytics();
	const onCloseClick = useCallback(
		(fromSave?: boolean) => {
			if (!fromSave && form.formState.isDirty) {
				confirm({
					message: i18n.t(
						"Are you sure you want to close the form? All changes will be lost.",
					),
					title: i18n.t("Confirm close"),
					confirmButtonColor: "primary",
					confirmButtonText: i18n.t("Close"),
					onCancel: () => {},
					onConfirm: () => {
						form.reset({});
						onClose();
					},
				});
			} else {
				form.reset({});
				onClose();
			}
		},
		[onClose],
	);

	const onSaveComplete = async (job?: Parse.Object) => {
		if (!job) {
			return;
		}
		onCloseClick(true);
		await queryClient.invalidateQueries(["analyticsJobs"]);
	};

	const { save, isLoading } = useManageConfig({
		defaultConfig: config,
		onComplete: onSaveComplete,
	});

	const creating = useMemo(() => !config && isLoading, [config]);
	const updating = useMemo(() => (config && isLoading) ?? false, [config]);

	const onSaveAndSend = useCallback(
		(shouldSend: boolean) => async (data: PushAnalyticsJobFormData) => {
			const job = await save(data);
			if (shouldSend) {
				await send(job);
			}
		},
		[id],
	);

	return (
		<Modal position="middle" hide={hidden} onClose={() => onCloseClick()}>
			<ModalTitle>{i18n.t("Send push analytics")}</ModalTitle>
			<ModalContent>
				<FormProvider {...form}>
					<div className="column gap-16">
						<RHFTextInputField
							required
							name="name"
							label={i18n.t("Name")}
						/>
						<RHFGatewaySelector
							required
							name="gateways"
							label={i18n.t("Gateway(s)")}
						/>
						<RHFVisualizationSelector
							label={i18n.t("Visualizations")}
							name="visualizations"
							required={true}
						/>
						<RHFRecipientSelector
							label={i18n.t("Recipients")}
							name="contacts"
						/>
					</div>
				</FormProvider>
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={() => onCloseClick()}>
						{i18n.t("Cancel")}
					</Button>
					<SplitButton
						component={
							<SendActions
								actions={[
									{
										label: config
											? i18n.t("Update and send")
											: i18n.t("Save and send"),
										action: form.handleSubmit(
											onSaveAndSend(true),
										),
									},
									{
										label: config
											? i18n.t("Update")
											: i18n.t("Save"),
										action: form.handleSubmit(
											onSaveAndSend(false),
										),
									},
								]}
							/>
						}
						disabled={
							form.formState.isValidating ||
							form.formState.isSubmitting
						}
						onClick={() => form.handleSubmit(onSaveAndSend(true))()}
						primary
					>
						{getButtonLabel(creating, updating, sending, config)}
					</SplitButton>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
