import React from 'react';
import 'react-infinite-tree/dist/react-infinite-tree.css';
import data from './data';
import LeftListTree from './LeftListTree';
import RightListTree from './RightListTree';


import './index.styl';

export default class GroupUserTree extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data,
            checkedNodes: []
        };
        this.getCheckedNodes = this.getCheckedNodes.bind(this);
        this.getUncheckedNodes = this.getUncheckedNodes.bind(this);
    }

    getCheckedNodes() {
      console.log('Nodes', this.LeftTree.getCheckedNodes());
        this.setState({ checkedNodes: this.LeftTree.getCheckedNodes() });
    }

    getUncheckedNodes() {
      //console.log('unchecked Nodes', this.RightTree.getUncheckedNodes());
        this.LeftTree.uncheckNodes(this.RightTree.getUncheckedNodes())
    }

    render () {
        const { checkedNodes } = this.state;
        return (
            <div>
                <div className="leftTree">
                    <LeftListTree
                        data={this.state.data}
                        ref={(elem) => { if (elem) this.LeftTree = elem; }}
                    />
                </div>
                <button onClick={this.getCheckedNodes}>to the right</button>
                <button onClick={this.getUncheckedNodes}>to the left</button>

                <div className="rightTree">
                    <RightListTree
                        data={checkedNodes}
                        ref={(elem) => { if (elem) this.RightTree = elem; }}
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
