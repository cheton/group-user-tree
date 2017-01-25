import React from 'react';
import classNames from 'classnames';
import InfiniteTree from 'react-infinite-tree';
import 'react-infinite-tree/dist/react-infinite-tree.css';
import './index.styl';

export default class BlockListTree extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            searchMode: false
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.getCheckedNodes = this.getCheckedNodes.bind(this);
    }

    componentDidMount () {
        this.tree.loadData(this.props.data);
    }

    handleSearch (event) {
        event.preventDefault();
        const bindedSearch = this.props.handleSearch.bind(this);
        bindedSearch(event);
    }

    getCheckedNodes () {
        const nodesToFilter = this.tree.nodes;

        const checkedNodes = nodesToFilter.filter((node) => {
            return node.props.checked === true;
        }).filter((node) => {
            if (node.id === 'search' || node.id === 'noResult') {
                return false;
            } else if (node.parent.props) {
                return node.parent.props.checked !== true || node.parent.id === 'search';
            }

            return true;
        })
        .map((node) => {
            const nodeToSend = {
                id: node.id,
                props: {
                    label: node.props.label,
                    clone: node.props.clone,
                    clonedId: node.props.clonedId
                }
            };

            return nodeToSend;
        });
        return checkedNodes;
    }

    render () {
        return (
            <div>
                <form onSubmit={this.handleSearch}>
                    <input
                        name="keyWord"
                        type="text"
                        ref={(c) => {
                            if (c) {
                                this.form = c.form;
                            }
                        }}
                    />
                </form>
                <InfiniteTree
                    ref={(c) => {
                        if (c) {
                            this.tree = c.tree;
                        }
                    }}
                    autoOpen={!this.state.searchMode}
                    rowRenderer={(node, treeOptions) => {
                        const { id, loadOnDemand = false, state, props = {} } = node;
                        const { depth, open } = state;
                        const { checked = false, isFiltered = true } = props;
                        const { searchMode } = this.state;
                        const more = node.hasChildren();
                        let style;

                        if (!isFiltered && !searchMode) {
                            return (<div
                                data-id={id}
                                style={{ display: 'none' }}
                            />);
                        }

                        if (checked === 'partial') {
                            style = 'icon-checkbox-checked';
                        } else {
                            style = checked ? 'icon-checkmark2' : 'icon-checkbox-unchecked';
                        }

                        return (
                            <div
                                className={classNames(
                                  'infinite-tree-item',
                                  { 'infinite-tree-selected': checked }
                                )}
                                data-id={id}
                            >
                                <div
                                    className="infinite-tree-node"
                                    style={{ marginLeft: depth * 18 }}
                                >
                                    {!more && loadOnDemand &&
                                        <a className={classNames(treeOptions.togglerClass, 'infinite-tree-closed')}>►</a>
                                    }
                                    {more && open &&
                                        <a className={classNames(treeOptions.togglerClass)}>▼</a>
                                    }
                                    {more && !open &&
                                        <a className={classNames(treeOptions.togglerClass, 'infinite-tree-closed')}>►</a>
                                    }
                                    <i className={style} aria-hidden="true" />
                                    <span className="infinite-tree-title">{props.label}</span>
                                </div>
                            </div>
                        );
                    }}
                    selectable
                    shouldSelectNode={(rootNode) => {
                        const more = rootNode.hasChildren();

                        const recursiveUpdate = (node) => {
                            const more = node.hasChildren();

                            node.props.checked = rootNode.props.checked;

                            if (more) {
                                node.children.forEach(child => {
                                    recursiveUpdate(child);
                                });
                            }
                        };

                        if (
                            rootNode.props.checked === 'partial' ||
                            rootNode.props.checked === false ||
                            rootNode.props.checked === undefined
                            ) {
                            rootNode.props.checked = true;
                        } else {
                            rootNode.props.checked = false;
                        }

                        if (more) {
                            recursiveUpdate(rootNode);
                        }

                        const changeParentChecked = (parent) => {
                            const childrenLength = parent.children.length;
                            let checkedChildren = 0;
                            let checked;

                            const isPartial = parent.children.find((child) => {
                                return child.props.checked === 'partial';
                            });

                            parent.children.forEach((child) => {
                                if (child.props.checked) {
                                    checkedChildren++;
                                }
                            });

                            parent.children.find((child) => {
                                return child.props.checked === 'partial';
                            });

                            if (checkedChildren > 0 && checkedChildren < childrenLength || isPartial) {
                                checked = 'partial';
                            } else if (checkedChildren === 0) {
                                checked = false;
                            } else {
                                checked = true;
                            }

                            return checked;
                        };

                        const recursiveParentChange = (parent, child) => {
                            parent.props.checked = changeParentChecked(parent);
                            if (parent.state.depth !== 0) {
                                recursiveParentChange(parent.parent, parent);
                            } else {
                                this.tree.updateNode(parent);
                            }
                        };

                        if (rootNode.state.depth !== 0) {
                            recursiveParentChange(rootNode.parent, rootNode);
                        } else {
                            this.tree.updateNode(rootNode);
                        }

                        return false;
                    }}
                />
            </div>
        );
    }
}

BlockListTree.propTypes = {
    isFiltered: React.PropTypes.bool,
    handleSearch: React.PropTypes.func,
    data: React.PropTypes.obj,
    checked: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool
    ])
};
