import {FC} from "react";
import {Page} from "@/components/Page.tsx";
import {useParams} from "react-router-dom";

export const ProfilePage : FC = () => {
    const { userId } = useParams();
    return (
        <Page>
            <h1>Profile {userId}</h1>
        </Page>
    )
}