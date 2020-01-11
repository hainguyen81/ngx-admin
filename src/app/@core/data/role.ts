import { Module } from './module';

export interface Role {
  id: string;
  moduleId: string;
  groupId: string;
  writable?: boolean | false;
  module?: Module | null;
}
