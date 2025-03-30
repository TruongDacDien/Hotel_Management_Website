import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Room, RoomStatus } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building, Building2, ClipboardList } from 'lucide-react';

export default function RoomManagement() {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomStatus, setRoomStatus] = useState<RoomStatus | ''>('');
  const [roomNotes, setRoomNotes] = useState('');
  const [viewingHistory, setViewingHistory] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all rooms
  const { data: allRooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['/api/rooms'],
    select: (data: Room[]) => data.sort((a, b) => a.floor - b.floor || a.roomNumber.localeCompare(b.roomNumber)),
  });

  // Fetch room status history when needed
  const { data: roomHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['/api/rooms/status-history', selectedRoom?.id],
    enabled: viewingHistory && !!selectedRoom?.id,
  });

  // Update room status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ roomId, status, notes }: { roomId: number, status: RoomStatus, notes?: string }) => {
      return await apiRequest('PATCH', `/api/rooms/${roomId}/status`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      toast({
        title: "Room status updated",
        description: "The room status has been successfully updated.",
      });
      setSelectedRoom(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to update room status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Get unique floors from rooms
  const uniqueFloors = Array.from(new Set(allRooms.map((room: Room) => room.floor))).sort((a, b) => a - b);

  // Select a floor if one isn't already selected and we have data
  React.useEffect(() => {
    if (uniqueFloors.length > 0 && selectedFloor === null) {
      setSelectedFloor(uniqueFloors[0]);
    }
  }, [uniqueFloors, selectedFloor]);

  // Get rooms for the selected floor
  const floorRooms = allRooms.filter((room: Room) => selectedFloor !== null && room.floor === selectedFloor);

  // Status handling functions
  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'bg-gray-200'; // Gray - Empty and ready
      case RoomStatus.BOOKED:
        return 'bg-blue-200'; // Blue - Reserved
      case RoomStatus.OCCUPIED:
        return 'bg-green-200'; // Green - Currently occupied
      case RoomStatus.CLEANING:
        return 'bg-yellow-200'; // Yellow - Needs cleaning
      case RoomStatus.MAINTENANCE:
        return 'bg-red-200'; // Red - Under maintenance
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusDisplayName = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'Available';
      case RoomStatus.BOOKED:
        return 'Booked';
      case RoomStatus.OCCUPIED:
        return 'Occupied';
      case RoomStatus.CLEANING:
        return 'Needs Cleaning';
      case RoomStatus.MAINTENANCE:
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const handleUpdateStatus = () => {
    if (selectedRoom && roomStatus) {
      updateStatusMutation.mutate({
        roomId: selectedRoom.id,
        status: roomStatus as RoomStatus,
        notes: roomNotes || undefined,
      });
    }
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setRoomStatus(room.status as RoomStatus);
    setRoomNotes('');
    setViewingHistory(false);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  if (roomsLoading) {
    return <div className="flex justify-center p-8">Loading room data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Floors
                </h3>
              </div>
              <div className="space-y-2">
                {uniqueFloors.map((floor) => (
                  <Button
                    key={floor}
                    variant={selectedFloor === floor ? "default" : "outline"}
                    onClick={() => setSelectedFloor(floor)}
                    className="w-full justify-start"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Floor {floor}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-3/4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Rooms on Floor {selectedFloor}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {floorRooms.length > 0 ? (
                  floorRooms.map((room: Room) => (
                    <div
                      key={room.id}
                      className={`${getStatusColor(room.status as RoomStatus)} p-3 rounded-md cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => handleRoomClick(room)}
                    >
                      <div className="font-semibold">{room.roomNumber}</div>
                      <div className="text-xs">{getStatusDisplayName(room.status as RoomStatus)}</div>
                      <div className="text-xs truncate">{room.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-4">
                    No rooms found on this floor.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Room Status Update Dialog */}
      <Dialog open={!!selectedRoom} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {!viewingHistory 
                ? `Update Room ${selectedRoom?.roomNumber} Status` 
                : `Status History - Room ${selectedRoom?.roomNumber}`}
            </DialogTitle>
          </DialogHeader>
          
          {viewingHistory ? (
            <div className="space-y-4">
              {historyLoading ? (
                <div className="text-center py-4">Loading history...</div>
              ) : (
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  {(roomHistory as any[]).length > 0 ? (
                    (roomHistory as any[]).map((record: any) => (
                      <div key={record.id} className="mb-4 pb-4 border-b last:border-0">
                        <div className="flex justify-between">
                          <span className={`font-medium px-2 py-1 rounded text-xs ${getStatusColor(record.status as RoomStatus)}`}>
                            {getStatusDisplayName(record.status as RoomStatus)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(record.timestamp)}
                          </span>
                        </div>
                        {record.notes && (
                          <div className="mt-2 text-sm">
                            <span className="font-semibold">Notes:</span> {record.notes}
                          </div>
                        )}
                        <div className="mt-1 text-xs">
                          <span className="text-muted-foreground">Updated by: </span>
                          {record.updatedByName || 'System'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">No history records found.</div>
                  )}
                </ScrollArea>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setViewingHistory(false)}
                >
                  Back to Room
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{selectedRoom?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Current status: {selectedRoom?.status && getStatusDisplayName(selectedRoom.status as RoomStatus)}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setViewingHistory(true)}
                  >
                    View History
                  </Button>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select 
                    value={roomStatus} 
                    onValueChange={(value) => setRoomStatus(value as RoomStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={RoomStatus.AVAILABLE}>Available</SelectItem>
                      <SelectItem value={RoomStatus.BOOKED}>Booked</SelectItem>
                      <SelectItem value={RoomStatus.OCCUPIED}>Occupied</SelectItem>
                      <SelectItem value={RoomStatus.CLEANING}>Needs Cleaning</SelectItem>
                      <SelectItem value={RoomStatus.MAINTENANCE}>Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about this status change..."
                    value={roomNotes}
                    onChange={(e) => setRoomNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={handleUpdateStatus} 
                  disabled={!roomStatus || roomStatus === selectedRoom?.status || updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}