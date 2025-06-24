import localFont from 'next/font/local';

// Load the local font file
export const font = localFont({
  src: [
    {
      path: './fonts/UntitledSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});
