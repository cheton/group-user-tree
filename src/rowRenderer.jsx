import classNames from 'classnames';
import React from 'react';

const rowRenderer = (node, treeOptions) => {
    const { id, state, loadOnDemand = false, props = {} } = node;
    const { depth, open } = state;
    const { checked = false, loading = false } = props;
    const more = node.hasChildren();

    let style;
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
                {loadOnDemand && loading && <span className="glyphicon glyphicon-refresh" />}
                <span className="infinite-tree-title">{props.label}</span>
            </div>
        </div>
    );
};

rowRenderer.propTypes = {
    checked: React.PropTypes.bool,
    label: React.PropTypes.string
};

export default rowRenderer;
