import "./globals.css";

export const metadata = {
  title: "Invoice Manager",
  description: "A platform to manage your invoices",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
