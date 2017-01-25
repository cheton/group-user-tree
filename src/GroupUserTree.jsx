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

    handleSearch () {
        const searchKeyword = this.form.keyWord.value.toLowerCase();
        const { data } = this.props;

        this.tree.loadData(data);
        if (searchKeyword === '') {
            return;
        }

        this.setState({ searchMode: true });

        let checkedNodes = this.tree.nodes.filter((node) => {
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

        if (checkedNodes.length === 0) {
            checkedNodes = [{
                id: 'noResult',
                props: { label: 'No result' }
            }];
        }

        const searchNode = {
            id: 'search',
            props: { label: `Search: ${searchKeyword}` },
            children: checkedNodes
        };

        this.tree.loadData(searchNode);
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
                        handleSearch={this.handleSearch}
                    />
                </div>
                <div className="controls col-sm-4">
                    <button onClick={this.mergeCheckedNodes}>to the right</button>
                    <button onClick={this.mergeUnheckedNodes}>to the left</button>
                </div>
                <div className="rightTree col-sm-4">
                    <RightListTree
                        data={checkedNodes}
                        handleSearch={this.handleSearch}
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
    data: React.PropTypes.obj,
    isFiltered: React.PropTypes.bool,
    checked: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool
    ])
};
