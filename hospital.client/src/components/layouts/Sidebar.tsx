import { Link, useLocation } from 'react-router-dom';
import { User, ChevronDown, LogOut, UserCog, HeartPulse } from 'lucide-react';
import sideBarItems from '../../configs/sidebarItems';

import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '../ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from "../../hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

const Sidebar = () => {
  const location = useLocation();
  const { user, roles, permissions, activeRole, setActiveRole, logOut } = useAuth();

  const hasPermission = (requiredPermission: string) => {
    return (permissions && permissions.includes(requiredPermission)) || activeRole === 'Admin';
  }

  const filteredSidebarItems = sideBarItems.filter(item => {
    if (item.permission) {
      return hasPermission(item.permission) || item.submenu?.some(subItem => !subItem.permission || hasPermission(subItem.permission));
    }
    return true;
  })

  return (
    <UISidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <HeartPulse className="h-4 w-4" />
          </div>
          <div className="font-semibold">EHR System</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSidebarItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  {item.submenu ? (
                    <Collapsible className="w-full">
                      <CollapsibleTrigger className="w-full">
                        <SidebarMenuButton tooltip={item.label}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            (!subItem.permission || hasPermission(subItem.permission)) && <SidebarMenuSubItem key={subItem.path}>
                              <SidebarMenuSubButton asChild isActive={location.pathname === subItem.path}>
                                <Link to={subItem.path}>{subItem.label}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild isActive={location.pathname === item.path} tooltip={item.label}>
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src=""
                      // {user?.avatar} 
                      alt={user?.firstName} />
                    <AvatarFallback>{user?.firstName?.[0] || ''}{user?.lastName?.[0] || ''}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span>
                      {user?.firstName}
                    </span>
                    <span className="text-xs text-muted-foreground"> {roles.map(role => (
                      <div key={role} className="role-badge">
                        {role}
                      </div>
                    ))}</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                {roles.map((role) => (<>
                  <DropdownMenuItem className="bg-accent" onClick={() => setActiveRole(role)} key={`${role}-selection`}>
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>{role}</span>
                    {activeRole === role && <Badge variant="outline" className="ml-auto">
                      Active
                    </Badge>}
                  </DropdownMenuItem>
                </>))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </UISidebar>
  );
};

export default Sidebar;