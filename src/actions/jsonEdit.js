const editJsonFile = require('edit-json-file');

module.exports = (plop) => {
  plop.setActionType('jsonEdit', (answers) => {
    const rootDir = plop.getDestBasePath();
    const file = editJsonFile(`${rootDir}/package.json`, {
      stringify_eol: true,
    });
    file.set('name', plop.renderString(`{{dashCase name}}`, answers));
    file.set('title', plop.renderString(`{{titleCase name}}`, answers));
    file.set(
      'description',
      plop.renderString(`{{sentenceCase description}}`, answers)
    );
    file.set('repository.url', answers.repository);
    file.set('bugs.url', `${answers.repository}/issues`);
    file.save();
  });
  plop.setDefaultInclude({ actionTypes: true });
};
