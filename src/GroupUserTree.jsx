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
            draggingNode: {},
            nodeOwner: ''
        };

        this.dropNode = this.dropNode.bind(this);
        this.beginDrag = this.beginDrag.bind(this);
        this.mergeCheckedNodes = this.mergeCheckedNodes.bind(this);
        this.mergeUncheckedNodes = this.mergeUncheckedNodes.bind(this);
    }

    beginDrag(node, nodeOwner) {
        this.setState({ dragStarted: true, draggingNode: node, nodeOwner });
    }

    mergeCheckedNodes(draggedNode) {
        const { selectedNodes } = this.state;
        const newNodes = (Array.isArray(draggedNode) && draggedNode) || this.leftTree.getCheckedNodes();

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

    mergeUncheckedNodes(draggedNode) {
        const { selectedNodes } = this.state;
        const newNodes = (Array.isArray(draggedNode) && draggedNode) || this.rightTree.getCheckedNodes();

        newNodes.forEach((newNode) => {
            const index = selectedNodes.children.findIndex((node) => {
                return node.id === newNode.id;
            });
            (index > -1) && selectedNodes.children.splice(index, 1);
        });

        this.setState({ selectedNodes });
    }

    allowDrop(ev) {
        ev.preventDefault();
    }

    dropNode(target) {
        const { draggingNode, nodeOwner } = this.state;

        if (target === 'right' && nodeOwner === 'left') {
            this.mergeCheckedNodes(draggingNode);
            this.setState({ dragStarted: false, draggingNode: {}, nodeOwner: '' });
        } else if (target === 'left' && nodeOwner === 'right') {
            this.mergeUncheckedNodes(draggingNode);
            this.setState({ dragStarted: false, draggingNode: {}, nodeOwner: '' });
        }
    }

    render () {
        const { selectedNodes, nodeOwner, dragStarted } = this.state;
        return (
            <div className="container">
                <div
                    className="leftTree col-sm-4"
                    onDrop={() => {
                        this.dropNode('left');
                    }}
                    onDragOver={this.allowDrop}
                >
                    <div>Available Users / Groups</div>
                    <LeftListTree
                        data={this.state.data}
                        ref={elem => {
                            if (elem) {
                                this.leftTree = elem;
                            }
                        }}
                        rowRenderer={rowRenderer}
                        beginDrag={this.beginDrag}
                        dragStarted={dragStarted}
                        nodeOwner={nodeOwner}
                    />
                </div>
                <div className="controls col-sm-4">
                    <button onClick={this.mergeCheckedNodes}>{'Add >>'}</button>
                    <button onClick={this.mergeUncheckedNodes}>{'<< Remove'}</button>
                </div>
                <div
                    className="rightTree col-sm-4"
                    onDrop={() => {
                        this.dropNode('right');
                    }}
                    onDragOver={this.allowDrop}
                >
                    <div className="tree-title">
                      Selected Users / Groups
                    </div>
                    <RightListTree
                        data={selectedNodes}
                        beginDrag={this.beginDrag}
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
