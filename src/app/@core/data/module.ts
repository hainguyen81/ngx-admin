import { Api } from './api';

export interface Module {
  id: string;
  code: string;
  name: string;
  apiId: string;
  api?: Api | null;
}
