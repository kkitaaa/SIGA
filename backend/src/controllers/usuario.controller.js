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
