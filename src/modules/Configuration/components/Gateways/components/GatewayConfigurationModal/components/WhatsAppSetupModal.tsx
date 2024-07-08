import React, { useEffect, useState } from "react";
import { useAlert } from "@dhis2/app-runtime";
import { io } from "socket.io-client";
import i18n from "@dhis2/d2-i18n";
import {
	Button,
	ButtonStrip,
	CircularLoader,
	LinearLoader,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import Parse from "parse";
import { useBoolean } from "usehooks-ts";
import { useFormContext, useWatch } from "react-hook-form";

export interface WhatsAppSetupModalProps {
	onClose: () => void;
	hide: boolean;
	onComplete: () => void;
	sessionId: string;
}

export function WhatsAppSetup({
	sessionId,
	onComplete,
}: {
	sessionId: string;
	onComplete: () => void;
}) {
	const name = useWatch({
		name: "name",
	});
	const [qrCode, setQrCode] = useState<string | undefined>();
	const [error, setError] = useState<unknown>();
	const [loadingStatus, setLoadingStatus] = useState<
		{ percentage: number; message: string } | undefined
	>();
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({
			...type,
			duration: 3000,
		}),
	);
	const setupWebsocket = () => {
		const token = sessionId;
		const user = Parse.User.current();
		const url = `${process.env.REACT_APP_SAAS_BASE_URL}channels/whatsapp/socket.io/${token}/init`;
		const socket = io(url, {
			path: "/dam/core/api/channels/whatsapp/socket.io",
			extraHeaders: {
				"X-Parse-Session-Token": user!.getSessionToken()!,
				"X-Parse-Application-Id": process.env.REACT_APP_SAAS_APP_ID!,
			},
			query: {
				name,
				session: token,
			},
			reconnectionAttempts: 5,
			retries: 5,
			upgrade: true,
		});

		const onConnect = () => {
			console.log("Client connected!");
		};

		const onQRCode = (qrCode: string) => {
			setQrCode(qrCode);
		};
		const onSuccess = () => {
			show({
				message: i18n.t("WhatsApp session connected successfully"),
				type: { success: true },
			});
			onComplete();
		};

		const onError = (error: Error) => {
			setError(error);
		};

		const onLoading = (loadingStatus: any) => {
			console.log(loadingStatus);
			setLoadingStatus(loadingStatus);
		};

		const onDisconnect = () => {
			setError("Disconnected from the server");
		};

		const onConnectionError = () => {
			setError("Could not connect to the server");
		};

		try {
			socket.on("connect_error", onConnectionError);
			socket.on("connect", onConnect);
			socket.on("qrCode", onQRCode);
			socket.on("success", onSuccess);
			socket.on("loading", onLoading);
			socket.on("error", onError);
			socket.on("disconnect", onDisconnect);
		} catch (error) {
			show({
				message: i18n.t("Could not connect to telegram"),
				type: { critical: true },
			});
			socket.close();
		}

		return () => {
			socket.off("connect", onConnect);
			socket.off("loading", onLoading);
			socket.off("qrCode", onQRCode);
			socket.off("success", onSuccess);
			socket.off("error", onError);
			socket.off("disconnect", onDisconnect);
			socket.off("connect_error", onConnectionError);
			socket.close();
		};
	};

	useEffect(() => {
		return setupWebsocket();
	}, []);

	return (
		<div
			style={{
				minWidth: 400,
				minHeight: 400,
				padding: 16,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{loadingStatus && !qrCode ? (
				<div>
					<LinearLoader amount={loadingStatus.percentage} />
					<span>{loadingStatus.message}</span>
				</div>
			) : null}
			{!qrCode && !loadingStatus && <CircularLoader small />}
			{!!error && <div>{error.toString()}</div>}
			{qrCode && !error ? (
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
							src={qrCode}
							alt="QR Code Code"
						/>
					</div>
				</div>
			) : null}
		</div>
	);
}

export function WhatsAppSetupModal({
	onClose,
	onComplete,
	hide,
	sessionId,
}: WhatsAppSetupModalProps) {
	return (
		<Modal position="middle" hide={hide}>
			<ModalTitle>{i18n.t("Setup WhatsApp")}</ModalTitle>
			<ModalContent>
				<WhatsAppSetup sessionId={sessionId} onComplete={onComplete} />
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={onClose}>{i18n.t("Cancel")}</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}

export function WhatsAppSetupButton({
	onComplete,
}: {
	onComplete: () => void;
}) {
	const { trigger } = useFormContext();
	const sessionId = useWatch({
		name: "sessionId",
	});

	const {
		value: hide,
		setTrue: onClose,
		setFalse: onOpen,
	} = useBoolean(true);

	const onDone = () => {
		onClose();
		onComplete();
	};

	const onConnect = async () => {
		try {
			if (await trigger()) {
				onOpen();
			} else {
				console.error("Form has errors");
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{!hide && (
				<WhatsAppSetupModal
					onClose={onClose}
					hide={hide}
					onComplete={onDone}
					sessionId={sessionId}
				/>
			)}
			<Button onClick={onConnect} primary>
				{i18n.t("Connect to WhatsApp")}
			</Button>
		</>
	);
}
