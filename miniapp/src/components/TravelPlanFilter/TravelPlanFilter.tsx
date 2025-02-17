import { useState, FC, Dispatch, SetStateAction } from "react";
import { Divider, Text, Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { SectionHeader } from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader";
import { DateInput } from "@/components/DateInput/DateInput.tsx";
import "./TravelPlanFilter.css";

type TravelPlanFilterProps = {
    isFilterOpened: boolean;
    setIsFilterOpened: Dispatch<SetStateAction<boolean>>;
};

export const TravelPlanFilter: FC<TravelPlanFilterProps> = ({ isFilterOpened, setIsFilterOpened }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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
                        <DateInput value={startDate} onChange={setStartDate} />
                    </div>
                    <Divider className="divider"/>
                    <div className="dates-content-part">
                        <Text>До</Text>
                        <Divider className="divider"/>
                        <DateInput value={endDate} onChange={setEndDate} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};
