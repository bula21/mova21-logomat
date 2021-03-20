import { capitalCase } from "capital-case";

/**
 * Strip title
 * @param fullTitle "SubObject - TopObject"
 * @param topTitle "TopObject"
 * @returns "SubObject"
 */
export function stripTitle(topTitle, fullTitle) {
  const postFix = ` - ${fullTitle}`;
  return topTitle.replace(postFix, "");
}

export function nicifyTitle(title) {
  return capitalCase(title)
    .replace("ae", "ä")
    .replace("oe", "ö")
    .replace("ue", "ü");
}
