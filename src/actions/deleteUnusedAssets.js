const client = require('../utils/client');

module.exports = (plop) => {
  plop.setActionType('deleteUnusedAssets', () => {
    const query = `
      *[ _type in ["sanity.imageAsset", "sanity.fileAsset"] ]
      {_id, "refs": count(*[ references(^._id) ])}
      [ refs == 0 ]
      ._id
    `;

    return client
      .fetch(query)
      .then((ids) => {
        if (!ids.length) {
          return console.log('No assets to delete');
        }

        console.log(`Deleting ${ids.length} assets`);
        return ids
          .reduce((trx, id) => trx.delete(id), client.transaction())
          .commit()
          .then(() => console.log('Done!'));
      })
      .catch((err) => {
        if (err.message.includes('Insufficient permissions')) {
          console.error(err.message);
          console.error(`Make sure you're logged in!`);
        } else {
          console.error(err.stack);
        }
      });
  });
  plop.setDefaultInclude({ actionTypes: true });
};
