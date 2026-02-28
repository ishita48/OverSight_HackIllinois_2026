"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sidebarData } from "@/lib/data";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { generateUUID } from "@/lib/utils";

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  // Handle special actions like Start Session
  const handleItemClick = (item, e) => {
    if (item.isAction && item.title === "Start Session") {
      e.preventDefault();
      const sessionId = generateUUID();
      router.push(`/record/${sessionId}`);
    }
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-screen">
      <nav
        className="h-full w-20 bg-[#FDFCFB]/98 backdrop-blur-md border-r border-[#F7F5F2]/50 
                      flex flex-col items-center py-6
                      shadow-lg shadow-[#2C2825]/5"
      >
        {/* Logo */}
        <Link href="/home" className="group mb-8">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-[#D4735F] to-[#B85A47] 
                       rounded-2xl flex items-center justify-center
                       shadow-lg shadow-[#D4735F]/20 group-hover:shadow-xl
                       group-hover:shadow-[#D4735F]/30 transition-all duration-300"
            whileHover={{
              scale: 1.05,
              rotate: [0, -5, 5, 0],
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Flame className="w-6 h-6 text-white drop-shadow-sm" />
          </motion.div>
        </Link>

        {/* Navigation Items */}
        <div className="flex flex-col gap-4 flex-1">
          {sidebarData.map((item, index) => {
            const isActive =
              pathname === item.link ||
              (pathname.includes(item.link) && item.link !== "/home");

            return (
              <TooltipProvider key={item.id}>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      <Link
                        href={item.link}
                        onClick={(e) => handleItemClick(item, e)}
                        className="block group relative"
                      >
                        <motion.div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center
                                     transition-all duration-300 relative overflow-hidden
                                     ${
                                       isActive
                                         ? "bg-gradient-to-br from-[#D4735F] to-[#B85A47] text-white shadow-lg shadow-[#D4735F]/30"
                                         : "bg-[#F7F5F2]/50 text-[#6B6560] hover:bg-[#8B9DC3]/10 hover:text-[#8B9DC3] hover:shadow-md"
                                     }`}
                          whileHover={{
                            scale: 1.05,
                            y: -2,
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <item.icon className="w-5 h-5 relative z-10" />

                          {/* Gradient overlay on hover for inactive items */}
                          {!isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-[#8B9DC3]/20 to-[#D4735F]/20 
                                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          )}
                        </motion.div>

                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 
                                       bg-gradient-to-b from-[#D4735F] to-[#B85A47] rounded-r-full
                                       shadow-sm"
                            layoutId="activeIndicator"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  </TooltipTrigger>

                  <TooltipContent
                    side="right"
                    className="bg-[#2C2825] text-[#FDFCFB] border-none shadow-xl rounded-xl px-3 py-2
                               font-medium text-sm"
                    sideOffset={15}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.title}
                    </motion.div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* User Section */}
        <div className="pt-6 border-t border-[#F7F5F2]/70">
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#F7F5F2] 
                                  group-hover:ring-[#8B9DC3]/30 transition-all duration-300
                                  shadow-md group-hover:shadow-lg"
                  >
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-full h-full rounded-2xl",
                          userButtonPopoverCard:
                            "bg-[#FDFCFB] border-[#F7F5F2] shadow-2xl rounded-2xl",
                          userButtonPopoverFooter: "hidden",
                        },
                      }}
                    />
                  </div>

                  {/* Online status indicator */}
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-4 h-4 
                               bg-gradient-to-br from-[#7FB069] to-[#6A9B5C]
                               border-2 border-[#FDFCFB] rounded-full
                               shadow-sm"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </TooltipTrigger>

              <TooltipContent
                side="right"
                className="bg-[#2C2825] text-[#FDFCFB] border-none shadow-xl rounded-xl px-3 py-2
                           font-medium text-sm"
                sideOffset={15}
              >
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <div>{user?.firstName || "Founder"}</div>
                  <div className="text-xs text-[#8B9DC3] font-light">
                    storyteller
                  </div>
                </motion.div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
