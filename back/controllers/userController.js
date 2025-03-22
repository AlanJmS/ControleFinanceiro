import prisma from "../config/prismaCl.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
    return token;
};

export const newUser = async (req, res) => {
    const { name, email, password } = req.body;
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
                password
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
        return res.status(200).json({ message: "Login realizado com sucesso", token: token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao fazer login" });
    }
};