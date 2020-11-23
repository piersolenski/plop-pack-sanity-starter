const getIcon = require('../utils/getIcon');
const alphabetizeLines = require('../utils/alphabetizeLines');
const { isEmpty } = require('validator');

module.exports = function (plop) {
  const rootDir = plop.getDestBasePath();

  plop.setGenerator('object', {
    description: 'Adds a object to the schema',
    prompts: async (inquirer) => {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is your object name?',
          validate: (value) => !isEmpty(value) || 'Required',
        },
      ]);

      const { name, pack } = await getIcon(plop);

      return Promise.resolve({
        ...answers,
        iconName: name,
        iconPack: pack,
      });
    },
    actions: [
      {
        type: 'add',
        path: `${rootDir}/src/schemas/objects/{{camelCase name}}.js`,
        templateFile: '../templates/object.hbs',
      },
      {
        type: 'append',
        path: `${rootDir}/src/schemas/objects/index.js`,
        unique: 'true',
        template: `export { default as {{camelCase name}} } from './{{camelCase name}}';`,
      },
      {
        type: 'modify',
        path: `${rootDir}/src/schemas/objects/index.js`,
        transform: alphabetizeLines,
      },
    ],
  });
};
