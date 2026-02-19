import axios from 'axios';
import { Product, Category, Sale } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
    async getProducts(): Promise<Product[]> {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    },

    async createProduct(product: any): Promise<Product> {
        const response = await axios.post(`${API_URL}/products`, product);
        return response.data;
    },

    async updateProduct(id: string, product: any): Promise<Product> {
        const response = await axios.patch(`${API_URL}/products/${id}`, product);
        return response.data;
    },

    async deleteProduct(id: string): Promise<void> {
        await axios.delete(`${API_URL}/products/${id}`);
    },

    async uploadImage(file: File): Promise<{ secure_url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_URL}/products/upload`, formData);
        return response.data;
    },

    async login(credentials: any): Promise<any> {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    },

    async getCategories(): Promise<Category[]> {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    },

    async createCategory(category: Partial<Category>): Promise<Category> {
        const response = await axios.post(`${API_URL}/categories`, category);
        return response.data;
    },

    async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
        const response = await axios.patch(`${API_URL}/categories/${id}`, category);
        return response.data;
    },



    async deleteCategory(id: string): Promise<void> {
        await axios.delete(`${API_URL}/categories/${id}`);
    },

    // Sales methods
    async getSales(): Promise<Sale[]> {
        const response = await axios.get(`${API_URL}/sales`);
        return response.data;
    },

    async createSale(data: any): Promise<Sale> {
        const response = await axios.post(`${API_URL}/sales`, data);
        return response.data;
    },

    async updateSale(id: string, data: any): Promise<Sale> {
        const response = await axios.patch(`${API_URL}/sales/${id}`, data);
        return response.data;
    },

    async deleteSale(id: string): Promise<void> {
        await axios.delete(`${API_URL}/sales/${id}`);
    },

    async sendContactEmail(data: { productId: string; productName: string; userName: string; userEmail: string; message: string; phone?: string }) {
        const response = await axios.post(`${API_URL}/mail/contact`, data);
        return response.data;
    },

    async getLeads(): Promise<any[]> {
        const response = await axios.get(`${API_URL}/leads`);
        return response.data;
    },

    async createLead(lead: any): Promise<any> {
        const response = await axios.post(`${API_URL}/leads`, lead);
        return response.data;
    },

    async deleteLead(id: string): Promise<void> {
        await axios.delete(`${API_URL}/leads/${id}`);
    }
};
