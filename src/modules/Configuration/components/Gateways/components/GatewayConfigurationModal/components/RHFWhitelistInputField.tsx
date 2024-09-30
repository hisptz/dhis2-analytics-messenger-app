import { Button, Chip, colors, Field, InputField } from "@dhis2/ui";
import React, { useState } from "react";
import { useController, useWatch } from "react-hook-form";
import i18n from "@dhis2/d2-i18n";
import { isEmpty, uniq } from "lodash";
import { GatewayConfigFormData } from "../index";

export interface RHFWhitelistInputFieldProps {}

export function RHFWhitelistInputField() {
	const [inputFieldState, setInputFieldState] = useState<string | null>(null);
	const { fieldState, field } = useController({
		name: "whitelist",
	});

	const enableChatbot = useWatch<GatewayConfigFormData>({
		name: "enableChatbot",
	});

	if (!enableChatbot) return null;

	return (
		<Field
			error={!!fieldState.error}
			validationText={fieldState.error?.message}
			name="whitelist"
			label={i18n.t("Contacts to whitelist")}
		>
			<div className="column gap-8">
				<div className="row gap-8">
					{field.value?.map((value: string) => (
						<Chip
							onRemove={() => {
								const updatedList = field.value?.filter(
									(val: string) => val !== value,
								);
								field.onChange(updatedList);
							}}
							key={value}
						>
							{value}
						</Chip>
					))}
					{isEmpty(field.value) && (
						<span style={{ fontSize: 12, color: colors.grey700 }}>
							{i18n.t(
								"The are no configured whitelist contacts. This means the enabled chatbot will work for all individual contacts.",
							)}
						</span>
					)}
				</div>
				<div className="row gap-8">
					<div className="flex-1">
						<InputField
							placeholder={i18n.t(
								"Enter a phone number or username and click add",
							)}
							value={inputFieldState ?? undefined}
							onChange={({ value }) =>
								setInputFieldState(value ?? null)
							}
						/>
					</div>
					<Button
						onClick={() => {
							const newValue = [
								...(field.value ?? []),
								inputFieldState,
							];
							field.onChange(uniq(newValue));
							setInputFieldState(null);
						}}
					>
						{i18n.t("Add")}
					</Button>
				</div>
			</div>
		</Field>
	);
}
