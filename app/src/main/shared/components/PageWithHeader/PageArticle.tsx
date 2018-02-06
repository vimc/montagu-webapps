import * as React from "react";

interface ArticleProps {
    title: JSX.Element;
    hideTitle: boolean;
    children: any;
}

export class PageArticle extends React.Component<ArticleProps, undefined> {

    render() {
        return <article className="page container-fluid pt-5">

            <div className="page__content pt-5">{ this.props.children }</div>
        </article>
    }
}