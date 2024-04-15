"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react';
import Pact from 'pact-lang-api';
import { getCorrectBalance } from '../utils/reduceBalance';
import { CHAIN_ID, creationTime, GAS_PRICE, NETWORK } from '../constants/contextConstants';
// import useLocalStorage from '../hooks/useLocalStorage';
import { getTokenBalanceAccount } from '../utils/api/pact';
// import { useWalletConnect } from '../utils/walletConnect';

export const AccountContext = createContext();
export const AccountProvider = (props) => {
  const [fetchAccountBalance, setFetchAccountBalance] = useState(false);
  const [localRes, setLocalRes] = useState(null);


  const setVerifiedAccount = async (accountName) => {
    try {
        console.log(accountName,"accountName",CHAIN_ID,GAS_PRICE,NETWORK)
      let data = await Pact.fetch.local(
        {
          pactCode: `(coin.details ${JSON.stringify(accountName)})`,
          meta: Pact.lang.mkMeta('', CHAIN_ID, GAS_PRICE, 3000, creationTime(), 600),
        },
        NETWORK
      );

      console.log(data,"data");

      if (data.result.status === 'success') {
        setLocalRes(data.result.data);
        return data.result;
      }

  
    } catch (e) {
      console.log(e);
    }
  };

  


  
  const contextValues = {
    setFetchAccountBalance,
    setLocalRes,
    setVerifiedAccount,
    fetchAccountBalance,
    localRes,
  };

  return <AccountContext.Provider value={contextValues}>{props.children}</AccountContext.Provider>;
};

export const AccountConsumer = AccountContext.Consumer;
