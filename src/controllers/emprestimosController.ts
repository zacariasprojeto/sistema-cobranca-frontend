import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export async function listar(req: any, res: Response) {
  const { data, error } = await supabase
    .from("emprestimos")
    .select("*, clientes(*)");

  if (error) return res.status(400).json(error);

  res.json(data);
}

export async function criar(req: any, res: Response) {
  const body = req.body;

  const { data, error } = await supabase
    .from("emprestimos")
    .insert([body])
    .select();

  if (error) return res.status(400).json(error);

  res.json(data[0]);
}
