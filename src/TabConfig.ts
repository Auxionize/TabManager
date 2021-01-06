import { TabTypeMap } from "@material-ui/core";
import React from 'react';

export interface TabConfig<
  TabKey extends string = string, 
  IconKey extends string = string
> {
  key: TabKey;
  iconKey?: IconKey;
  tab: TabTypeMap['props'];
  items?: Array<TabConfig<TabKey> | TabConfigWithPath<TabKey> | TabConfigWithElement<TabKey>>;
}

export type TabConfigWithPath<T extends string = string> =
  TabConfig<T> & { path: string };

export type TabConfigWithElement<T extends string = string> =
  TabConfig<T> & { element: React.ReactElement };
