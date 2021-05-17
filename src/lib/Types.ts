import { ClientEvents } from 'discord.js';
import { IShensuoEvents } from '.';

export type Permissions = 'clientPermissions' | 'userPermissions';
export type LogTypes = 'info' | 'success' | 'warn' | 'error' | 'checkpoint';
export type UnionEvents = keyof ClientEvents | keyof IShensuoEvents;
export type IntersectedEvents = keyof ClientEvents & keyof IShensuoEvents;
