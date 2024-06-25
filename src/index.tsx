// INDEX.TSX
import React from 'react';
import { createRoot } from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import App from './App';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <StyleSheetManager shouldForwardProp={(prop) => prop !== 'show'}>
      <App />
    </StyleSheetManager>
  </React.StrictMode>
);
