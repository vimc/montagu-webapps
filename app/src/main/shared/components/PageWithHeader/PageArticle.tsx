import * as React from "react";

interface ArticleProps {
    title: JSX.Element;
    hideTitle: boolean;
    children: any;
}

export class PageArticle extends React.Component<ArticleProps, undefined> {

    render() {
        return <article className="page container">

            <div className="page__content">{ this.props.children }</div>
        </article>
    }
}