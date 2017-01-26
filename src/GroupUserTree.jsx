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
            }
        };

        this.mergeCheckedNodes = this.mergeCheckedNodes.bind(this);
        this.mergeUnheckedNodes = this.mergeUnheckedNodes.bind(this);
    }

    handleSearch () {
        const searchKeyword = this.form.keyWord.value.toLowerCase();
        const { data } = this.props;

        this.tree.loadData(data);
        if (searchKeyword === '') {
            return;
        }

        this.setState({ searchMode: true });

        let selectedNodes = this.tree.nodes.filter((node) => {
            if (node.id === 'selectedRoot') {
                return false;
            }
            node.props = node.props || {};
            return !(node.props.label.toLowerCase().indexOf(searchKeyword) < 0 && searchKeyword !== '');
        })
        .map((node) => {
            const nodeToSend = {
                id: `${node.id + Math.random()}`,
                props: {
                    label: node.props.label,
                    checked: node.props.checked,
                    clone: true,
                    clonedId: node.id
                }
            };

            if (node.hasChildren()) {
                nodeToSend.children = [...node.children].map((child) => {
                    return {
                        id: `${child.id + Math.random()}`,
                        props: {
                            label: child.props.label,
                            checked: child.props.checked,
                            clone: true,
                            clonedId: child.id
                        }
                    };
                });
            }

            return nodeToSend;
        });

        if (selectedNodes.length === 0) {
            selectedNodes = [{
                id: 'noResult',
                props: { label: 'No result' }
            }];
        }

        const searchNode = {
            id: 'search',
            props: { label: `Search: ${searchKeyword}` },
            children: selectedNodes
        };

        this.tree.loadData(searchNode);
    }

    mergeCheckedNodes() {
        const { selectedNodes } = this.state;
        const newNodes = this.leftTree.getCheckedNodes();

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
                    <div>Availeble Users / Groups</div>
                    <LeftListTree
                        data={this.state.data}
                        ref={elem => {
                            if (elem) {
                                this.leftTree = elem;
                            }
                        }}
                        handleSearch={this.handleSearch}
                        rowRenderer={rowRenderer}
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
                        rowRenderer={rowRenderer}
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
