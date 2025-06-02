import { ReactNode } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.scss';

type Props = {
  children: ReactNode;
};

export default function RootLayout({children}: Props) {
  return children;
}
