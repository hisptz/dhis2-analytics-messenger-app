import {
	Button,
	ButtonStrip,
	CircularLoader,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRefetchGateways } from "../../../hooks/data";
import Parse from "parse";

export interface WhatsAppConnectModalProps {
	hide: boolean;
	onClose: () => void;
	gateway: Parse.Object;
}

interface QRCodePayload {
	base64Image: string;
	urlCode: string;
}

export function WhatsAppConnectModal({
	hide,
	onClose,
	gateway,
}: WhatsAppConnectModalProps) {
	const sessionId = useMemo(() => {
		return gateway.get("sessionId") as string;
	}, []);

	const refetch = useRefetchGateways();
	const user = Parse.User.current();

	async function getQR() {
		const url = `${
			process.env.REACT_APP_SAAS_BASE_URL
		}/channels/whatsapp/sessions/${sessionId}/qrCode`;
		const response = await fetch(url, {
			headers: {
				"X-Parse-Session-Token": user!.getSessionToken()!,
				"X-Parse-Application-Id": process.env.REACT_APP_SAAS_APP_ID!,
			},
		});
		if (response.status === 200) {
			return (await response.json()) as {
				qrCode: QRCodePayload;
			};
		} else {
			let error;
			try {
				const errorMessage = (await response.json()) as {
					message: string;
				};
				error = new Error(errorMessage.message);
			} catch (e) {
				error = new Error("Could not contact the server");
			}
			throw error;
		}
	}

	const { data, isLoading, isError, error } = useQuery({
		queryKey: [sessionId],
		queryFn: getQR,
	});

	return (
		<Modal hide={hide}>
			<ModalTitle>{i18n.t("Connect to WhatsApp")}</ModalTitle>
			<ModalContent>
				{isLoading && <CircularLoader small />}
				{isError && <div>{error!.toString()}</div>}
				{data && !error ? (
					<div className="w-100 h-100">
						<p>
							{i18n.t(
								"Scan the QR code below with your WhatsApp mobile account",
							)}
						</p>
						<div
							style={{
								width: "100%",
								height: "100%",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								padding: 16,
							}}
						>
							<img
								height={300}
								width={300}
								src={data.qrCode?.base64Image}
								alt="QR Code Code"
							/>
						</div>
					</div>
				) : null}
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={onClose}>{i18n.t("Cancel")}</Button>
					<Button
						onClick={() => {
							refetch();
							onClose();
						}}
					>
						{i18n.t("Done")}
					</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
