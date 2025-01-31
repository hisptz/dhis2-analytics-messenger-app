import { z } from "zod";
import Parse from "parse";
import i18n from "@dhis2/d2-i18n";

export enum ContactType {
	INDIVIDUAL = "individual",
	GROUP = "group",
}

export const channelSchema = z.enum(["whatsapp", "telegram"]);

export const ToContactSchema = z.object({
	identifier: z.string(),
	type: z.nativeEnum(ContactType),
	channel: channelSchema,
	gatewayId: z.string(),
});
export type Contact = z.infer<typeof ToContactSchema>;

export const ToContactFormSchema = ToContactSchema.omit({
	type: true,
	channel: true,
}).extend({
	type: z.enum([
		"whatsappPhoneNumber",
		"whatsappGroup",
		"telegramPhoneNumber",
		"telegramGroup",
		"user",
	]),
});
export const visualizationSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
});

export type Visualization = z.infer<typeof visualizationSchema>;
export const pushAnalyticsJobSchema = z.object({
	name: z.string({ required_error: i18n.t("Name is required") }),
	contacts: z
		.array(ToContactSchema, {
			required_error: i18n.t("Contacts are required"),
		})
		.min(1, i18n.t("At least one contact is required")),
	dhis2Instance: z.instanceof(Parse.Object),
	visualizations: z
		.array(visualizationSchema)
		.min(1, i18n.t("At least one visualization is required")),
});

export const visualizationFormObjectSchema = z.object({
	id: z.string(),
	type: z.enum(["map", "visualization"]),
	description: z.string().optional(),
});

export const pushAnalyticsJobFormDataSchema = pushAnalyticsJobSchema
	.omit({
		dhis2Instance: true,
	})
	.extend({
		contacts: z.array(ToContactSchema),
		gateways: z.array(z.string()),
		visualizations: z.array(visualizationFormObjectSchema),
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
