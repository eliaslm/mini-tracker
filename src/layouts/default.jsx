import NavBar from "@/components/NavBar";

export default function DefaultLayout({
  children,
  supabaseClient,
  supabaseSession,
}) {
  return (
    <div className="relative flex flex-col h-screen w-full">
      <NavBar supabaseClient={supabaseClient} supabaseSession={supabaseSession} />
      <main className="container mx-auto px-6 flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
