import {FC, Dispatch, SetStateAction} from "react";
import {Divider, Text, Modal} from "@telegram-apps/telegram-ui";

import "./TravelPlanFilter.css"
import {
    ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {
    SectionHeader
} from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader";

type TravelPlanFilterProps = {
    isFilterOpened: boolean;
    setIsFilterOpened: Dispatch<SetStateAction<boolean>>;
}

export const TravelPlanFilter : FC<TravelPlanFilterProps> = ({isFilterOpened, setIsFilterOpened}) => {
    return (
        <Modal
            open={isFilterOpened}
            className="travel-plan-filter-modal"
            header={<ModalHeader>Фильтр</ModalHeader>}
            onOpenChange={setIsFilterOpened}
        >
            <div className="dates">
                <SectionHeader large={true}>Даты</SectionHeader>
                <div className="dates-content">
                    <div className="dates-content-part">
                        <Text>От</Text>
                        <Divider className="divider"/>
                        <Text Component="input" className="input" name="startDate"/>
                    </div>
                    <Divider className="divider"/>
                    <div className="dates-content-part">
                        <Text>До</Text>
                        <Divider className="divider"/>
                        <Text Component="input" className="input" name="endDate"/>
                    </div>
                </div>
            </div>

        </Modal>
    )
}