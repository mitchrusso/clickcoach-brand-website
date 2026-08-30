export const SEO_TITLE_MAX_LENGTH = 60;

const SEO_TITLE_SUFFIX = " | ClickCoach";

function normalizeTitle(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateAtWordBoundary(value, maxLength) {
  if (value.length <= maxLength) return value;

  const clipped = value.slice(0, maxLength + 1);
  const boundary = clipped.lastIndexOf(" ");
  const shortened =
    boundary >= Math.floor(maxLength * 0.6)
      ? clipped.slice(0, boundary)
      : value.slice(0, maxLength);

  return shortened.trim().replace(/[,:;.\-\u2013\u2014]+$/u, "");
}

export function formatSeoTitle(title) {
  const normalized = normalizeTitle(title) || "ClickCoach Resource";
  const branded = `${normalized}${SEO_TITLE_SUFFIX}`;
  if (branded.length <= SEO_TITLE_MAX_LENGTH) return branded;

  const titleBudget = SEO_TITLE_MAX_LENGTH - SEO_TITLE_SUFFIX.length;
  return `${truncateAtWordBoundary(normalized, titleBudget)}${SEO_TITLE_SUFFIX}`;
}
