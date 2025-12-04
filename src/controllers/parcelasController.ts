import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export async function listarParcelas(req: Request, res: Response) {
  const { data, error } = await supabase.from("parcelas").select("*");

  if (error) return res.status(400).json(error);
  res.json(data);
}

export async function atualizarParcela(req: Request, res: Response) {
  const id = req.params.id;
  const body = req.body;

  const { data, error } = await supabase
    .from("parcelas")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json(error);
  res.json(data);
}
