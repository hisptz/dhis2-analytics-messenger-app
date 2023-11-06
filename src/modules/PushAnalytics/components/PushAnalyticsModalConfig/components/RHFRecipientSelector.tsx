import i18n from "@dhis2/d2-i18n";
import { Button, Field } from "@dhis2/ui";
import { RHFSingleSelectField, RHFTextInputField } from "@hisptz/dhis2-ui";
import { filter, uniqBy } from "lodash";
import React, { useCallback } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useUpdateEffect } from "usehooks-ts";
import { ContactChip } from "../../../../../shared/components/ContactChip";
import { useDHIS2Users } from "../../../../../shared/hooks/users";
import { useWhatsappData } from "../../../../../shared/hooks/whatsapp";
import { Contact, contactSchema } from "../../../../../shared/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";

export interface RHFRecipientSelectorProps {
	name: string;
	validations?: Record<string, any>;
	label: string;
	required?: boolean;
}

function AddRecipient({
	onChange,
}: {
	loading?: boolean;
	onChange: (recipient: Contact) => void;
}) {
	const { groups, loading } = useWhatsappData();
	const { users, loading: usersLoading } = useDHIS2Users();
	const form = useForm<
		Omit<Contact, "type"> & { type: "user" | "individual" | "group" }
	>({
		defaultValues: {
			type: "individual",
			clientType: "whatsapp,
		},
		reValidateMode: "onBlur",
		mode: "onBlur",
		shouldFocusError: false,
		resolver: zodResolver(contactSchema,
	});

	const [type] = form.watch(["type"]);

	const onSubmit = useCallback(
		(
			data: Omit<Contact, "type"> & {
				type: "user" | "individual" | "group";
			}
		) => {
			onChange({
				...data,
				type:
					data.type === "user"
						? "individual"
						: (data.type as "group" | "individual")
			});
			form.reset({
				clientType: "whatsapp"
			});
		},
		[form, onChange]
	);

	useUpdateEffect(() => {
		form.unregister("identifier");
		form.clearErrors("identifier");
		form.resetField("identifier");
	}, [type]);

	return (
		<Field
			label={i18n.t("Add new recipient")}
			helpText={
				type === "individual"
					? i18n.t(
							"Start with country code without the + sign. Example 255XXXXXXXXX"
					  )
					: type === "user"
					? i18n.t("Only users with whatsApp contacts will be listed")
					: i18n.t(
							"Only groups within which your whatsapp contact is in will be listed"
					  )
			}
		>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "2fr 3fr 1fr",
					gap: 16,
					alignItems: "end"
				}}
			>
				<FormProvider {...form}>
					<RHFSingleSelectField
						label={i18n.t("Type")}
						options={[
							{
								label: i18n.t("Group"),
								value: "group"
							},
							{
								label: i18n.t("Phone Number"),
								value: "individual"
							},
							{
								label: i18n.t("Users"),
								value: "user"
							}
						]}
						name={"type"}
					/>
					{type === "group" && (
						<RHFSingleSelectField
							loading={loading}
							label={i18n.t("Group")}
							options={groups.map((group) => ({
								value: group.id,
								label: group.name
							}))}
							name={"identifier"}
						/>
					)}
					{type === "user" && (
						<RHFSingleSelectField
							loading={usersLoading}
							label={i18n.t("User")}
							options={users.map((user: any) => ({
								value: user.whatsApp,
								label: user.displayName
							}))}
							name={"identifier"}
						/>
					)}
					{type === "individual" && (
						<RHFTextInputField
							placeholder={"255XXXXXXXXX"}
							validations={{
								pattern: {
									value: /^\d{1,3}\d{9}$/,
									message: i18n.t("Invalid phone number")
								}
							}}
							label={i18n.t("Number")}
							name={"identifier"}
						/>
					)}
					<Button onClick={form.handleSubmit(onSubmit)}>
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
	required
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
										clientType
									}: Contact) => (
										<ContactChip
											clientType={clientType}
											key={`${identifier}-recipient`}
											onRemove={() => {
												field.onChange(
													filter(
														recipients,
														(recipient) =>
															identifier !==
															recipient.identifier
													)
												);
											}}
											identifier={identifier}
											type={type}
										/>
									)
								)}
							</div>
							<AddRecipient
								onChange={(contact) => {
									field.onChange(
										uniqBy(
											[...recipients, contact],
											"identifier"
										)
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
