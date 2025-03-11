import {FC} from "react";
import {Page} from "@/components/Page.tsx";
import {CardSection} from "@/components/CardSection/CardSection.tsx";
import {Card} from "@/components/Card/Card.tsx";

export const HomePage : FC = () => {
    return (
        <Page>
            <h1>Home</h1>
            <CardSection title={"Для вас"}>
                <Card style="vertical"/>
                <Card style="vertical"/>
                <Card style="vertical"/>
            </CardSection>
        </Page>
    )
}