import Link from "next/link";
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg text-center border">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-semibold text-card-foreground mb-2">
            Oops! Something went wrong.
          </h1>
          <p className="text-muted-foreground mb-6">
            We&apos;re sorry, but we couldn&apos;t find the page you were looking for. 
            Please check the URL or go back to the homepage.
          </p>
          <Button asChild>
            <Link href="/">Go Back Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
