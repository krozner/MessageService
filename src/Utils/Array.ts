"use strict";

export class Array {

    static unique(arr: any) {
        const uniqueFilter = (value: any, index: any, self: any) => {
            return self.indexOf(value) === index;
        };
        return arr.filter(uniqueFilter);
    }

    static sum(arr: any) {
        return parseInt(arr.reduce((a: any, b: any) => a + b, 0)) || 0;
    }

    static async asyncForEach(array: any, callback: Function) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }
}

interface ILoopCallback {
    (value: any, key: string): void;
}

export const loop = (items: any, callback: ILoopCallback) => {
    Object.keys(items).forEach((key: any) => {
        callback(items[key], key);
    });
};
