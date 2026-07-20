export function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR") + " تومان";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function generateSlug(name: string): string {
  const persianMap: Record<string, string> = {
    آ: "a", ا: "a", ب: "b", پ: "p", ت: "t", ث: "s",
    ج: "j", چ: "ch", ح: "h", خ: "kh", د: "d", ذ: "z",
    ر: "r", ز: "z", ژ: "zh", س: "s", ش: "sh", ص: "s",
    ض: "z", ط: "t", ظ: "z", ع: "a", غ: "gh", ف: "f",
    ق: "gh", ک: "k", گ: "g", ل: "l", م: "m", ن: "n",
    و: "v", ه: "h", ی: "y", ئ: "y",
  };

  let slug = "";
  for (const char of name) {
    slug += persianMap[char] || char;
  }
  return slugify(slug);
}
