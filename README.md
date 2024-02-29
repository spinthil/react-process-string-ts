# react-process-string-ts
TypeScript port of [react-process-string](https://github.com/EfogDev/react-process-string).
The library allows you to process strings with regular expressions in React.

The main changes from the original JS version are:
- TypeScript support
  - Added `ProcessStringOption` interface
  - Typed `processString()` function
- Updated `processString()` function to
  - support replacements in nested JSX elements
  - always return data of the correct type (c.f., `flatMap()` vs. previously `map()`)

## Installation
Via npm:
```
npm install react-process-string-ts --save
```

## Syntax
```javascript
processString(options)(string);
```

Options should be an array of objects containing `regex` and `fn` fields.
`fn` is a function that takes two arguments: `key`, to pass it to a React component and `result` — the result of regex executing.

## Example Usage

### Usage in a FunctionComponent
```typescript jsx
import React, { FunctionComponent } from 'react';
import processString, { ProcessStringOption } from 'react-process-string-ts';

interface Props {}

const ProcessStringExample: FunctionComponent<Props> = ({}) => {
    const config: ProcessStringOption[] = [
        {
            regex: /(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.)/gim,
            fn: (key, result) => (
                <span key={key}>
                    <a target="_blank" href={`http://${result[1]}.${result[2]}${result[3]}`} rel="noreferrer">
                        {result[1]}.{result[2]}
                        {result[3]}
                    </a>
                    {result[4]}
                </span>
            ),
        },
    ];

    const stringWithLinks = 'Watch this on youtube.com.';
    const processed = processString(config)(stringWithLinks);

    return <>{processed}</>;
};

export default ProcessStringExample;
```
On the user side, `processed` will contain clickable links.

### Minimal Example
```typescript jsx
import React from 'react';
import processString from 'react-process-string-ts';

const users = [
    {
        username: 'testuser',
    },
];

const stringWithUsername = 'Hello @testuser, how do you feel today?';

const processor = processString([
    {
        regex: /@([a-z0-9_\-]+?)( |,|$|\.)/gim, //regex to match a username
        fn: (key, result) => {
            const username = result[1];
            const foundUsers = users.filter((user) => user.username === username);

            if (!foundUsers.length) return result[0]; //@username

            return (
                <a key={key} href={`/user/${username}`}>
                    @{username}
                </a>
            );
        },
    },
]);

const processed = processor(stringWithUsername);
```
This code allows to make `@usernames` clickable.
