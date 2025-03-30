import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Booking, Room, User } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatCurrency } from '@/lib/utils';
import { format, addDays, differenceInDays, isBefore, isAfter, parseISO, startOfToday } from 'date-fns';
import { CalendarIcon, Search, Printer, Filter, RefreshCw } from 'lucide-react';

export default function BookingManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });
  
  // Fetch bookings data
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/bookings'],
  });
  
  // Fetch rooms for filtering
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['/api/rooms'],
  });
  
  // Fetch users for displaying customer info
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
  });
  
  // Compute metrics
  const calculateMetrics = () => {
    const today = startOfToday();
    const upcomingBookings = bookings.filter((booking: Booking) => 
      isAfter(parseISO(booking.checkIn), today)
    );
    
    const currentBookings = bookings.filter((booking: Booking) => 
      isBefore(parseISO(booking.checkIn), today) && 
      isAfter(parseISO(booking.checkOut), today)
    );
    
    const totalRevenue = bookings.reduce(
      (sum: number, booking: Booking) => sum + booking.totalPrice,
      0
    );
    
    return {
      total: bookings.length,
      upcoming: upcomingBookings.length,
      current: currentBookings.length,
      revenue: totalRevenue,
    };
  };
  
  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter((booking: Booking) => {
    // Search by booking ID or customer info
    const user = users.find((u: User) => u.id === booking.userId);
    const room = rooms.find((r: Room) => r.id === booking.roomId);
    const searchString = `${booking.id} ${user?.name || ''} ${user?.email || ''} ${room?.roomNumber || ''}`.toLowerCase();
    
    if (searchQuery && !searchString.includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by room
    if (selectedRoomId && booking.roomId !== selectedRoomId) {
      return false;
    }
    
    // Filter by date range
    if (dateRange.from && isAfter(dateRange.from, parseISO(booking.checkIn))) {
      return false;
    }
    
    if (dateRange.to && isBefore(dateRange.to, parseISO(booking.checkOut))) {
      return false;
    }
    
    // Filter by status (upcoming, current, past)
    const today = startOfToday();
    if (selectedStatus) {
      if (selectedStatus === 'upcoming' && !isAfter(parseISO(booking.checkIn), today)) {
        return false;
      }
      if (selectedStatus === 'current' && 
          !(isBefore(parseISO(booking.checkIn), today) && isAfter(parseISO(booking.checkOut), today))) {
        return false;
      }
      if (selectedStatus === 'past' && !isBefore(parseISO(booking.checkOut), today)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRoomId(null);
    setSelectedStatus(null);
    setDateRange({ from: null, to: null });
  };
  
  // Format date range for display
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    if (dateRange.from) {
      return `From ${format(dateRange.from, 'MMM d, yyyy')}`;
    }
    if (dateRange.to) {
      return `Until ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    return 'Select date range';
  };
  
  // Get booking status based on dates
  const getBookingStatus = (checkIn: string, checkOut: string) => {
    const today = startOfToday();
    const checkInDate = parseISO(checkIn);
    const checkOutDate = parseISO(checkOut);
    
    if (isAfter(checkInDate, today)) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    }
    if (isBefore(checkInDate, today) && isAfter(checkOutDate, today)) {
      return { status: 'current', label: 'Current Stay', color: 'bg-green-100 text-green-800' };
    }
    return { status: 'past', label: 'Completed', color: 'bg-gray-100 text-gray-800' };
  };
  
  if (bookingsLoading || roomsLoading || usersLoading) {
    return <div className="flex justify-center p-8">Loading booking data...</div>;
  }
  
  const metrics = calculateMetrics();
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time bookings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcoming}</div>
            <p className="text-xs text-muted-foreground mt-1">Reservations in the future</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Stays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.current}</div>
            <p className="text-xs text-muted-foreground mt-1">Active guest stays</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time booking revenue</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings by ID, guest, or room..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2">
              <Select value={selectedStatus || ''} onValueChange={(value) => setSelectedStatus(value || null)}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="past">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedRoomId ? String(selectedRoomId) : ''} 
                onValueChange={(value) => setSelectedRoomId(value ? Number(value) : null)}
              >
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Rooms</SelectItem>
                  {rooms.map((room: Room) => (
                    <SelectItem key={room.id} value={String(room.id)}>
                      {room.roomNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal sm:w-[240px]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={{ 
                      from: dateRange.from || undefined, 
                      to: dateRange.to || undefined
                    }}
                    onSelect={(range) => 
                      setDateRange({ 
                        from: range?.from || null, 
                        to: range?.to || null 
                      })
                    }
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="ghost" size="icon" onClick={resetFilters}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <ScrollArea className="max-h-[500px]">
              <table className="w-full min-w-[800px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Guest</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Room</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Dates</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking: Booking) => {
                      const user = users.find((u: User) => u.id === booking.userId);
                      const room = rooms.find((r: Room) => r.id === booking.roomId);
                      const status = getBookingStatus(booking.checkIn, booking.checkOut);
                      const checkInDate = parseISO(booking.checkIn);
                      const checkOutDate = parseISO(booking.checkOut);
                      const nights = differenceInDays(checkOutDate, checkInDate);
                      
                      return (
                        <tr key={booking.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3 text-sm">#{booking.id}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium">{user?.name || 'Guest'}</div>
                            <div className="text-xs text-muted-foreground">{user?.email || 'No email'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">{room?.roomNumber || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {room?.name || 'Room'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <div>{format(parseISO(booking.checkIn), 'MMM d, yyyy')}</div>
                            <div>to {format(parseISO(booking.checkOut), 'MMM d, yyyy')}</div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {nights} {nights === 1 ? 'night' : 'nights'}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {formatCurrency(booking.totalPrice)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={`${status.color} border-0`}>
                              {status.label}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                        No bookings found matching the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}