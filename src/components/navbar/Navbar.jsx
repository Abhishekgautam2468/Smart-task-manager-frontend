'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { LuMenu, LuSearch, LuSparkles } from 'react-icons/lu'
import logo from '@/assets/my logo.png'
import { toggleMobileSidebar } from '@/redux/slices/tasksSlices'

const Navbar = () => {
  const dispatch = useDispatch()
  const isMobileSidebarOpen = useSelector(state => state.tasks.isMobileSidebarOpen)

  return (
    <header className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur md:px-7">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gray-900 shadow-sm">
          <Image src={logo} alt="Task Flow" width={26} height={26} />
        </span>
        <div>
          <h1 className="text-xl font-black text-gray-950 md:text-2xl">
            Task Flow
          </h1>
          <p className="hidden text-xs font-medium text-gray-500 sm:block">
            Plan, prioritize, finish.
          </p>
        </div>
      </div>

      <div className="hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 lg:flex">
        <LuSearch className="h-4 w-4 shrink-0" />
        <span className="truncate">Search is coming soon</span>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-800 sm:flex">
        <LuSparkles className="h-4 w-4" />
        AI ready
      </div>

      <motion.button
        type="button"
        aria-label={isMobileSidebarOpen ? 'Close menu' : 'Open menu'}
        onClick={() => dispatch(toggleMobileSidebar())}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 520, damping: 30 }}
        className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 md:hidden"
      >
        <LuMenu className="h-5 w-5" />
      </motion.button>
    </header>
  )
}

export default Navbar
