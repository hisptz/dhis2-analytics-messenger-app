import i18n from "@dhis2/d2-i18n";
import { Button, Field, Help } from "@dhis2/ui";
import { filter, uniqBy } from "lodash";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { ContactChip } from "../../../../../../shared/components/ContactChip";
import { Contact } from "../../../../../../shared/interfaces";
import { RecipientSelectorModalConfig } from "../RecipientSelectorModal/RecipientSelectorModal";

export interface RHFRecipientSelectorProps {
	name: string;
	validations?: Record<string, any>;
	label: string;
	required?: boolean;
}

export function RHFRecipientSelector({
	validations,
	name,
	label,
	required,
}: RHFRecipientSelectorProps) {
	const [showSelector, setShowSelector] = useState(false);

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
								{!recipients.length ? (
									<Help>
										{i18n.t(
											"There are no selected recipients.",
										)}
									</Help>
								) : (
									recipients.map(
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
									)
								)}
							</div>
							<div style={{ maxWidth: "40%" }}>
								<Button
									onClick={() => {
										setShowSelector(true);
									}}
								>
									{i18n.t("Add Recipient")}
								</Button>
							</div>
							{showSelector && (
								<RecipientSelectorModalConfig
									hidden={!showSelector}
									onClose={(contact?: Contact) => {
										if (contact) {
											field.onChange(
												uniqBy(
													[...recipients, contact],
													(recipient) =>
														recipient.identifier ===
															contact.identifier &&
														recipient.gatewayId ===
															contact.gatewayId,
												),
											);
										}
										setShowSelector(false);
									}}
								/>
							)}
						</div>
					</Field>
				);
			}}
			name={name}
		/>
	);
}
