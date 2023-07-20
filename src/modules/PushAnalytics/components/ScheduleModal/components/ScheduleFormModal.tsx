import i18n from "@dhis2/d2-i18n";
import {
    Button,
    ButtonStrip,
    Field,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SegmentedControl,
    SingleSelectField,
    SingleSelectOption
} from "@dhis2/ui";
import {
    ControllerRenderProps,
    FieldValues,
    FormProvider,
    useController,
    useForm,
    useFormContext,
    useWatch
} from "react-hook-form";
import React, {useMemo, useState} from "react";
import {PushAnalytics} from "../../../../../shared/interfaces";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {PushSchedule, useManagePushSchedule} from "../hooks/schedule";
import {useSetting} from "@dhis2/app-service-datastore";
import {CronTime} from "cron-time-generator";
import {isEmpty, padStart, range} from "lodash";
import {useEffectOnce, useUpdateEffect} from "usehooks-ts";
import cronstrue from 'cronstrue';
import {RHFMultiSelectField} from "../../../../../shared/components/Fields/RHFMultiSelectField";


export interface ScheduleFormModalProps {
    onClose: () => void;
    hide: boolean;
    config: PushAnalytics,
    defaultValue?: PushSchedule;
}


function Predefined() {
    const [predefinedSchedules] = useSetting("predefinedSchedules", {global: true})
    return (
        <RHFSingleSelectField label={i18n.t("Select time")} options={predefinedSchedules} name={"cron"}/>
    )

}

const daysOfWeek = [
    {
        label: i18n.t("Monday"),
        value: 'mon'
    },
    {
        label: i18n.t("Tuesday"),
        value: 'tue'
    },
    {
        label: i18n.t("Wednesday"),
        value: 'wed'
    },
    {
        label: i18n.t("Thursday"),
        value: 'thu'
    },
    {
        label: i18n.t("Friday"),
        value: 'fri'
    },
    {
        label: i18n.t("Saturday"),
        value: 'sat'
    },
    {
        label: i18n.t("Sunday"),
        value: 'sun'
    }
]

const monthsOfYear = [
    {
        label: i18n.t("January"),
        value: 'jan'
    },
    {
        label: i18n.t("February"),
        value: 'feb'
    },
    {
        label: i18n.t("March"),
        value: 'mar'
    },
    {
        label: i18n.t("April"),
        value: 'apr'
    },
    {
        label: i18n.t("May"),
        value: 'may'
    },
    {
        label: i18n.t("June"),
        value: 'jun'
    },
    {
        label: i18n.t("July"),
        value: 'jul'
    },
    {
        label: i18n.t("August"),
        value: 'aug'
    },
    {
        label: i18n.t("September"),
        value: 'sep'
    },
    {
        label: i18n.t("October"),
        value: 'oct'
    },
    {
        label: i18n.t("November"),
        value: 'nov'
    },
    {
        label: i18n.t("December"),
        value: 'dec'
    }
]

const fields = [
    {
        label: i18n.t("Hour"),
        id: 'hour',
        conjunction: i18n.t("At"),
        fn: CronTime.everyHourAt,
        fields: [
            {
                label: i18n.t("Minute"),
                min: 0,
                max: 59
            }
        ] as any[]
    },
    {
        label: i18n.t("Day"),
        id: 'day',
        fn: CronTime.everyDayAt,
        conjunction: i18n.t("At"),
        fields: [
            {
                label: i18n.t("Hour"),
                min: 0,
                max: 23
            },
            {
                label: i18n.t("Minute"),
                min: 0,
                max: 59
            }
        ] as any[]
    },
    {
        label: i18n.t("Week"),
        id: 'week',
        fn: CronTime.everyWeekAt,
        conjunction: i18n.t("On"),
        fields: [
            {
                label: i18n.t("Day"),
                multiple: true,
                options: daysOfWeek
            },
            {
                label: i18n.t("Hour"),
                min: 0,
                max: 23
            },
            {
                label: i18n.t("Minute"),
                min: 0,
                max: 59
            }
        ] as any[]
    },
    {
        label: i18n.t("Month"),
        id: 'month',
        fn: CronTime.everyMonthOn,
        conjunction: i18n.t("On"),
        fields: [
            {
                label: i18n.t("Day"),
                min: 1,
                max: 31
            },
            {
                label: i18n.t("Hour"),
                min: 0,
                max: 23
            },
            {
                label: i18n.t("Minute"),
                min: 0,
                max: 59
            }
        ]
    },
    {
        label: i18n.t("Year"),
        id: 'year',
        fn: CronTime.everyYearIn,
        conjunction: i18n.t("On"),
        fields: [
            {
                label: i18n.t("Month"),
                multiple: true,
                options: monthsOfYear
            },
            {
                label: i18n.t("Day"),
                min: 1,
                max: 31
            },
            {
                label: i18n.t("Hour"),
                min: 0,
                max: 23
            },
            {
                label: i18n.t("Minute"),
                min: 0,
                max: 59
            }
        ]
    }
]

