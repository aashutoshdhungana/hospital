import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Trash2,
  Search,
  PlusCircle,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Gender, UserInfo } from "../schemas/UserInfo";
import userInfoService from "../services/userInfoServices";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { PaginationResponse } from "@/types/Pagination";
import Loading from "@/components/Loading/Loading";
import { DeleteUserConfirmation } from "./DeleteUserConfirmation";

const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const getGenderString = (gender: Gender): string => {
  switch (gender) {
    case Gender.Male:
      return "Male";
    case Gender.Female:
      return "Female";
    case Gender.Other:
      return "Other";
    default:
      return "Unknown";
  }
};

export default function UserDataGrid() {
  const [isLoading, setIsloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;
  const [userData, setUserData] = useState<PaginationResponse<UserInfo>>();
  const [isDeletePoupOpen, setIsDeletePopupOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number>();
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsloading(true);
    try {
      let response = await userInfoService.getUsers({
        pageSize,
        pageNumber: currentPage,
      });
      setUserData(response);
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pageSize, currentPage]);

  const filteredUsers =
    userData?.items.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

  const deletingUser =
    userIdToDelete && userData && userData.items.length
      ? userData?.items.find((x) => x.id === userIdToDelete)
      : null;

  const handleDelete = (userId: number) => {
    setUserIdToDelete(userId);
    setIsDeletePopupOpen(true);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Users</h2>
        <Link
          to={`/user/new`}
          className="flex items-center gap-2 text-sm md:text-base"
        >
          <PlusCircle className="h-4 w-4" />
          Add User
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <DeleteUserConfirmation
        setIsOpen={setIsDeletePopupOpen}
        isOpen={isDeletePoupOpen}
        userName={`${deletingUser?.firstName} ${deletingUser?.lastName}`}
        onDelete={async () => {
          setIsDeleting(true);
          try {
            if (userIdToDelete) {
              await userInfoService.delete(userIdToDelete);
              loadData();
            }
            toast.success("Deleted user successfully");
            setIsDeletePopupOpen(false);
            setUserIdToDelete(undefined);
          } catch {
            toast.error("Failed to delete user");
          } finally {
            setIsDeleting(false);
          }
        }}
        isDeleting={isDeleting}
      />

      {/* Responsive table container */}
      <div className="border rounded-md overflow-x-auto">
        {/* Min-width ensures table doesn't shrink too much */}
        <Table className="min-w-[800px] lg:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Gender</TableHead>
              <TableHead className="hidden xl:table-cell">Location</TableHead>
              <TableHead className="hidden xl:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="hidden sm:table-cell">{user.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500 md:hidden">
                      {user.email || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.email || "-"}
                  </TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {getGenderString(user.gender)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {user.city && user.state ? `${user.city}, ${user.state}` : "-"}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label="Actions menu"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={`/user/edit/${user.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {[
            ...Array(
              Math.ceil((userData?.totalCount ?? 0) / (userData?.pageSize ?? 1))
            ),
          ].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(
                      (userData?.totalCount ?? 0) / (userData?.pageSize ?? 1)
                    )
                  )
                )
              }
              className={
                currentPage ===
                Math.ceil(
                  (userData?.totalCount ?? 0) / (userData?.pageSize ?? 1)
                )
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}