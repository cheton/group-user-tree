import React from 'react';
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
        this.getUncheckedNodes = this.getUncheckedNodes.bind(this);
    }

    componentDidMount () {
        this.tree.loadData(this.props.data);
    }

    componentWillReceiveProps (nextProps) {
        if (this.state.searchMode) {
            this.handleSearch();
            return;
        }

        this.tree.loadData(nextProps.data);
    }

    handleSearch (event) {
        event && event.preventDefault();
        const bindedSearch = this.props.handleSearch.bind(this);
        bindedSearch(event);
    }

    getUncheckedNodes () {
        const checkedNodes = this.tree.nodes.filter((node) => {
            if (node.props.checked && node.props.checked !== false) {
                this.tree.updateNode(node);

                return true;
            }
            return false;
        })
        .map((node) => {
            return { id: node.id, clone: node.props.clone, clonedId: node.props.clonedId };
        });

        return checkedNodes;
    }

    render () {
        return (
            <div>
                <form onSubmit={this.handleSearch}>
                    <input
                        type="text"
                        name="keyWord"
                        style={{ width: '100%' }}
                        placeholder="Search...(press enter to search)"
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
                    autoOpen
                    rowRenderer={this.props.rowRenderer}
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
    handleSearch: React.PropTypes.func,
    rowRenderer: React.PropTypes.func,
    isFiltered: React.PropTypes.bool,
    data: React.PropTypes.obj,
    checked: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool
    ])
};
