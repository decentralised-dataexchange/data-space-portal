import { notFound } from 'next/navigation';
import { Locale, hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import ClientProviders from '@/components/common/Providers';
import ThemeRegistry from '@/components/common/ThemeRegistry/ThemeRegistry';
import AppLayout from '@/layouts/AppLayout';
import { font } from '../fonts';

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
    <html lang={locale} className={`${font.variable} font-sans`}>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ClientProviders>
          <ThemeRegistry>
            <NextIntlClientProvider>
              <AppLayout>
                {children}
              </AppLayout>
            </NextIntlClientProvider>
          </ThemeRegistry>
        </ClientProviders>
      </body>
    </html>
  );
}
