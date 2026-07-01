import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

let authMiddleware;

beforeAll(async () => {
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "secreto_para_entorno_de_pruebas";
  }

  ({ authMiddleware } = await import("../../src/middleware/auth.js"));
});

describe("authMiddleware", () => {
  test("responde 401 cuando no hay header de autorización", () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No autorizado" });
    expect(next).not.toHaveBeenCalled();
  });

  test("acepta un token Bearer y adjunta el usuario al request", () => {
    const token = jwt.sign({ id_usuario: 5 }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user).toEqual(expect.objectContaining({ id_usuario: 5 }));
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("responde 401 cuando el token es inválido", () => {
    const req = { headers: { authorization: "Bearer token-invalido" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token inválido" });
    expect(next).not.toHaveBeenCalled();
  });
});
