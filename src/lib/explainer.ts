import { RegexToken, TokenType } from "@/types";

type ParseState = {
  pattern: string;
  pos: number;
  tokens: RegexToken[];
};

function createToken(
  raw: string,
  type: TokenType,
  title: string,
  description: string,
  example: string
): RegexToken {
  return { raw, type, title, description, example };
}

function parseEscape(state: ParseState): RegexToken | null {
  const start = state.pos;
  state.pos++;
  if (state.pos >= state.pattern.length) {
    return createToken(state.pattern.slice(start), "escape", "Incomplete escape", "Incomplete escape sequence", "");
  }

  const char = state.pattern[state.pos];

  switch (char) {
    case "d":
      state.pos++;
      return createToken("\\d", "class", "Digit", "Matches any digit (0-9)", "4, 7, 0");
    case "D":
      state.pos++;
      return createToken("\\D", "class", "Non-digit", "Matches any character that is not a digit", "a, @, #");
    case "w":
      state.pos++;
      return createToken("\\w", "class", "Word character", "Matches any word character (a-z, A-Z, 0-9, _)", "a, Z, 5, _");
    case "W":
      state.pos++;
      return createToken("\\W", "class", "Non-word character", "Matches any character that is not a word character", "!, @, space");
    case "s":
      state.pos++;
      return createToken("\\s", "class", "Whitespace", "Matches any whitespace character (space, tab, newline)", "space, tab");
    case "S":
      state.pos++;
      return createToken("\\S", "class", "Non-whitespace", "Matches any character that is not whitespace", "a, 1, !");
    case "b":
      state.pos++;
      return createToken("\\b", "anchor", "Word boundary", "Matches a position between a word and non-word character", "start of word");
    case "B":
      state.pos++;
      return createToken("\\B", "anchor", "Non-word boundary", "Matches a position that is not a word boundary", "middle of word");
    case "n":
      state.pos++;
      return createToken("\\n", "escape", "Newline", "Matches a newline character", "line break");
    case "t":
      state.pos++;
      return createToken("\\t", "escape", "Tab", "Matches a tab character", "tab");
    case "r":
      state.pos++;
      return createToken("\\r", "escape", "Carriage return", "Matches a carriage return character", "return");
    case "0":
      state.pos++;
      return createToken("\\0", "escape", "Null character", "Matches a null character", "null");
    case "x":
      if (state.pos + 2 < state.pattern.length) {
        const hex = state.pattern.slice(state.pos + 1, state.pos + 3);
        state.pos += 3;
        return createToken(`\\x${hex}`, "escape", "Hex escape", `Matches the character with hex code ${hex}`, "character");
      }
      return createToken("\\x", "escape", "Incomplete hex escape", "Incomplete hex escape sequence", "");
    case "u":
      if (state.pos + 4 < state.pattern.length) {
        const unicode = state.pattern.slice(state.pos + 1, state.pos + 5);
        state.pos += 5;
        return createToken(`\\u${unicode}`, "escape", "Unicode escape", `Matches the Unicode character U+${unicode}`, "character");
      }
      return createToken("\\u", "escape", "Incomplete unicode escape", "Incomplete unicode escape sequence", "");
    default:
      state.pos++;
      return createToken(`\\${char}`, "escape", "Escaped character", `Matches the literal character '${char}'`, char);
  }
}

function parseCharacterClass(state: ParseState): RegexToken | null {
  const start = state.pos;
  state.pos++;
  let content = "";

  while (state.pos < state.pattern.length && state.pattern[state.pos] !== "]") {
    if (state.pattern[state.pos] === "\\" && state.pos + 1 < state.pattern.length) {
      content += state.pattern[state.pos] + state.pattern[state.pos + 1];
      state.pos += 2;
    } else {
      content += state.pattern[state.pos];
      state.pos++;
    }
  }

  if (state.pos >= state.pattern.length) {
    return createToken(state.pattern.slice(start), "class", "Unclosed character class", "Character class is not closed", "");
  }

  state.pos++;
  const raw = state.pattern.slice(start, state.pos);

  if (content.startsWith("^")) {
    return createToken(raw, "class", "Negated character set", `Matches any character NOT in: ${content.slice(1)}`, "any character except");
  }

  return createToken(raw, "class", "Character set", `Matches any character in: ${content}`, "a, b, c");
}

