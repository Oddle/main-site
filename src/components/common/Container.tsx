import React from 'react';
import { cn } from "@/lib/utils"; // Utility for combining class names

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "container mx-auto px-4 md:px-6 2xl:max-w-[1400px]", // Standard container classes
        className // Allows passing additional classes if needed
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;