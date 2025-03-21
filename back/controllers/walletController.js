import prisma from "../config/prismaCl.js";

// 🔹 Buscar todas as carteiras associadas a um usuário
export const getAllWallets = async (req, res) => {
    const userId = req.headers.userid;

    if (!userId) {
        return res.status(400).json({ message: "Usuário não autenticado" });
    }

    try {
        const wallets = await prisma.wallet.findMany({
            where: {
                usersWallet: {
                    some: { userId: Number(userId) }
                }
            },
            include: {
                usersWallet: { include: { user: true } }
            }
        });

        return res.status(200).json(wallets);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar carteiras" });
    }
};

// 🔹 Criar uma carteira associada ao usuário do header
export const createWallet = async (req, res) => {
    const userId = req.headers.userid;
    const { name, balance } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "Usuário não autenticado" });
    }

    try {
        // Criar a carteira e associar ao usuário autenticado
        const wallet = await prisma.wallet.create({
            data: {
                name,
                balance,
                usersWallet: {
                    create: {
                        user: { connect: { id: Number(userId) } }
                    }
                }
            },
            include: { usersWallet: { include: { user: true } } }
        });

        return res.status(201).json(wallet);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar carteira" });
    }
};

// 🔹 Editar uma carteira, verificando se o usuário autenticado tem permissão
export const editWallet = async (req, res) => {
    const userId = req.headers.userid;
    const { id } = req.params;
    const { name, balance } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "Usuário não autenticado" });
    }

    try {
        // Verifica se a carteira pertence ao usuário autenticado
        const wallet = await prisma.wallet.findFirst({
            where: {
                id: Number(id),
                usersWallet: { some: { userId: Number(userId) } }
            }
        });

        if (!wallet) {
            return res.status(403).json({ message: "Acesso negado ou carteira não encontrada" });
        }

        const updatedWallet = await prisma.wallet.update({
            where: { id: Number(id) },
            data: { 
                name: name || wallet.name,
                balance: balance !== undefined ? balance : wallet.balance
            },
            include: { usersWallet: { include: { user: true } } }
        });

        return res.status(200).json(updatedWallet);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao editar carteira" });
    }
};

// 🔹 Deletar carteira, verificando se o usuário autenticado tem permissão
export const deleteWallet = async (req, res) => {
    const userId = req.headers.userid;
    const { id } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "Usuário não autenticado" });
    }

    try {
        // Verifica se a carteira pertence ao usuário autenticado
        const wallet = await prisma.wallet.findFirst({
            where: {
                id: Number(id),
                usersWallet: { some: { userId: Number(userId) } }
            },
            include: { usersWallet: true }
        });

        if (!wallet) {
            return res.status(403).json({ message: "Acesso negado ou carteira não encontrada" });
        }

        // Impedir a exclusão se houver múltiplos usuários vinculados
        if (wallet.usersWallet.length > 1) {
            return res.status(400).json({ message: "Carteira compartilhada não pode ser deletada diretamente" });
        }

        await prisma.wallet.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({ message: "Carteira deletada com sucesso" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao deletar carteira" });
    }
};
