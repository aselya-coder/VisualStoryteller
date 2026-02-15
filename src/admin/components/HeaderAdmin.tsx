import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/admin/auth/AuthContext";

const HeaderAdmin = ({ title }: { title: string }) => {
  const { logout } = useAuth();
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span>Admin</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderAdmin;

