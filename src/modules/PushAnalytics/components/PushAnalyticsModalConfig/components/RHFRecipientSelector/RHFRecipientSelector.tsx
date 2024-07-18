import i18n from "@dhis2/d2-i18n";
import { Button, Field } from "@dhis2/ui";
import { RHFSingleSelectField } from "@hisptz/dhis2-ui";
import { filter, uniqBy } from "lodash";
import React, { useCallback } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useUpdateEffect } from "usehooks-ts";
import { ContactChip } from "../../../../../../shared/components/ContactChip";
import {
	Contact,
	ContactType,
	ToContactFormSchema,
} from "../../../../../../shared/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRecipientOptions } from "../../hooks/recipientOptions";
import { PhoneNumber } from "./components/PhoneNumber";
import { Group } from "./components/Group/Group";

export interface RHFRecipientSelectorProps {
	name: string;
	validations?: Record<string, any>;
	label: string;
	required?: boolean;
}

export type RecipientData = Omit<Contact, "type"> & {
	type:
		| "whatsappPhoneNumber"
		| "whatsappGroup"
		| "telegramPhoneNumber"
		| "telegramGroup"
		| "user";
};

function AddRecipient({
	onChange,
}: {
	loading?: boolean;
	onChange: (recipient: Contact) => void;
}) {
	const recipientOptions = useRecipientOptions();
	const form = useForm<RecipientData>({
		reValidateMode: "onBlur",
		mode: "onBlur",
		shouldFocusError: false,
		resolver: zodResolver(ToContactFormSchema),
	});

	const [type] = form.watch(["type"]);

	const onSubmit = useCallback(
		(data: RecipientData) => {
			onChange({
				channel: data.type.includes("whatsapp")
					? "whatsapp"
					: "telegram",
				identifier: data.identifier,
				type: data.type.includes("group")
					? ContactType.GROUP
					: ContactType.INDIVIDUAL,
			});
			form.reset({});
		},
		[form, onChange],
	);

	useUpdateEffect(() => {
		form.unregister("identifier");
		form.clearErrors("identifier");
		form.resetField("identifier");
	}, [type]);

	return (
		<Field label={i18n.t("Add new recipient")} helpText="">
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "2fr 3fr 1fr",
					gap: 16,
					alignItems: "end",
				}}
			>
				<FormProvider {...form}>
					<RHFSingleSelectField
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
					<Button onClick={() => form.handleSubmit(onSubmit)()}>
						{i18n.t("Add")}
					</Button>
				</FormProvider>
			</div>
		</Field>
	);
}

export function RHFRecipientSelector({
	validations,
	name,
	label,
	required,
}: RHFRecipientSelectorProps) {
	return (
		<Controller
			rules={validations}
			render={({ field }) => {
				const recipients = field.value ?? [];
				return (
					<Field required={required} label={label}>
						<div className="column gap-16">
							<div
								style={{ flexWrap: "wrap", gap: 8 }}
								className="row"
							>
								{recipients.map(
									({
										type,
										identifier,
										channel,
									}: Contact) => (
										<ContactChip
											channel={channel}
											key={`${identifier}-recipient`}
											onRemove={() => {
												field.onChange(
													filter(
														recipients,
														(recipient) =>
															identifier !==
															recipient.identifier,
													),
												);
											}}
											identifier={identifier}
											type={type}
										/>
									),
								)}
							</div>
							<AddRecipient
								onChange={(contact) => {
									field.onChange(
										uniqBy(
											[...recipients, contact],
											"identifier",
										),
									);
								}}
							/>
						</div>
					</Field>
				);
			}}
			name={name}
		/>
	);
}
