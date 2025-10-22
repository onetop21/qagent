import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import SWRProvider from '@/components/providers/SWRProvider';
import { ProjectProvider } from '@/contexts/ProjectContext';
import ProjectSelector from '@/components/ProjectSelector';
import Link from 'next/link';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Gemini Web QA Tool',
  description: 'Automated web QA testing with Gemini AI and Playwright',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRProvider>
          <ProjectProvider>
            <div className="min-h-screen bg-gray-50">
              <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16 gap-4">
                    <div className="flex items-center gap-8">
                      <Link href="/" className="flex-shrink-0 flex items-center">
                        <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                          Gemini Web QA
                        </h1>
                      </Link>
                      <div className="hidden md:flex gap-4">
                        <Link href="/prd" className="text-gray-600 hover:text-gray-900 text-sm font-medium whitespace-nowrap">
                          PRD
                        </Link>
                        <Link href="/testcases" className="text-gray-600 hover:text-gray-900 text-sm font-medium whitespace-nowrap">
                          Test Cases
                        </Link>
                        <Link href="/webservices" className="text-gray-600 hover:text-gray-900 text-sm font-medium whitespace-nowrap">
                          Web Services
                        </Link>
                        <Link href="/sessions" className="text-gray-600 hover:text-gray-900 text-sm font-medium whitespace-nowrap">
                          Sessions
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <ProjectSelector />
                    </div>
                  </div>
                </div>
              </nav>
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
              </main>
            </div>
          </ProjectProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
