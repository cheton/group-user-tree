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
            checkedNodes: {
                id: 'selectedRoot',
                props: {
                    label: 'Selected Users / Groups'
                },
                children: []
            }
        };
        this.mergeCheckedNodes = this.mergeCheckedNodes.bind(this);
        this.mergeUnheckedNodes = this.mergeUnheckedNodes.bind(this);
    }

    mergeCheckedNodes() {
        const { checkedNodes } = this.state;
        const newNodes = this.leftTree.getCheckedNodes();

        newNodes.forEach((newNode) => {
            const isClone = newNode.props.clone;

            newNode.id = isClone ? newNode.props.clonedId : newNode.id;
            const isNew = checkedNodes.children.find((node) => {
                return node.id === newNode.id;
            });

            !isNew && checkedNodes.children.push(newNode);
        });
        this.setState({ checkedNodes });
    }

    mergeUnheckedNodes() {
        const { checkedNodes } = this.state;
        const newNodes = this.rightTree.getUncheckedNodes();

        newNodes.forEach((newNode) => {
            const isClone = newNode.clone;
            newNode.id = isClone ? newNode.clonedId : newNode.id;

            const index = checkedNodes.children.findIndex((node) => {
                return node.id === newNode.id;
            });
            (index > -1) && checkedNodes.children.splice(index, 1);
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
                                this.leftTree = elem;
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
                                this.rightTree = elem;
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
