import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { User } from "../../shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash, Pencil, Plus, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { useToast } from "../../hooks/use-toast";

var userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .optional(),
  isAdmin: z.boolean().default(false),
});

export default function CustomerManagement() {
  var [page, setPage] = useState(1);
  var [searchQuery, setSearchQuery] = useState("");
  var [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  var [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  var [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  var [selectedUser, setSelectedUser] = useState(null);
  var itemsPerPage = 10;
  var { toast } = useToast();
  var queryClient = useQueryClient();

  var { data: users, isLoading } = useQuery({
    queryKey: ["/api/users"],
  });

  var addForm = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      isAdmin: false,
    },
  });

  var editForm = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    },
  });

  useEffect(
    function () {
      if (selectedUser && isEditDialogOpen) {
        editForm.reset({
          name: selectedUser.name,
          email: selectedUser.email,
          phone: selectedUser.phone || "",
          isAdmin: selectedUser.isAdmin || false,
        });
      }
    },
    [selectedUser, isEditDialogOpen, editForm]
  );

  var addUserMutation = useMutation({
    mutationFn: function (values) {
      return apiRequest("POST", "/api/users", values);
    },
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsAddDialogOpen(false);
      addForm.reset();
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
    },
    onError: function (error) {
      toast({
        title: "Error",
        description: "Failed to add customer: " + error.message,
        variant: "destructive",
      });
    },
  });

  var updateUserMutation = useMutation({
    mutationFn: function (values) {
      var id = values.id;
      var userData = Object.assign({}, values);
      delete userData.id;
      return apiRequest("PATCH", "/api/users/" + id, userData);
    },
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
    },
    onError: function (error) {
      toast({
        title: "Error",
        description: "Failed to update customer: " + error.message,
        variant: "destructive",
      });
    },
  });

  var deleteUserMutation = useMutation({
    mutationFn: function (id) {
      return apiRequest("DELETE", "/api/users/" + id);
    },
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    },
    onError: function (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer: " + error.message,
        variant: "destructive",
      });
    },
  });

  function onAddSubmit(values) {
    addUserMutation.mutate(values);
  }

  function onEditSubmit(values) {
    if (selectedUser) {
      updateUserMutation.mutate(
        Object.assign({}, values, { id: selectedUser.id })
      );
    }
  }

  function onDeleteConfirm() {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  }

  var filteredUsers = users
    ? users.filter(function (user) {
        return (
          user.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
          user.email.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
          (user.phone && user.phone.indexOf(searchQuery) !== -1)
        );
      })
    : [];

  var totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  var paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  function handleSearch(e) {
    setSearchQuery(e.target.value);
    setPage(1);
  }

  var paginationItems = [];
  for (var i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={page === i}
            onClick={function (e) {
              e.preventDefault();
              setPage(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    } else if (
      (i === page - 2 && page > 3) ||
      (i === page + 2 && page < totalPages - 2)
    ) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Button
          onClick={function () {
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map(function (user) {
                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>{user.isAdmin ? "Admin" : "Customer"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={function () {
                            setSelectedUser(user);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={function () {
                            setSelectedUser(user);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={function (e) {
                  e.preventDefault();
                  setPage(function (p) {
                    return Math.max(1, p - 1);
                  });
                }}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {paginationItems}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={function (e) {
                  e.preventDefault();
                  setPage(function (p) {
                    return Math.min(totalPages, p + 1);
                  });
                }}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the details for the new customer account.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(onAddSubmit)}
              className="space-y-4"
            >
              <FormField
                control={addForm.control}
                name="name"
                render={function (fieldProps) {
                  return (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...fieldProps.field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={addForm.control}
                name="email"
                render={function (fieldProps) {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          {...fieldProps.field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={addForm.control}
                name="phone"
                render={function (fieldProps) {
                  return (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          {...fieldProps.field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={addForm.control}
                name="password"
                render={function (fieldProps) {
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          type="password"
                          {...fieldProps.field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={addForm.control}
                name="isAdmin"
                render={function (fieldProps) {
                  return (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={fieldProps.field.value}
                          onCheckedChange={fieldProps.field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Admin Access</FormLabel>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <DialogFooter>
                <Button type="submit" disabled={addUserMutation.isPending}>
                  {addUserMutation.isPending ? "Adding..." : "Add Customer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update the customer details.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={function (fieldProps) {
                  return (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...fieldProps.field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={function (fieldProps) {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...fieldProps.field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={editForm.control}
                name="phone"
                render={function (fieldProps) {
                  return (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input {...fieldProps.field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={editForm.control}
                name="isAdmin"
                render={function (fieldProps) {
                  return (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={fieldProps.field.value}
                          onCheckedChange={fieldProps.field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Admin Access</FormLabel>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending
                    ? "Updating..."
                    : "Update Customer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={function () {
                setIsDeleteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
