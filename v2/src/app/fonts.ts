import localFont from 'next/font/local';

// Load the local font file
export const untitledSans = localFont({
  src: [
    {
      path: '../../public/fonts/UntitledSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-untitled-sans',
  display: 'swap',
  preload: true,
});

// Export as the default font
export const font = untitledSans;
