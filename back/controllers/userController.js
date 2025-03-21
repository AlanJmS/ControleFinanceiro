import prisma from "../config/prismaCl.js";

export const newUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user) {
            return res.status(400).json({ message: "Usuário já existe" });
        };
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
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
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(400).json({ message: "Usuário não existe" });
        };
        if (user.password !== password) {
            return res.status(400).json({ message: "Senha incorreta" });
        };
        return res.status(200).json({ message: "Login realizado com sucesso" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao fazer login" });
    }
};