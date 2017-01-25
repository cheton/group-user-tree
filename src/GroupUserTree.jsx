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
        this.mergeCheckedNodes = this.mergeCheckedNodes.bind(this);
        this.mergeUnheckedNodes = this.mergeUnheckedNodes.bind(this);
    }

    mergeCheckedNodes() {
        const { checkedNodes } = this.state;
        let newNodes = this.LeftTree.getCheckedNodes();

        newNodes.forEach((newNode) => {
            const isClone = newNode.props.clone;

            newNode.id = isClone ? newNode.props.clonedId : newNode.id;
            const isNew = checkedNodes.find((node) => {
                return node.id === newNode.id;
            });

            !isNew && checkedNodes.push(newNode);
        });
        this.setState({ checkedNodes });
    }

    mergeUnheckedNodes() {
        const { checkedNodes } = this.state;
        const newNodes = this.RightTree.getUncheckedNodes();

        newNodes.forEach((newNode) => {
            const index = checkedNodes.findIndex((node) => {
                return node.id === newNode;
            });
            (index > -1) && checkedNodes.splice(index, 1);
        });

        this.setState({ checkedNodes });
    }

    render () {
        const { checkedNodes } = this.state;
        return (
            <div className="container">
                <div className="leftTree col-sm-4">
                    <LeftListTree
                        data={this.state.data}
                        ref={elem => {
                            if (elem) {
                                this.LeftTree = elem;
                            }
                        }}
                    />
                </div>
                <div className="controls col-sm-4">
                    <button onClick={this.mergeCheckedNodes}>to the right</button>
                    <button onClick={this.mergeUnheckedNodes}>to the left</button>
                </div>
                <div className="rightTree col-sm-4">
                    <RightListTree
                        data={checkedNodes}
                        ref={elem => {
                            if (elem) {
                                this.RightTree = elem;
                            }
                        }}
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
