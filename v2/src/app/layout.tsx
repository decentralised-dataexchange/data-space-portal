import { ReactNode } from 'react';
import { untitledSans } from '@/constants/fonts';
import ThemeRegistry from '@/components/common/ThemeRegistry/ThemeRegistry';
import '../styles/globals.scss';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={`${untitledSans.variable} font-sans`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
