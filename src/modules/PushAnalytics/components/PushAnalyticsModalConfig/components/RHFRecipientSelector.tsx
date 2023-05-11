import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Controller, FormProvider, useForm, useWatch} from "react-hook-form";
import axios from "axios"
import {filter, find, head, uniqBy} from "lodash";
import i18n from '@dhis2/d2-i18n';
import {Button, Chip, Field, IconUser24, IconUserGroup24} from "@dhis2/ui"
import {RHFSingleSelectField, RHFTextInputField} from "@hisptz/dhis2-ui";
import {Contact} from "../../../../../shared/interfaces";
import {useGateways} from "../../../../Configuration/components/Gateway/hooks/data";
import {Gateway} from "../../../../Configuration/components/Gateway/schema";

export interface RHFRecipientSelectorProps {
    name: string;
    validations?: Record<string, any>;
    label: string;
    required?: boolean;
}


async function getGroups(gateway: string): Promise<{ id: string, name: string }[]> {
    try {
        const response = await axios.get(`${gateway}/groups`,);
        if (response.status === 200) {
            return response.data.groups;
        } else {
            return []
        }
    } catch (e) {
        return [];
    }
}


function AddRecipient({onChange, groups}: { onChange: (recipient: Contact) => void, groups: any }) {
    const form = useForm<Contact>({
        defaultValues: {
            type: "individual"
        }
    });

    const [type] = form.watch(['type']);

    const onSubmit = useCallback(
        (data: Contact) => {
            onChange(data)
            form.reset({});
        },
        [form, onChange],
    );


    return (
        <Field label={i18n.t("Add new recipient")}>
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
                        <RHFSingleSelectField label={i18n.t("Group")} options={groups} name={'number'}/>
                    }
                    {
                        type === "individual" && (<RHFTextInputField label={i18n.t("Number")} name={'number'}/>)
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
    const [groups, setGroups] = useState<Array<{ label: string, value: string }>>([]);
    const {gateways} = useGateways();
    const [selectedGateway] = useWatch({
        name: ['gateway']
    });

    useEffect(() => {
        async function get() {
            if (selectedGateway) {
                const gateway = find(gateways as Gateway[], ['id', selectedGateway]);
                if (!gateway) {
                    return;
                }
                const groups = await getGroups(gateway?.whatsappURL);
                setGroups(groups?.map(({id, name}: any) => ({label: name, value: head(id.split('@')) ?? ''})) ?? [])
            }
        }

        get();
    }, [selectedGateway]);

    const options = useMemo(() => {
        return []
    }, []);


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
                                        <Chip key={`${number}-recipient`} onRemove={() => {
                                            field.onChange(filter(recipients, (recipient) => number !== recipient.number))
                                        }} icon={type === 'group' ? <IconUserGroup24/> :
                                            <IconUser24/>}>{number}</Chip>))
                                }
                            </div>
                            <AddRecipient onChange={(contact) => {
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

