const { isEmpty, isURL } = require('validator');

module.exports = function (plop) {
  const rootDir = plop.getDestBasePath();
  plop.load('../actions/jsonEdit.js');
  plop.setGenerator('bootstrap', {
    description: 'Bootstrap your project',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: `Enter project name`,
        validate: (value) => !isEmpty(value) || 'Required',
      },
      {
        type: 'input',
        name: 'description',
        message: `Enter project description`,
        validate: (value) => !isEmpty(value) || 'Required',
      },
      {
        type: 'input',
        name: 'repository',
        message: `Enter project repository url`,
        validate: (value) => isURL(value) || 'Must be a valid URL',
      },
    ],
    actions: [
      {
        type: 'jsonEdit',
        path: `${rootDir}/package.json`,
      },
    ],
  });
};
