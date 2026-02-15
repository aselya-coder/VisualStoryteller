import { NavLink } from "react-router-dom";
import { Sidebar as UISidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Navigation, Image, Info, Briefcase, GalleryHorizontalEnd, Cog, Wallet, MessageSquareQuote, Megaphone, FileText, Phone } from "lucide-react";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/navbar", label: "Navbar", icon: Navigation },
  { to: "/admin/hero", label: "Hero", icon: Image },
  { to: "/admin/about", label: "About", icon: Info },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/portfolio", label: "Portfolio", icon: GalleryHorizontalEnd },
  { to: "/admin/process", label: "Process", icon: Cog },
  { to: "/admin/pricing", label: "Pricing", icon: Wallet },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/cta", label: "CTA", icon: Megaphone },
  { to: "/admin/footer", label: "Footer", icon: FileText },
  { to: "/admin/whatsapp", label: "WhatsApp Settings", icon: Phone },
];

export const AdminSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <UISidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <SidebarTrigger />
            <span className="font-semibold">VisualStoryteller</span>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Menu</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <SidebarMenuItem key={it.to}>
                    <NavLink to={it.to} className={({ isActive }) => "block"}>
                      <SidebarMenuButton isActive={location.pathname === it.to}>
                        <Icon />
                        <span>{it.label}</span>
                      </SidebarMenuButton>
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </UISidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
