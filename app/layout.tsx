import './globals.css';

export const metadata = {
  title: 'Japanese Typing Game',
  description: 'A typing game with Japanese words and Romaji',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 font-sans">{children}</body>
    </html>
  );
}