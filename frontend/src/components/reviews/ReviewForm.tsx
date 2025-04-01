// import { useState } from 'react';
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useToast } from '@/hooks/use-toast';
// import { useAuth } from '@/hooks/use-auth';
// import { apiRequest } from '@/lib/queryClient';
// import { useMutation, useQueryClient } from '@tanstack/react-query';

// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Stars } from "@/components/reviews/Stars";

// // Define the form schema with zod
// const formSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   content: z.string().min(10, "Review must be at least 10 characters"),
//   rating: z.number().min(1).max(5),
//   roomId: z.number().nullable().optional(),
//   serviceId: z.number().nullable().optional(),
// });

// type FormValues = z.infer<typeof formSchema>;

// interface ReviewFormProps {
//   roomId?: number;
//   serviceId?: number;
//   onSuccess?: () => void;
// }

// export default function ReviewForm({ roomId, serviceId, onSuccess }: ReviewFormProps) {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const [selectedRating, setSelectedRating] = useState(5);

//   // Initialize the form
//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       content: "",
//       rating: 5,
//       roomId: roomId || null,
//       serviceId: serviceId || null,
//     },
//   });

//   const mutation = useMutation({
//     mutationFn: async (data: FormValues) => {
//       const response = await apiRequest('POST', '/api/reviews', data);
//       return response.json();
//     },
//     onSuccess: () => {
//       toast({
//         title: "Review submitted!",
//         description: "Thank you for your feedback.",
//       });

//       // Reset the form
//       form.reset({
//         title: "",
//         content: "",
//         rating: 5,
//         roomId: roomId || null,
//         serviceId: serviceId || null,
//       });

//       // Invalidate related queries to refresh data
//       if (roomId) {
//         queryClient.invalidateQueries({ queryKey: ['/api/reviews/room', roomId] });
//       } else if (serviceId) {
//         queryClient.invalidateQueries({ queryKey: ['/api/reviews/service', serviceId] });
//       }

//       // Call onSuccess if provided
//       if (onSuccess) {
//         onSuccess();
//       }
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error submitting review",
//         description: error.message || "Please try again later.",
//         variant: "destructive",
//       });
//     },
//   });

//   function onSubmit(data: FormValues) {
//     // Make sure the rating from the stars component is included
//     const reviewData = { ...data, rating: selectedRating };
//     mutation.mutate(reviewData);
//   }

//   // If the user is not logged in, show a message
//   if (!user) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Write a Review</CardTitle>
//           <CardDescription>Share your experience with others</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-center py-4">
//             Please <a href="/auth" className="text-primary font-medium">sign in</a> to leave a review.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Write a Review</CardTitle>
//         <CardDescription>Share your experience with others</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Summarize your experience" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="rating"
//               render={() => (
//                 <FormItem>
//                   <FormLabel>Rating</FormLabel>
//                   <FormControl>
//                     <Stars
//                       rating={selectedRating}
//                       editable={true}
//                       onRatingChange={setSelectedRating}
//                       size="lg"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="content"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Review</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Tell us about your experience..."
//                       className="min-h-[120px]"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={mutation.isPending}
//             >
//               {mutation.isPending ? "Submitting..." : "Submit Review"}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }
