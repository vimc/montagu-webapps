import * as React from "react";
import { logOut } from "../../_actions/AuthActions";
// import { AuthStateBase } from "../../reducers/AuthReducer";
import { InternalLink } from "../InternalLink";
import { connect } from "react-redux";

import "./Logout.scss";
//AuthStateBase
export class LoggedInUserBoxComponent extends React.Component<any, undefined> {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
    }

    logout(e: React.MouseEvent<HTMLAnchorElement>) {
        this.props.dispatch(logOut());
    }

    render() :JSX.Element {
        if (this.props.auth.loggedIn) {
            return <div className="logout">
                <div>
                    Logged in as { this.props.auth.username } |&nbsp;
                    <InternalLink href="/" onClick={ this.logout }>
                        Log out
                    </InternalLink>
                </div>
            </div>;
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state: any) => ({
    auth: state.auth
});

export const LoggedInUserBox = connect(mapStateToProps)(LoggedInUserBoxComponent);