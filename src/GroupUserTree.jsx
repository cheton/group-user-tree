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
            checkedNodes: []
        };
        this.changeSomething = this.changeSomething.bind(this);
    }

    changeSomething() {
      console.log('Nodes', this.LeftTree.getCheckedNodes());
        this.setState({ checkedNodes: this.LeftTree.getCheckedNodes() });
    }

    render () {
        const { checkedNodes } = this.state;
        return (
            <div>
                <div className="leftTree">
                    <BlockListTree
                        data={this.state.data}
                        ref={(elem) => { if (elem) this.LeftTree = elem; }}
                    />
                </div>
                <button onClick={this.changeSomething}>to the right</button>
                <button>to the left</button>

                <div className="rightTree">
                    <BlockListTree
                        data={checkedNodes}
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
