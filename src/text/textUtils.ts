export function stringReplace(stringToReplace: string, data: string[]) {
  let regexSearcher: string = '';

  for (let i = 1; i < data.length + 1; i++) {
    regexSearcher = ':_' + i;
    stringToReplace = stringToReplace.replace(regexSearcher, data[i - 1]);
  }

  return stringToReplace;
}
