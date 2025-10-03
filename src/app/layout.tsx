import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata = {
  title: "NOSUM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <html lang="en" suppressHydrationWarning>
          <body className="antialiased">
            {children}
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
