/// <reference types="react" />
/**
 * This function allows to process strings with regular expressions in React.
 * @param options Options should be an array of objects containing a regex and a replacement function fn.
 * @param input The input text in which to replace parts.
 */
export type ProcessStringOption = {
    regex: RegExp;
    fn: (key: number, result: RegExpExecArray) => string | JSX.Element;
};
export default function processString(options: ProcessStringOption[]): (input: string | (string | JSX.Element)[]) => string | JSX.Element | (string | JSX.Element)[];
