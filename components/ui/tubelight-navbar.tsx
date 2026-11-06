"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "")

  const sectionItems = useMemo(
    () => items.filter((item) => item.url.startsWith("#")),
    [items]
  )

  useEffect(() => {
    const updateActiveTab = () => {
      const viewportAnchor = window.innerHeight * 0.38
      let nextActive = items[0]?.name ?? ""

      for (const item of sectionItems) {
        const element = document.getElementById(item.url.slice(1))
        if (!element) continue

        const rect = element.getBoundingClientRect()
        if (rect.top <= viewportAnchor && rect.bottom >= viewportAnchor) {
          nextActive = item.name
        }
      }

      if (window.scrollY < 24) {
        nextActive = items[0]?.name ?? nextActive
      }

      setActiveTab(nextActive)
    }

    updateActiveTab()
    window.addEventListener("scroll", updateActiveTab, { passive: true })
    window.addEventListener("resize", updateActiveTab)

    return () => {
      window.removeEventListener("scroll", updateActiveTab)
      window.removeEventListener("resize", updateActiveTab)
    }
  }, [items, sectionItems])

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 z-50 mb-4 w-[calc(100%-1rem)] -translate-x-1/2 pointer-events-none sm:top-0 sm:mb-0 sm:w-auto sm:pt-6",
        className
      )}
    >
      <div className="pointer-events-auto flex items-center justify-center gap-1 rounded-full border border-white/10 bg-black/35 px-1 py-1 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:gap-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative flex min-w-0 items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:px-5",
                "text-zinc-300/85 hover:text-white",
                isActive && "text-violet-100"
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.25} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 -z-10 w-full rounded-full bg-violet-500/10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 280, damping: 26 }}
                >
                  <div className="absolute left-1/2 top-0 h-1 w-10 -translate-x-1/2 rounded-full bg-violet-400 sm:-top-2">
                    <div className="absolute -left-3 -top-2 h-6 w-16 rounded-full bg-violet-400/20 blur-md" />
                    <div className="absolute left-1 top-0 h-5 w-8 rounded-full bg-cyan-300/25 blur-md" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
