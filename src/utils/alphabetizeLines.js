module.exports = function alphabetizeLines(str) {
  const noSpaces = str.replace(/^(\s*\r\n){2,}/, '\r\n');
  console.log(noSpaces);
  const alphabetizedImports = noSpaces.split('\n').sort().join('\n');
  return alphabetizedImports;
};
