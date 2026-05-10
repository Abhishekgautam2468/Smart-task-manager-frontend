import React from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import HomeClient from '@/components/home/HomeClient'

const page = () => {
  return (
    <main className="h-screen bg-[#edf1f7] p-0 md:p-3">
      <div className="w-full h-full overflow-hidden flex bg-white md:rounded-2xl md:border md:border-gray-200 md:shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <Sidebar />
        <HomeClient />
      </div>
    </main>
  )
}

export default page
