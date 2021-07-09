const crypto = require('crypto');

const hashPassword = (plainText) => {
  return crypto.createHmac(process.env.algo, process.env.secret)
    .update(plainText)
    .digest('hex');
}

module.exports = { hashPassword };