function parseGroup(state: ParseState): RegexToken | null {
  const start = state.pos;
  state.pos++;

  if (state.pos >= state.pattern.length) {
    return createToken("(", "group", "Unclosed group", "Group is not closed", "");
  }

  let groupType = "capturing";
  let groupName = "";
  let title = "Capturing group";
  let description = "Groups the pattern and captures the match";

  if (state.pattern[state.pos] === "?") {
    state.pos++;
    if (state.pos >= state.pattern.length) {
      return createToken(state.pattern.slice(start), "group", "Invalid group", "Invalid group syntax", "");
    }

    const nextChar = state.pattern[state.pos];
    switch (nextChar) {
      case ":":
        state.pos++;
        groupType = "non-capturing";
        title = "Non-capturing group";
        description = "Groups the pattern without capturing";
        break;
      case "=":
        state.pos++;
        groupType = "lookahead";
        title = "Positive lookahead";
        description = "Asserts what follows matches the pattern";
        break;
      case "!":
        state.pos++;
        groupType = "negative-lookahead";
        title = "Negative lookahead";
        description = "Asserts what follows does not match the pattern";
        break;
      case "<":
        state.pos++;
        if (state.pos >= state.pattern.length) {
          return createToken(state.pattern.slice(start), "group", "Incomplete group", "Incomplete group syntax", "");
        }
        if (state.pattern[state.pos] === "=") {
          state.pos++;
          groupType = "lookbehind";
          title = "Positive lookbehind";
          description = "Asserts what precedes matches the pattern";
        } else if (state.pattern[state.pos] === "!") {
          state.pos++;
          groupType = "negative-lookbehind";
          title = "Negative lookbehind";
          description = "Asserts what precedes does not match the pattern";
        } else {
          let name = "";
          while (state.pos < state.pattern.length && state.pattern[state.pos] !== ">") {
            name += state.pattern[state.pos];
            state.pos++;
          }
          if (state.pos >= state.pattern.length) {
            return createToken(state.pattern.slice(start), "group", "Unclosed named group", "Named group is not closed", "");
          }
          state.pos++;
          groupType = "named";
          groupName = name;
          title = `Named group '${name}'`;
          description = `Captures matches into the group '${name}'`;
        }
        break;
      default:
        state.pos--;
        break;
    }
  }

  let depth = 1;
  let groupEnd = -1;

  while (state.pos < state.pattern.length) {
    if (state.pattern[state.pos] === "\\") {
      state.pos += 2;
      continue;
    }
    if (state.pattern[state.pos] === "(") {
      depth++;
    } else if (state.pattern[state.pos] === ")") {
      depth--;
      if (depth === 0) {
        groupEnd = state.pos;
        break;
      }
    }
    state.pos++;
  }

  if (groupEnd === -1) {
    return createToken(state.pattern.slice(start), "group", "Unclosed group", "Group is not closed", "");
  }

  const groupContent = state.pattern.slice(start + (groupType === "capturing" || groupType === "named" || groupType === "non-capturing" ? 1 : 2) + (groupName ? groupName.length + 2 : 0), groupEnd);
  state.pos = groupEnd + 1;

  const raw = state.pattern.slice(start, groupEnd + 1);
  let example = groupContent.length > 10 ? groupContent.slice(0, 10) + "..." : groupContent;

  return createToken(raw, groupType === "lookahead" || groupType === "negative-lookahead" ? "lookahead" : "group", title, description, example);
}

