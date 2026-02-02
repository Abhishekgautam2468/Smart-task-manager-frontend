import React from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import HomeClient from '@/components/home/HomeClient'

const page = () => {
  return (
    <main className="h-screen bg-gray-100">
      <div className="w-full h-full bg-white overflow-hidden flex">
        <Sidebar />
        <HomeClient />
      </div>
    </main>
  )
}

export default page
