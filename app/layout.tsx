import { ModalProvider } from "@/components/Modal/ModalContext";
import SessionWrapper from "@/components/SessionWrapper/SessionWrapper";
import { SwitzerFont } from "@/fonts/Switzer";
import "@/styles/global.css"
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "FlowTicket",
  description: "Manage event tickets, visitors and vip guests",
  keywords: 'event tickets, party tickets, interactive ticketing, animated checkout, personal event experience, flow ticketing, emotional UI, immersive events, digital tickets, party signup',
  openGraph: {
    title: 'FlowTicket - The Most Interactive Way to Get Tickets',
    description: 'Manage event tickets, visitors and vip guests with an immersive, personal experience. Flow through our animated checkout and get ready for an unforgettable event.',
    url: 'https://yourflowticketdomain.com',
    siteName: 'FlowTicket',
    images: [
      {
        url: 'https://yourflowticketdomain.com/og-image.png', // Replace with your actual image
        width: 1200,
        height: 630,
        alt: 'FlowTicket Animated Checkout Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlowTicket - The Most Interactive Way to Get Tickets',
    description: 'Experience a magical ticket-buying journey with FlowTicket. Reactive design, smooth checkout, pure vibe.',
    images: ['https://yourflowticketdomain.com/og-image.png'],
    creator: '@phillyxm0', // Optional
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <ModalProvider>
        <html lang="en">
          <head>
            <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/favicon.ico" />
          </head>
          <body className={SwitzerFont.className}>
            <Toaster richColors position="top-center" />
            {children}
          </body>
        </html>
      </ModalProvider>
    </SessionWrapper>
  );
}
