import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Textarea } from "../components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const BookingForm = ({ rooms = [], isRoomBooking = false }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (values) => {
      const res = await apiRequest("POST", "/api/bookings", values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking successful!",
        description: "Your booking has been confirmed.",
      });
      form.reset();
      setCheckInDate(null);
      setCheckOutDate(null);
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values) => {
    const formData = {
      ...values,
      checkIn: checkInDate ? format(checkInDate, "yyyy-MM-dd") : "",
      checkOut: checkOutDate ? format(checkOutDate, "yyyy-MM-dd") : "",
    };
    createBookingMutation.mutate(formData);
  };

  // return (
  //   <Form {...form}>
  //     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
  //       <FormField
  //         control={form.control}
  //         name="name"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Full Name</FormLabel>
  //             <FormControl>
  //               <Input placeholder="John Doe" {...field} />
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />

  //       <FormField
  //         control={form.control}
  //         name="email"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Email</FormLabel>
  //             <FormControl>
  //               <Input
  //                 placeholder="email@example.com"
  //                 type="email"
  //                 {...field}
  //               />
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />

  //       <FormField
  //         control={form.control}
  //         name="phone"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Phone Number</FormLabel>
  //             <FormControl>
  //               <Input placeholder="+1 (555) 123-4567" {...field} />
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />

  //       {isRoomBooking && (
  //         <FormField
  //           control={form.control}
  //           name="checkIn"
  //           render={({ field }) => (
  //             <FormItem className="flex flex-col">
  //               <FormLabel>Check-in Date</FormLabel>
  //               <Popover>
  //                 <PopoverTrigger asChild>
  //                   <FormControl>
  //                     <Button variant="outline" className="w-full text-left">
  //                       {checkInDate
  //                         ? format(checkInDate, "PPP")
  //                         : "Select date"}
  //                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
  //                     </Button>
  //                   </FormControl>
  //                 </PopoverTrigger>
  //                 <PopoverContent className="w-auto p-0">
  //                   <Calendar
  //                     mode="single"
  //                     selected={checkInDate}
  //                     onSelect={setCheckInDate}
  //                   />
  //                 </PopoverContent>
  //               </Popover>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //       )}

  //       <FormField
  //         control={form.control}
  //         name="notes"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Special Requests</FormLabel>
  //             <FormControl>
  //               <Textarea
  //                 placeholder="Any special requests..."
  //                 className="resize-none"
  //                 {...field}
  //               />
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />

  //       <Button type="submit" className="w-full bg-primary text-white">
  //         {createBookingMutation.isPending ? "Processing..." : "Book Now"}
  //       </Button>
  //     </form>
  //   </Form>
  // );
};

export default BookingForm;
