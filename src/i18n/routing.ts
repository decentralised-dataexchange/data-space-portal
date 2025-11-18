import {defineRouting} from 'next-intl/routing';
import {locales, defaultLocale} from '@/constants/il8n';

export const routing = defineRouting({
  locales,
  defaultLocale,
});
