const sanityClient = require('@sanity/client');
const getUserConfig = require('../utils/getUserConfig');
const { api } = require(`${process.cwd()}/sanity.json`);

const client = sanityClient({
  projectId: api?.projectId || process.env.SANITY_STUDIO_API_PROJECT_ID,
  dataset: projectId?.dataset || process.env.SANITY_STUDIO_API_DATASET,
  token: getUserConfig().get('authToken'),
  useCdn: false,
});

module.exports = client;
