import { useAlert, useConfig } from "@dhis2/app-runtime";
import {
	useDamConfig,
	useRefreshDamConfig,
} from "../components/DamConfigProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import i18n from "@dhis2/d2-i18n";
import { z } from "zod";
import Parse from "parse";
import { ParseClass } from "../constants/parse";
import { DateTime } from "luxon";

const accessConfigSchema = z
	.object({
		url: z.string().url(),
		pat: z.string().startsWith("d2pat_", {
			message: i18n.t("The personal access token must start with d2pat_"),
		}),
		expiresOn: z.string().date("Invalid expiry date"),
	})
	.superRefine(async (value, context) => {
		const response = await fetch(`${value.url}/api/me`, {
			headers: {
				Authorization: `Api Token ${value.pat}`,
			},
		});
		if (!response.ok) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["pat"],
				message: i18n.t("The personal access token is invalid"),
				fatal: true,
			});
		}
	});

export type AccessConfigData = z.infer<typeof accessConfigSchema>;

async function saveDamConfig(
	variables: ReturnType<typeof useConfig>["systemInfo"] & {
		systemId: string;
		systemName: string;
		instanceBaseUrl?: string;
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
		dhis2Instance.set(
			"url",
			variables.instanceBaseUrl ?? variables.contextPath,
		);
		dhis2Instance.set("version", variables.version);
	}
	dhis2Instance.set("pat", variables.pat);
	dhis2Instance.set("expiresOn", new Date(variables.expiresOn));
	dhis2Instance.set("timezone", variables.serverTimeZoneId);

	return await dhis2Instance.save();
}

export function useManageDHIS2Config({ onClose }: { onClose: () => void }) {
	const { systemInfo } = useConfig();
	const config = useDamConfig();
	const refresh = useRefreshDamConfig();

	const form = useForm<AccessConfigData>({
		resolver: zodResolver(accessConfigSchema),
		defaultValues: {
			url: systemInfo?.contextPath,
			pat: config?.get("pat"),
			expiresOn: DateTime.fromJSDate(
				config?.get("expiresOn") as Date,
			).toFormat("yyyy-MM-dd"),
		},
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

	return {
		form,
		onSave,
	};
}
