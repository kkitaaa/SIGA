import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Ajusta la ruta según tu proyecto
import '../../styles/home.css'; // O el archivo de estilos que uses

export default function EstudianteDetallePage() {
  const { id } = useParams(); // Captura el ID de la URL
  const navigate = useNavigate();

  const [estudiante, setEstudiante] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setCargando(true);
        const estRes = await api.get(`/estudiantes/${id}`);
        
        console.log("Respuesta del Backend:", estRes.data);

        const datosEstudiante = estRes.data.estudiante || estRes.data.data || estRes.data;
        
        setEstudiante(datosEstudiante);

        if (datosEstudiante.es_nee) {
          try {
            const asigRes = await api.get(`/asignacion-pie/estudiante/${id}`);
            setProfesionales(asigRes.data.profesionales || asigRes.data.data || []);
          } catch (err) {
            console.warn("Este estudiante no tiene asignaciones o hubo un error al cargarlas", err);
          }
        }
      } catch (err) {
        console.error("Error al cargar estudiante:", err);
        setError("No se pudo cargar la información del estudiante.");
      } finally {
        setCargando(false);
      }
    };

    fetchDetalle();
  }, [id]);

  if (cargando) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando información del estudiante...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!estudiante) return <div style={{ padding: '20px', textAlign: 'center' }}>Estudiante no encontrado.</div>;

  return (
    <div className="home-page">
      <main className="home-main" style={{ display: 'block', maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
        
        {/* Botón de retorno */}
        <button 
          onClick={() => navigate(-1)} 
          style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', borderRadius: '5px' }}
        >
          &larr; Volver al listado
        </button>

        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            Perfil del Estudiante
          </h2>

          {/* DATOS PERSONALES */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Datos Personales</h3>
            <p><strong>RUT:</strong> {estudiante.rut}</p>
            <p><strong>Nombre Completo:</strong> {estudiante.primer_nombre} {estudiante.segundo_nombre} {estudiante.primer_apellido} {estudiante.segundo_apellido}</p>
            <p><strong>Sexo:</strong> {estudiante.sexo}</p>
            <p><strong>Fecha de Nacimiento:</strong> {new Date(estudiante.fecha_nacimiento).toLocaleDateString()}</p>
          </div>

          {/* INFORMACIÓN ACADÉMICA */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Información Académica</h3>
            <p><strong>ID Curso Actual:</strong> {estudiante.id_curso || 'Sin asignar'}</p>
            <p><strong>Fecha de Ingreso:</strong> {new Date(estudiante.fecha_ingreso).toLocaleDateString()}</p>
          </div>

          {/* ESTADO PIE / NEE */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: estudiante.es_nee ? '#ebf8fa' : '#f7fafc', borderRadius: '8px' }}>
            <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Programa de Integración Escolar (PIE)</h3>
            <p><strong>Pertenece a PIE:</strong> {estudiante.es_nee ? '✅ Sí' : '❌ No'}</p>

            {estudiante.es_nee && (
              <div style={{ marginTop: '15px' }}>
                <h4>Profesionales Asignados:</h4>
                {profesionales.length > 0 ? (
                  <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    {profesionales.map((profe, index) => (
                      <li key={index}>
                        <strong>{profe.nombre}</strong> - {profe.tipo_profesional}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#718096', marginTop: '5px' }}>No hay profesionales asignados actualmente a este estudiante.</p>
                )}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}