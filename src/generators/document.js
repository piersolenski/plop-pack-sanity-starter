const { isEmpty } = require('validator');
const getIcon = require('../utils/getIcon');

module.exports = function (plop) {
  const rootDir = plop.getDestBasePath();

  plop.setGenerator('document', {
    description: 'Adds a document to the schema',
    prompts: async (inquirer) => {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is your document name?',
          validate: (value) => !isEmpty(value) || 'Required',
        },
        {
          type: 'list',
          name: 'singleton',
          message: 'Is the document unique or for repeated use?',
          choices: [
            {
              name: 'Unique',
              value: true,
            },
            {
              name: 'Repeatable',
              value: false,
            },
          ],
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
        path: `${rootDir}/src/schemas/documents/{{camelCase name}}.js`,
        templateFile: '../templates/document.hbs',
      },
      `Document schema created.`,
      {
        type: 'append',
        path: `${rootDir}/src/schemas/documents/index.js`,
        unique: 'true',
        separator: '',
        template: `export { default as {{camelCase name}} } from './{{camelCase name}}';`,
      },
      `Document schema imported.`,
      {
        type: 'add',
        path: `${rootDir}/src/structure/{{camelCase name}}.js`,
        templateFile: '../templates/structure.hbs',
      },
      `Document structure created.`,
      {
        type: 'append',
        path: `${rootDir}/src/structure/index.js`,
        unique: 'true',
        separator: '',
        template: `export { default as {{camelCase name}} } from './{{camelCase name}}';`,
      },
      `Document structure imported.`,
    ],
  });
};
