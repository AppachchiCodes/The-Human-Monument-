// src/services/idGenerator.js
// Generates unique, memorable IDs for contributions

const ShortUniqueId = require('short-unique-id');

const uid = new ShortUniqueId({
  length: 6,
  dictionary: 'alphanum_upper', // A-Z, 0-9
});

const generateContributionId = () => {
  return `HM-${uid.rnd()}`;
};

module.exports = {
  generateContributionId,
};