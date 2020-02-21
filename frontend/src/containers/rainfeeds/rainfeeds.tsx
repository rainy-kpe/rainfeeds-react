import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as _ from "lodash";

import { Header } from "../../containers/header/header";
import { FeedCard } from "../../containers/feedCard/feedCard";
import { Settings } from "../settings/settings";
import * as style from "./rainfeeds.styl";
import * as actions from "../../actions/cardActions";
import { IStoreState } from "../../store";

interface IRainfeedsProps {
    titles: string[];
}

class RainfeedsComponent extends React.Component<IRainfeedsProps> {

    public shouldComponentUpdate(nextProps: IRainfeedsProps) {
        return !_.isEqual(this.props.titles, nextProps.titles);
    }

    public render() {
        return (
            <div>
                <Header application="Rainfeeds 2.0" />

                <div className={ style.items }>
                    {
                        this.props.titles.map((title: string, i: number) => (
                            <div className={style.item} key={i}>
                                <FeedCard title={title} />
                            </div>)
                        )
                    }
                </div>

                <Settings />
            </div>
        );
    }
}

export const mapStateToProps = (state: IStoreState): IRainfeedsProps => ({
    titles: state.cardState.cards.map((card) => card.title)
});

export const Rainfeeds = connect(mapStateToProps)(RainfeedsComponent);
