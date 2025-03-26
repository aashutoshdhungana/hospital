import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, FileText, Settings, Bell, Pill, Activity, User, ChevronDown, LogOut, UserCog, ClipboardList, Stethoscope, Microscope, HeartPulse } from 'lucide-react';

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
} from './ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from "../hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

const Sidebar = () => {
  const location = useLocation();
  const { user, roles } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      path: '/appointments', 
      label: 'Appointments', 
      icon: Calendar,
      submenu: [
        { path: '/appointments/list', label: 'All appointments' },
        { path: '/appointments/create', label: 'Create' },
       
      ]
    },
    { 
      path: '/patients', 
      label: 'Patients', 
      icon: Users,
      submenu: [
        { path: '/patients/list', label: 'All Patients' },
        { path: '/patients/new', label: 'Create' },
        
      ]
    },
    { path: '/medical-records', label: 'Medical Records', icon: FileText },
    { 
      path: '/prescriptions', 
      label: 'Prescriptions', 
      icon: Pill,
      submenu: [
        { path: '/prescriptions/new', label: 'New Prescription' },
        { path: '/prescriptions/active', label: 'Active Prescriptions' },
        { path: '/prescriptions/history', label: 'Prescription History' },
      ]
    },
    { path: '/vitals', label: 'Vitals', icon: Activity },
    { path: '/notifications', label: 'Notifications', icon: Bell, badge: '5' },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  // Additional menu items based on role
  const doctorItems = [
    { path: '/doctor/patients', label: 'My Patients', icon: Stethoscope },
    { path: '/doctor/rounds', label: 'Rounds', icon: ClipboardList },
    { path: '/doctor/lab-results', label: 'Lab Results', icon: Microscope },
  ];

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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  {item.submenu ? (
                    <Collapsible className="w-full">
                      <CollapsibleTrigger className="w-full">
                        <SidebarMenuButton tooltip={item.label}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto mr-2">
                              {/* {item.badge} */}
                            </Badge>
                          )}
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.path}>
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
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Doctor Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {doctorItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.path} tooltip={item.label}>
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
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
                    <AvatarFallback>{user?.firstName}</AvatarFallback>
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
                <DropdownMenuItem className="bg-accent">
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Doctor</span>
                  <Badge variant="outline" className="ml-auto">
                    Active
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/receptionist/dashboard">
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Receptionist</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Admin</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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