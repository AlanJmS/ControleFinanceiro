import prisma from "../config/prismaCl.js";

// 🔹 Buscar todos os custos de uma carteira específica
export const getAllCosts = async (req, res) => {
  const userId = req.user?.id || req.headers.userid;
  const { walletId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Usuário não autenticado" });
  }

  try {
    // Verifica se o usuário tem acesso à carteira
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: Number(walletId),
        usersWallet: { some: { userId: Number(userId) } },
      },
    });

    if (!wallet) {
      return res
        .status(403)
        .json({ message: "Acesso negado ou carteira não encontrada" });
    }

    const costs = await prisma.cost.findMany({
      where: { walletId: Number(walletId) },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return res.status(200).json(costs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar custos" });
  }
};

// 🔹 Criar um custo, vinculando ao usuário e à carteira
export const createCost = async (req, res) => {
  const userId = req.user.id;
  const { walletId, name, amount, date, category } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Usuário não autenticado" });
  }

  try {
    // Verifica se a carteira pertence ao usuário autenticado
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: Number(walletId),
        usersWallet: { some: { userId: Number(userId) } },
      },
    });

    if (!wallet) {
      return res
        .status(403)
        .json({ message: "Acesso negado ou carteira não encontrada" });
    }

    // Cria o gasto
    const cost = await prisma.cost.create({
      data: {
        name,
        amount: parseFloat(amount),
        date: new Date(date),
        category,
        wallet: { connect: { id: Number(walletId) } },
        user: { connect: { id: Number(userId) } },
      },
      include: { user: true },
    });

    // Atualiza o balance da carteira
    await prisma.wallet.update({
      where: { id: Number(walletId) },
      data: {
        balance: {
          increment: parseFloat(amount), // Incrementa o balance com o valor do gasto
        },
      },
    });

    return res.status(201).json(cost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar custo" });
  }
};

// 🔹 Editar um custo, garantindo que o usuário tenha permissão
export const editCost = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { name, amount, date } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Usuário não autenticado" });
  }

  try {
    // Verificar se o custo pertence ao usuário e à carteira correta
    const cost = await prisma.cost.findFirst({
      where: {
        id: Number(id),
        userId: Number(userId), // Apenas o criador pode editar
        wallet: { usersWallet: { some: { userId: Number(userId) } } },
      },
    });

    if (!cost) {
      return res
        .status(403)
        .json({ message: "Acesso negado ou custo não encontrado" });
    }

    // Calcula a diferença entre o valor antigo e o novo valor
    const difference = amount - cost.amount;

    // Atualiza o custo
    const updatedCost = await prisma.cost.update({
      where: { id: Number(id) },
      data: {
        name: name || cost.name,
        amount: amount !== undefined ? amount : cost.amount,
        date: date ? new Date(date) : cost.date,
      },
      include: { user: true },
    });

    // Atualiza o balance da carteira
    await prisma.wallet.update({
      where: { id: cost.walletId },
      data: {
        balance: {
          increment: difference, // Ajusta o balance com a diferença
        },
      },
    });

    return res.status(200).json(updatedCost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao editar custo" });
  }
};

// 🔹 Deletar um custo (apenas se o usuário for o criador)
export const deleteCost = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Usuário não autenticado" });
  }

  try {
    // Verificar se o custo pertence ao usuário e à carteira correta
    const cost = await prisma.cost.findFirst({
      where: {
        id: Number(id),
        userId: Number(userId), // Apenas o criador pode deletar
        wallet: { usersWallet: { some: { userId: Number(userId) } } },
      },
    });

    if (!cost) {
      return res
        .status(403)
        .json({ message: "Acesso negado ou custo não encontrado" });
    }

    // Deleta o custo
    await prisma.cost.delete({ where: { id: Number(id) } });

    // Atualiza o balance da carteira
    await prisma.wallet.update({
      where: { id: cost.walletId },
      data: {
        balance: {
          decrement: cost.amount, // Decrementa o balance com o valor do gasto
        },
      },
    });

    return res.status(200).json({ message: "Custo deletado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao deletar custo" });
  }
};
