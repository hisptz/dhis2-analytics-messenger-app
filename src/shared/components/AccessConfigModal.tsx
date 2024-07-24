import React from "react";
import i18n from "@dhis2/d2-i18n";
import { FormProvider } from "react-hook-form";
import {
	Button,
	ButtonStrip,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import { useManageDHIS2Config } from "../hooks/saveDHIS2Config";
import { AccessConfigForm } from "./AccessConfigForm";

export interface AccessConfigModalProps {
	hide: boolean;
	onClose: () => void;
}

export function AccessConfigModal({ hide, onClose }: AccessConfigModalProps) {
	const { form, onSave } = useManageDHIS2Config({ onClose });
	const loading = form.formState.isSubmitting || form.formState.isValidating;

	return (
		<FormProvider {...form}>
			<Modal position="middle" hide={hide}>
				<ModalTitle>{i18n.t("DHIS2 Access Config")}</ModalTitle>
				<ModalContent>
					<AccessConfigForm editable form={form} />
				</ModalContent>
				<ModalActions>
					<ButtonStrip>
						<Button
							loading={loading}
							primary
							onClick={() => form.handleSubmit(onSave)()}
						>
							{loading ? i18n.t("Saving...") : i18n.t("Save")}
						</Button>
					</ButtonStrip>
				</ModalActions>
			</Modal>
		</FormProvider>
	);
}
