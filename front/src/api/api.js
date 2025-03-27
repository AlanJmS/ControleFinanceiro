import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
});

const authHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        }
    }
}

// User
export const registerUser = async (userData) => {
    const response = await api.post("/user/registro", userData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await api.post("/user/login", loginData);
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response;
};

export const getUserInfo = async () => {
    const response = await api.get("/user/info", authHeader());
    return response;
};

export const updateUser = async (userData) => {
    const response = await api.put("/user/atualizar", userData, authHeader());
    return response;
};

// Wallet
export const createWallet = async (walletData) => {
    const response = await api.post("/wallets", walletData, authHeader());
    return response;
};

export const getWallets = async () => {
    const response = await api.get("/wallets", authHeader());
    return response;
};

export const getWallet = async (walletId) => {
    const response = await api.get(`/wallets/${walletId}`, authHeader());
    return response;
}

export const addToWallet = async (walletId, userId) => {
    const response = await api.post(`/wallets/${walletId}/addUser`, { userId }, authHeader());
    return response;
};

export const editWallet = async (walletId, walletData) => {
    const response = await api.put(`/wallets/${walletId}`, walletData, authHeader());
    return response;
};

export const deleteWallet = async (walletId) => {
    const response = await api.delete(`/wallets/${walletId}`, authHeader());
    return response;
};

// Cost
export const getAllCosts = async (walletId) =>{
    const response = await api.get(`/costs/${walletId}`,authHeader());
    return response;
}

export const createCost = async (costData) =>{
    const response = await api.post(`/costs/`,costData,authHeader());
    return response;
}

export const editCost = async (costId,costData) => {
    const response = await api.put(`/costs/${costId}`,costData,authHeader());
    return response;
}

export const deleteCost = async (costId) =>{
    const response = await api.delete(`/costs/${costId}`,authHeader());
    return response;
}