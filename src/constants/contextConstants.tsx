export const CHAIN_ID = process.env.NEXT_PUBLIC_KDA_CHAIN_ID || '0';
export const PRECISION = Number(process.env.NEXT_PUBLIC_KDA_PRECISION) || 12;
export const NETWORKID = process.env.NEXT_PUBLIC_KDA_NETWORK_ID || 'testnet04';
export const FEE = process.env.NEXT_PUBLIC_KDA_FEE || 0.003;
export const APR_FEE = process.env.NEXT_PUBLIC_APR_FEE || 0.0025;
export const GAS_PRICE = Number(process.env.NEXT_PUBLIC_KDA_GAS_PRICE) || 0.0000001;
export const GAS_LIMIT = Number(process.env.NEXT_PUBLIC_KDA_GAS_LIMIT) || 100000;
export const NETWORK_TYPE = process.env.NEXT_PUBLIC_KDA_NETWORK_TYPE || 'testnet';
export const ENABLE_GAS_STATION = process.env.NEXT_PUBLIC_ENABLE_GAS_STATION || false;
export const KADDEX_NAMESPACE = process.env.NEXT_PUBLIC_KADDEX_NAMESPACE || 'kaddex'; //
export const STAKING_REWARDS_PERCENT = process.env.NEXT_PUBLIC_STAKING_REWARDS_PERCENT || 0.05;
export const NETWORK_VERSION = process.env.NEXT_PUBLIC_KDA_NETWORK_VERSION || '0.0';

export const KDX_TOTAL_SUPPLY = 1000000000;

export const NETWORK = `${process.env.NEXT_PUBLIC_KDA_NETWORK}/chainweb/${NETWORK_VERSION}/${NETWORKID}/chain/${CHAIN_ID}/pact`;

export const creationTime = () => Math.round(new Date().getTime() / 1000) - 10;

export const isMainnet = () => NETWORK_TYPE === 'mainnet';
