import React from "react";
import i18n from "@dhis2/d2-i18n";
import { useAlert } from "@dhis2/app-runtime";
import {
	Button,
	ButtonStrip,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFDHIS2FormField } from "@hisptz/dhis2-ui";
import Parse from "parse";
import { useNavigate } from "react-router-dom";
import { useRefreshDamConfig } from "../../../../shared/components/DamConfigProvider";

const ConnectFormSchema = z.object({
	username: z.string({ required_error: "Username is required" }),
	password: z
		.string()
		.min(8, "Password should have at least 8 characters")
		.regex(/[A-Z]/, "Password should have at least one capital letter")
		.regex(/\d/, "Password should have at least one number"),
});

export type ConnectFormData = z.infer<typeof ConnectFormSchema>;

export interface ConnectFormModalProps {
	onClose: (refresh: boolean) => void;
	hide: boolean;
}

export function ConnectFormModal({
	onClose,
	hide,
}: ConnectFormModalProps): React.ReactElement {
	const navigate = useNavigate();
	const refresh = useRefreshDamConfig();
	const connectionForm = useForm<ConnectFormData>({
		resolver: zodResolver(ConnectFormSchema),
		shouldFocusError: false,
	});
	const { show: showAlert, hide: hideAlert } = useAlert(
		({ message }: { message: string }) => message,
		({ type }: { type: Record<string, any> }) => ({
			...type,
			duration: 3000,
		}),
	);

	const onConnect = async (data: ConnectFormData) => {
		try {
			const user = await Parse.User.logIn(
				data?.username ?? "",
				data?.password ?? "",
			);
			if (user) {
				connectionForm.reset();
				onClose(true);
				await refresh();
				navigate("/");
			}
		} catch (error: any) {
			if (error.code === 205) {
				console.log("Verify your email first");
				return;
			} else {
				showAlert({
					message: error.message,
					type: { critical: true },
				});
				await new Promise((resolve) => setTimeout(resolve, 5000));
				hideAlert();
			}
		}
	};

	return (
		<Modal position="middle" hide={hide}>
			<ModalTitle>
				{i18n.t("Connect to Analytics Messaging Service")}
			</ModalTitle>
			<ModalContent>
				<FormProvider {...connectionForm}>
					<RHFDHIS2FormField
						className="pt-8"
						name="username"
						valueType="TEXT"
						label={i18n.t("Username")}
						required
					/>
					<RHFDHIS2FormField
						className="pt-8"
						name="password"
						error={
							connectionForm.formState.errors.password?.message
						}
						valueType="TEXT"
						type="password"
						label={i18n.t("Password")}
						required
					/>
				</FormProvider>
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={() => onClose(false)}>
						{i18n.t("Cancel")}
					</Button>
					<Button
						primary
						type="submit"
						loading={connectionForm.formState.isSubmitting}
						onClick={() => connectionForm.handleSubmit(onConnect)()}
					>
						{i18n.t("Connect")}
					</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
