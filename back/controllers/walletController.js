import prisma from "../config/prismaCl.js";

// 🔹 Buscar todas as carteiras associadas a um usuário
export const getAllWallets = async (req, res) => {
    const user = req.user;

    try {
        const wallets = await prisma.wallet.findMany({
            where: {
                usersWallet: {
                    some: { userId: user.id }
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

// 🔹 Buscar uma carteira específica
export const getWallet = async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    try {
        const wallet = await prisma.wallet.findFirst({
            where: {
                id: Number(id),
                usersWallet: { some: { userId: user.id } }
            },
            include: {
                usersWallet: { include: { user: true } }
            }
        });
        if (!wallet) {
            return res.status(404).json({ message: "Carteira não encontrada" });
        }
        return res.status(200).json(wallet);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar carteira" });
    }
};

// 🔹 Criar uma carteira associada ao usuário do header e opcionalmente a outros usuários (por email)
export const createWallet = async (req, res) => {
    const user = req.user;
    const { name, balance = 0, userEmails = [] } = req.body;

    try {
        // Remover duplicatas e garantir que são strings
        const uniqueEmails = [...new Set(userEmails.map(email => String(email).trim().toLowerCase()))];

        // Buscar os usuários pelos emails fornecidos
        const users = await prisma.user.findMany({
            where: {
                email: {
                    in: uniqueEmails
                }
            },
            select: {
                id: true,
                email: true
            }
        });

        // Verificar se todos os emails foram encontrados
        const foundEmails = users.map(user => user.email);
        const notFoundEmails = uniqueEmails.filter(email => !foundEmails.includes(email));

        if (notFoundEmails.length > 0) {
            return res.status(400).json({
                message: "Alguns usuários não foram encontrados",
                notFoundEmails
            });
        }

        // Extrair os IDs dos usuários encontrados
        const userIds = users.map(user => user.id);

        // Garantir que o criador da carteira esteja sempre incluído
        if (!userIds.includes(user.id)) {
            userIds.push(user.id);
        }

        // Preparar os dados para criar as relações com os usuários
        const usersWalletData = userIds.map(userId => ({
            user: { connect: { id: userId } }
        }));

        // Criar a carteira e associar aos usuários
        const wallet = await prisma.wallet.create({
            data: {
                name,
                balance: balance || 0,
                usersWallet: {
                    create: usersWalletData
                }
            },
            include: {
                usersWallet: {
                    include: { user: true }
                }
            }
        });

        return res.status(201).json(wallet);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar carteira" });
    }
};

// 🔹 Editar uma carteira, verificando se o usuário autenticado tem permissão
export const editWallet = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const { name, balance } = req.body;

    try {
        // Verifica se a carteira pertence ao usuário autenticado
        const wallet = await prisma.wallet.findFirst({
            where: {
                id: Number(id),
                usersWallet: { some: { userId: user.id } }
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

// Adicionar um usuário à carteira usando email
export const addUserToWallet = async (req, res) => {
    const user = req.user;
    const walletId = req.params.walletId;
    const { userEmail } = req.body;

    if (!userEmail) {
        return res.status(400).json({ message: "Email do usuário é obrigatório" });
    }

    try {
        // Verifica se a carteira pertence ao usuário autenticado
        const wallet = await prisma.wallet.findFirst({
            where: {
                id: Number(walletId),
                usersWallet: { some: { userId: user.id } }
            },
            include: { usersWallet: true }
        });

        if (!wallet) {
            return res.status(403).json({ message: "Acesso negado ou carteira não encontrada" });
        }

        const formatedEmail = userEmail.trim().toLowerCase();

        // Buscar o usuário pelo email
        const userToAdd = await prisma.user.findUnique({
            where: { email: formatedEmail }
        });
        console.log(userToAdd);
        if (!userToAdd) {
            return res.status(404).json({ message: "Usuário não encontrado com este email" });
        }

        // Verifica se o usuário a ser adicionado já está na carteira
        const userAlreadyInWallet = wallet.usersWallet.some(uw => uw.userId === userToAdd.id);

        if (userAlreadyInWallet) {
            return res.status(400).json({ message: "Usuário já está na carteira" });
        }

        // Adiciona o usuário à carteira
        const addedUser = await prisma.userWallet.create({
            data: {
                user: { connect: { id: userToAdd.id } },
                wallet: { connect: { id: Number(walletId) } }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Usuário adicionado com sucesso",
            user: addedUser.user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao adicionar usuário à carteira" });
    }
};

// 🔹 Deletar carteira, verificando se o usuário autenticado tem permissão
export const deleteWallet = async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    try {
        // Verifica se a carteira pertence ao usuário autenticado
        const wallet = await prisma.wallet.findFirst({
            where: {
                id: Number(id),
                usersWallet: { some: { userId: user.id } }
            },
            include: { usersWallet: true }
        });

        if (!wallet) return res.status(403).json({ message: "Acesso negado ou carteira não encontrada" });

        // Só permitir a exclusão se for o criador da carteira
        if (wallet.usersWallet[0].userId !== user.id) return res.status(403).json({ message: "Somente o criador da carteira pode apagar." });

        await prisma.wallet.delete({
            where: { id: Number(id) }
        });

        console.log("Carteira deletada com sucesso");
        res.status(200).json({ message: "Carteira deletada com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar carteira:", error);
        res.status(500).json({ message: "Erro ao deletar carteira" });
    }
};
