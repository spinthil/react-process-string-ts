/* ************************************************************************ *
 * Author: TSpinner                                                         *
 * Date: 2023-03-24                                                         *
 * This is a TypeScript version of EfogDev's react-process-string library.  *
 * The original library can be found here:                                  *
 * https://github.com/EfogDev/react-process-string                          *
 ************************************************************************** */

import React from 'react';


export type ProcessStringOption = {
    regex: RegExp;
    fn: (key: number, result: RegExpExecArray) => string | JSX.Element;
};

/**
 * This function allows to process strings with regular expressions in React.
 * @param options An array of ProcessStringOptions, each containing a regex and a replacement function fn.
 * @returns A function that takes an input text (string or JSX elements) and returns the text processed according to the given options.
 */
export default function processString(
    options: ProcessStringOption[]
): (input: string | JSX.Element | (string | JSX.Element)[]) => string | JSX.Element | (string | JSX.Element)[] {
    let key = 0;
    function processInputWithRegex(
        option: ProcessStringOption,
        input: string | JSX.Element | (string | JSX.Element)[]
    ): string | JSX.Element | (string | JSX.Element)[] {
        if (!option.fn || typeof option.fn !== 'function') return input;
        if (!option.regex) return input;
        if (Array.isArray(input)) {
            return input.flatMap((chunk: string | JSX.Element) => processInputWithRegex(option, chunk));
        }
        if (typeof input === 'string') {
            const regex = option.regex;
            let result = null;
            const output: (string | JSX.Element)[] = [];
            while ((result = regex.exec(input)) !== null) {
                const index = result.index;
                const match = result[0];
                output.push(input.substring(0, index));
                output.push(option.fn(++key, result));
                input = input.substring(index + match.length, input.length + 1);
                regex.lastIndex = 0;
            }
            output.push(input);
            return output;
        }
        if (typeof input === 'object') {
            // In this case, input is a JSX.Element.
            const content = input.props.children;
            // In case the element has children, we process them.
            if (content !== undefined) {
                const processedContent = processInputWithRegex(option, content);
                return React.cloneElement(input, { ...input.props, children: processedContent });
            }
        }

        return input;
    }
    return function (
        input: string | JSX.Element | (string | JSX.Element)[]
    ): string | JSX.Element | (string | JSX.Element)[] {
        if (!options || !Array.isArray(options) || !options.length) return input;
        options.forEach((option) => (input = processInputWithRegex(option, input)));
        return input;
    };
}
