import React, { useCallback } from "react";
import i18n from "@dhis2/d2-i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
	Button,
	ButtonStrip,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import { z } from "zod";
import { RHFDescription } from "../../RHFDescription";
import { PushDashboardConfiguration, SaveButton } from "./SaveButton";
import { DashboardSelector } from "./RHFDashboardSelector";

export const DashboardSchema = z.object({
	dashboard: z.string(),
	description: z.string().optional(),
});

export type DashboardData = z.infer<typeof DashboardSchema>;

interface DashboardSelectorModalProps {
	hidden: boolean;
	onClose: (dashboard?: PushDashboardConfiguration) => void;
}

export function DashboardSelectorModal({
	hidden,
	onClose,
}: DashboardSelectorModalProps) {
	const form = useForm<DashboardData>({
		reValidateMode: "onBlur",
		mode: "onBlur",
		shouldFocusError: false,
		resolver: zodResolver(DashboardSchema),
	});

	const onSubmit = useCallback(
		(data: PushDashboardConfiguration) => {
			onClose(data);
			form.reset();
		},
		[onClose],
	);

	return (
		<FormProvider {...form}>
			<Modal
				small
				position="middle"
				onClose={() => onClose()}
				hide={hidden}
			>
				<ModalTitle>{i18n.t("Select dashboard")}</ModalTitle>
				<ModalContent>
					<div className="column gap-16">
						<DashboardSelector />
						<RHFDescription
							label={i18n.t("Description")}
							name="description"
						/>
					</div>
				</ModalContent>

				<ModalActions>
					<ButtonStrip>
						<Button secondary onClick={() => onClose()}>
							{i18n.t("Cancel")}
						</Button>
						<SaveButton onClose={onClose} />
					</ButtonStrip>
				</ModalActions>
			</Modal>
		</FormProvider>
	);
}
