import i18n from "@dhis2/d2-i18n";
import {Button, ButtonStrip, InputField, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import React, {useState} from "react";
import {useSetting} from "@dhis2/app-service-datastore";


export interface GatewayConfigurationModalProps {
		onClose: () => void,
    hide: boolean;
}

export function GatewayConfigurationModal({onClose, hide}: GatewayConfigurationModalProps) {
    const [defaultValue, {set}] = useSetting("gatewayConfig", {global: true});
    const [token, setToken] = useState(defaultValue?.token);

    const onSave = () => {
        set({
            ...defaultValue,
            token
        });
        onClose();
    };

    return (
        <Modal position="middle" hide={hide}>
            <ModalTitle>
                DHIS2 Analytics Messenger Token
            </ModalTitle>
            <ModalContent>
                <InputField
                    label={i18n.t("Token")} name="token" value={token}
                    onChange={({value}: { value: string }) => setToken(value)}
                />
                <div>

                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button primary onClick={onSave}>
                        Save
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}
