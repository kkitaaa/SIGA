import React from "react";
import PropTypes from "prop-types";
import AdminDashboard from "./DirectivaDashboard";

function AdministracionDashboard({ user }) {
  return <AdminDashboard user={user} roleLabel="Coordinador administrativo" />;
}

AdministracionDashboard.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string,
    rol: PropTypes.string,
  }),
};

export default AdministracionDashboard;
