import { Button, FlyoutMenu, IconMore24, MenuItem, Popover } from "@dhis2/ui";
import React, { useState } from "react";
import { TableAction } from "../interfaces";

export function ActionButton({
	actions,
	row,
}: {
	actions?: TableAction[];
	row: any;
}) {
	const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

	return (
		<>
			<Button
				style={{
					padding: 2,
				}}
				onClick={(_, event) => {
					event.stopPropagation();
					event.preventDefault();
					setButtonRef(event.target);
				}}
				icon={<IconMore24 />}
			/>
			{buttonRef && (
				<Popover
					onClickOutside={() => setButtonRef(null)}
					reference={buttonRef}
				>
					<FlyoutMenu dense>
						{actions?.map((action) => (
							<MenuItem
								suffix={<div />}
								onClick={() => {
									setButtonRef(null);
									action.onClick(row);
								}}
								key={`${action.key}-menu-item`}
								icon={action.icon}
								label={action.label}
							/>
						))}
					</FlyoutMenu>
				</Popover>
			)}
		</>
	);
}
