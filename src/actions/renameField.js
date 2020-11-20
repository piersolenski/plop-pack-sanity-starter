const client = require('../utils/client');

module.exports = (plop) => {
  plop.setActionType('renameField', ({ parentType, oldField, newField }) => {
    console.log(parentType, oldField, newField);
    const fetchDocuments = () =>
      client.fetch(
        `*[_type == '${parentType}' && defined(${oldField})][0...100] {_id, _rev, ${oldField}}`
      );

    const buildPatches = (docs) =>
      docs.map((doc) => ({
        id: doc._id,
        patch: {
          set: { [newField]: doc[oldField] },
          unset: [oldField],
          // this will cause the migration to fail if any of the documents has been
          // modified since it was fetched.
          ifRevisionID: doc._rev,
        },
      }));

    const createTransaction = (patches) =>
      patches.reduce(
        (tx, patch) => tx.patch(patch.id, patch.patch),
        client.transaction()
      );

    const commitTransaction = (tx) => tx.commit();

    const migrateNextBatch = async () => {
      const documents = await fetchDocuments();
      const patches = buildPatches(documents);
      if (patches.length === 0) {
        return console.log('No more documents to migrate!');
      }
      console.log(
        `Migrating batch:\n %s`,
        patches
          .map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`)
          .join('\n')
      );
      const transaction = createTransaction(patches);
      await commitTransaction(transaction);
      return migrateNextBatch();
    };

    return migrateNextBatch().catch((err) => {
      console.error(err);
      process.exit(1);
    });
  });
  plop.setDefaultInclude({ actionTypes: true });
};
