import { Inter } from 'next/font/google';

export const untitledSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-untitled-sans',
  preload: true,
});

// For local font (uncomment if you want to use the local font instead)
// import localFont from 'next/font/local';
// export const untitledSans = localFont({
//   src: '../assets/fonts/UntitledSans-Regular.woff2',
//   display: 'swap',
//   variable: '--font-untitled-sans',
//   preload: true,
// });
