import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PointsToFly — Business Class con puntos, hasta 12 meses de anticipación",
  description: "Encuentra asientos Business y First Class con puntos de fidelidad. Busca disponibilidad real, compara programas y vuela plano por el precio de economy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0a0e1a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
