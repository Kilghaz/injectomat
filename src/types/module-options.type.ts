import { Module } from '../module';
import { Component } from './component.type';
import { Provider } from './provider';

export type ModuleOptions = {
    components?: Component[];
    imports?: Module[];
    providers?: Provider<unknown>[];
}
