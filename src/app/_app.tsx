/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrimeReactProvider } from "primereact/api";
import "./globals.css";
import "primeicons/primeicons.css";

export default function App({ 
  Component, 
  pageProps
}: { Component: React.ComponentType; pageProps: any }) {
  return (
    
      <PrimeReactProvider>
        <Component {...pageProps} />
      </PrimeReactProvider>
  );
  
}