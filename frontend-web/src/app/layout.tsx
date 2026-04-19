import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
export const metadata: Metadata = {
  description:
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
    <html lang="en">
        <AuthProvider>{children}</AuthProvider>
    </html>
}
