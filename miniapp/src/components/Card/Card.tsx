import React, {FC} from "react";

import "./Card.css"


type CardProps = {
    style: "horizontal" | "vertical";
    image?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

export const Card: FC<CardProps> = ({style, image, onClick, children}) => {

    return (
        <div className={`card ${style}-card-mixin`} onClick={onClick}>
            <div className="card-image" style={{backgroundImage: image}}></div>
            <div className="card-content">
                {children}
            </div>
        </div>
    )
}