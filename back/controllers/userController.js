import prisma from "../config/prismaCl.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
    return token;
};

export const newUser = async (req, res) => {
    const { name, email, password, salary = 0 } = req.body;
    const formatedEmail = email.trim().toLowerCase();
    if (!name || !email || !password) return res.status(400).json({ message: "Campos obrigatórios não preenchidos" });

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: formatedEmail
            }
        });
        if (user) {
            return res.status(400).json({ message: "Usuário já existe" });
        };
        const newUser = await prisma.user.create({
            data: {
                name,
                email: formatedEmail,
                password,
                salary: Number(salary)
            }
        });
        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao criar usuário" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Campos obrigatórios não preenchidos" });
    const formatedEmail = email.trim().toLowerCase();
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: formatedEmail
            }
        });
        if (!user) {
            return res.status(400).json({ message: "Usuário não existe" });
        };
        if (user.password !== password) {
            return res.status(400).json({ message: "Senha incorreta" });
        };
        const token = generateToken(user);
        return res.status(200).json({ message: "Login realizado com sucesso", token: token, userId: user.id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao fazer login" });
    }
};

export const userInfo = async (req, res) => {
    const userId = req.user;
    console.log(userId);
    if (!userId) return res.status(400).json({ message: "Usuário não encontrado" });
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId.id)
            }
        });
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao buscar usuário" });
    }
};

export const updateUser = async (req, res) => {
    const userId = req.user;
    const {name, email, salary} = req.body;
    if (!userId) return res.status(400).json({ message: "Usuário não encontrado" });
    try {
        const user = await prisma.user.update({
            where: {
                id: Number(userId.id)
            },
            data: {
                name: name ? name : userId.name,
                email: email ? email : userId.email,
                salary: Number(salary) ? Number(salary) : userId.salary
            }
        });
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
};