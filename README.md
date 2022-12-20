# style-parser

> This project was create with [create-expression-lib](https://github.com/motiondeveloper/create-expression-lib)

## Use the library

1. Download the latest version from the releases page.
2. Import into After Effects and reference in your expressions

Learn more about writing `.jsx` files for After Effects here: https://motiondeveloper.com/blog/write-expressions-external-files/

```ts
type Line = Array<{ content: string; style: string }>;

type parseStyles = (
  textString: string,
  parsers?: Array<{ matcher: RegExp; stylename: string }>
) => Line[];
```

## Example

Expression:

```js
const { parseStyles } = footage('style-parser.jsx').sourceData;
const textString = `This will
*be bold* and
this will _be italics_`;

const parsed = parseStyles(textString);
```

Results in:

```js
[
  [{ content: 'This will', style: 'regular' }],
  [
    { content: 'be bold', style: 'bold' },
    { content: 'and', style: 'regular' },
  ],
  [
    { content: 'this will', style: 'regular' },
    { content: 'be italics', style: 'italics' },
  ],
];
```
