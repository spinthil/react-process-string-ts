"use strict";
/* ************************************************************************ *
 * Author: Thilo Spinner                                                    *
 * This is a TypeScript version of EfogDev's react-process-string library.  *
 * The original library can be found here:                                  *
 * https://github.com/EfogDev/react-process-string                          *
 ************************************************************************** */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function processString(options) {
    let key = 0;
    function processInputWithRegex(option, input) {
        if (!option.fn || typeof option.fn !== 'function')
            return input;
        if (!option.regex)
            return input;
        if (Array.isArray(input)) {
            return input.flatMap((chunk) => processInputWithRegex(option, chunk));
        }
        if (typeof input === 'string') {
            const regex = option.regex;
            let result = null;
            const output = [];
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
                return react_1.default.cloneElement(input, { ...input.props, children: processedContent });
            }
        }
        return input;
    }
    return function (input) {
        if (!options || !Array.isArray(options) || !options.length)
            return input;
        options.forEach((option) => (input = processInputWithRegex(option, input)));
        return input;
    };
}
exports.default = processString;
