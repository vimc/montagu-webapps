import * as React from "react";
import { Dispatch } from "redux";
import { compose } from "recompose";
import { connect } from 'react-redux';

import { ChooseActionContent } from "./ChooseActionContent";
import {ChooseGroupPageComponent} from "../ChooseGroup/ChooseGroupPage";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageProperties";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {chooseActionPageActionCreators} from "../../actions/pages/chooseActionPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";

export interface ChooseActionPageLocationProps {
    groupId: string;
}

export class ChooseActionPageComponent extends React.Component<PageProperties<ChooseActionPageLocationProps>> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: state.groups.currentUserGroup.description,
            urlFragment: `${state.groups.currentUserGroup.id}/`,
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title="What do you want to do?">
            <ChooseActionContent/>
        </PageArticle>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<PageProperties<ChooseActionPageLocationProps>> => {
    return {
        onLoad: (params: ChooseActionPageLocationProps) => dispatch(chooseActionPageActionCreators.onLoad(params))
    }
};

export const ChooseActionPage = compose(
    connect(state => state, mapDispatchToProps)
)(ChooseActionPageComponent) as React.ComponentClass<Partial<PageProperties<ChooseActionPageLocationProps>>>;
