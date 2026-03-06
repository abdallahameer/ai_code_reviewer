import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className=" flex items-center">
        <iframe
          src="/particles.html"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            zIndex: 0,
            pointerEvents: "auto",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            margin: "0 auto",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
