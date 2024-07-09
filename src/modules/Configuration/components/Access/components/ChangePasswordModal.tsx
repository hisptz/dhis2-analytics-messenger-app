import { z } from "zod";
import Parse from "parse";
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
import React from "react";
import { RHFTextInputField } from "@hisptz/dhis2-ui";
import { useAlert } from "@dhis2/app-runtime";

const passwordSchema = z
	.string()
	.min(8, "Password should have at least 8 characters")
	.regex(/[A-Z]/, "Password should have at least one capital letter")
	.regex(/\d/, "Password should have at least one number");

const passwordChangeSchema = z
	.object({
		currentPassword: passwordSchema.refine(
			async (value) => {
				try {
					const user = Parse.User.current();
					if (!user) {
						return false;
					}
					// @ts-ignore
					const valid = await user.verifyPassword(value, {
						ignoreEmailVerification: true,
					});
					if (valid) {
						return true;
					}
				} catch (e) {
					if (e instanceof Parse.Error) {
						if (e.message === "User email is not verified.") {
							//Just the user is not verified
							return true;
						}
					}

					return false;
				}
			},
			{
				message: i18n.t("Invalid current password"),
			},
		),
		newPassword: passwordSchema,
		confirmNewPassword: passwordSchema,
	})
	.refine(
		(value) => {
			return value.confirmNewPassword === value.newPassword;
		},
		{
			message: i18n.t("Passwords do not match"),
		},
	);

type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

export interface ChangePasswordModalProps {
	hide: boolean;
	onClose: () => void;
}

export function ChangePasswordModal({
	onClose,
	hide,
}: ChangePasswordModalProps) {
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);
	const form = useForm<PasswordChangeData>({
		resolver: zodResolver(passwordChangeSchema),
		shouldFocusError: false,
		reValidateMode: "onChange",
	});

	const onChange = async (data: PasswordChangeData) => {
		try {
			const user = Parse.User.current();
			if (!user) {
				show({
					message: i18n.t(
						"Could not find details about the connected in user. Refresh this page and try again",
					),
					type: { critical: true },
				});
				return;
			}
			user?.setPassword(data.newPassword);
			await user.save();
			show({
				message: i18n.t("Password changed successfully"),
				type: { success: true },
			});
			onClose();
		} catch (e) {
			if (e instanceof Error || e instanceof Parse.Error) {
				show({
					message: `${i18n.t("Error changing password")}: ${
						e.message
					}`,
					type: { critical: true },
				});
			}
		}
	};

	const buttonLabel = form.formState.isValidating
		? i18n.t("Checking...")
		: form.formState.isSubmitting
		? i18n.t("Saving...")
		: i18n.t("Save");
	const buttonLoading =
		form.formState.isSubmitting || form.formState.isValidating;

	return (
		<Modal position="middle" hide={hide} onClose={onClose}>
			<ModalTitle>{i18n.t("Change Password")}</ModalTitle>
			<ModalContent>
				<FormProvider {...form}>
					<div className="column gap-8">
						<RHFTextInputField
							label={i18n.t("Current password")}
							name="currentPassword"
							type="password"
							required
						/>
						<RHFTextInputField
							label={i18n.t("New password")}
							name="newPassword"
							type="password"
							required
						/>
						<RHFTextInputField
							label={i18n.t("Confirm new password")}
							name="confirmNewPassword"
							type="password"
							required
						/>
					</div>
				</FormProvider>
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={onClose}>{i18n.t("Cancel")}</Button>
					<Button
						loading={buttonLoading}
						primary
						onClick={() => form.handleSubmit(onChange)()}
					>
						{buttonLabel}
					</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
