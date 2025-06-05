import { notFound } from 'next/navigation';
import { Locale, hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import ClientProviders from '@/components/common/Providers';
import ThemeRegistry from '@/components/common/ThemeRegistry/ThemeRegistry';
import MinimalLayout from '@/layouts/minimal/MinimalLayout';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <ClientProviders>
          <ThemeRegistry>
            <NextIntlClientProvider>
              <MinimalLayout>
                {children}
              </MinimalLayout>
            </NextIntlClientProvider>
          </ThemeRegistry>
        </ClientProviders>
      </body>
    </html>
  );
}
