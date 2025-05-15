import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Room, RoomType, RoomStatus } from "../../shared/schema";
import { apiRequest } from "../../lib/queryClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { formatCurrency } from "../../lib/utils";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useToast } from "../../hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Edit, Trash, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

// Form schema
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  type: z.nativeEnum(RoomType),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  basePrice: z.number().min(50, { message: "Base price must be at least $50" }),
  baseSize: z
    .number()
    .min(15, { message: "Base size must be at least 15 sq ft" }),
  baseCapacity: z
    .number()
    .min(1, { message: "Base capacity must be at least 1 person" }),
  defaultAmenities: z.array(z.string()),
  defaultImageUrl: z.string().url({ message: "Please enter a valid URL" }),
  priorityLevel: z.number().min(1).max(10).default(5),
});

function RoomTypeManagement() {
  var [selectedType, setSelectedType] = useState("all");
  var [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  var [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  var [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  var [currentRoomType, setCurrentRoomType] = useState(null);
  var [currentPage, setCurrentPage] = useState(1);
  var [itemsPerPage] = useState(5);
  var { toast } = useToast();
  var queryClient = useQueryClient();

  var form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: RoomType.STANDARD,
      description: "",
      basePrice: 100,
      baseSize: 30,
      baseCapacity: 2,
      defaultAmenities: ["Free Wi-Fi", "Air Conditioning"],
      defaultImageUrl:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      priorityLevel: 5,
    },
  });

  var createMutation = useMutation({
    mutationFn: function (values) {
      return apiRequest("POST", "/api/room-types", values);
    },
    onSuccess: function () {
      toast({
        title: "Room type created",
        description: "The room type has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/room-types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: function (error) {
      toast({
        title: "Error",
        description: "Failed to create room type: " + error.message,
        variant: "destructive",
      });
    },
  });

  var updateMutation = useMutation({
    mutationFn: function (values) {
      return apiRequest("PATCH", "/api/room-types/" + values.id, values);
    },
    onSuccess: function () {
      toast({
        title: "Room type updated",
        description: "The room type has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/room-types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      setIsEditDialogOpen(false);
    },
    onError: function (error) {
      toast({
        title: "Error",
        description: "Failed to update room type: " + error.message,
        variant: "destructive",
      });
    },
  });

  var deleteMutation = useMutation({
    mutationFn: function (type) {
      return apiRequest("DELETE", "/api/room-types/" + type);
    },
    onSuccess: function () {
      toast({
        title: "Room type deleted",
        description: "The room type has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/room-types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      setIsDeleteDialogOpen(false);
    },
    onError: function (error) {
      toast({
        title: "Error",
        description: "Failed to delete room type: " + error.message,
        variant: "destructive",
      });
    },
  });

  // ... Tiếp tục phần còn lại (calculateTypeMetrics, countAmenities, useQuery, JSX render)

  function calculateTypeMetrics(rooms) {
    return Object.values(RoomType).reduce(function (acc, type) {
      var typeRooms = rooms.filter(function (room) {
        return room.type === type;
      });

      if (typeRooms.length > 0) {
        var avgPrice =
          typeRooms.reduce(function (sum, room) {
            return sum + room.price;
          }, 0) / typeRooms.length;
        var minPrice = Math.min.apply(
          null,
          typeRooms.map(function (room) {
            return room.price;
          })
        );
        var maxPrice = Math.max.apply(
          null,
          typeRooms.map(function (room) {
            return room.price;
          })
        );
        var avgSize =
          typeRooms.reduce(function (sum, room) {
            return sum + room.size;
          }, 0) / typeRooms.length;

        acc[type] = {
          count: typeRooms.length,
          avgPrice: avgPrice,
          minPrice: minPrice,
          maxPrice: maxPrice,
          avgSize: avgSize,
          amenityCounts: countAmenities(typeRooms),
        };
      }

      return acc;
    }, {});
  }

  function countAmenities(rooms) {
    var amenityCounts = {};

    rooms.forEach(function (room) {
      if (room.amenities) {
        room.amenities.forEach(function (amenity) {
          amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1;
        });
      }
    });

    return Object.entries(amenityCounts)
      .sort(function (a, b) {
        return b[1] - a[1];
      })
      .reduce(function (obj, entry) {
        obj[entry[0]] = entry[1];
        return obj;
      }, {});
  }

  var { data: allRooms = [], isLoading } = useQuery({
    queryKey: ["/api/rooms"],
  });

  var roomTypesData = Object.values(RoomType).map(function (type) {
    var typeRooms = allRooms.filter(function (room) {
      return room.type === type;
    });
    var avgPrice =
      typeRooms.length > 0
        ? typeRooms.reduce(function (sum, room) {
            return sum + room.price;
          }, 0) / typeRooms.length
        : 0;
    var avgSize =
      typeRooms.length > 0
        ? typeRooms.reduce(function (sum, room) {
            return sum + room.size;
          }, 0) / typeRooms.length
        : 0;
    var avgCapacity =
      typeRooms.length > 0
        ? typeRooms.reduce(function (sum, room) {
            return sum + room.capacity;
          }, 0) / typeRooms.length
        : 0;

    return {
      id: type,
      name: type.charAt(0).toUpperCase() + type.slice(1) + " Room",
      type: type,
      description: "Standard description for " + type + " room type.",
      basePrice: avgPrice || 100,
      baseSize: avgSize || 30,
      baseCapacity: avgCapacity || 2,
      defaultAmenities: Array.from(
        new Set(
          typeRooms.flatMap(function (room) {
            return room.amenities || [];
          })
        )
      ).slice(0, 5),
      defaultImageUrl:
        typeRooms.length > 0
          ? typeRooms[0].imageUrl
          : "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      priorityLevel:
        type === RoomType.VIP
          ? 10
          : type === RoomType.SUITE
          ? 8
          : type === RoomType.DELUXE
          ? 6
          : type === RoomType.FAMILY
          ? 5
          : 3,
      roomCount: typeRooms.length,
    };
  });

  function handleEditRoomType(type) {
    setCurrentRoomType(type);
    var roomTypeData = roomTypesData.find(function (rt) {
      return rt.type === type;
    });

    if (roomTypeData) {
      form.reset({
        name: roomTypeData.name,
        type: roomTypeData.type,
        description: roomTypeData.description,
        basePrice: roomTypeData.basePrice,
        baseSize: roomTypeData.baseSize,
        baseCapacity: roomTypeData.baseCapacity,
        defaultAmenities: roomTypeData.defaultAmenities,
        defaultImageUrl: roomTypeData.defaultImageUrl,
        priorityLevel: roomTypeData.priorityLevel,
      });
      setIsEditDialogOpen(true);
    }
  }

  function handleDeleteRoomType(type) {
    setCurrentRoomType(type);
    setIsDeleteDialogOpen(true);
  }

  function onEditSubmit(values) {
    if (currentRoomType) {
      updateMutation.mutate(Object.assign({}, values, { id: currentRoomType }));
    }
  }

  function confirmDelete() {
    if (currentRoomType) {
      deleteMutation.mutate(currentRoomType);
    }
  }

  function onCreateSubmit(values) {
    createMutation.mutate(values);
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading room data...</div>;
  }

  var metrics = calculateTypeMetrics(allRooms);
  var roomTypes = Object.keys(metrics);
  var filteredRooms =
    selectedType === "all"
      ? allRooms
      : allRooms.filter(function (room) {
          return room.type === selectedType;
        });
  var totalRooms = allRooms.length;
  var indexOfLastItem = currentPage * itemsPerPage;
  var indexOfFirstItem = indexOfLastItem - itemsPerPage;
  var currentRoomTypesData = roomTypesData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  var totalPages = Math.ceil(roomTypesData.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Type Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4  grid-cols-3">
            {roomTypes.map(function (type) {
              return (
                <Card key={type} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold capitalize">
                        {type} Room
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline">
                          {metrics[type].count} rooms
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {((metrics[type].count / totalRooms) * 100).toFixed(
                            1
                          )}
                          % of inventory
                        </span>
                      </div>
                      <Progress
                        className="mt-2"
                        value={(metrics[type].count / totalRooms) * 100}
                      />

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Avg. Price:</span>
                          <span className="font-medium">
                            {formatCurrency(metrics[type].avgPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Size:</span>
                          <span className="font-medium">
                            {Math.round(metrics[type].avgSize)} sq ft
                          </span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">
                          Common Amenities:
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(metrics[type].amenityCounts)
                            .slice(0, 3)
                            .map(function (entry) {
                              return (
                                <Badge
                                  key={entry[0]}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {entry[0]} ({entry[1]})
                                </Badge>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="flex flex-col justify-between items-start  mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Room Type Management</h2>
              <p className="text-muted-foreground text-sm">
                Manage hotel room types and their default attributes
              </p>
            </div>
            <Button
              onClick={function () {
                form.reset();
                setIsCreateDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Room Type
            </Button>
          </div>

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
                  {currentRoomTypesData.map(function (roomType) {
                    return (
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
                        <TableCell>{roomType.baseCapacity} guests</TableCell>
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
                            <span className="text-xs">
                              {roomType.priorityLevel}/10
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={function () {
                                handleEditRoomType(roomType.type);
                              }}
                              size="icon"
                              variant="ghost"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={function () {
                                handleDeleteRoomType(roomType.type);
                              }}
                              size="icon"
                              variant="ghost"
                              disabled={roomType.roomCount > 0}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={function () {
                            setCurrentPage(Math.max(currentPage - 1, 1));
                          }}
                          className="cursor-pointer"
                          aria-disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }).map(function (_, i) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={function () {
                                setCurrentPage(i + 1);
                              }}
                              isActive={currentPage === i + 1}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      <PaginationItem>
                        <PaginationNext
                          onClick={function () {
                            setCurrentPage(
                              Math.min(currentPage + 1, totalPages)
                            );
                          }}
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

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={function (open) {
              setIsCreateDialogOpen(open);
            }}
          >
            <DialogContent className="max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Room Type</DialogTitle>
                <DialogDescription>
                  Add a new room type to your hotel. This will set default
                  attributes for rooms of this type.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onCreateSubmit)}
                  className="space-y-4 pt-4"
                >
                  <div className="grid  grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Room Type Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Deluxe Room" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={function ({ field }) {
                        return (
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
                                {Object.values(RoomType).map(function (type) {
                                  return (
                                    <SelectItem
                                      key={type}
                                      value={type}
                                      className="capitalize"
                                    >
                                      {type}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Base Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={function (e) {
                                  field.onChange(parseFloat(e.target.value));
                                }}
                                value={field.value}
                                placeholder="100.00"
                              />
                            </FormControl>
                            <FormDescription>
                              Base nightly rate in USD
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="baseSize"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Base Size (sq ft)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={function (e) {
                                  field.onChange(parseFloat(e.target.value));
                                }}
                                value={field.value}
                                placeholder="400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="baseCapacity"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Base Capacity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={function (e) {
                                  field.onChange(parseInt(e.target.value));
                                }}
                                value={field.value}
                                placeholder="2"
                              />
                            </FormControl>
                            <FormDescription>Number of guests</FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="priorityLevel"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Priority Level (1-10)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                {...field}
                                onChange={function (e) {
                                  field.onChange(parseInt(e.target.value));
                                }}
                                value={field.value}
                                placeholder="5"
                              />
                            </FormControl>
                            <FormDescription>
                              Higher priority rooms appear first in searches
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={function ({ field }) {
                      return (
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
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="defaultImageUrl"
                    render={function ({ field }) {
                      return (
                        <FormItem>
                          <FormLabel>Default Image URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://example.com/image.jpg"
                            />
                          </FormControl>
                          <FormDescription>
                            URL for the default room image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={function () {
                        setIsCreateDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending
                        ? "Creating..."
                        : "Create Room Type"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isEditDialogOpen}
            onOpenChange={function (open) {
              setIsEditDialogOpen(open);
            }}
          >
            <DialogContent className="max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Room Type</DialogTitle>
                <DialogDescription>
                  Update the attributes for this room type.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onEditSubmit)}
                  className="space-y-4 pt-4"
                >
                  {/* Lặp lại các FormField tương tự Create, chỉ khác disable Select */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Room Type Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Deluxe Room" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Type Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={true}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a room type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(RoomType).map(function (type) {
                                  return (
                                    <SelectItem
                                      key={type}
                                      value={type}
                                      className="capitalize"
                                    >
                                      {type}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Type category cannot be changed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Base Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={function (e) {
                                  field.onChange(parseFloat(e.target.value));
                                }}
                                value={field.value}
                                placeholder="100.00"
                              />
                            </FormControl>
                            <FormDescription>
                              Base nightly rate in USD
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="baseSize"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Base Size (sq ft)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={function (e) {
                                  field.onChange(parseFloat(e.target.value));
                                }}
                                value={field.value}
                                placeholder="400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="baseCapacity"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Base Capacity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={function (e) {
                                  field.onChange(parseInt(e.target.value));
                                }}
                                value={field.value}
                                placeholder="2"
                              />
                            </FormControl>
                            <FormDescription>Number of guests</FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="priorityLevel"
                      render={function ({ field }) {
                        return (
                          <FormItem>
                            <FormLabel>Priority Level (1-10)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                {...field}
                                onChange={function (e) {
                                  field.onChange(parseInt(e.target.value));
                                }}
                                value={field.value}
                                placeholder="5"
                              />
                            </FormControl>
                            <FormDescription>
                              Higher priority rooms appear first in searches
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={function ({ field }) {
                      return (
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
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="defaultImageUrl"
                    render={function ({ field }) {
                      return (
                        <FormItem>
                          <FormLabel>Default Image URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://example.com/image.jpg"
                            />
                          </FormControl>
                          <FormDescription>
                            URL for the default room image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={function () {
                        setIsEditDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending
                        ? "Updating..."
                        : "Update Room Type"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={function (open) {
              setIsDeleteDialogOpen(open);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Room Type</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this room type? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              {currentRoomType && (
                <div className="py-4">
                  <p>
                    You are about to delete the{" "}
                    <strong className="capitalize">{currentRoomType}</strong>{" "}
                    room type.
                  </p>
                  {roomTypesData.find(function (rt) {
                    return rt.type === currentRoomType;
                  })?.roomCount > 0 && (
                    <div className="mt-2 p-4 bg-amber-50 text-amber-800 rounded-md">
                      <p className="text-sm font-medium">
                        Warning: This room type has{" "}
                        {
                          roomTypesData.find(function (rt) {
                            return rt.type === currentRoomType;
                          })?.roomCount
                        }{" "}
                        rooms assigned to it.
                      </p>
                      <p className="text-xs mt-1">
                        You need to reassign or delete these rooms before
                        deleting this room type.
                      </p>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={function () {
                    setIsDeleteDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={
                    deleteMutation.isPending ||
                    (currentRoomType &&
                      roomTypesData.find(function (rt) {
                        return rt.type === currentRoomType;
                      })?.roomCount > 0)
                  }
                >
                  {deleteMutation.isPending
                    ? "Deleting..."
                    : "Delete Room Type"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RoomTypeManagement;
