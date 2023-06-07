import React, {useCallback, useEffect} from "react";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {filter, uniqBy} from "lodash";
import i18n from '@dhis2/d2-i18n';
import {Button, Field} from "@dhis2/ui"
import {RHFSingleSelectField, RHFTextInputField} from "@hisptz/dhis2-ui";
import {Contact} from "../../../../../shared/interfaces";
import {useWhatsappData} from "../../../../../shared/hooks/whatsapp";
import {ContactChip} from "../../../../../shared/components/ContactChip";

export interface RHFRecipientSelectorProps {
    name: string;
    validations?: Record<string, any>;
    label: string;
    required?: boolean;
}

function AddRecipient({onChange, groups, loading}: {
    loading?: boolean;
    onChange: (recipient: Contact) => void,
    groups: Array<{ id: string; name: string }>
}) {
    const form = useForm<Contact>({
        defaultValues: {
            type: "individual"
        },
        reValidateMode: "onBlur",
        mode: "onBlur"
    });

    const [type] = form.watch(['type']);

    const onSubmit = useCallback(
        (data: Contact) => {
            onChange(data)
            form.reset({});
        },
        [form, onChange],
    );

    useEffect(() => {
        form.clearErrors('number')
    }, [type])

    return (
        <Field
            label={i18n.t("Add new recipient")}
            helpText={type === "individual" && i18n.t("Start with country code without the + sign. Example 255XXXXXXXXX")}
        >
            <div style={{display: "grid", gridTemplateColumns: "2fr 3fr 1fr", gap: 16, alignItems: 'end'}}>
                <FormProvider {...form}>
                    <RHFSingleSelectField
                        label={i18n.t("Type")}
                        options={[
                            {
                                label: i18n.t("Group"),
                                value: 'group'
                            },
                            {
                                label: i18n.t("Phone Number"),
                                value: "individual"
                            }
                        ]}
                        name={'type'}
                    />
                    {
                        type === "group" &&
                        <RHFSingleSelectField loading={loading} label={i18n.t("Group")}
                                              options={groups.map(group => ({value: group.id, label: group.name}))}
                                              name={'number'}/>
                    }
                    {
                        type === "individual" && (<RHFTextInputField
                            placeholder={`255XXXXXXXXX`}
                            validations={type === "individual" ? {
                                pattern: {
                                    value: /^\d{1,3}\d{9}$/,
                                    message: i18n.t("Invalid phone number")
                                }
                            } : undefined} label={i18n.t("Number")} name={'number'}/>)
                    }
                    <Button onClick={form.handleSubmit(onSubmit)}>
                        {i18n.t("Add")}
                    </Button>
                </FormProvider>
            </div>
        </Field>
    )
}


export function RHFRecipientSelector({validations, name, label, required}: RHFRecipientSelectorProps) {
    const {groups, loading} = useWhatsappData();

    return (
        <Controller
            rules={validations}
            render={({field, fieldState}) => {
                const recipients = field.value ?? [];
                return (
                    <Field required={required} label={label}>
                        <div className="column gap-16">
                            <div style={{flexWrap: "wrap", gap: 8}} className="row">
                                {
                                    recipients.map(({number, type}: Contact) => (
                                        <ContactChip key={`${number}-recipient`} onRemove={() => {
                                            field.onChange(filter(recipients, (recipient) => number !== recipient.number))
                                        }} number={number} type={type}/>))
                                }
                            </div>
                            <AddRecipient loading={loading} onChange={(contact) => {
                                field.onChange(uniqBy([
                                    ...recipients,
                                    contact
                                ], 'number'))
                            }} groups={groups}/>
                        </div>
                    </Field>
                )
            }}
            name={name}
        />
    )
}

