import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { UserProvider } from '@/stores/user/userProvider';
import { CheckAuth } from '@/components/CheckAuth';

const poppins = Poppins({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      data-theme="fantasy"
      suppressHydrationWarning
    >
      <body className={poppins.className}>
        <UserProvider>
          <CheckAuth />
          <div className="w-full flex items-center justify-center flex-col max-w-full bg-base-100 overflow-x-clip">
            <Header />
            <main className="flex flex-1 flex-col w-full min-h-screen py-20">
              {children}
            </main>
            <Footer />
          </div>
          <ToastContainer pauseOnFocusLoss={false} />
        </UserProvider>
      </body>
    </html>
  );
}
