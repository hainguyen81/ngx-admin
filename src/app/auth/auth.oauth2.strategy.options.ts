import {NbPasswordAuthStrategyOptions} from '@nebular/auth';

export interface NbxPasswordStrategyModule {
    alwaysFail?: boolean;
    endpoint?: string;
    method?: string;
    redirect?: {
        success?: string | null;
        failure?: string | null;
    };
    requireValidToken?: boolean;
    defaultErrors?: string[];
    defaultMessages?: string[];
    headers?: any | {};
}

export declare class NbxPasswordAuthStrategyOptions extends NbPasswordAuthStrategyOptions {
    login?: boolean | NbxPasswordStrategyModule;
    register?: boolean | NbxPasswordStrategyModule;
    requestPass?: boolean | NbxPasswordStrategyModule;
    resetPass?: boolean | NbxPasswordStrategyModule;
    refreshToken?: boolean | NbxPasswordStrategyModule;
}
