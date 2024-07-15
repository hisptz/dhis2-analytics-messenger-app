import { z } from "zod";
import { useForm } from "react-hook-form";
import Parse from "parse";
import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { zodResolver } from "@hookform/resolvers/zod";

const userDataSchema = z.object({
	username: z.string(),
	email: z.string().email(),
	phoneNumber: z.string(),
	fullName: z.string(),
});

export type UserData = z.infer<typeof userDataSchema>;

export function useManageUser({ onComplete }: { onComplete: () => void }) {
	const user = Parse.User.current();
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);
	const form = useForm<UserData>({
		resolver: zodResolver(userDataSchema),
		defaultValues: {
			username: user?.getUsername(),
			fullName: user?.get("fullName"),
			phoneNumber: user?.get("phoneNumber"),
			email: user?.getEmail(),
		},
	});

	const onSave = async (data: UserData) => {
		try {
			if (!user) return;
			user.setEmail(data.email);
			user.setUsername(data.username);
			user.set("fullName", data.fullName);
			user.set("phoneNumber", data.phoneNumber);
			await user.save();
			show({
				message: i18n.t("Profile changed successfully"),
				type: { success: true },
			});
			onComplete();
		} catch (e) {
			if (e instanceof Parse.Error) {
				show({
					message: `${i18n.t("Could not update the profile")}: ${
						e.message
					}`,
					type: { critical: true },
				});
			}
			if (e instanceof Error) {
				console.error(e);
				show({ message: e.message, type: { critical: true } });
			}
		}
	};

	return {
		form,
		onSave,
	};
}
