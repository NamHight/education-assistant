import { create } from 'zustand';
import authApi from "@/lib/authAxios";
import authApiServer from "@/lib/authAxiosServer";
import { API } from "@/types/general";
import { IParamHocBa } from "@/types/params";

export class HocBaService {
    static async getAllHocBa(params: IParamHocBa) {
        return await authApi.get(`${API.HOC_BA.GET_ALL}`, {
            params: params
        }).then((response) => Promise.resolve({
            data: response.data,
            meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        })).catch((error) => {
            console.error('Error fetching Hoc Ba:', error);
            return Promise.reject(error.response?.data);
        });
    }

    static async getAllHocBaServer(params: IParamHocBa) {
        return await authApiServer.get(`${API.HOC_BA.GET_ALL}`, {
            params: params
        }).then((response) => Promise.resolve({
            data: response.data,
            meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        })).catch((error) => {
            console.error('Error fetching Hoc Ba on server:', error);
            return Promise.reject(error.response?.data);
        });
    }

    static async getHocBaById(id: string | number | null) {
        return await authApi.get(`${API.HOC_BA.GET_BY_ID}`.replace(':id', `${id}`))
            .then((response) => Promise.resolve(response.data))
            .catch((error) => {
                console.error('Error fetching Hoc Ba by ID:', error);
                return Promise.reject(error.response?.data);
            });
    }

    static async getHocBaByIdServer(id: string | number | null) {
        return await authApiServer.get(`${API.HOC_BA.GET_BY_ID}`.replace(':id', `${id}`))
            .then((response) => Promise.resolve(response.data))
            .catch((error) => {
                console.error('Error fetching Hoc Ba by ID on server:', error);
                return Promise.reject(error.response?.data);
            });
    }

    static async updateHocBa(id: string | number | null, data: any) {
        try {
            const response = await authApi.put(`${API.HOC_BA.GET_BY_ID.replace(':id', `${id}`)}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating Hoc Ba:', error);
            throw error.response?.data;
        }
    }

    static async deleteHocBa(id: string | number | null) {
        try {
            const response = await authApi.delete(`${API.HOC_BA.GET_BY_ID.replace(':id', `${id}`)}`);
            return response.data;
        } catch (error: any) {
            console.error('Error deleting Hoc Ba:', error);
            throw error.response?.data;
        }
    }

    static async createHocBa(data: any) {
        try {
            const response = await authApi.post(`${API.HOC_BA.GET_ALL}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating Hoc Ba:', error);
            throw error.response?.data;
        }
    }
    static async nopDiemHocBa(data: any) {
        try {
            const response = await authApi.put(`${API.HOC_BA.NOP_DIEM}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error submitting Hoc Ba scores:', error);
            throw error.response?.data;
        }
    }

    static async deleteHocBaList(data: { ids: string[] }) {
        try {
            const response = await authApi.delete(`${API.HOC_BA.DELETE_LIST}`, {
                params: data
            });
            return response.data;
        } catch (error: any) {
            console.error('Error deleting Hoc Ba list:', error);
            throw error.response?.data;
        }
    }

}