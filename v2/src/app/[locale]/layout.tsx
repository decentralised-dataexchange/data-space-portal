import { notFound } from 'next/navigation';
import { Locale, hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import ClientProviders from '@/components/common/Providers';
import ThemeRegistry from '@/components/common/ThemeRegistry/ThemeRegistry';
import AppLayout from '@/layouts/AppLayout';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

if (!routing.locales) {
  throw new Error('routing.locales is not defined');
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <ClientProviders>
      <ThemeRegistry>
        <NextIntlClientProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </NextIntlClientProvider>
      </ThemeRegistry>
    </ClientProviders>
  );
}
