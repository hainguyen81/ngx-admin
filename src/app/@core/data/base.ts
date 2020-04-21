export interface IModel {
    id: string;
    createdAt?: number | string | null;
    createdUser?: string | null;
    updatedAt?: number | string | null;
    updatedUser?: string | null;
    deletedAt?: number | string | null;
    expiredAt?: number | null;
    // readonly upToDated?: () => boolean | false;
}

export default class BaseModel implements IModel {
    createdAt?: number | string | null;
    createdUser?: string | null;
    updatedAt?: number | string | null;
    updatedUser?: string | null;
    deletedAt?: number | string | null;
    expiredAt?: number | null;
    // readonly upToDated: () => boolean;

    constructor(public id: string) {
        // this.upToDated = () => (!this.deletedAt
        //     && (!this.expiredAt || new Date(this.expiredAt) <= new Date()));
    }
}
