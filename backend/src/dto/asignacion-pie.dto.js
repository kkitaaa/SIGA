const normalizarEntero = (valor) => {
  const numero = typeof valor === "string" ? Number(valor) : valor;

  return Number.isInteger(numero) ? numero : null;
};

export const validarCrearAsignacionPIEDto = (payload = {}) => {
  const errores = [];
  const idEstudiante = normalizarEntero(payload.idEstudiante);
  const idFuncionario = normalizarEntero(payload.idFuncionario);

  if (idEstudiante === null) {
    errores.push("El id del estudiante debe ser un numero entero");
  }

  if (idFuncionario === null) {
    errores.push("El id del funcionario debe ser un numero entero");
  }

  return {
    valido: errores.length === 0,
    errores,
    data: {
      idEstudiante,
      idFuncionario,
    },
  };
};
