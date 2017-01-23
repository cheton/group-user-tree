import React from 'react';
import 'react-infinite-tree/dist/react-infinite-tree.css';
import data from './data';
import data2 from './data2';
import BlockListTree from './BlockListTree';

import './index.styl';

export default class GroupUserTree extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data,
            data2,
            somethingFromLeft: {}
        };
        this.changeSomething = this.changeSomething.bind(this);
    }

    changeSomething(something) {
        this.setState({ somethingFromLeft: something });
    }

    render () {
        return (
            <div>
                <div className="leftTree">
                    <BlockListTree
                        data={this.state.data}
                        changeSomething={this.changeSomething}
                    />
                </div>
                <div className="rightTree">
                    <BlockListTree
                        data={this.state.data2}
                    />
                </div>
            </div>
        );
    }
}

GroupUserTree.propTypes = {
    isFiltered: React.PropTypes.bool,
    checked: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool
    ])
};
