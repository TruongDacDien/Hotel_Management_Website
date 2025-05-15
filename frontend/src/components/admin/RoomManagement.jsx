import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Room, RoomStatus } from "../../shared/schema";
import { apiRequest } from "../../lib/queryClient";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Building, Building2, ClipboardList } from "lucide-react";

export default function RoomManagement() {
  var [selectedFloor, setSelectedFloor] = useState(null);
  var [selectedRoom, setSelectedRoom] = useState(null);
  var [roomStatus, setRoomStatus] = useState("");
  var [roomNotes, setRoomNotes] = useState("");
  var [viewingHistory, setViewingHistory] = useState(false);

  var { toast } = useToast();
  var queryClient = useQueryClient();

  var { data: allRooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["/api/rooms"],
    select: function (data) {
      return data.sort(function (a, b) {
        return a.floor - b.floor || a.roomNumber.localeCompare(b.roomNumber);
      });
    },
  });

  var { data: roomHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: [
      "/api/rooms/status-history",
      selectedRoom ? selectedRoom.id : null,
    ],
    enabled: viewingHistory && selectedRoom && selectedRoom.id,
  });

  var updateStatusMutation = useMutation({
    mutationFn: function (params) {
      return apiRequest("PATCH", "/api/rooms/" + params.roomId + "/status", {
        status: params.status,
        notes: params.notes,
      });
    },
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      toast({
        title: "Room status updated",
        description: "The room status has been successfully updated.",
      });
      setSelectedRoom(null);
    },
    onError: function (error) {
      toast({
        title: "Failed to update room status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  var uniqueFloors = Array.from(
    new Set(
      allRooms.map(function (room) {
        return room.floor;
      })
    )
  ).sort(function (a, b) {
    return a - b;
  });

  useEffect(
    function () {
      if (uniqueFloors.length > 0 && selectedFloor === null) {
        setSelectedFloor(uniqueFloors[0]);
      }
    },
    [uniqueFloors, selectedFloor]
  );

  var floorRooms = allRooms.filter(function (room) {
    return selectedFloor !== null && room.floor === selectedFloor;
  });

  function getStatusColor(status) {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return "bg-gray-200";
      case RoomStatus.BOOKED:
        return "bg-blue-200";
      case RoomStatus.OCCUPIED:
        return "bg-green-200";
      case RoomStatus.CLEANING:
        return "bg-yellow-200";
      case RoomStatus.MAINTENANCE:
        return "bg-red-200";
      default:
        return "bg-gray-100";
    }
  }

  function getStatusDisplayName(status) {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return "Available";
      case RoomStatus.BOOKED:
        return "Booked";
      case RoomStatus.OCCUPIED:
        return "Occupied";
      case RoomStatus.CLEANING:
        return "Needs Cleaning";
      case RoomStatus.MAINTENANCE:
        return "Maintenance";
      default:
        return "Unknown";
    }
  }

  function handleUpdateStatus() {
    if (selectedRoom && roomStatus) {
      updateStatusMutation.mutate({
        roomId: selectedRoom.id,
        status: roomStatus,
        notes: roomNotes || undefined,
      });
    }
  }

  function handleRoomClick(room) {
    setSelectedRoom(room);
    setRoomStatus(room.status);
    setRoomNotes("");
    setViewingHistory(false);
  }

  function formatDateTime(dateTimeString) {
    var date = new Date(dateTimeString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }

  if (roomsLoading) {
    return <div className="flex justify-center p-8">Loading room data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <div className="w-1/4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Floors
                </h3>
              </div>
              <div className="space-y-2">
                {uniqueFloors.map(function (floor) {
                  return (
                    <Button
                      key={floor}
                      variant={selectedFloor === floor ? "default" : "outline"}
                      onClick={function () {
                        setSelectedFloor(floor);
                      }}
                      className="w-full justify-start"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Floor {floor}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-3/4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Rooms on Floor {selectedFloor}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {floorRooms.length > 0 ? (
                  floorRooms.map(function (room) {
                    return (
                      <div
                        key={room.id}
                        className={
                          getStatusColor(room.status) +
                          " p-3 rounded-md cursor-pointer hover:shadow-md transition-shadow"
                        }
                        onClick={function () {
                          handleRoomClick(room);
                        }}
                      >
                        <div className="font-semibold">{room.roomNumber}</div>
                        <div className="text-xs">
                          {getStatusDisplayName(room.status)}
                        </div>
                        <div className="text-xs truncate">{room.name}</div>
                      </div>
                    );
                  })
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

      <Dialog
        open={!!selectedRoom}
        onOpenChange={function (open) {
          if (!open) {
            setSelectedRoom(null);
          }
        }}
      >
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {!viewingHistory
                ? "Update Room " + selectedRoom?.roomNumber + " Status"
                : "Status History - Room " + selectedRoom?.roomNumber}
            </DialogTitle>
          </DialogHeader>

          {viewingHistory ? (
            <div className="space-y-4">
              {historyLoading ? (
                <div className="text-center py-4">Loading history...</div>
              ) : (
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  {roomHistory.length > 0 ? (
                    roomHistory.map(function (record) {
                      return (
                        <div
                          key={record.id}
                          className="mb-4 pb-4 border-b last:border-0"
                        >
                          <div className="flex justify-between">
                            <span
                              className={
                                "font-medium px-2 py-1 rounded text-xs " +
                                getStatusColor(record.status)
                              }
                            >
                              {getStatusDisplayName(record.status)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(record.timestamp)}
                            </span>
                          </div>
                          {record.notes && (
                            <div className="mt-2 text-sm">
                              <span className="font-semibold">Notes:</span>{" "}
                              {record.notes}
                            </div>
                          )}
                          <div className="mt-1 text-xs">
                            <span className="text-muted-foreground">
                              Updated by:{" "}
                            </span>
                            {record.updatedByName || "System"}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      No history records found.
                    </div>
                  )}
                </ScrollArea>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={function () {
                    setViewingHistory(false);
                  }}
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
                      Current status:{" "}
                      {selectedRoom?.status &&
                        getStatusDisplayName(selectedRoom.status)}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={function () {
                      setViewingHistory(true);
                    }}
                  >
                    View History
                  </Button>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select
                    value={roomStatus}
                    onValueChange={function (value) {
                      setRoomStatus(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={RoomStatus.AVAILABLE}>
                        Available
                      </SelectItem>
                      <SelectItem value={RoomStatus.BOOKED}>Booked</SelectItem>
                      <SelectItem value={RoomStatus.OCCUPIED}>
                        Occupied
                      </SelectItem>
                      <SelectItem value={RoomStatus.CLEANING}>
                        Needs Cleaning
                      </SelectItem>
                      <SelectItem value={RoomStatus.MAINTENANCE}>
                        Maintenance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about this status change..."
                    value={roomNotes}
                    onChange={function (e) {
                      setRoomNotes(e.target.value);
                    }}
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={
                    !roomStatus ||
                    roomStatus === selectedRoom?.status ||
                    updateStatusMutation.isPending
                  }
                >
                  {updateStatusMutation.isPending
                    ? "Updating..."
                    : "Update Status"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
