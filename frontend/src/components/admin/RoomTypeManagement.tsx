import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Room, RoomType, RoomStatus } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Edit, Trash, Search } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Form schema for room type
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  type: z.nativeEnum(RoomType),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  basePrice: z.number().min(50, { message: "Base price must be at least $50" }),
  baseSize: z.number().min(15, { message: "Base size must be at least 15 sq ft" }),
  baseCapacity: z.number().min(1, { message: "Base capacity must be at least 1 person" }),
  defaultAmenities: z.array(z.string()),
  defaultImageUrl: z.string().url({ message: "Please enter a valid URL" }),
  priorityLevel: z.number().min(1).max(10).default(5)
});

type FormValues = z.infer<typeof formSchema>;

export default function RoomTypeManagement() {
  const [selectedType, setSelectedType] = useState<RoomType | 'all'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRoomType, setCurrentRoomType] = useState<RoomType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form for creating/editing room types
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: RoomType.STANDARD,
      description: '',
      basePrice: 100,
      baseSize: 30,
      baseCapacity: 2,
      defaultAmenities: ['Free Wi-Fi', 'Air Conditioning'],
      defaultImageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      priorityLevel: 5
    }
  });
  
  // CRUD mutations for room types
  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return apiRequest('POST', '/api/room-types', values);
    },
    onSuccess: () => {
      toast({
        title: "Room type created",
        description: "The room type has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/room-types'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create room type: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (values: FormValues & { id: RoomType }) => {
      return apiRequest('PATCH', `/api/room-types/${values.id}`, values);
    },
    onSuccess: () => {
      toast({
        title: "Room type updated",
        description: "The room type has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/room-types'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update room type: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (type: RoomType) => {
      return apiRequest('DELETE', `/api/room-types/${type}`);
    },
    onSuccess: () => {
      toast({
        title: "Room type deleted",
        description: "The room type has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/room-types'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete room type: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  // Calculate metrics for room types
  const calculateTypeMetrics = (rooms: Room[]) => {
    return Object.values(RoomType).reduce((acc, type) => {
      const typeRooms = rooms.filter(room => room.type === type);
      
      if (typeRooms.length > 0) {
        const avgPrice = typeRooms.reduce((sum, room) => sum + room.price, 0) / typeRooms.length;
        const minPrice = Math.min(...typeRooms.map(room => room.price));
        const maxPrice = Math.max(...typeRooms.map(room => room.price));
        const avgSize = typeRooms.reduce((sum, room) => sum + room.size, 0) / typeRooms.length;
        
        acc[type] = {
          count: typeRooms.length,
          avgPrice,
          minPrice,
          maxPrice,
          avgSize,
          amenityCounts: countAmenities(typeRooms),
        };
      }
      
      return acc;
    }, {} as Record<string, any>);
  };
  
  // Count amenities across rooms of same type
  const countAmenities = (rooms: Room[]) => {
    const amenityCounts: Record<string, number> = {};
    
    rooms.forEach(room => {
      if (room.amenities) {
        room.amenities.forEach(amenity => {
          amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1;
        });
      }
    });
    
    // Sort by count
    return Object.entries(amenityCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {} as Record<string, number>);
  };
  
  // Fetch all rooms
  const { data: allRooms = [], isLoading } = useQuery({
    queryKey: ['/api/rooms'],
  });
  
  // Create a simulated API endpoint for room types
  // In a real app, this would be fetched from the server
  const roomTypesData = Object.values(RoomType).map(type => {
    const typeRooms = allRooms.filter((room: Room) => room.type === type);
    const avgPrice = typeRooms.length > 0 
      ? typeRooms.reduce((sum, room) => sum + room.price, 0) / typeRooms.length
      : 0;
    const avgSize = typeRooms.length > 0
      ? typeRooms.reduce((sum, room) => sum + room.size, 0) / typeRooms.length
      : 0;
    const avgCapacity = typeRooms.length > 0
      ? typeRooms.reduce((sum, room) => sum + room.capacity, 0) / typeRooms.length
      : 0;
    
    return {
      id: type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Room`,
      type: type,
      description: `Standard description for ${type} room type.`,
      basePrice: avgPrice || 100,
      baseSize: avgSize || 30,
      baseCapacity: avgCapacity || 2,
      defaultAmenities: Array.from(new Set(typeRooms.flatMap(room => room.amenities || []))).slice(0, 5),
      defaultImageUrl: typeRooms.length > 0 ? typeRooms[0].imageUrl : 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      priorityLevel: type === RoomType.VIP ? 10 : type === RoomType.SUITE ? 8 : type === RoomType.DELUXE ? 6 : type === RoomType.FAMILY ? 5 : 3,
      roomCount: typeRooms.length
    };
  });
  
  // Handle edit room type
  const handleEditRoomType = (type: RoomType) => {
    setCurrentRoomType(type);
    const roomTypeData = roomTypesData.find(rt => rt.type === type);
    
    if (roomTypeData) {
      form.reset({
        name: roomTypeData.name,
        type: roomTypeData.type as RoomType,
        description: roomTypeData.description,
        basePrice: roomTypeData.basePrice,
        baseSize: roomTypeData.baseSize,
        baseCapacity: roomTypeData.baseCapacity,
        defaultAmenities: roomTypeData.defaultAmenities,
        defaultImageUrl: roomTypeData.defaultImageUrl,
        priorityLevel: roomTypeData.priorityLevel
      });
      setIsEditDialogOpen(true);
    }
  };
  
  // Handle delete room type
  const handleDeleteRoomType = (type: RoomType) => {
    setCurrentRoomType(type);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirm edit room type
  const onEditSubmit = (values: FormValues) => {
    if (currentRoomType) {
      updateMutation.mutate({ ...values, id: currentRoomType });
    }
  };
  
  // Confirm delete room type
  const confirmDelete = () => {
    if (currentRoomType) {
      deleteMutation.mutate(currentRoomType);
    }
  };
  
  // Handle create room type
  const onCreateSubmit = (values: FormValues) => {
    createMutation.mutate(values);
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading room data...</div>;
  }
  
  const metrics = calculateTypeMetrics(allRooms);
  const roomTypes = Object.keys(metrics) as RoomType[];
  
  // Filter rooms based on selected type
  const filteredRooms = selectedType === 'all' 
    ? allRooms 
    : allRooms.filter((room: Room) => room.type === selectedType);
    
  // Get total room count for calculating percentages
  const totalRooms = allRooms.length;
  
  // Handle pagination for room types table
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoomTypesData = roomTypesData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(roomTypesData.length / itemsPerPage);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Type Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {roomTypes.map(type => (
              <Card key={type} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold capitalize">{type} Room</h3>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline">{metrics[type].count} rooms</Badge>
                      <span className="text-sm text-muted-foreground">
                        {((metrics[type].count / totalRooms) * 100).toFixed(1)}% of inventory
                      </span>
                    </div>
                    <Progress 
                      className="mt-2" 
                      value={(metrics[type].count / totalRooms) * 100} 
                    />
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Avg. Price:</span>
                        <span className="font-medium">{formatCurrency(metrics[type].avgPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Size:</span>
                        <span className="font-medium">{Math.round(metrics[type].avgSize)} sq ft</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Common Amenities:</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(metrics[type].amenityCounts).slice(0, 3).map(([amenity, count]) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity} ({count})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Room Type Management</h2>
              <p className="text-muted-foreground text-sm">Manage hotel room types and their default attributes</p>
            </div>
            <Button 
              onClick={() => {
                form.reset();
                setIsCreateDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Room Type
            </Button>
          </div>
          
          {/* Room Type Data Table */}
          <Card>
            <CardHeader className="pb-1">
              <CardTitle>Room Types</CardTitle>
              <CardDescription>
                Configure default settings for each room type in your hotel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Base Size</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Room Count</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRoomTypesData.map((roomType) => (
                    <TableRow key={roomType.id}>
                      <TableCell className="font-medium capitalize">
                        {roomType.name}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(roomType.basePrice)}
                      </TableCell>
                      <TableCell>
                        {Math.round(roomType.baseSize)} sq ft
                      </TableCell>
                      <TableCell>
                        {roomType.baseCapacity} guests
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {roomType.roomCount} rooms
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={roomType.priorityLevel * 10}
                            className="h-2 w-20"
                          />
                          <span className="text-xs">{roomType.priorityLevel}/10</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={() => handleEditRoomType(roomType.type as RoomType)}
                            size="icon" 
                            variant="ghost"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => handleDeleteRoomType(roomType.type as RoomType)}
                            size="icon" 
                            variant="ghost"
                            disabled={roomType.roomCount > 0}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                          className="cursor-pointer"
                          aria-disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                          className="cursor-pointer"
                          aria-disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Room List by Type */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Rooms by Type</h3>
              <div className="flex space-x-2">
                <Badge 
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedType('all')}
                >
                  All Types
                </Badge>
                {roomTypes.map(type => (
                  <Badge 
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Room</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Floor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Capacity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Size</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium">{room.roomNumber}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {room.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="outline" className="capitalize">{room.type}</Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {room.floor}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {formatCurrency(room.price)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {room.capacity} guests
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {room.size} sq ft
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Create Room Type Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Room Type</DialogTitle>
                <DialogDescription>
                  Add a new room type to your hotel. This will set default attributes for rooms of this type.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Deluxe Room" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a room type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(RoomType).map(type => (
                                <SelectItem key={type} value={type} className="capitalize">
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Price</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                              value={field.value}
                              placeholder="100.00" 
                            />
                          </FormControl>
                          <FormDescription>
                            Base nightly rate in USD
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="baseSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Size (sq ft)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                              value={field.value}
                              placeholder="400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="baseCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Capacity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              value={field.value}
                              placeholder="2" 
                            />
                          </FormControl>
                          <FormDescription>
                            Number of guests
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priorityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority Level (1-10)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              max="10"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              value={field.value}
                              placeholder="5" 
                            />
                          </FormControl>
                          <FormDescription>
                            Higher priority rooms appear first in searches
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe this room type..." 
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="defaultImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/image.jpg" />
                        </FormControl>
                        <FormDescription>
                          URL for the default room image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? "Creating..." : "Create Room Type"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          {/* Edit Room Type Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Room Type</DialogTitle>
                <DialogDescription>
                  Update the attributes for this room type.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Deluxe Room" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={true} // Can't change the enum type itself
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a room type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(RoomType).map(type => (
                                <SelectItem key={type} value={type} className="capitalize">
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Type category cannot be changed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Price</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                              value={field.value}
                              placeholder="100.00" 
                            />
                          </FormControl>
                          <FormDescription>
                            Base nightly rate in USD
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="baseSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Size (sq ft)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                              value={field.value}
                              placeholder="400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="baseCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Capacity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              value={field.value}
                              placeholder="2" 
                            />
                          </FormControl>
                          <FormDescription>
                            Number of guests
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priorityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority Level (1-10)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              max="10"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              value={field.value}
                              placeholder="5" 
                            />
                          </FormControl>
                          <FormDescription>
                            Higher priority rooms appear first in searches
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe this room type..." 
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="defaultImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/image.jpg" />
                        </FormControl>
                        <FormDescription>
                          URL for the default room image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Updating..." : "Update Room Type"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          {/* Delete Room Type Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Room Type</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this room type? 
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              {currentRoomType && (
                <div className="py-4">
                  <p>
                    You are about to delete the <strong className="capitalize">{currentRoomType}</strong> room type.
                  </p>
                  
                  {roomTypesData.find(rt => rt.type === currentRoomType)?.roomCount > 0 && (
                    <div className="mt-2 p-4 bg-amber-50 text-amber-800 rounded-md">
                      <p className="text-sm font-medium">
                        Warning: This room type has {roomTypesData.find(rt => rt.type === currentRoomType)?.roomCount} rooms assigned to it.
                      </p>
                      <p className="text-xs mt-1">
                        You need to reassign or delete these rooms before deleting this room type.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={
                    deleteMutation.isPending || 
                    (currentRoomType && roomTypesData.find(rt => rt.type === currentRoomType)?.roomCount > 0)
                  }
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete Room Type"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}