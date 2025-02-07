import { useState, useEffect } from "react";

import { Route, Routes } from "react-router-dom";

import { createClient } from '@supabase/supabase-js';

import './App.css'
import IndexPage from "@/pages/index";
import DummyPage from './pages/dummy';


const supabaseClient = createClient('http://localhost:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE')

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
      <Route element={<DummyPage supabaseClient={supabaseClient} supabaseSession={supabaseSession} />} path="/dummy" />
    </Routes>
  );
}

export default App;
