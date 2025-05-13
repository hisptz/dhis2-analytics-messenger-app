import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DashboardSelector } from "./components/DashboardSelector";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import i18n from "@dhis2/d2-i18n";
import { useGetDashboards, useSaveDashboards } from "./hooks/data";
import { Button, ButtonStrip } from "@dhis2/ui";

export const dashboardSchema = z.object({
	id: z.string(),
	name: z.string(),
});
export type DashboardConfig = z.infer<typeof dashboardSchema>;

export const dashboardsFormSchema = z.object({
	dashboards: z.array(dashboardSchema),
});
export type DashboardsForm = z.infer<typeof dashboardsFormSchema>;

export function DashboardsConfigPage() {
	const { get } = useGetDashboards();
	const { save } = useSaveDashboards();
	const form = useForm<DashboardsForm>({
		resolver: zodResolver(dashboardsFormSchema),
		shouldFocusError: false,
		defaultValues: async () => {
			return {
				dashboards: await get(),
			};
		},
	});

	return (
		<FormProvider {...form}>
			<div className="w-full h-full flex flex-col gap-4">
				<h1>Dashboards</h1>
				<span>
					{i18n.t(
						"Select dashboards that will be accessible in push analytics",
					)}
				</span>
				<div>
					<DashboardSelector formLoading={form.formState.isLoading} />
				</div>
				<ButtonStrip>
					<Button disabled={!form.formState.isDirty}>
						{i18n.t("Reset")}
					</Button>
					<Button
						disabled={!form.formState.isDirty}
						loading={form.formState.isSubmitting}
						primary
						onClick={(_, e) => form.handleSubmit(save)(e)}
					>
						{form.formState.isSubmitting
							? i18n.t("Saving...")
							: i18n.t("Save changes")}
					</Button>
				</ButtonStrip>
			</div>
		</FormProvider>
	);
}
