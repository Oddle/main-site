import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import Container from "@/components/common/Container";
import React from 'react';

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavBar />
      {/* Main content area wrapped by the common Container */}
      <main className="flex-1 py-6 md:py-10">
        <Container>{children}</Container>
      </main>
      <Footer />
    </div>
  );
} 