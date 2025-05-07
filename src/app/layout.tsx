import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniBites',
  description: 'Discover Hand-Picked Food Options from University of Hawaii at Manoa',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const classString = `${inter.className} wrapper`;

  return (
    <html lang="en">
      <body className={`${classString} d-flex flex-column min-vh-100`}>
        <Providers>
          <NavBar />
          <main className="flex-grow-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
