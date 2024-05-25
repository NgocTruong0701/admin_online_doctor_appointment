import 'simplebar';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ThemeConfig from '@/theme';
import ScrollToTop from '@/components/ScrollToTop';
import Router from '@/routes';
import { LoadingProvider } from './context/LoadingContext';

const App = (): JSX.Element => {
    return (
        <LoadingProvider>
            <ThemeConfig>
                <ScrollToTop />
                <Router />
            </ThemeConfig>
        </LoadingProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <HelmetProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </HelmetProvider>
);
