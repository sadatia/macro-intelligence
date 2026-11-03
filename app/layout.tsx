import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'USD Macro Intelligence Terminal',
  description: 'High-frequency macroeconomic intelligence, yield differentials, and institutional positioning dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#06080d] text-slate-100 font-mono min-h-screen selection:bg-emerald-500/30 selection:text-emerald-300">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
