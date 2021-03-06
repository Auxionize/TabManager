import { TabTypeMap } from "@material-ui/core";
import React from 'react';
export interface TabConfig<TabKey extends string = string, IconKey extends string = string> {
    key: TabKey;
    iconKey?: IconKey;
    tab: TabTypeMap['props'];
    items?: Array<TabConfig<TabKey> | TabConfigWithPath<TabKey> | TabConfigWithElement<TabKey>>;
}
export declare type TabConfigWithPath<TabKey extends string = string, IconKey extends string = string> = TabConfig<TabKey, IconKey> & {
    path: string;
};
export declare type TabConfigWithElement<TabKey extends string = string, IconKey extends string = string> = TabConfig<TabKey, IconKey> & {
    element: React.ReactElement;
};
