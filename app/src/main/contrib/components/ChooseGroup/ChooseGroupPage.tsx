import * as React from "react";
import { ChooseGroupContent } from "./ChooseGroupContent";
import { ContribPageWithHeader } from "../PageWithHeader/ContribPageWithHeader";

export class ChooseGroupPage extends ContribPageWithHeader<undefined> {
    title() {
        return <span>Modellers' contribution portal</span>;
    }

    renderPageContent() {
        return <div>
            <p>
                Montagu's database hosts estimates provided to Gavi in the
                past, and will hold those generated by the VIMC going forward.
                The contribution portal facilitates interaction of modellers
                with the database to generate estimates going forward. To this
                end, it is a platform for modellers contributing vaccine
                impact estimates to the VIMC to download input datasets and
                upload, review and approve model estimates.
            </p>
            <ChooseGroupContent />
        </div>;
    }
}