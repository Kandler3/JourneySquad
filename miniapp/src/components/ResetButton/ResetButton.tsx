import {Button} from "@telegram-apps/telegram-ui";
import {FC, ReactNode} from "react";

import './ResetButton.css'

type ResetButtonProps = {
    onClick?: () => void,
    children?: ReactNode,
}

export const ResetButton: FC<ResetButtonProps> = ({ onClick, children }) => (
    <Button
        className="reset-button"
        onClick={onClick}
    >
        {children}
    </Button>
)