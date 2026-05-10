import { RegexResult } from "@/types";

export function exportAsJSON(
  result: RegexResult,
  pattern: string,
  flags: string,
  testString: string
): string {
  const data = {
    pattern: {
      source: pattern,
      flags,
    },
    testString,
    matches: result.matches,
  };
  return JSON.stringify(data, null, 2);
}

export function exportAsCSV(result: RegexResult): string {
  if (result.matches.length === 0) {
    return "match_index,value,start_position,end_position,length\n";
  }

  const firstMatch = result.matches[0];
  const groupNames = Object.keys(firstMatch.groups).filter(
    (key) => firstMatch.groups[key] !== undefined
  );

  const headers = [
    "match_index",
    "value",
    "start_position",
    "end_position",
    "length",
    ...groupNames.map((name) => `group_${name}`),
  ];

  const escapeCSV = (value: string): string => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const rows = result.matches.map((match, index) => {
    const values = [
      index.toString(),
      escapeCSV(match.value),
      match.index.toString(),
      (match.index + match.length).toString(),
      match.length.toString(),
      ...groupNames.map((name) =>
        match.groups[name] ? escapeCSV(match.groups[name]!) : ""
      ),
    ];
    return values.join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}