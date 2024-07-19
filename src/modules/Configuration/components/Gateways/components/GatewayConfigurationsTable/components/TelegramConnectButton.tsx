import React, { useMemo } from "react";
import { useAlert } from "@dhis2/app-runtime";
import { io } from "socket.io-client";
import i18n from "@dhis2/d2-i18n";
import { Button, IconLink24 } from "@dhis2/ui";
import Parse from "parse";
import { useMutation } from "@tanstack/react-query";

export function TelegramConnectButton({ gateway }: { gateway: Parse.Object }) {
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);

	const sessionId = useMemo(() => {
		return gateway.get("sessionId") as string;
	}, []);

	const setupWebsocket = async () => {
		return new Promise<null>((resolve, reject) => {
			const token = sessionId;
			const user = Parse.User.current();
			const url = `${process.env.REACT_APP_SAAS_BASE_URL}channels/telegram/socket.io/${token}/init`;
			const socket = io(url, {
				path: `${
					new URL(process.env.REACT_APP_SAAS_BASE_URL!).pathname
				}/channels/telegram/socket.io`,
				extraHeaders: {
					"X-Parse-Session-Token": user!.getSessionToken()!,
					"X-Parse-Application-Id":
						process.env.REACT_APP_SAAS_APP_ID!,
				},
				query: {
					name: gateway.get("name"),
					session: token,
					phoneNumber: gateway.get("phoneNumber"),
				},
				reconnectionAttempts: 5,
				retries: 5,
				upgrade: true,
			});
			const onConnect = () => {
				console.log("Client connected!");
			};

			const onSuccess = () => {
				socket.close();
				resolve(null);
			};

			const onError = (error: Error) => {
				show({ message: error.message, type: { critical: true } });
				reject(error);
			};

			const onConnectionError = () => {
				reject(new Error(i18n.t("Could not connect to the server")));
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
				socket.on("success", onSuccess);
				socket.on("error", onError);
			} catch (error) {
				socket.close();
				reject(new Error(i18n.t("Could not connect to telegram")));
			}
		});
	};
	const onConnect = async () => {
		return setupWebsocket();
	};

	const { isLoading, mutate } = useMutation({
		mutationKey: [sessionId],
		mutationFn: onConnect,
		onSuccess: () => {
			show({
				message: i18n.t("Telegram session connected successfully"),
				type: { success: true },
			});
		},
		onError: (error) => {
			if (error instanceof Error) {
				show({ message: error.message, type: { critical: true } });
			}
		},
	});

	return (
		<>
			<Button
				loading={isLoading}
				onClick={() => {
					mutate();
				}}
				icon={<IconLink24 />}
			/>
		</>
	);
}
