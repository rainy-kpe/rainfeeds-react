import * as React from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";

import { Header } from "../../components/header/header";
import { FeedCard } from "../../containers/feed-card/feed-card";
import * as style from "./rainfeeds.styl";
import * as actions from "../../actions";

interface IRainfeedsProps {
    url?: string;
}

interface IState {
    counter: number;
}

class RainfeedsImpl extends React.Component<IRainfeedsProps, IState> {
    public state: IState = {
        counter: 0
    };

    // TODO: Is state type correct?
    constructor(props: IRainfeedsProps, context: IState) {
        super(props, context);
    }

    public render() {
        const { url } = this.props;

        console.log(this.props);
        console.log(this.state);

        return (
            <div>
                <Header application="Rainfeeds 2.0" />
                Counter: {this.state.counter}<br />
                <Button onClick={(this.props as any).incr()}>
                    Increment
                </Button>
                <Button onClick={(this.props as any).decr()}>
                    Decrement
                </Button>
            </div>
        );
    }
}

const mapStateToProps = (state: IState) => state;

const mapDispatchToProps = (dispatch: any) => ({
    decr: () => dispatch(actions.incrementCounter(-1)),
    incr: () => dispatch(actions.incrementCounter(1))
});

// TODO: Fix the type
export const Rainfeeds = connect(mapStateToProps, mapDispatchToProps)(RainfeedsImpl as any);

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
