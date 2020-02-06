export interface IModel {
    id: string;
    createdAt?: number | string | null;
    createdUser?: string | null;
    updatedAt?: number | string | null;
    updatedUser?: string | null;
    deletedAt?: number | string | null;
}
