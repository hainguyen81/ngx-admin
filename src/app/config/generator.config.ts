export const IdGenerators = {
    uuid: {
        v1: require('uuid/v1'),
        v2: require('uuid/v2'),
        v3: require('uuid/v3'),
        v4: require('uuid/v4'),
        v5: require('uuid/v5'),
    },
    oid: require('bson-objectid'),
};
