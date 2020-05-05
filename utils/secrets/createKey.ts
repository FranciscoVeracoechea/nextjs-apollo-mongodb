import crypto from 'crypto';


export default (value = crypto.randomBytes(16).toString('hex')) => crypto.createHmac(
  'sha512',
  crypto.randomBytes(64).toString('hex')
).update(value).digest('hex');
