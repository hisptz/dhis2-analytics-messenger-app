import React, {useMemo} from "react";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {Info} from "luxon"

export function MonthField() {
    const options = useMemo(() => Info.months("long").map((option: string, index: number) => ({
        label: option,
        value: index.toString()
    })), []);


    return (
        <RHFSingleSelectField options={options} name={"3"}/>
    )
}
