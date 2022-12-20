type ParsedSection = {
  content: string;
  style: string;
};

function parseStyles(
  inputText: string,
  customParsers: Array<{ matcher: RegExp; stylename: string }>
) {
  /** Split the input text into an array of lines */
  const inputLines = inputText.split(/[\r\n\3]/g);

  /** Creates a function that turns lines into a style tree based on a given regex */
  function createLineParser(matcher: RegExp, stylename: string) {
    return (line: string | ParsedSection | ParsedSection[]) => {
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
              return { content, style: stylename };
            }
            // It's unstyled
            return { content, style: 'regular' };
          })
          .filter(Boolean) as ParsedSection[]
      );
    };
  }

  const parsers = customParsers ?? [
    { stylename: 'bold', matcher: new RegExp(/\*(.*)\*/) },
    { stylename: 'italics', matcher: new RegExp(/_(.*)_/) },
  ];

  // Parse all the styles
  let styles: (string | ParsedSection | ParsedSection[])[] = inputLines;
  for (const { matcher, stylename } of parsers) {
    const parser = createLineParser(matcher, stylename);
    styles = styles.map(parser);
  }

  return styles.map((line) =>
    typeof line === 'string' ? { content: line, style: 'regular' } : line
  );
}

// '_npmVersion' is replaced with value from package.json
// during compilation
const version: string = '_npmVersion';

// Export values to appear in jsx files
export { parseStyles, version };
