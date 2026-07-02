import { UsuarioRepository } from "../repositories/usuario.repository.js";
import { UsuarioService } from "../services/usuario.service.js";

const usuarioRepo = new UsuarioRepository();

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioRepo.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await usuarioRepo.create(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ message: "Error al crear usuario", error });
  }
};

export const listarUsuariosSinRolController = async (req, res) => {
  try {
    const usuarios = await UsuarioService.obtenerUsuariosSinRol();
    res.status(200).json({ ok: true, usuarios });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

export const listarUsuariosController = async (req, res) => {
  try {
    const usuarios = await UsuarioService.obtenerUsuariosConRol();

    if (!usuarios || usuarios.length === 0) {
      return res.status(200).json({
        ok: true,
        usuarios: [],
        mensaje: "No hay usuarios registrados",
      });
    }

    return res.status(200).json({
      ok: true,
      usuarios,
    });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error del servidor",
    });
  }
};

export const actualizarUsuarioController = async (req, res) => {
  try {
    const idUsuario = Number(req.params.id);

    if (!Number.isInteger(idUsuario)) {
      return res.status(400).json({ ok: false, mensaje: "ID de usuario inválido." });
    }

    const usuarioActualizado = await UsuarioService.actualizarUsuario(idUsuario, req.body);

    return res.status(200).json({
      ok: true,
      usuario: usuarioActualizado,
      mensaje: "Información de la cuenta actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(400).json({
      ok: false,
      mensaje: error.message || "No se pudo actualizar la información del usuario.",
    });
  }
};
