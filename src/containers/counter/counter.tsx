import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button } from "semantic-ui-react";

import * as style from "./counter.styl";
import * as actions from "../../actions/counterActions";
import * as store from "../../store";
import { ICounterState } from "../../actions/counterActions";

interface ICounterDispatch {
    incr: () => actions.IIncrementAction;
    decr: () => actions.IIncrementAction;
}

class CounterComponent extends React.Component<ICounterState & ICounterDispatch> {
    public render() {
        console.log(this.props);
        console.log(this.state);

        return (
            <div>
                Counter: {this.props.counter}<br />
                <Button onClick={this.props.incr}>
                    Increment
                </Button>
                <Button onClick={this.props.decr}>
                    Decrement
                </Button>
            </div>
        );
    }
}

const mapStateToProps = (state: store.IStoreState): ICounterState => ({
    counter: state.counterState.counter
});

const mapDispatchToProps = (dispatch: Dispatch<actions.IIncrementAction>): ICounterDispatch => ({
    decr: () => dispatch(actions.incrementCounter(-1)),
    incr: () => dispatch(actions.incrementCounter(1))
});

export const Counter = connect(mapStateToProps, mapDispatchToProps)(CounterComponent);
