import { mkReq, parseRes } from './api/utils';

const fetch = require('node-fetch');

const cmd = {
  asset: 'kadena',
};

const getAccounts = async () => {
  try {
    let res = await fetch("http://127.0.0.1:9467/v1/accounts", mkReq(cmd));
    let pRes = await parseRes(res);
    return pRes;
  } catch (e) {
    return -1;
  }
};

const openZelcore = () => window.open('zel:', '_self');

export { getAccounts, openZelcore };
