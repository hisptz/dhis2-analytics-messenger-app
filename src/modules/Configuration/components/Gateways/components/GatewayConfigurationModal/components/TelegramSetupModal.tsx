import React from "react";
import { useAlert } from "@dhis2/app-runtime";
import { io } from "socket.io-client";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import Parse from "parse";
import { useFormContext, useWatch } from "react-hook-form";
import { GatewayConfigFormData } from "../index";

export function TelegramSetupButton({
	onComplete,
}: {
	onComplete: () => void;
}) {
	const { handleSubmit } = useFormContext<GatewayConfigFormData>();
	const sessionId = useWatch({
		name: "sessionId",
	});
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);

	const setupWebsocket = (data: GatewayConfigFormData) => {
		const token = sessionId;
		const user = Parse.User.current();
		const url = `${process.env.REACT_APP_SAAS_BASE_URL}channels/telegram/socket.io/${token}/init`;
		const socket = io(url, {
			path: "/dam/core/api/channels/telegram/socket.io",
			extraHeaders: {
				"X-Parse-Session-Token": user!.getSessionToken()!,
				"X-Parse-Application-Id": process.env.REACT_APP_SAAS_APP_ID!,
			},
			query: {
				name: data.name,
				session: token,
				phoneNumber: data.phoneNumber,
			},
			reconnectionAttempts: 5,
			retries: 5,
			upgrade: true,
		});
		const onConnect = () => {
			console.log("Client connected!");
		};

		const onSuccess = () => {
			show({
				message: i18n.t("Telegram session connected successfully"),
				type: { success: true },
			});
			onComplete();
		};

		const onError = (error: Error) => {
			show({ message: error.message, type: { critical: true } });
		};

		const onConnectionError = () => {
			show({
				message: i18n.t("Could not connect to the server"),
				type: { critical: true },
			});
		};

		try {
			socket.on("connect_error", onConnectionError);
			socket.on("connect", onConnect);
			socket.on("getPhoneCode", (value, callback) => {
				const code = window.prompt(
					"Enter the login code you've received from telegram",
				);
				if (code) {
					callback(code);
				} else {
					socket.disconnect();
					throw "Invalid code";
				}
			});
			socket.on("success", () => {
				socket.disconnect();
				show({
					message: i18n.t("Telegram connected successfully"),
					type: { success: true },
				});
				onComplete();
			});
			socket.on("error", onError);
		} catch (error) {
			show({
				message: i18n.t("Could not connect to telegram"),
				type: { critical: true },
			});
			socket.close();
		}

		return () => {
			socket.off("connect", onConnect);
			socket.off("success", onSuccess);
			socket.off("error", onError);
			socket.off("connect_error", onConnectionError);
			socket.close();
		};
	};

	const onConnect = async (data: GatewayConfigFormData) => {
		try {
			setupWebsocket(data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<Button onClick={() => handleSubmit(onConnect)()} primary>
				{i18n.t("Connect to Telegram")}
			</Button>
		</>
	);
}
