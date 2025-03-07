import {
    SectionHeader
} from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader";
import {Divider} from "@telegram-apps/telegram-ui";

import './ContentSection.css'
import {Children, FC, ReactNode} from "react";

type ContentSectionProps = {
    title?: string,
    children?: ReactNode,
}

export const ContentSection: FC<ContentSectionProps> = ({title, children}) => {
    const contentList : ReactNode[] = [];

    Children.forEach(children, (child, index) => {
        contentList.push(child)
        if (index !== Children.count(children) - 1)
            contentList.push(<Divider className="divider" key={index}/>)
    })

    return (
        <div className="section">
            <SectionHeader large={true}>{ title }</SectionHeader>
            <div className="section-content">
                { contentList }
            </div>
        </div>
    );
}