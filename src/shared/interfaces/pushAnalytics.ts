import { z } from "zod";
import Parse from "parse";
import i18n from "@dhis2/d2-i18n";

export const contactSchema = z.object({
	id: z.string().optional(),
	type: z.enum(["individual", "group", "user"]),
	clientType: z.enum(["whatsapp"]),
	identifier: z.string(),
});
export type Contact = z.infer<typeof contactSchema>;
export const visualizationSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
});

export type Visualization = z.infer<typeof visualizationSchema>;
export const pushAnalyticsJobSchema = z.object({
	name: z.string({ required_error: i18n.t("Name is required") }),
	contacts: z
		.array(contactSchema, {
			required_error: i18n.t("Contacts are required"),
		})
		.min(1, i18n.t("At least one contact is required")),
	dhis2Instance: z.instanceof(Parse.Object),
	description: z.string().optional(),
	visualizations: z
		.array(visualizationSchema)
		.min(1, i18n.t("At least one visualization is required")),
});
export const pushAnalyticsJobFormDataSchema = pushAnalyticsJobSchema
	.omit({
		dhis2Instance: true,
	})
	.extend({
		contacts: z.array(contactSchema),
		visualizations: z.array(visualizationSchema),
		visualizationGroup: z.string(),
	});
export type PushAnalyticsJob = z.infer<typeof pushAnalyticsJobSchema>;
export type PushAnalyticsJobFormData = z.infer<
	typeof pushAnalyticsJobFormDataSchema
>;
export const pushAnalyticsScheduleSchema = z.object({
	enabled: z.boolean(),
	cron: z.string(),
});
export type PushAnalyticsJobSchedule = z.infer<
	typeof pushAnalyticsScheduleSchema
>;
