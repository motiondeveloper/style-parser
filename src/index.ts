type ParsedSection = {
  content: string;
  style: string;
  line: number;
};

function parseStyles(
  inputText: string,
  customParsers: Array<{ matcher: RegExp; stylename: string }> = []
): ParsedSection[] {
  /** Split the input text into an array of lines */
  const inputLines = inputText.split(/[\r\n\3]/g);

  /** Creates a function that turns lines into a style tree based on a given regex */
  function createLineParser(matcher: RegExp, stylename: string) {
    return (line: string | ParsedSection | ParsedSection[], index: number) => {
      // Section has already been parsed
      if (typeof line !== 'string') return line;
      const captureGroups = matcher.exec(line);
      // Line doesn't contain matching styles, return as is
      if (!captureGroups) return line;

      // Return parsed styles
      return (
        line
          // Split by the style regex
          .split(matcher)
          .map((section) => {
            // Remove whitespace
            const content = section.trim();
            // If the content is empty, return null so we can filter it out
            if (content === '') return null;
            // The content is what matched the regex, it's the styled content
            if (content === captureGroups[1]) {
              return { line: index, content, style: stylename };
            }
            // It's unstyled
            return { line: index, content, style: 'regular' };
          })
          .filter(Boolean) as ParsedSection[]
      );
    };
  }

  const parsers = [
    ...customParsers,
    { stylename: 'bold', matcher: new RegExp(/\*(.*)\*/) },
    { stylename: 'italics', matcher: new RegExp(/_(.*)_/) },
  ];

  // Parse all the styles
  let styles = inputLines;
  for (const { matcher, stylename } of parsers) {
    const parser = createLineParser(matcher, stylename);
    styles = styles.map(parser);
  }

  const parsedStyles = styles.map((line, index) =>
    typeof line === 'string'
      ? [{ content: line, style: 'regular', line: index }]
      : line
  );

  return parsedStyles.flat();
}

function styleByIndex(
  inputText: string,
  {
    boldIndexes,
    italicsIndexes,
  }: { boldIndexes: number[]; italicsIndexes: number[] }
): ParsedSection[] {
  const inputLines = inputText.split(/[\r\n\3]/g);
  const words = inputLines.flatMap((line, index) =>
    line
      .trim()
      .split(' ')
      .map((word) => ({ content: word, line: index }))
  );

  const wordsWithStyles = words.map((word, index) => {
    let style = 'regular';
    if (boldIndexes.includes(index)) style = 'bold';
    if (italicsIndexes.includes(index)) style = 'italics';
    return {
      ...word,
      style,
    };
  });

  return wordsWithStyles;
}

function styleBySearch(
  inputText: string,
  {
    boldString,
    italicsString,
  }: { boldString?: string; italicsString?: string } = {}
): ParsedSection[] {
  let regex;
  const italics = italicsString ? italicsString.trim() : '';
  const bold = boldString ? boldString.trim() : '';
  if (boldString && italicsString) {
    regex = new RegExp(`(${bold})|(${italics})`, 'g');
  } else if (boldString) {
    regex = new RegExp(`(${bold})`, 'g');
  } else if (italicsString) {
    regex = new RegExp(`(${italics})`, 'g');
  }

  if (!regex) {
    return [
      {
        content: inputText,
        style: 'regular',
        line: 0,
      },
    ];
  }

  const inputLines = inputText.split(/[\r\n\3]/g);

  return inputLines.flatMap((line, index) => {
    return line
      .split(regex)
      .filter(Boolean)
      .map((part) => {
        const style =
          part === boldString
            ? 'bold'
            : part === italicsString
            ? 'italics'
            : 'regular';
        return {
          content: part.trim(),
          style,
          line: index,
        };
      });
  });
}

const defaultFontMap = {
  bold: 'Arial-BoldMT',
  italics: 'Arial-ItalicMT',
};

// '_npmVersion' is replaced with value from package.json
// during compilation
const version: string = '_npmVersion';

// Export values to appear in jsx files
export { parseStyles, styleByIndex, styleBySearch, defaultFontMap, version };
