import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button } from "semantic-ui-react";

import { Header } from "../../components/header/header";
import { FeedCard } from "../../containers/feed-card/feed-card";
import * as style from "./rainfeeds.styl";
import * as actions from "../../actions";
import * as store from "../../store";

export interface IRainfeedsState {
    counter: number;
}

interface IRainfeedsProps {
    counter: number;
}

interface IRainfeedsDispatch {
    incr: () => actions.IIncrementAction;
    decr: () => actions.IIncrementAction;
}

class RainfeedsComponent extends React.Component<IRainfeedsProps & IRainfeedsDispatch> {
    public render() {
        console.log(this.props);
        console.log(this.state);

        return (
            <div>
                <Header application="Rainfeeds 2.0" />
                Counter: {this.props.counter}<br />
                <Button onClick={() => this.props.incr()}>
                    Increment
                </Button>
                <Button onClick={() => this.props.decr()}>
                    Decrement
                </Button>
            </div>
        );
    }
}

const mapStateToProps = (state: store.IStoreState): IRainfeedsProps => {
    console.log(state);
    return {
        counter: state.rainfeeds.counter
    };
};

const mapDispatchToProps = (dispatch: Dispatch<actions.IIncrementAction>): IRainfeedsDispatch => ({
    decr: () => dispatch(actions.incrementCounter(-1)),
    incr: () => dispatch(actions.incrementCounter(1))
});

export const Rainfeeds = connect(mapStateToProps, mapDispatchToProps)(RainfeedsComponent);

/*
                <div className={ style.items }>
                    {
                        [...Array(1)].map((card: any) => (
                            <div className={ style.item }>
                                <FeedCard title="Hello World" />
                            </div>)
                        )
                    }
                </div>
*/
