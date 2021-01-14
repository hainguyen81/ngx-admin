import {v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5} from 'uuid';

export const IdGenerators = {
    uuid: {
        v1: uuidv1,
        v3: uuidv3,
        v4: uuidv4,
        v5: uuidv5,
    },
    oid: require('bson-objectid'),
};
