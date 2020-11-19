const inquirer = require('inquirer');
const searchList = require('inquirer-search-list');

module.exports = async function getIcon(plop) {
  inquirer.registerPrompt('search-list', searchList);
  const rootDir = plop.getDestBasePath();
  const {
    IconsManifest,
  } = require(`${rootDir}/node_modules/react-icons/lib/cjs/iconsManifest`);
  const { pack } = await inquirer.prompt({
    type: 'search-list',
    message: 'What icon pack would you like to use?',
    name: 'pack',
    choices: IconsManifest.map((icon) => ({
      name: icon.name,
      value: icon.id,
    })),
  });

  const iconExports = require(`${rootDir}/node_modules/react-icons/${pack}`);
  const icons = Object.keys(iconExports);
  const { name } = await inquirer.prompt({
    type: 'search-list',
    name: 'name',
    message: 'What icon would you like to use?',
    choices: icons,
  });
  return { name, pack };
};
