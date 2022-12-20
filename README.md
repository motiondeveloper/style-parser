# style-parser

> This project was create with [create-expression-lib](https://github.com/motiondeveloper/create-expression-lib)

## Use the library

1. Download the latest version from the releases page.
2. Import into After Effects and reference in your expressions

Learn more about writing `.jsx` files for After Effects here: https://motiondeveloper.com/blog/write-expressions-external-files/

```ts
type StyleResult = { content: string; style: string; line: number }[];

/** Parse a markdown-ish string*/
type parseStyles = (
  textString: string,
  parsers?: Array<{ matcher: RegExp; stylename: string }>
) => StyleResult;

/** Style the given word indexes */
type styleByIndex = (textString: string, {
   boldIndexes: number[],
   italicsIndexes: number[]
}) => StyleResult;

/** Style the given words */
type styleBySearch = (textString: string, {
   boldString?: string,
   italicsString?: string,
}) => StyleResult;
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
  { content: 'This will', style: 'regular', line: 0 },

  { content: 'be bold', style: 'bold', line: 1 },
  { content: 'and', style: 'regular', line: 1 },

  { content: 'this will', style: 'regular', line: 2 },
  { content: 'be italics', style: 'italics', line: 2 },
];
```

## Limitations

Currently you need to style whole words in each method, otherwise you'll get unnecessary spaces inserted.
