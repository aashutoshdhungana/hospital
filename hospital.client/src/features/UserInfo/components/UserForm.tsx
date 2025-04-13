import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from  "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Gender } from '../schemas/UserInfo';
import { cn } from "@/lib/utils";
import { UserInfoValidationSchema, UserInfoFormData } from "../schemas/ValidationSchema";
import userInfoService from "../services/userInfoServices";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "sonner";
import Loading from "@/components/Loading/Loading";

interface UserFormProps {
    id?: number;
}

const UserForm : React.FC<UserFormProps> = ({ id }) => {
    const [isLoading, setIsloading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    let navigate = useNavigate();

    const isEditMode = !!id;

    const form = useForm<UserInfoFormData>({
        resolver: zodResolver(UserInfoValidationSchema),
        defaultValues: {
            email: undefined,
            firstName: '',
            middleName: undefined,
            lastName: '',
            phoneNumber: '',
            gender: Gender.Male,
            street: undefined,
            city: undefined,
            state: undefined,
            country: undefined
        }
    })

    const loadUserInfo = async (id : number) => {
        setIsloading(true)
        try {
            let data = await userInfoService.getUserById(id);
            form.reset({
                ...data,
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : ""
            })
        } catch (error) {
            toast.error("Failed to load user's information")
        } finally {
            setIsloading(false)
        }
    }

    const onSubmit = async (data: UserInfoFormData) => {
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await userInfoService.update(id, data)
                toast.success("User updated successfully")
            }
            else {
                let createdUser = await userInfoService.create(data)
                toast.success("User added successfully")
                navigate(`/user/edit/${createdUser.id}`)
            }
        } catch(error : any | AxiosError) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    const { errors, fieldErrors } = error.response.data;
                    if (Array.isArray(errors) && errors.length > 0) {
                        toast.error(errors[0]);
                    }
                    else {
                        toast.error("Failed to save the user's information")
                    }

                    if (fieldErrors && typeof fieldErrors === "object") {
                        Object.entries(fieldErrors).forEach(([fieldName, messages]) => {
                            if (Array.isArray(messages)) {
                                form.setError(fieldName as keyof UserInfoFormData, {
                                    type: "server",
                                    message: messages[0], // Show the first error message
                                });
                            }
                        });
                    }
                    return;
                }

                toast.error("Failed to save the user's information")
                return;
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (isEditMode) {
            loadUserInfo(id)
        }
    }, [id])

    if (isLoading)
        return <Loading />
        
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Middle Name */}
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Middle name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input disabled={isEditMode} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Gender.Male.toString()}>Male</SelectItem>
                      <SelectItem value={Gender.Female.toString()}>Female</SelectItem>
                      <SelectItem value={Gender.Other.toString()}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-gray-400"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                                field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                            }}
                            initialFocus
                            fromDate={new Date("1900-01-01")}
                            toDate={new Date()}
                            className="rounded-md border shadow p-2"
                        />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Address Fields */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Address Information</h2>
            
            {/* Street */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save" }
          </Button>
        </form>
      </Form>
    )
}

export default UserForm;