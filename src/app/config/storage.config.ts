export const StorageConfig: {
    /**
     * Determines the key prefix. (Default: null)
     */
    prefix?: string;
    /**
     * Determines if null | 'null' values should be stored. (Default: true)
     */
    allowNull?: boolean;
} =  {
    prefix: 'hi_system_',
    allowNull: false,
};

export const SecureStorageConfig: {
    isCompression?: boolean | false;
    encodingType?: string | null;
    encryptionSecret?: string | null;
    encryptionNamespace?: string | null;
} =  {
    isCompression: true,
    encodingType: 'base64',
    encryptionNamespace: 'hi-system',
};
