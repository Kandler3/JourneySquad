import {Button} from "@telegram-apps/telegram-ui";
import {FC, ReactNode} from "react";

import './SaveButton.css'

type SaveButtonProps = {
    onClick?: () => void,
    children?: ReactNode,
}

export const SaveButton: FC<SaveButtonProps> = ({ onClick, children }) => (
    <div className="save-button-container">
        <Button
            className="save-button"
            onClick={onClick}
        >
            {children}
        </Button>
    </div>
)