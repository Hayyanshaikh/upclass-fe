type EnumOptionFormat = "default" | "hyphen";

export const toOptions = <T extends Record<string, string>>(
  enumObject: T,
  format: EnumOptionFormat = "default",
) =>
  Object.values(enumObject).map((value) => {
    const label = value
      .replaceAll("_", format === "hyphen" ? "-" : " ")
      .toLowerCase()
      .replace(/^./, (letter) => letter.toUpperCase());

    return { label, value };
  });
