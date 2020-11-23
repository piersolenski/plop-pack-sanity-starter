const searchList = require('inquirer-search-list');
const { isEmpty } = require('validator');
var inquirer = require('inquirer');
inquirer.registerPrompt('search-list', searchList);

async function getArguments(actionType) {
  const { getFields, getTypes } = require('../utils/sanity');
  let answers;
  switch (actionType) {
    case 'deleteType':
      answers = await inquirer.prompt({
        type: 'search-list',
        name: 'targetType',
        message: 'Which type do you want to delete?',
        choices: await getTypes(),
      });
      return answers;
    case 'migrateDocumentType':
      answers = await inquirer.prompt([
        {
          type: 'search-list',
          name: 'oldType',
          message: 'Which type do you want to migrate?',
          choices: await getTypes(),
        },
        {
          type: 'input',
          name: 'newType',
          message: `What should the new name of the type be?`,
          validate: (value) => !isEmpty(value) || 'Required',
        },
      ]);
      return answers;
    case 'renameField':
      const { parentType } = await inquirer.prompt({
        type: 'search-list',
        name: 'parentType',
        message: 'Which type has the field you wish to rename?',
        choices: await getTypes(),
      });
      answers = await inquirer.prompt([
        {
          type: 'search-list',
          name: 'oldField',
          message: 'Which type do you want to migrate?',
        },
        {
          choices: await getFields(parentType),
          type: 'input',
          name: 'newField',
          message: `What should the new name of the type be?`,
          validate: (value) => !isEmpty(value) || 'Required',
        },
      ]);
      return { ...answers, parentType };
    default:
      return [];
  }
}

module.exports = async (plop) => {
  plop.setPrompt('search-list', searchList);

  plop.setGenerator('utils', {
    description: 'Run Sanity utility scrips',
    prompts: async () => {
      try {
        require('../utils/client');
      } catch (e) {
        console.error(e.message);
        console.error('Make it exists in your sanity.json or .env file');
        console.log('https://www.sanity.io/docs/studio-environment-variables');
        return false;
      }
      plop.load([
        '../actions/deleteType.js',
        '../actions/deleteUnusedAssets.js',
        '../actions/migrateDocumentType.js',
        '../actions/renameField.js',
      ]);
      const { actionType } = await inquirer.prompt({
        type: 'search-list',
        name: 'actionType',
        message: 'What do you want to do?',
        choices: [
          {
            name: 'Delete a type',
            value: 'deleteType',
          },
          {
            name: 'Delete all unused assets',
            value: 'deleteUnusedAssets',
          },
          {
            name: 'Migrate document type',
            value: 'migrateDocumentType',
          },
          {
            name: 'Rename a field',
            value: 'renameField',
          },
        ],
      });
      const answers = await getArguments(actionType);
      return Promise.resolve({ ...answers, actionType });
    },
    actions: ({ actionType, ...answers }) => [
      {
        type: actionType,
        ...answers,
      },
    ],
  });
};
