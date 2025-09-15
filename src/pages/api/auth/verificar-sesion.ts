// src/pages/api/verificar-sesion.ts
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";

export async function GET({cookies}: any)  {
  const sessionCookie = cookies.get("__session")?.value;

  if (!sessionCookie) {
    return new Response(JSON.stringify({ autenticado: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const auth = getAuth(app);
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    return new Response(JSON.stringify({ autenticado: true, uid: decoded.uid }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ autenticado: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}