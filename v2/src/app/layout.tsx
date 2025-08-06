import { ReactNode } from 'react';
import { Metadata } from 'next';
import { untitledSans } from '@/constants/fonts';
import ThemeRegistry from '@/components/common/ThemeRegistry/ThemeRegistry';
import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'NordXDataspace (NXD)',
  description: 'Enabling trust in the data ecosystem for next-generation data sharing.',
  icons: {
    icon: '/favicon.ico',
  },
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={`${untitledSans.variable} font-sans`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
