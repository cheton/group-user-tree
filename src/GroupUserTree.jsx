import React from 'react';
import 'react-infinite-tree/dist/react-infinite-tree.css';
import { data } from './data';
import LeftListTree from './LeftListTree';
import RightListTree from './RightListTree';
import rowRenderer from './rowRenderer';
import './index.styl';

export default class GroupUserTree extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            data,
            selectedNodes: {
                id: 'selectedRoot',
                props: {
                    label: 'Selected Users / Groups'
                },
                children: []
            },
            dragStarted: false,
            draggingNode: {}
        };


        this.mergeDropped = this.mergeDropped.bind(this);
        this.mergeCheckedNodes = this.mergeCheckedNodes.bind(this);
        this.mergeUnheckedNodes = this.mergeUnheckedNodes.bind(this);
    }

    mergeDropped(node) {
        this.setState({ dragStarted: true, draggingNode: node });
        console.log('state parent', node);
    }

    mergeCheckedNodes(draggedNode) {
      console.log('draggedNode', draggedNode);
        const { selectedNodes } = this.state;
        const newNodes = draggedNode || this.leftTree.getCheckedNodes();

        newNodes.forEach((newNode) => {
            const isClone = newNode.props.clone;

            newNode.id = isClone ? newNode.props.clonedId : newNode.id;
            const isNew = selectedNodes.children.find((node) => {
                return node.id === newNode.id;
            });

            !isNew && selectedNodes.children.push(newNode);
        });
        this.setState({ selectedNodes });
    }

    mergeUnheckedNodes() {
        const { selectedNodes } = this.state;
        const newNodes = this.rightTree.getCheckedNodes();

        newNodes.forEach((newNode) => {
            const index = selectedNodes.children.findIndex((node) => {
                return node.id === newNode.id;
            });
            (index > -1) && selectedNodes.children.splice(index, 1);
        });

        this.setState({ selectedNodes });
    }

    render () {
        const { selectedNodes } = this.state;
        return (
            <div className="container">
                <div className="leftTree col-sm-4">
                    <div>Available Users / Groups</div>
                    <LeftListTree
                        data={this.state.data}
                        ref={elem => {
                            if (elem) {
                                this.leftTree = elem;
                            }
                        }}
                        rowRenderer={rowRenderer}
                        mergeDropped={this.mergeDropped}
                        dragStarted={this.state.dragStarted}
                    />
                </div>
                <div className="controls col-sm-4">
                    <button onClick={this.mergeCheckedNodes}>{'Add >>'}</button>
                    <button onClick={this.mergeUnheckedNodes}>{'<< Remove'}</button>
                </div>
                <div className="rightTree col-sm-4">
                    <div className="tree-title">Selected Users / Groups</div>
                    <RightListTree
                        data={selectedNodes}
                        dragStarted={this.state.dragStarted}
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
    data: React.PropTypes.object,
    isFiltered: React.PropTypes.bool,
    checked: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool
    ])
};
