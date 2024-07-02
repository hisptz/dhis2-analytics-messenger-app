import React, {useState} from "react";
import i18n from "@dhis2/d2-i18n";
import {useSetting} from "@dhis2/app-service-datastore";
import {Button, InputField} from "@dhis2/ui";
import {useBoolean} from "usehooks-ts";


export default function GatewayConfigurationsTable(): React.ReactElement {
    const [defaultValue, {set}] = useSetting("gatewayConfig", {global: true});
    const [token, setToken] = useState(defaultValue?.token);
    const {value: editMode, setTrue: enableEdit, setFalse: disableEdit} = useBoolean(false);

    const onSave = () => {
        set({
            ...defaultValue,
            token
        });
        disableEdit();
    };

    return (
        <div className="column gap-16">
            <InputField
                disabled={!editMode}
                label={i18n.t("Token")} name="token" value={token}
                onChange={({value}: { value: string }) => setToken(value)}
            />
            <div>
                <Button primary onClick={editMode ? onSave : enableEdit}>
                    {editMode ? i18n.t("Save") : i18n.t("Update")}
                </Button>
            </div>
        </div>
    );
}
