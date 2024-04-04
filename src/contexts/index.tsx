import { useContext } from 'react';
import { AccountContext } from './AccountContext';


export function useAccountContext() {
  return useContext(AccountContext);
}