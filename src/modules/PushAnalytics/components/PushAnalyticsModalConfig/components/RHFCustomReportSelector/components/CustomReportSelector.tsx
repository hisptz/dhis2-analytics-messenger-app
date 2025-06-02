import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
	Button,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { RHFDescription } from "../../RHFDescription";
import { CustomReportSelector } from "./RHFCustomReportSelector";

export const CustomReportSchema = z.object({
	id: z.string(),
	customReport: z.string(),
	type: z.enum(["visualization", "map", "customReport"]),
	description: z.string().optional(),
});

export type CustomReportData = z.infer<typeof CustomReportSchema>;

interface CustomReportSelectorProps {
	hidden: boolean;
	onClose: (customReport?: CustomReportData) => void;
}

export function CustomReportSelectorModal({
	hidden,
	onClose,
}: CustomReportSelectorProps) {
	const form = useForm<CustomReportData>({
		reValidateMode: "onBlur",
		mode: "onBlur",
		shouldFocusError: false,
		resolver: zodResolver(CustomReportSchema),
	});

	return (
		<FormProvider {...form}>
			<Modal
				small
				position="middle"
				onClose={() => onClose()}
				hide={hidden}
			>
				<ModalTitle>{i18n.t("Select custom report")}</ModalTitle>
				<ModalContent>
					<div className="column gap-16">
						<CustomReportSelector />
						<RHFDescription
							label={i18n.t("Description")}
							name="description"
						/>
					</div>
				</ModalContent>
				<ModalActions>
					<Button secondary onClick={() => onClose()}>
						{i18n.t("Cancel")}
					</Button>
					<Button
						primary
						onClick={() =>
							onClose({
								id: form.getValues("customReport"),
								type: "customReport",
								customReport: form.getValues("customReport"),
								description: form.getValues("description"),
							})
						}
					>
						{i18n.t("Add")}
					</Button>
				</ModalActions>
			</Modal>
		</FormProvider>
	);
}
