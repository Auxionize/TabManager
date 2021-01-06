
import { ListItem, ListItemText, Tabs, Tab, makeStyles, Typography, Divider } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { NextRouter } from 'next/router';
import { TreeItem, TreeView } from '@material-ui/lab';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { TabConfig, TabConfigWithElement } from './TabConfig';
import { IconType } from './otherTypes';
import React from 'react';


export const DIVIDER = 'DIVIDER';
const isDivider = (tab: any): tab is typeof DIVIDER => typeof tab === typeof DIVIDER;

export interface TabManagerOptions {
  namespace?: string;
  showIcons?: boolean;
  defaultIcon?: IconType;
}


/**
 * @param <T> The type of the tab config
 * @param <K> The type of the tab key
 */
export default class TabManager<
  T extends TabConfig<TabKey, IconKey>, 
  TabKey extends string = string,
  IconKey extends string = string,
> {

  constructor(
    private tabConfigs: Array<T | typeof DIVIDER>,
    private iconStore: (iconKey: IconKey) => IconType,
    private handleChange?: (tab: T) => any,
    private options: TabManagerOptions = {
      showIcons: true,
      namespace: '',
    },
  ) { }

  public TabList = (currentTabKey?: TabKey, showIcon: boolean = true, compact: boolean = false) => (
    <TreeView
      defaultExpanded={['3']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
    >
      {this.tabConfigs.map((tabConfig, idx) => this.tab(tabConfig, idx, currentTabKey, showIcon, compact))}
    </TreeView>
  );

  public treeItemClasses = makeStyles(theme => ({
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
  public tab = (tabConfig: T | typeof DIVIDER, nodeId: number, currentTabKey?: TabKey, showIcon: boolean = true, compact: boolean = false) => {
    if (isDivider(tabConfig)) {
      return <Divider variant="middle" component="li" key={nodeId} />;
    } else {
      return <TreeItem
        key={nodeId}
        style={{ borderLeft: (tabConfig.key === currentTabKey) ? '1px solid red' : 'none', ...tabConfig.tab.style }}
        label={
          <ListItem key={nodeId} onClick={() => !tabConfig.items && this.handleChangeInternal(tabConfig)} component="div">
            {
              showIcon &&
              <ListItemIcon style={{ minWidth: compact ? 30 : 54 }}>
                {this.getFormatedIcon(tabConfig)}
              </ListItemIcon>
            }
            <ListItemText primary={tabConfig.tab.label} />
          </ListItem>
        }
        nodeId={String(nodeId)}
        classes={{
          content: this.treeItemClasses.content,
          iconContainer: tabConfig.items ? this.treeItemClasses.icon : this.treeItemClasses.noIcon,
        }}
      >
        {tabConfig.items && tabConfig.items.map((i: any, idx) => this.tab(i, nodeId * 1000 + idx, currentTabKey, showIcon, compact))}
      </TreeItem>
    }
  }

  public handleChangeInternal(tab: T) {
    if (this.handleChange) {
      this.handleChange(tab);
    }
    // else if (typeof tab === TabConfigWithPath) {

    // }
  }

  public HorizontalTabList = (
    currentTabKey: TabKey,
    showIcon: boolean = true,
    tabProps?: any,
  ) => {
    const useStyles = makeStyles(theme => ({
      wrapper: {
        flexDirection: 'row',
      },
    }));
    const classes = useStyles();
    return (
      <Tabs {... {
        orientation: 'horizontal',
        value: currentTabKey,
        ...tabProps,
      }}>
        {
          this.getTabs().map((tabConfig) => <Tab
            key={tabConfig.key}
            value={tabConfig.key}
            onClick={() => this.handleChangeInternal(tabConfig)}
            classes={{ wrapper: classes.wrapper }}
            label={
              <>
                {showIcon && this.getFormatedIcon(tabConfig)}
                <Typography style={{ textTransform: 'capitalize', marginLeft: tabConfig.tab.icon || showIcon ? 5 : 0 }}>
                  {tabConfig.tab.label}
                </Typography>
              </>
            }
          />)
        }
      </Tabs >
    );
  }

  private getTabs(): T[] {
    return this.tabConfigs.filter(this.isTab);
  }

  private isTab(tab: T | typeof DIVIDER): tab is T {
    return !isDivider(tab);
  }

  private getFormatedIcon(tabConfig: T) {
    const icon = this.getIcon(tabConfig);
    if (typeof icon === 'string') {
      return <img style={{ height: 40, margin: 6 }} src={icon} />;
    } else {
      return icon;
    }
  }

  private getIcon(tabConfig: T) {
    // If the config provided it's own icon
    if (tabConfig.tab.icon) {
      return tabConfig.tab.icon;

      // If the config provided it's own iconKey
    } else if (tabConfig.iconKey) {
      return this.iconStore(tabConfig.iconKey);

      // If the config key matches an icon key
    } else if (this.iconStore(tabConfig.key as any)) {
      return this.iconStore(tabConfig.key as any);

      // Finally return the default icon
    } else {
      return this.options.defaultIcon!;
    }
  }

  public getInitialTabKey = (router: NextRouter, defaultTab: string) => {
    return typeof router.query.tab === 'string'
      && this.getTabKeys().indexOf(router.query.tab) >= 0 ? router.query.tab : defaultTab;
  }

  public getTabKeys = () => this.getTabs().map(t => t.key as string);

  public pushToRouter = (router: NextRouter, currentTabKey: TabKey) => {
    router.push(router.pathname, `${router.pathname}?tab=${currentTabKey}`);
  }

  public getTab = (tabKey: TabKey) => {
    const tab = this.getTabs().find((t) => t.key === tabKey);
    if (!tab) {
      throw new Error('missing tab for key: ' + tabKey);
    }
    return tab;
  }

  public getElement = <K extends string>(currentTab: K) => {
    return TabManager.getElement(this.getTabs() as any, currentTab);
  }

  public static getElement = <K extends string>(configs: Array<TabConfigWithElement<K>>, currentTab: K) => {
    const config = configs.find(tab => tab.key === currentTab);
    if (!config) {
      return <></>;
    }
    return config.element;
  }
}