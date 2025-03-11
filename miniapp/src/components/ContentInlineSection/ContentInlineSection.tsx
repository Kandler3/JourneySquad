import {Divider, Text} from "@telegram-apps/telegram-ui";

import './ContentInlineSection.css'
import {Children, FC, ReactNode} from "react";

type ContentSectionInlineProps = {
    title?: string,
    children?: ReactNode,
}

export const ContentInlineSection: FC<ContentSectionInlineProps> = ({title, children}) => {
    const contentList : ReactNode[] = [];

    Children.forEach(children, (child, index) => {
        contentList.push(child)
        if (index !== Children.count(children) - 1)
            contentList.push(<Divider className="divider"/>)
    })

    return (
        <div className="section-inline">
            <Text>{ title }</Text>
            <Divider className="divider"/>
            <div className="section-content">
                { contentList }
            </div>
        </div>
    );
}