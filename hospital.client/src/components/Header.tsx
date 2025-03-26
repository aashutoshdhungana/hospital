import { Bell, Search, User, MessageSquare, Calendar, FileText } from 'lucide-react';
import ThemeSwitch from './ThemeSwitch';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SidebarTrigger } from './ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { useAuth } from "../hooks/useAuth";
const Header = () => {
  // Mock user data
  const { user, roles } = useAuth();

  const notifications = [
    { id: 1, title: 'New appointment', message: 'You have a new appointment at 2:00 PM', time: '10 min ago', type: 'appointment' },
    { id: 2, title: 'Lab results ready', message: 'Patient John Doe lab results are ready', time: '1 hour ago', type: 'lab' },
    { id: 3, title: 'Meeting reminder', message: 'Staff meeting in 30 minutes', time: '25 min ago', type: 'meeting' },
    { id: 4, title: 'New message', message: 'Dr. Smith sent you a message', time: '2 hours ago', type: 'message' },
  ];



  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'lab':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'meeting':
        return <User className="h-4 w-4 text-purple-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">Hospital Management</h1>
          <p className="text-sm text-muted-foreground">
          {roles.map(role => (
                <div key={role} className="role-badge">
                  {role}
                </div>
              ))}
          </p>
        </div>
      </div>

      <div className="flex flex-1 justify-center px-4 md:px-6 lg:px-8">
        <div className="relative hidden w-full max-w-md md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients, appointments, records..."
            className="w-full pl-8 md:w-[300px] lg:w-[400px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {notifications.length}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <div className="font-medium">Notifications</div>
              <div className="text-xs text-muted-foreground">
                You have {notifications.length} unread messages
              </div>
            </div>
            <div className="max-h-80 overflow-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b last:border-0"
                >
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t">
              <Button variant="ghost" className="w-full justify-center" size="sm">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <ThemeSwitch />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src=""
                // {user?.avatar} 
                alt={user?.firstName} />
                <AvatarFallback>{user?.firstName}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
