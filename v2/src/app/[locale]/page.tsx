import {Locale, useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {use} from 'react';
import PageLayout from '@/layouts/minimal/MinimalLayout';

type Props = {
  params: Promise<{locale: Locale}>;
};

export default function HomePage({params}: Props) {
  const {locale} = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations('home');

  return (
    <PageLayout>
      <h1>{t('header')}</h1>
    </PageLayout>
  );
}
