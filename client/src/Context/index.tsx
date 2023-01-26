import { createContext } from 'react';

export const CurrencyContext = createContext(
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
);