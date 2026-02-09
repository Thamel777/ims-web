import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { InventoryProvider } from "@/lib/hooks/useInventory";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IMS Web Admin',
  description: 'Inventory Management System Web Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <InventoryProvider>
              {children}
              <Toaster position="top-right" />
            </InventoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
