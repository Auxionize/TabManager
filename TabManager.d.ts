/// <reference types="react" />
import { NextRouter } from 'next/router';
import { TabConfig, TabConfigWithElement } from './TabConfig';
import { IconType } from './otherTypes';
export declare const DIVIDER = "DIVIDER";
export interface TabManagerOptions {
    namespace?: string;
    showIcons?: boolean;
    defaultIcon?: IconType;
}
/**
 * @param <T> The type of the tab config
 * @param <K> The type of the tab key
 */
export default class TabManager<T extends TabConfig<TabKey, IconKey>, TabKey extends string = string, IconKey extends string = string> {
    private tabConfigs;
    private iconStore;
    private handleChange?;
    private options;
    constructor(tabConfigs: Array<T | typeof DIVIDER>, iconStore: (iconKey: IconKey) => IconType, handleChange?: ((tab: T) => any) | undefined, options?: TabManagerOptions);
    TabList: (currentTabKey?: TabKey | undefined, showIcon?: boolean, compact?: boolean) => JSX.Element;
    treeItemClasses: Record<"content" | "icon" | "noIcon", string>;
    tab: (tabConfig: T | typeof DIVIDER, nodeId: number, currentTabKey?: TabKey | undefined, showIcon?: boolean, compact?: boolean) => JSX.Element;
    handleChangeInternal(tab: T): void;
    HorizontalTabList: (currentTabKey: TabKey, showIcon?: boolean, tabProps?: any) => JSX.Element;
    private getTabs;
    private isTab;
    private getFormatedIcon;
    private getIcon;
    getInitialTabKey: (router: NextRouter, defaultTab: string) => any;
    getTabKeys: () => string[];
    pushToRouter: (router: NextRouter, currentTabKey: TabKey) => void;
    getTab: (tabKey: TabKey) => T;
    getElement: <K extends string>(currentTab: K) => JSX.Element;
    static getElement: <K extends string>(configs: TabConfigWithElement<K, string>[], currentTab: K) => JSX.Element;
}
