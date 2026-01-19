import slugify from "slugify";

export function makeSlug(text: string) {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: "ar",
    trim: true,
  });
}
