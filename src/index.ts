type ParsedSection = {
  content: string;
  style: string;
};

function parseStyles(inputText: string) {
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

  /** Matches *content* */
  const BOLD_REGEX = new RegExp(/\*(.*)\*/);
  const parseBold = createLineParser(BOLD_REGEX, 'bold');

  /** Matches _content_ */
  const ITALICS_REGEX = new RegExp(/_(.*)_/);
  const parseItalics = createLineParser(ITALICS_REGEX, 'italics');

  const textStylesByLine = inputLines.map(parseBold).map(parseItalics);
  return textStylesByLine;
}

// '_npmVersion' is replaced with value from package.json
// during compilation
const version: string = '_npmVersion';

// Export values to appear in jsx files
export { parseStyles, version };
