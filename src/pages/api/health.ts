import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  try {
    switch (method) {
      case "GET": {
        const { data, error } = await supabase.from("health").select("*");
        if (error) throw error;
        return res.status(200).json({ success: true, data });
      }
      case "POST": {
        const { data, error } = await supabase.from("health").insert(body).select().single();
        if (error) throw error;
        return res.status(201).json({ success: true, data });
      }
      case "PUT": {
        const { id } = query;
        const { data, error } = await supabase.from("health").update(body).eq("id", id).select().single();
        if (error) throw error;
        return res.status(200).json({ success: true, data });
      }
      case "DELETE": {
        const { id } = query;
        const { error } = await supabase.from("health").delete().eq("id", id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }
      default: return res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (error: any) { return res.status(500).json({ success: false, error: error.message }); }
}
