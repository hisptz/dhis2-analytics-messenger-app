import React from "react";
import Parse from "parse";
import i18n from "@dhis2/d2-i18n";
import {
	Button,
	ButtonStrip,
	InputField,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RHFDHIS2FormField } from "@hisptz/dhis2-ui";
import { useNavigate } from "react-router-dom";
import { useRefreshDamConfig } from "../../../../shared/components/DamConfigProvider";
import { useAlert } from "@dhis2/app-runtime";

const signUpSchema = z.object({
	fullName: z
		.string()
		.regex(/^[a-zA-Z ]+$/, "Only alphabets and spaces are allowed")
		.refine(
			(value) => value.includes(" "),
			"A space is required between your first and last name",
		),
	username: z.string().min(4, "Username should have at least 4 characters"),
	phoneNumber: z
		.string()
		.regex(
			/^(\+?\d{1,3})?\d{7,15}$/,
			"Invalid phone number format, Use +255XXXXXXXXX or 0XXXXXXXXX",
		)
		.optional(),
	email: z.string().email(),
	password: z
		.string()
		.min(8, "Password should have at least 8 characters")
		.regex(/[a-z]/, "Password should have at least one small letter")
		.regex(/[A-Z]/, "Password should have at least one capital letter")
		.regex(/\d/, "Password should have at least one number"),
	consent: z
		.boolean()
		.refine(
			(value) => value,
			"You must consent to the privacy policy to continue",
		),
});

export type SignUpData = z.infer<typeof signUpSchema>;

export interface RegistrationFormModalProps {
	onClose: () => void;
	hide: boolean;
}

export function RegistrationFormModal({
	onClose,
	hide,
}: RegistrationFormModalProps): React.ReactElement {
	const navigate = useNavigate();
	const refresh = useRefreshDamConfig();
	const { show: showAlert, hide: hideAlert } = useAlert(
		({ message }: { message: string }) => message,
		({ type, actions }: { type: Record<string, any>; actions: any[] }) => ({
			...type,
			actions,
			duration: 3000,
		}),
	);
	const registrationForm = useForm<SignUpData>({
		resolver: zodResolver(signUpSchema),
		shouldFocusError: false,
	});

	const onRegister = async (data: SignUpData) => {
		try {
			const { fullName, username, phoneNumber, email, password } = data;
			const user = await Parse.User.signUp(username, password, {
				fullName,
				email,
				phoneNumber,
			});

			if (user) {
				showAlert({
					message: i18n.t(
						"Registration successful. Check your email to verify your account.",
					),
					type: { success: true, permanent: true },
				});
				registrationForm.reset();
				onClose();
				refresh();
				navigate("/");
			}
		} catch (error: any) {
			showAlert({
				message: error.message,
				type: { critical: true },
			});
			await new Promise((resolve) => setTimeout(resolve, 5000));
			hideAlert();
		}
	};

	return (
		<Modal position="middle" hide={hide}>
			<ModalTitle>
				{i18n.t("Register to Analytics Messaging Service")}
			</ModalTitle>
			<ModalContent>
				<FormProvider {...registrationForm}>
					<RHFDHIS2FormField
						className="pt-8"
						name="fullName"
						label={i18n.t("Full Name")}
						valueType="TEXT"
						component={InputField}
						required
					/>
					<RHFDHIS2FormField
						className="pt-8"
						name="username"
						label={i18n.t("Username")}
						valueType="TEXT"
						component={InputField}
						required
					/>
					<RHFDHIS2FormField
						className="pt-8"
						name="phoneNumber"
						label={i18n.t("Phone Number")}
						valueType="PHONE_NUMBER"
						component={InputField}
					/>
					<RHFDHIS2FormField
						className="pt-8"
						name="email"
						label={i18n.t("Email")}
						valueType="EMAIL"
						component={InputField}
						required
					/>
					<RHFDHIS2FormField
						className="pt-8"
						name="password"
						label={i18n.t("Password")}
						component={InputField}
						valueType="TEXT"
						type="password"
						required
					/>
					<RHFDHIS2FormField
						className="pt-8"
						name="consent"
						label={i18n.t(
							"I have read and consent to the privacy policy",
						)}
						component={InputField}
						type="checkbox"
						valueType="TRUE_ONLY"
						required
					/>
				</FormProvider>
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={onClose}>{i18n.t("Cancel")}</Button>
					<Button
						type="submit"
						primary
						loading={registrationForm.formState.isSubmitting}
						onClick={() =>
							registrationForm.handleSubmit(onRegister)()
						}
					>
						{i18n.t("Register")}
					</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
