const client = require('../utils/client');

module.exports = (plop) => {
  plop.setActionType('deleteType', ({ targetType }) => {
    return client
      .delete({ query: `*[_type == "${targetType}"]` })
      .then(() => console.log(`"${targetType}" successfully deleted.`))
      .catch(console.err);
  });
  plop.setDefaultInclude({ actionTypes: true });
};
