import * as React from "react";
import { connect } from "react-redux";

import { Header } from "../../containers/header/header";
import { FeedCard } from "../../containers/feedCard/feedCard";
import { Settings } from "../settings/settings";
import * as style from "./rainfeeds.styl";
import * as actions from "../../actions/cardActions";

class RainfeedsComponent extends React.Component<actions.ICardState> {
    public render() {
        return (
            <div>
                <Header application="Rainfeeds 2.0" />

                <div className={ style.items }>
                    {
                        this.props.cards.map((card: actions.ICard, i: number) => (
                            <div className={style.item} key={i}>
                                <FeedCard title={card.title} />
                            </div>)
                        )
                    }
                </div>

                <Settings />
            </div>
        );
    }
}

export const Rainfeeds = connect(actions.mapStateToProps)(RainfeedsComponent);