function parseQuantifier(state: ParseState): RegexToken | null {
  const start = state.pos;
  const char = state.pattern[state.pos];

  if (char === "*") {
    state.pos++;
    if (state.pos < state.pattern.length && state.pattern[state.pos] === "?") {
      state.pos++;
      return createToken("*?", "quantifier", "Lazy zero or more", "Matches zero or more, preferring shorter matches", "0+ times (lazy)");
    }
    return createToken("*", "quantifier", "Zero or more", "Matches zero or more of the preceding element", "0+ times");
  }

  if (char === "+") {
    state.pos++;
    if (state.pos < state.pattern.length && state.pattern[state.pos] === "?") {
      state.pos++;
      return createToken("+?", "quantifier", "Lazy one or more", "Matches one or more, preferring shorter matches", "1+ times (lazy)");
    }
    return createToken("+", "quantifier", "One or more", "Matches one or more of the preceding element", "1+ times");
  }

  if (char === "?") {
    state.pos++;
    if (state.pos < state.pattern.length && state.pattern[state.pos] === "?") {
      state.pos++;
      return createToken("??", "quantifier", "Lazy optional", "Matches zero or one, preferring zero", "0 or 1 (lazy)");
    }
    return createToken("?", "quantifier", "Optional", "Matches zero or one of the preceding element", "0 or 1");
  }

  if (char === "{") {
    let end = state.pos + 1;
    while (end < state.pattern.length && state.pattern[end] !== "}") {
      end++;
    }

    if (end >= state.pattern.length) {
      return createToken("{", "quantifier", "Incomplete quantifier", "Quantifier is not closed", "");
    }

    const quantifierContent = state.pattern.slice(state.pos + 1, end);
    state.pos = end + 1;

    let isLazy = false;
    if (state.pos < state.pattern.length && state.pattern[state.pos] === "?") {
      isLazy = true;
      state.pos++;
    }

    if (quantifierContent.includes(",")) {
      const [min, max] = quantifierContent.split(",");
      if (max === "") {
        return createToken(
          `{${quantifierContent}}${isLazy ? "?" : ""}`,
          "quantifier",
          `Lazy ${min} or more` as any,
          `Matches ${min} or more of the preceding element`,
          `${min}+ times${isLazy ? " (lazy)" : ""}`
        );
      }
      return createToken(
        `{${quantifierContent}}${isLazy ? "?" : ""}`,
        "quantifier",
        `Between ${min} and ${max}` as any,
        `Matches between ${min} and ${max} of the preceding element`,
        `${min}-${max} times${isLazy ? " (lazy)" : ""}`
      );
    }

    return createToken(
      `{${quantifierContent}}${isLazy ? "?" : ""}`,
      "quantifier",
      `Exactly ${quantifierContent}` as any,
      `Matches exactly ${quantifierContent} of the preceding element`,
      `${quantifierContent} times${isLazy ? " (lazy)" : ""}`
    );
  }

  return null;
}

export function parsePattern(pattern: string): RegexToken[] {
  const state: ParseState = {
    pattern,
    pos: 0,
    tokens: [],
  };

  if (!pattern) {
    return [];
  }

  while (state.pos < state.pattern.length) {
    const char = state.pattern[state.pos];

    if (char === "\\") {
      const token = parseEscape(state);
      if (token) state.tokens.push(token);
    } else if (char === "[") {
      const token = parseCharacterClass(state);
      if (token) state.tokens.push(token);
    } else if (char === "(") {
      const token = parseGroup(state);
      if (token) state.tokens.push(token);
    } else if (char === "^") {
      state.pos++;
      state.tokens.push(createToken("^", "anchor", "Start of string", "Matches the start of the string", "start"));
    } else if (char === "$") {
      state.pos++;
      state.tokens.push(createToken("$", "anchor", "End of string", "Matches the end of the string", "end"));
    } else if (char === ".") {
      state.pos++;
      state.tokens.push(createToken(".", "class", "Any character", "Matches any single character except newline", "any char"));
    } else if (char === "|") {
      state.pos++;
      state.tokens.push(createToken("|", "special", "Alternation", "Matches either the pattern before or after the pipe", "or"));
    } else if (char === "*" || char === "+" || char === "?" || char === "{") {
      const token = parseQuantifier(state);
      if (token) state.tokens.push(token);
    } else {
      state.pos++;
      state.tokens.push(
        createToken(char, "literal", `Literal '${char}'`, `Matches the literal character '${char}'`, char)
      );
    }
  }

  return state.tokens;
}