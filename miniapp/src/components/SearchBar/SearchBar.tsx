import {FC} from "react";
import { themeParams } from "@telegram-apps/sdk-react";

import {Icon28Search} from "@/icons/Search.tsx";
import {Icon24Close} from "@telegram-apps/telegram-ui/dist/icons/24/close";
import "./SearchBar.css"
import {Text} from "@telegram-apps/telegram-ui";


export const SearchBar : FC = () => {
    return (
        <form action="" className="search-bar">
            <button type="submit" className="button">
                <Icon28Search color={themeParams.buttonColor()}/>
            </button>
            <div className="search-bar-input">
                <Text Component="input" className="input" name="query"/>
                <button type="reset" className="button">
                    <Icon24Close/>
                </button>
            </div>
        </form>
    )
}