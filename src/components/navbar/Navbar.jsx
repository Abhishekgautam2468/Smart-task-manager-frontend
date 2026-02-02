'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import logo from '@/assets/my logo.png'
import { toggleMobileSidebar } from '@/redux/slices/tasksSlices'

const Navbar = () => {
  const dispatch = useDispatch()
  const isMobileSidebarOpen = useSelector(state => state.tasks.isMobileSidebarOpen)

  return (
    <header className="flex items-center justify-between px-6 py-5 border-b">
      <div className="flex items-center gap-3">
        <Image src={logo} alt="Task Flow" width={32} height={32} />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Task Flow
        </h1>
      </div>

      <motion.button
        type="button"
        aria-label={isMobileSidebarOpen ? 'Close menu' : 'Open menu'}
        onClick={() => dispatch(toggleMobileSidebar())}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 520, damping: 30 }}
        className="h-10 w-10 grid place-items-center rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-700 md:hidden"
      >
        <span className="relative block h-4 w-5">
          <motion.span
            className="absolute left-0 top-0 h-0.5 w-5 rounded bg-current"
            animate={
              isMobileSidebarOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }
            }
            transition={{ type: 'spring', stiffness: 520, damping: 34 }}
          />
          <motion.span
            className="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current"
            animate={isMobileSidebarOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.12 }}
          />
          <motion.span
            className="absolute left-0 top-3 h-0.5 w-5 rounded bg-current"
            animate={
              isMobileSidebarOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }
            }
            transition={{ type: 'spring', stiffness: 520, damping: 34 }}
          />
        </span>
      </motion.button>
    </header>
  )
}

export default Navbar
