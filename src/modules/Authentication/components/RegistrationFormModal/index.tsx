import React, { useState } from "react";
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
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RHFDHIS2FormField } from "@hisptz/dhis2-ui";

const signUpSchema = z.object({
	fullName: z
		.string()
		.refine(
			(value) => value.includes(" "),
			"A space is required between your first and last name",
		),
	username: z.string().min(4, "Username should have at least 4 characters"),
	phoneNumber: z.string().optional(),
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
	const registrationForm = useForm<SignUpData>({
		resolver: zodResolver(signUpSchema),
		shouldFocusError: false,
	});

	const onRegister = (data: SignUpData) => {
		console.log("Connecting...", data);
		onClose();
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
						onClick={registrationForm.handleSubmit(onRegister)}
					>
						{i18n.t("Register")}
					</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
