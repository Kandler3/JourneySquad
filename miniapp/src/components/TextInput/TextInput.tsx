import {FC, FormEvent} from "react";
import {Text} from "@telegram-apps/telegram-ui";

import './TextInput.css'

type TextInputProps = {
    value: string
    onChange: (value: string) => void
    multiline?: boolean
}

export const TextInput: FC<TextInputProps> = ({value, onChange, multiline=false}) => {
    return (
        <Text
            Component={multiline ? "textarea" : "input"}
            type={multiline ? "" : "text"} value={value}
            onInput={
                (e : FormEvent<HTMLInputElement>) =>
                {onChange(e.currentTarget.value)}
            }
            className="text-input"
        />
    )
}