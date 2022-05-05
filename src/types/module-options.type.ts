import { Module } from '../module';
import { Component } from './component.type';
import { Provider } from './provider';
import { Context } from '../context';

export type ModuleOptions = {
    components?: Component[];
    imports?: Module[];
    providers?: Provider<unknown>[];
    context?: Context;
    root?: boolean;
};
