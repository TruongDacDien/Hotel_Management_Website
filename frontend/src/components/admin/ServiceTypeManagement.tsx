import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "Service type name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceType {
  id: number;
  name: string;
  description: string;
}

export default function ServiceTypeManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentServiceType, setCurrentServiceType] = useState<ServiceType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of items per page

  // Set up form for adding a new service type
  const addForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Set up form for editing a service type
  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Fetch all service types
  const { data: serviceTypes = [], isLoading } = useQuery({
    queryKey: ["/api/service-types"],
    queryFn: async () => {
      const response = await apiRequest("/api/service-types");
      return response as ServiceType[];
    },
  });

  // Add service type mutation
  const addMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return await apiRequest<ServiceType>("/api/service-types", {
        method: "POST",
        body: JSON.stringify(values),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-types"] });
      setIsAddDialogOpen(false);
      addForm.reset();
      toast({
        title: "Success",
        description: "Service type added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add service type: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Edit service type mutation
  const editMutation = useMutation({
    mutationFn: async (values: FormValues & { id: number }) => {
      const { id, ...data } = values;
      return await apiRequest<ServiceType>(`/api/service-types/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-types"] });
      setIsEditDialogOpen(false);
      setCurrentServiceType(null);
      editForm.reset();
      toast({
        title: "Success",
        description: "Service type updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update service type: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete service type mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/service-types/${id}`, {
        method: "DELETE",
        body: JSON.stringify({}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-types"] });
      toast({
        title: "Success",
        description: "Service type deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete service type: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onAddSubmit = (values: FormValues) => {
    addMutation.mutate(values);
  };

  const onEditSubmit = (values: FormValues) => {
    if (currentServiceType) {
      editMutation.mutate({ ...values, id: currentServiceType.id });
    }
  };

  const handleEdit = (serviceType: ServiceType) => {
    setCurrentServiceType(serviceType);
    editForm.reset({
      name: serviceType.name,
      description: serviceType.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Handle pagination
  const totalPages = Math.ceil(serviceTypes.length / pageSize);
  const paginatedServiceTypes = serviceTypes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Service Types</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Service Type</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service Type</DialogTitle>
                <DialogDescription>
                  Create a new service type to categorize your services.
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Wellness, Dining, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe this service type..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={addMutation.isPending}>
                      {addMutation.isPending ? "Adding..." : "Add Service Type"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading service types...</div>
        ) : paginatedServiceTypes.length === 0 ? (
          <div className="text-center py-4">No service types found.</div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedServiceTypes.map((serviceType) => (
                    <TableRow key={serviceType.id}>
                      <TableCell>{serviceType.id}</TableCell>
                      <TableCell>{serviceType.name}</TableCell>
                      <TableCell className="max-w-[400px] truncate">
                        {serviceType.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(serviceType)}
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Service Type
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this service type? 
                                  This action cannot be undone. Services assigned to 
                                  this type will need to be reassigned.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(serviceType.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {renderPagination()}
          </>
        )}

        {/* Edit Service Type Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service Type</DialogTitle>
              <DialogDescription>
                Update the details of this service type.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={editMutation.isPending}>
                    {editMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}