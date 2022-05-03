import { Component as ReactComponent, FC as ReactFunctionComponent } from 'react';
import { Component as VueComponent } from 'vue';

export type Component =
    ReactFunctionComponent |
    ReactComponent |
    VueComponent |
    { name: string } |
    { displayName: string };
