import {FC} from "react";
import {Text} from "@telegram-apps/telegram-ui";

import {Page} from "@/components/Page.tsx";

export const LoadingPage: FC = () => {
    return (
        <Page>
            <Text>Loading...</Text>
        </Page>
    )
}