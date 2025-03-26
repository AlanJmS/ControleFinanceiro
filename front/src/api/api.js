import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
});

// User
export const registerUser = async (userData) => {
    const response = await api.post("/user/registro", userData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await api.post("/user/login", loginData);
    return response;
};

// Wallet
export const createWallet = async (walletData) => {
    const response = await api.post("/wallet", walletData);
    return response.data;
};

export const getWallets = async () => {
    const response = await api.get("/wallet");
    return response.data;
};

export const addToWallet = async (walletId, userId) => {
    const response = await api.post(`/wallet/${walletId}/addUser`, { userId });
    return response.data;
};

export const editWallet = async (walletId, walletData) => {
    const response = await api.put(`/wallet/${walletId}`, walletData);
    return response.data;
};

export const deleteWallet = async (walletId) => {
    const response = await api.delete(`/wallet/${walletId}`);
    return response.data;
};

// Cost
