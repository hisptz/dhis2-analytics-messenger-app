import React from "react";
import { z } from "zod";
import i18n from "@dhis2/d2-i18n";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	ButtonStrip,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import { RHFTextInputField } from "@hisptz/dhis2-ui";
import { useAlert, useConfig } from "@dhis2/app-runtime";
import Parse from "parse";
import { ParseClass } from "../constants/parse";
import { useDamConfig, useRefreshDamConfig } from "./DamConfigProvider";

export interface AccessConfigModalProps {
	hide: boolean;
	onClose: () => void;
}

const accessConfigSchema = z.object({
	pat: z.string().startsWith("d2", {
		message: i18n.t("The personal access token must start with d2"),
	}),
	expiresOn: z.string().date("Invalid expiry date"),
});

type AccessConfigData = z.infer<typeof accessConfigSchema>;

async function saveDamConfig(
	variables: ReturnType<typeof useConfig>["systemInfo"] & {
		systemId: string;
		systemName: string;
		pat: string;
		expiresOn: Date;
		config: Parse.Object | null;
	},
): Promise<Parse.Object | null> {
	const dhis2Instance =
		variables.config ?? new Parse.Object(ParseClass.DHIS2_INSTANCE);
	if (!variables.config) {
		dhis2Instance.set("systemId", variables.systemId);
		dhis2Instance.set("name", variables.systemName);
		dhis2Instance.set("url", variables.contextPath);
		dhis2Instance.set("version", variables.version);
	}
	dhis2Instance.set("pat", variables.pat);
	dhis2Instance.set("expiresOn", new Date(variables.expiresOn));

	return await dhis2Instance.save();
}

export function AccessConfigModal({ hide, onClose }: AccessConfigModalProps) {
	const { systemInfo } = useConfig();
	const config = useDamConfig();
	const refresh = useRefreshDamConfig();
	const form = useForm<AccessConfigData>({
		resolver: zodResolver(accessConfigSchema),
	});
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);

	const onSave = async (data: AccessConfigData) => {
		try {
			const response = await saveDamConfig({
				...systemInfo,
				...data,
				config,
			} as any);
			if (response) {
				show({
					message: i18n.t("Configuration saved successfully"),
					type: { success: true },
				});
				refresh();
				onClose();
			}
		} catch (error: any) {
			const errorMessage = error.message;
			show({
				message: i18n.t("Could not save configuration {{reason}}", {
					reason: errorMessage,
				}),
				type: { critical: true },
			});
		}
	};

	return (
		<FormProvider {...form}>
			<Modal position="middle" hide={hide} onClose={onClose}>
				<ModalTitle>{i18n.t("DHIS2 Access Config")}</ModalTitle>
				<ModalContent>
					<div className="column gap-8">
						<RHFTextInputField
							type="password"
							name="pat"
							label={i18n.t("Personal access token")}
						/>
						<RHFTextInputField
							type="date"
							name="expiresOn"
							label={i18n.t("Expires on")}
						/>
					</div>
				</ModalContent>
				<ModalActions>
					<ButtonStrip>
						<Button onClick={onClose}>{i18n.t("Cancel")}</Button>
						<Button
							primary
							onClick={() => form.handleSubmit(onSave)()}
						>
							{i18n.t("Save")}
						</Button>
					</ButtonStrip>
				</ModalActions>
			</Modal>
		</FormProvider>
	);
}
