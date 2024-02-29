/// <reference types="react" />
export type ProcessStringOption = {
    regex: RegExp;
    fn: (key: number, result: RegExpExecArray) => string | JSX.Element;
};
/**
 * This function allows to process strings with regular expressions in React.
 * @param options An array of ProcessStringOptions, each containing a regex and a replacement function fn.
 * @returns A function that takes an input text (string or JSX elements) and returns the text processed according to the given options.
 */
export default function processString(options: ProcessStringOption[]): (input: string | JSX.Element | (string | JSX.Element)[]) => string | JSX.Element | (string | JSX.Element)[];
