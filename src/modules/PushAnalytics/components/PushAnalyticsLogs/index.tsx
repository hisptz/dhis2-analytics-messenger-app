import React from "react";
import i18n from "@dhis2/d2-i18n";
import {
	Button,
	ButtonStrip,
	Divider,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import { useJobStatus } from "../PushAnalyticsTable/components/JobStatus/hooks/data";
import { AnalyticsLog } from "./components/AnalyticsLog";

interface PushAnalyticsLogsProps {
	onClose: () => void;
	hidden: boolean;
	config: Parse.Object;
}

export function PushAnalyticsLogs({
	onClose,
	hidden,
	config,
}: PushAnalyticsLogsProps) {
	const { allStatus, isLoading } = useJobStatus(config.id);

	console.log(allStatus);

	return (
		<Modal position="middle" onClose={onClose} hide={hidden}>
			<ModalTitle>
				{i18n.t("Logs for {{name}}", { name: config.get("name") })}
			</ModalTitle>
			<ModalContent>
				{isLoading ? (
					<div></div>
				) : (
					allStatus.map((status, index) => (
						<div className="pt-8">
							<AnalyticsLog key={index} analyticsLogs={status} />
							{index < allStatus.length - 1 && <Divider />}
						</div>
					))
				)}
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={onClose}>{i18n.t("Hide")}</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
