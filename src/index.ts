/* ************************************************************************ *
 * Author: Thilo Spinner                                                    *
 * This is a TypeScript version of EfogDev's react-process-string library.  *
 * The original library can be found here:                                  *
 * https://github.com/EfogDev/react-process-string                          *
 ************************************************************************** */

import React from 'react';

/**
 * This function allows to process strings with regular expressions in React.
 * @param options Options should be an array of objects containing a regex and a replacement function fn.
 * @param input The input text in which to replace parts.
 */
export type ProcessStringOption = {
    regex?: RegExp;
    fn?: (key: number, result: RegExpExecArray) => string | JSX.Element;
};

export default function processString(
    options: ProcessStringOption[]
): (input: string | (string | JSX.Element)[]) => string | JSX.Element | (string | JSX.Element)[] {
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
