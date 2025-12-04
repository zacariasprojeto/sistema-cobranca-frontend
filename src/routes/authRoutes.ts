import { Router } from "express";
import { supabase } from "../config/supabase";
import { auth } from "../middlewares/auth";
import { permitir } from "../middlewares/permissoes";

const router = Router();

// LOGIN (já existe)

// REGISTER (já existe)

// LISTAR TODOS OS USUÁRIOS
router.get("/users", auth, permitir("admin"), async (req, res) => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) return res.status(400).json(error);

  res.json(data.users);
});

// EDITAR USUÁRIO
router.put("/users/:id", auth, permitir("admin"), async (req, res) => {
  const { nome, telefone, role, permissoes } = req.body;
  const id = req.params.id;

  const { data, error } = await supabase.auth.admin.updateUserById(id, {
    user_metadata: { nome, telefone, role, permissoes },
  });

  if (error) return res.status(400).json(error);

  res.json(data.user);
});

// EXCLUIR USUÁRIO
router.delete("/users/:id", auth, permitir("admin"), async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase.auth.admin.deleteUser(id);

  if (error) return res.status(400).json(error);

  res.json({ message: "Usuário removido com sucesso" });
});

export default router;
