import {isArray, isBoolean, isObject} from 'util';
import {convertToBoolProperty} from '@nebular/theme/components/helpers';

export const parseResponseJson = (data) => {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {}
  }
  if (isObject(data) && Object.keys(data).length > 0
    && isObject(data['status']) && data['status']['code'] === 200
    && isBoolean(data['status']['success']) && (data['status']['success'] || false)
    && isArray(data['elements']) && Array.from(data['elements']).length > 0) {
    data = Array.from(data['elements']);
  }
  return data;
};
