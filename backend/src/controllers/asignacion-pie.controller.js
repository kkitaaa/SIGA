import { validarCrearAsignacionPIEDto } from "../dto/asignacion-pie.dto.js";
import { AsignacionPieRepository } from "../repositories/asignacion-pie.repository.js";
import { EstudianteRepository } from "../repositories/estudiante.repository.js";
import { FuncionarioRepository } from "../repositories/funcionario.repository.js";
import prisma from "../config/prisma.js";
import { AsignacionPieService } from "../services/asignacion-pie.service.js";

const asignacionPieService = new AsignacionPieService({
  asignacionPieRepository: new AsignacionPieRepository(),
  estudianteRepository: new EstudianteRepository(),
  funcionarioRepository: new FuncionarioRepository(),
  prismaClient: prisma,
});

const responderError = (res, error) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    ok: false,
    mensaje: error.message,
  });
};

export const crearAsignacionPieController = async (req, res) => {
  const validacion = validarCrearAsignacionPIEDto(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      ok: false,
      errores: validacion.errores,
    });
  }

  try {
    const resultado = await asignacionPieService.crearAsignacion({
      ...validacion.data,
      idUsuario: req.user.id_usuario,
    });

    return res.status(201).json(resultado);
  } catch (error) {
    return responderError(res, error);
  }
};

export const listarAsignacionesPieController = async (req, res) => {
  try {
    const asignaciones = await asignacionPieService.listarAsignaciones();

    return res.status(200).json({
      ok: true,
      asignaciones,
    });
  } catch (error) {
    return responderError(res, error);
  }
};

export const obtenerAsignacionPieController = async (req, res) => {
  try {
    const asignacion = await asignacionPieService.obtenerAsignacion(
      req.params.id,
    );

    return res.status(200).json({
      ok: true,
      asignacion,
    });
  } catch (error) {
    return responderError(res, error);
  }
};

export const finalizarAsignacionPieController = async (req, res) => {
  try {
    const resultado = await asignacionPieService.finalizarAsignacion(
      req.params.id,
      req.user.id_usuario,
    );

    return res.status(200).json(resultado);
  } catch (error) {
    return responderError(res, error);
  }
};
