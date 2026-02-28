import { Home, FolderOpen, BarChart3, Settings, User } from "lucide-react";

export const sidebarData = [
  {
    id: 1,
    title: "Home",
    link: "/home",
    icon: Home,
  },
  {
    id: 2,
    title: "Projects",
    link: "/projects",
    icon: FolderOpen,
  },
  {
    id: 3,
    title: "Insights",
    link: "/sessions",
    icon: BarChart3,
  },
  {
    id: 4,
    title: "Profile",
    link: "/profile",
    icon: User,
  },
  {
    id: 5,
    title: "Settings",
    link: "/settings",
    icon: Settings,
  },
];
