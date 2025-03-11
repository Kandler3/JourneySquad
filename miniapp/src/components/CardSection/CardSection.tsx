import React, {FC} from "react";
import {
    SectionHeader
} from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader";

import "./CardSection.css"

type CardSectionProps = {
    title: string
    onClick?: () => void
    children?: React.ReactNode
}

export const CardSection: FC<CardSectionProps> = ({title, onClick, children}) => {
    return (
        <div className="card-section">
            <SectionHeader onClick={onClick}>
                {title}
            </SectionHeader>
            <div className="card-section-content">
                {children}
            </div>
        </div>
    )
}