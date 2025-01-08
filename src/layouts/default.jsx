import NavBar from "@/components/NavBar";

export default function DefaultLayout({
  children,
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <NavBar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
