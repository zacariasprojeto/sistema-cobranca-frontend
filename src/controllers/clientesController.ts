import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export async function listarClientes(req: any, res: Response) {
  const { data, error } = await supabase.from("clientes").select("*");

  if (error) return res.status(400).json(error);

  res.json(data);
}

export async function criarCliente(req: any, res: Response) {
  const body = req.body;

  const { data, error } = await supabase
    .from("clientes")
    .insert([{ ...body, criado_por: req.user.id }])
    .select();

  if (error) return res.status(400).json(error);

  res.json(data[0]);
}
