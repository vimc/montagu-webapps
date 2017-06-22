import * as React from "react";
import { PageWithHeaderAndNav } from "../PageWithHeader/PageWithHeaderAndNav";

interface LocationProps {
    groupId: string;
}

export class MembershipPage extends PageWithHeaderAndNav<LocationProps> {
    title() {
        return <span>Modelling group members</span>
    }

    renderPageContent() {
        return <div>Hello world</div>;
    }
}