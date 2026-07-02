import React from "react";
import PropTypes from "prop-types";
import AdminDashboard from "./DirectivaDashboard";

function CoordinadorAdministrativoDashboard({ user }) {
  return <AdminDashboard user={user} roleLabel="Coordinador administrativo" />;
}

CoordinadorAdministrativoDashboard.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string,
    rol: PropTypes.string,
  }),
};

export default CoordinadorAdministrativoDashboard;