function CustomSelector({type}: { type?: string | null }) {
    const {reset} = useFormContext();
    const selectedConfig = useMemo(() => {
        return fields.find(({id}) => id === type);
    }, [type]);

    useUpdateEffect(() => {
        reset();
    }, [selectedConfig])

    return (
        <>
            <span>{selectedConfig?.conjunction}</span>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
                alignItems: "end"
            }} className="w-100">
                {
                    selectedConfig?.fields?.map(({options, min, max, label, multiple}, index) => {
                        if (!isEmpty(options)) {
                            if (multiple) {
                                return (
                                    <RHFMultiSelectField name={index.toString()} label={label} options={options}/>
                                )
                            }
                            return (
                                <RHFSingleSelectField label={label} fullWidth options={options}
                                                      name={index.toString()}/>
                            )
                        }

                        const generatedOptions = range(min, max + 1).map((value) => ({
                            label: padStart(value.toString(), 2),
                            value: padStart(value.toString(), 2)
                        }))

                        return (
                            <RHFSingleSelectField label={label} fullWidth options={generatedOptions}
                                                  name={index.toString()}/>
                        )
                    })
                }
            </div>
        </>
    )
}


function Submitter({field, type}: { field: ControllerRenderProps<FieldValues, "cron">, type: string | null }) {
    const values = useWatch();
    useUpdateEffect(() => {
        if (!values) return;
        const config = fields.find((config) => config.id === type);
        if (config) {
            if (isEmpty(values)) return;
            let params: any = Object.values(values) as any[];
            console.log(params)
            if (config.fields.length === params.length) {
                const cron = config.fn(...params);
                console.log(cron)
                field.onChange(cron);
            }
        }
    }, [values])

    return null;
}

function Custom() {
    const [type, setType] = useState<string | null>(null)
    const {field, formState, fieldState} = useController({
        name: "cron"
    });
    const form = useForm();

    const mainOptions = fields.map(({id, label}) => ({label, value: id}));

    const text = useMemo(() => {
        const value = field.value;
        if (value) {
            try {
                return cronstrue.toString(value);
            } catch (e) {
                return "";
            }
        }
        return "";
    }, [field.value]);


    useEffectOnce(() => () => {
        form.reset()
    })


    return (
        <Field helpText={text} error={fieldState.error?.message}>
            <FormProvider {...form}>
                <div className="column gap-16 w-100">
                    <Submitter type={type} field={field}/>
                    <div className="w-100">
                        <SingleSelectField selected={type}
                                           onChange={({selected}: { selected: string }) => {
                                               setType(selected);
                                               form.reset();
                                               field.onChange(null);
                                           }}
                                           label={i18n.t("Every")} options={mainOptions} name="type">
                            {
                                mainOptions.map((option) => (
                                    <SingleSelectOption key={`${option.value}-option`} {...option} />))
                            }
                        </SingleSelectField>
                    </div>
                    <CustomSelector type={type}/>
                </div>
            </FormProvider>
        </Field>
    )
}

export function ScheduleFormModal({onClose, hide, config, defaultValue}: ScheduleFormModalProps) {
    const form = useForm<{ cron: string }>();
    const [type, setType] = useState('predefined');
    const {onAdd, saving} = useManagePushSchedule(config, defaultValue, onClose);
    const onSubmit = (data: { cron: string }) => onAdd(data);

    const onCloseClick = () => {
        form.reset();
        onClose()
    }

    return (
        <Modal position="middle" hide={hide} onClose={onCloseClick}>
            <ModalTitle>{i18n.t("Add new schedule")}</ModalTitle>
            <ModalContent>
                <FormProvider {...form} >
                    <div style={{minHeight: 200}} className="column gap-16">
                        {i18n.t("Scheduling to send")}<b>{config.name}</b>
                        <SegmentedControl
                            selected={type}
                            onChange={({value}: { value: string }) => setType(value)}
                            options={[
                                {label: i18n.t("Predefined"), value: "predefined"},
                                {label: i18n.t("Custom"), value: "custom"},
                            ]}
                        />

                        {
                            type === 'predefined' && <Predefined/>
                        }
                        {
                            type === 'custom' && <Custom/>
                        }
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>Cancel</Button>
                    <Button onClick={form.handleSubmit(onSubmit)} loading={saving}
                            primary>{saving ? i18n.t("Adding...") : i18n.t("Add")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
