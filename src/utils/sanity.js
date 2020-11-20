const client = require('../utils/client');

exports.getFields = async function getFields(oldType) {
  const obj = await client.fetch(
    `*[_type == "${oldType}" && !(_type match ["system.*", "sanity.*"])][0]`
  );
  const keys = Object.keys(obj).filter((key) => !key.startsWith('_'));
  return keys;
};

exports.getTypes = function getTypes() {
  return client.fetch(`*[!(_type match "system.*")]._type`);
};
