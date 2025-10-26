import type { Metadata } from "next";
// Removed font and css imports
import AuthProvider from "../context/AuthContext"; // 1. IMPORT IT (Fixed path and default import)

// Removed Inter font initialization

export const metadata: Metadata = {
  title: "HireMe Pro",
  description: "Freelancer Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Removed className from body */}
      <body>
        <AuthProvider> {/* 2. WRAP YOUR APP */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
