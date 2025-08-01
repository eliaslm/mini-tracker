import { useState, useEffect } from "react";

import { Route, Routes } from "react-router-dom";

import { createClient } from '@supabase/supabase-js';

import './App.css'
import IndexPage from "@/pages/index";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey)

function App() {
  const [supabaseSession, setSupabaseSession] = useState(null)
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session)
    })

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSupabaseSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])


  return (
    <Routes>
      <Route element={<IndexPage supabaseClient={supabaseClient} supabaseSession={supabaseSession} />} path="/" />
    </Routes>
  );
}

export default App;
