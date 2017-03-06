import * as mongo from 'mongodb';

export const isAnArray = x => Array.isArray(x);
export const isNotAnArray = x => !isAnArray(x);

export const isABoolean = x => typeof x == 'boolean';
export const isNotABoolean = x => !isABoolean(x);

export const isAnId = x => mongo.ObjectID.isValid(x);
export const isNotAnId = x => !isAnId(x);

export const isANumber = x => Number.isFinite(x);
export const isNotANumber = x => !isANumber(x);

export const isAnObject = x => typeof x == 'object';
export const isNotAnObject = x => !isAnObject(x);

export const isAString = x => typeof x == 'string';
export const isNotAString = x => !isAString(x);
