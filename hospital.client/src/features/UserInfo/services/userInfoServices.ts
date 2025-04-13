import axios, { AxiosError } from "axios";
import { PaginationParms, PaginationResponse } from "@/types/Pagination";
import { UserInfo } from "../schemas/UserInfo";
import { UserInfoFormData } from "../schemas/ValidationSchema";

const userInfoService = {
    getUsers: async (params: PaginationParms): Promise<PaginationResponse<UserInfo>> => {
        try {
            const response = await axios
                .get(`/api/UserInfo?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error;
              }
            throw error;
        }
    },

    getUserById: async (id : number) : Promise<UserInfo> => {
        try {
            const response = await axios
                .get(`/api/UserInfo/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error;
              }
            throw error;
        }
    },

    create: async (userInfo : UserInfoFormData): Promise<UserInfo> => {
        try {
            const response = await axios
            .post('/api/UserInfo', {
                ...userInfo,
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error;
              }
            throw error;
        }
    },

    update: async (id : number, userInfo : UserInfoFormData): Promise<void> => {
        try {
            await axios
            .put(`/api/UserInfo/${id}`, {
                ...userInfo,
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error;
              }
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await axios
            .delete(`/api/UserInfo/${id}`)
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error;
              }
            throw error;
        }
    } 
}

export default userInfoService;