/* eslint-disable import/extensions */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import translationEN from "./translations/en/translation.json";
import translationSV from "./translations/sv/translation.json";
import translationFI from "./translations/fi/translation.json";
import "./index.css";

i18next.init({
      resources: {
        en: {
          translation: translationEN,
        },
        sv: {
          translation: translationSV,
        },
        fi: {
          translation: translationFI,
        },
      },
      lng: localStorage.getItem("i18nextLng") || "en",
      fallbackLng: "en",
    });

const container = document.getElementById('react-app');
const root = createRoot(container);
root.render(
      <Router>
            <I18nextProvider i18n={i18next}>
                  <App />
            </I18nextProvider>
      </Router>
);