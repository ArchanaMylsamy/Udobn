// src/context/CurrencyContext.js
import { createContext, useContext, useState, useEffect } from 'react';

// Create the currency context
const CurrencyContext = createContext();


export function CurrencyProvider({ children }) {
  // Initialize with USD or use stored preference from localStorage
  const storedCurrency = localStorage.getItem('selectedCurrency') || 'INR';
  const storedCountry = localStorage.getItem('selectedCountry') || 'INDIA';
  
  const [currency, setCurrency] = useState(storedCurrency);
  const [country, setCountry] = useState(storedCountry);
  const [symbol, setSymbol] = useState(currency === 'INDIA' ? '₹' : '$');

  // Update localStorage when currency changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', currency);
    localStorage.setItem('selectedCountry', country);
    setSymbol(currency === 'INDIA' ?  '₹': '$');
  }, [currency, country]);
 

  // Function to update both currency and country at once
  const updateCurrency = (newCurrency, newCountry) => {
    setCurrency(newCurrency);
    setCountry(newCountry);
  };
// Function to format price based on selected currency
const formatPrice = (priceObject) => {
    // Display price based on the selected currency
    if (currency === 'USD') {
      return `$${priceObject.price.usd.toFixed(2)}`;
    } else if (currency === 'INR') {
      return `₹${priceObject.price.inr}`;
    }
  };
  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        setCurrency, 
        country, 
        setCountry, 
        symbol, 
        updateCurrency,
        formatPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

// Custom hook to use the currency context
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}