/**
 * Strip title
 * @param fullTitle "SubObject - TopObject"
 * @param topTitle "TopObject"
 * @returns "SubObject"
 */
export function stripTitle(fullTitle, topTitle) {
  const postFix = ` - ${fullTitle}`;
  return topTitle.replace(postFix, "");
}
