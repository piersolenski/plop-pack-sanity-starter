const sanityClient = require('@sanity/client');
const getUserConfig = require('../utils/getUserConfig');
const { api } = require(`${process.cwd()}/sanity.json`);

const client = () => {
  return sanityClient({
    projectId: process.env.SANITY_STUDIO_API_PROJECT_ID || api?.projectId,
    dataset: process.env.SANITY_STUDIO_API_DATASET || api?.dataset,
    token: getUserConfig().get('authToken'),
    useCdn: false,
  });
};

module.exports = client();
