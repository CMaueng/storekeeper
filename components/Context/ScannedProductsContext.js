// ScannedProductsContext.js

import React, { createContext, useContext, useState } from 'react';

const ScannedProductsContext = createContext();

export function useScannedProducts() {
  return useContext(ScannedProductsContext);
}

export function ScannedProductsProvider({ children }) {
  const [scannedProducts, setScannedProducts] = useState([]);

  return (
    <ScannedProductsContext.Provider value={{ scannedProducts, setScannedProducts }}>
      {children}
    </ScannedProductsContext.Provider>
  );
}
