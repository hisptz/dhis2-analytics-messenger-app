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
									recipients.map((contact: Contact) => (
										<ContactChip
											key={`${contact.gatewayId}-${contact.identifier}`}
											contact={contact}
											onRemove={() => {
												const updatedList = filter(
													recipients,
													(recipient) =>
														!(
															recipient.identifier ===
																contact.identifier &&
															recipient.gatewayId ===
																contact.gatewayId
														),
												);

												field.onChange(updatedList);
											}}
										/>
									))
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
														`${recipient.gatewayId}.${recipient.identifier}`,
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
