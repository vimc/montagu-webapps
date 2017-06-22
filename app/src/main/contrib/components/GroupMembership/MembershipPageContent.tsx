import * as React from "react";
import { connectToStores } from "../../../shared/alt";
import { membershipStore } from "../../stores/MembershipStore";

interface Props {

}

export class MembershipPageContentComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [ membershipStore ];
    }
    static getPropsFromStores(): Props {
        return {};
    }

    render() {
        
    }
}

export const MembershipPageContent = connectToStores(MembershipPageContentComponent);