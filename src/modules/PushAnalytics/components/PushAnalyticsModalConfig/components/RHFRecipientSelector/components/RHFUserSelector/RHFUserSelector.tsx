import React, { useRef } from "react";
import {
	Button,
	IconCross24,
	InputField,
	Menu,
	MenuItem,
	Popover,
} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { useSearchUser } from "./hooks/data";
import { useController } from "react-hook-form";
import { RecipientData } from "../../../RecipientSelectorModal/RecipientSelectorModal";
import { get, isEmpty } from "lodash";
import classes from "./RHFUserSelector.module.css";
import { useSelectedRecipientGateway } from "../../../../hooks/gatewayChanelOptions";

export function UserSelector() {
	const gateway = useSelectedRecipientGateway();
	const { field } = useController<RecipientData>({
		name: "identifier",
	});

	const channel = gateway?.channel;
	const ref = useRef<HTMLDivElement>(null);
	const { keyword, setKeyword, onChange, results, loading } = useSearchUser();
	return (
		<>
			<div
				style={{ alignItems: "center" }}
				className="row gap-8 "
				ref={ref}
			>
				<div className="flex-1">
					<InputField
						helpText={i18n.t(
							"Only users with {{channel}} contacts configured will appear",
							{ channel },
						)}
						loading={loading}
						value={keyword ?? undefined}
						onChange={onChange}
						placeholder={i18n.t("Search for username, name, or id")}
						label={i18n.t("User")}
						disabled={!!field.value}
					/>
				</div>
				{!!field.value && (
					<Button
						icon={<IconCross24 />}
						onClick={() => {
							field.onChange(null);
							setKeyword(null);
						}}
					/>
				)}
			</div>
			{Array.isArray(results) && !field.value && !!keyword ? (
				<Popover
					onClickOutside={() => {
						setKeyword(null);
					}}
					className={classes}
					placement="bottom"
					reference={ref}
				>
					{isEmpty(results) ? (
						<span>
							{i18n.t(
								"Could not find any user with name or username {{keyword}}",
								{ keyword },
							)}
						</span>
					) : (
						<Menu>
							{results.map((item) => (
								<MenuItem
									onClick={() => {
										const key =
											gateway?.channel == "whatsapp"
												? "whatsApp"
												: gateway?.channel;
										if (key) {
											const identifier = get(item, key);
											field.onChange(identifier);
											setKeyword(item.displayName);
										}
									}}
									key={`${item.id}`}
									label={item.displayName}
								/>
							))}
						</Menu>
					)}
				</Popover>
			) : null}
		</>
	);
}
