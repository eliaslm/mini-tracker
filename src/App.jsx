import { useState } from 'react'
import BlurredCard from './BlurredCard'
import NavBar from './NavBar'
import './App.css'

function App() {
  return (
    <>
      <div className='w-full h-full'>
        <NavBar />
        <div className='flex w-full h-full justify-center'>
          <BlurredCard />
        </div>
        <div className='flex w-full h-full justify-center'>
          <BlurredCard />
        </div>
      </div>
    </>
  )
}

export default App
