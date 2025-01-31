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
import { RHFGroupSelector } from "../../RHFGroupSelector";
import { RHFVisSelector } from "../../RHFVisSelector";
import { RHFDescription } from "../../RHFDescription";
import { PushVisualizationConfiguration, SaveButton } from "./SaveButton";

export const VisualizationSchema = z.object({
	visualizationGroup: z.string(),
	visualization: z.string(),
	description: z.string().optional(),
});

export type VisualizationData = z.infer<typeof VisualizationSchema>;

interface VisualizationSelectorModalProps {
	hidden: boolean;
	onClose: (visualization?: PushVisualizationConfiguration) => void;
}
export function VisualizationSelectorModal({
	hidden,
	onClose,
}: VisualizationSelectorModalProps) {
	const form = useForm<VisualizationData>({
		reValidateMode: "onBlur",
		mode: "onBlur",
		shouldFocusError: false,
		resolver: zodResolver(VisualizationSchema),
	});

	const onSubmit = useCallback(
		(data: PushVisualizationConfiguration) => {
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
				<ModalTitle>{i18n.t("Select visualizations")}</ModalTitle>
				<ModalContent>
					<div className="column gap-16">
						<RHFGroupSelector
							required
							name="visualizationGroup"
							label={i18n.t("Visualization group")}
						/>
						<RHFVisSelector
							required
							name="visualization"
							label={i18n.t("Visualization")}
						/>
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
