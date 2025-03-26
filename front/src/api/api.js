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
