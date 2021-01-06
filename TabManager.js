import { ListItem, ListItemText, Tabs, Tab, makeStyles, Typography, Divider } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { TreeItem, TreeView } from '@material-ui/lab';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import React from 'react';
export const DIVIDER = 'DIVIDER';
const isDivider = (tab) => typeof tab === typeof DIVIDER;
/**
 * @param <T> The type of the tab config
 * @param <K> The type of the tab key
 */
export default class TabManager {
    constructor(tabConfigs, iconStore, handleChange, options = {
        showIcons: true,
        namespace: '',
    }) {
        this.tabConfigs = tabConfigs;
        this.iconStore = iconStore;
        this.handleChange = handleChange;
        this.options = options;
        this.TabList = (currentTabKey, showIcon = true, compact = false) => (React.createElement(TreeView, { defaultExpanded: ['3'], defaultCollapseIcon: React.createElement(ArrowDropDownIcon, null), defaultExpandIcon: React.createElement(ArrowRightIcon, null), defaultEndIcon: React.createElement("div", { style: { width: 24 } }) }, this.tabConfigs.map((tabConfig, idx) => this.tab(tabConfig, idx, currentTabKey, showIcon, compact))));
        this.treeItemClasses = makeStyles(theme => ({
            content: {
                flexDirection: 'row-reverse',
            },
            icon: {
                width: 24,
            },
            noIcon: {
                width: 0,
            },
        }))();
        this.tab = (tabConfig, nodeId, currentTabKey, showIcon = true, compact = false) => {
            if (isDivider(tabConfig)) {
                return React.createElement(Divider, { variant: "middle", component: "li", key: nodeId });
            }
            else {
                return React.createElement(TreeItem, { key: nodeId, style: { borderLeft: (tabConfig.key === currentTabKey) ? '1px solid red' : 'none', ...tabConfig.tab.style }, label: React.createElement(ListItem, { key: nodeId, onClick: () => !tabConfig.items && this.handleChangeInternal(tabConfig), component: "div" },
                        showIcon &&
                            React.createElement(ListItemIcon, { style: { minWidth: compact ? 30 : 54 } }, this.getFormatedIcon(tabConfig)),
                        React.createElement(ListItemText, { primary: tabConfig.tab.label })), nodeId: String(nodeId), classes: {
                        content: this.treeItemClasses.content,
                        iconContainer: tabConfig.items ? this.treeItemClasses.icon : this.treeItemClasses.noIcon,
                    } }, tabConfig.items && tabConfig.items.map((i, idx) => this.tab(i, nodeId * 1000 + idx, currentTabKey, showIcon, compact)));
            }
        };
        this.HorizontalTabList = (currentTabKey, showIcon = true, tabProps) => {
            const useStyles = makeStyles(theme => ({
                wrapper: {
                    flexDirection: 'row',
                },
            }));
            const classes = useStyles();
            return (React.createElement(Tabs, Object.assign({}, {
                orientation: 'horizontal',
                value: currentTabKey,
                ...tabProps,
            }), this.getTabs().map((tabConfig) => React.createElement(Tab, { key: tabConfig.key, value: tabConfig.key, onClick: () => this.handleChangeInternal(tabConfig), classes: { wrapper: classes.wrapper }, label: React.createElement(React.Fragment, null,
                    showIcon && this.getFormatedIcon(tabConfig),
                    React.createElement(Typography, { style: { textTransform: 'capitalize', marginLeft: tabConfig.tab.icon || showIcon ? 5 : 0 } }, tabConfig.tab.label)) }))));
        };
        this.getInitialTabKey = (router, defaultTab) => {
            return typeof router.query.tab === 'string'
                && this.getTabKeys().indexOf(router.query.tab) >= 0 ? router.query.tab : defaultTab;
        };
        this.getTabKeys = () => this.getTabs().map(t => t.key);
        this.pushToRouter = (router, currentTabKey) => {
            router.push(router.pathname, `${router.pathname}?tab=${currentTabKey}`);
        };
        this.getTab = (tabKey) => {
            const tab = this.getTabs().find((t) => t.key === tabKey);
            if (!tab) {
                throw new Error('missing tab for key: ' + tabKey);
            }
            return tab;
        };
        this.getElement = (currentTab) => {
            return TabManager.getElement(this.getTabs(), currentTab);
        };
    }
    handleChangeInternal(tab) {
        if (this.handleChange) {
            this.handleChange(tab);
        }
        // else if (typeof tab === TabConfigWithPath) {
        // }
    }
    getTabs() {
        return this.tabConfigs.filter(this.isTab);
    }
    isTab(tab) {
        return !isDivider(tab);
    }
    getFormatedIcon(tabConfig) {
        const icon = this.getIcon(tabConfig);
        if (typeof icon === 'string') {
            return React.createElement("img", { style: { height: 40, margin: 6 }, src: icon });
        }
        else {
            return icon;
        }
    }
    getIcon(tabConfig) {
        // If the config provided it's own icon
        if (tabConfig.tab.icon) {
            return tabConfig.tab.icon;
            // If the config provided it's own iconKey
        }
        else if (tabConfig.iconKey) {
            return this.iconStore(tabConfig.iconKey);
            // If the config key matches an icon key
        }
        else if (this.iconStore(tabConfig.key)) {
            return this.iconStore(tabConfig.key);
            // Finally return the default icon
        }
        else {
            return this.options.defaultIcon;
        }
    }
}
TabManager.getElement = (configs, currentTab) => {
    const config = configs.find(tab => tab.key === currentTab);
    if (!config) {
        return React.createElement(React.Fragment, null);
    }
    return config.element;
};
//# sourceMappingURL=TabManager.js.map