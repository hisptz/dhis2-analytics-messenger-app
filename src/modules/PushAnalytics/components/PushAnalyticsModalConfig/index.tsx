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
import { RHFDescription } from "./components/RHFDescription";
import { RHFGroupSelector } from "./components/RHFGroupSelector";
import { RHFRecipientSelector } from "./components/RHFRecipientSelector";
import { RHFVisSelector } from "./components/RHFVisSelector";
import { useManageConfig } from "./hooks/save";
import { useSendAnalytics } from "./hooks/send";
import { zodResolver } from "@hookform/resolvers/zod";
import Parse from "parse";
import { useBoolean } from "usehooks-ts";
import { useQueryClient } from "@tanstack/react-query";

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
		defaultValues: config?.attributes || {},
		shouldFocusError: false,
		resolver: zodResolver(pushAnalyticsJobFormDataSchema),
	});
	const { send, loading: sending } = useSendAnalytics();
	const { value: shouldSend, setValue: setShouldSend } = useBoolean(true);
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
	const { save, isLoading } = useManageConfig({
		defaultConfig: config,
		onComplete: async (job: Parse.Object) => {
			if (shouldSend) {
				await send(job);
				onCloseClick(true);
				queryClient.invalidateQueries(["analyticsJobs"]);
			} else {
				queryClient.invalidateQueries(["analyticsJobs"]);
				onCloseClick(true);
			}
		},
	});

	const creating = useMemo(() => !config && isLoading, [config]);
	const updating = useMemo(() => (config && isLoading) ?? false, [config]);

	const onSaveAndSend = useCallback(
		(shouldSend: boolean) => async (data: PushAnalyticsJobFormData) => {
			setShouldSend(shouldSend);
			await save(data);
		},
		[send, id],
	);

	return (
		<Modal position="middle" hide={hidden} onClose={onCloseClick}>
			<ModalTitle>{i18n.t("Send push analytics")}</ModalTitle>
			<ModalContent>
				<FormProvider {...form}>
					<div className="column gap-16">
						<RHFTextInputField
							required
							name="name"
							label={i18n.t("Name")}
						/>
						<RHFGroupSelector
							required
							name="visualizationGroup"
							label={i18n.t("Visualization group")}
						/>
						<RHFVisSelector
							required
							name="visualizations"
							label={i18n.t("Visualizations")}
						/>
						<RHFDescription
							label={i18n.t("Description")}
							name="description"
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
					<Button onClick={onCloseClick}>{i18n.t("Cancel")}</Button>
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
						disabled={creating || updating || sending}
						loading={sending || creating || updating}
						onClick={form.handleSubmit(onSaveAndSend(true))}
						primary
					>
						{getButtonLabel(creating, updating, sending, config)}
					</SplitButton>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
