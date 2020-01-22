export interface Api {
  id: string;
  code: string;
  name: string;
  regexUrl?: string | null;
  baseUrl?: string | null;
  icon?: string | null;
  version?: string | null;
}
