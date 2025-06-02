import _isString from 'lodash-es/isString';
import { SaveFileParserEvent, SaveFileParserEventType } from "@/lib/types";

export const getErrorMessage = (err: unknown): string => {

    let message: string = 'Unknown error';

    if (err instanceof Error) {
        message = err.message;
    } else if (_isString(err)) {
        message = err;
    }

    return message;
}

export function sendEvent<T>(type: SaveFileParserEventType, data?: T) {
    const evt: SaveFileParserEvent<T> = { type, data };
    postMessage(evt);
}