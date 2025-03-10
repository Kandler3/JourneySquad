import {FC, FormEvent, useState} from "react";
import { themeParams } from "@telegram-apps/sdk-react";

import {Icon28Search} from "@/icons/Search.tsx";
import {Icon24Close} from "@telegram-apps/telegram-ui/dist/icons/24/close";
import "./SearchBar.css"
import {Text} from "@telegram-apps/telegram-ui";

type SearchBarProps = {
    onSubmit: (value: string) => void;
    onReset: () => void;
}

export const SearchBar : FC<SearchBarProps> = ({onSubmit, onReset}) => {
    const [query, setQuery] = useState("")

    return (
        <div className="search-bar">
            <button onClick={() => {onSubmit(query)}} className="button">
                <Icon28Search color={themeParams.buttonColor()}/>
            </button>
            <div className="search-bar-input">
                <Text
                    Component="input"
                    className="input"
                    onInput={(e: FormEvent<HTMLInputElement>) => {setQuery(e.currentTarget.value)}}
                />
                <button onClick={() => {setQuery(""); onReset()}} className="button">
                    <Icon24Close/>
                </button>
            </div>
        </div>
    )
}