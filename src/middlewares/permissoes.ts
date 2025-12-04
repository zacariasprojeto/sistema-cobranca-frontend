export function permitir(permissao: string) {
  return async (req: any, res: any, next: any) => {
    const user = req.user;

    if (user.user_metadata.role === "admin") return next();

    if (!user.user_metadata.permissoes[permissao])
      return res.status(403).json({ error: "Acesso negado." });

    next();
  };
}
