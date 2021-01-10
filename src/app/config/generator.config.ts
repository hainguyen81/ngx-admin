export const uuid_dist = 'uuid/';
export const IdGenerators = {
    uuid: {
        v1: require(uuid_dist + 'v1'),
        v3: require(uuid_dist + 'v3'),
        v4: require(uuid_dist + 'v4'),
        v5: require(uuid_dist + 'v5'),
    },
    oid: require('bson-objectid'),
};
