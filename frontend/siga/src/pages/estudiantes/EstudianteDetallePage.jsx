import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import '../../styles/home.css'; 

const formatDateToDDMMYYYY = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const toDateInputValue = (value) => {
  if (!value) return '';
  if (typeof value !== 'string') return '';
  if (value.includes('/')) {
    const [day, month, year] = value.split('/');
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return value.split('T')[0];
};

export default function EstudianteDetallePage() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [estudiante, setEstudiante] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // --- NUEVOS ESTADOS PARA EDICIÓN ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setCargando(true);
        const estRes = await api.get(`/estudiantes/${id}`);
        const datosEstudiante = estRes.data.estudiante || estRes.data.data || estRes.data;
        
        setEstudiante(datosEstudiante);
        
        setFormData({
          ...datosEstudiante,
          fecha_nacimiento: toDateInputValue(datosEstudiante.fecha_nacimiento),
          fecha_ingreso: toDateInputValue(datosEstudiante.fecha_ingreso)
        });

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

  // --- FUNCIONES DE EDICIÓN ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setGuardando(true);
      
      const datosParaEnviar = { ...formData };

      if (datosParaEnviar.fecha_nacimiento) {
        datosParaEnviar.fecha_nacimiento = `${datosParaEnviar.fecha_nacimiento}T00:00:00.000Z`;
      }
      
      if (datosParaEnviar.fecha_ingreso) {
        datosParaEnviar.fecha_ingreso = `${datosParaEnviar.fecha_ingreso}T00:00:00.000Z`;
      }

      if (datosParaEnviar.id_curso) {
        datosParaEnviar.id_curso = parseInt(datosParaEnviar.id_curso);
      }

      await api.put(`/estudiantes/${id}`, datosParaEnviar);
      
      setEstudiante({ ...estudiante, ...datosParaEnviar });
      setIsEditing(false);
      alert("¡Estudiante actualizado correctamente!");
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...estudiante,
      fecha_nacimiento: toDateInputValue(estudiante.fecha_nacimiento),
      fecha_ingreso: toDateInputValue(estudiante.fecha_ingreso)
    });
    setIsEditing(false);
  };

  if (cargando) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando información del estudiante...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!estudiante) return <div style={{ padding: '20px', textAlign: 'center' }}>Estudiante no encontrado.</div>;

  return (
    <div className="home-page">
      <main className="home-main" style={{ display: 'block', maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
        
        <button 
          onClick={() => navigate(-1)} 
          style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', borderRadius: '5px', backgroundColor: '#e2e8f0', border: 'none' }}
        >
          &larr; Volver al listado
        </button>

        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          
          {/* ENCABEZADO CON BOTONES DE EDICIÓN */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Perfil del Estudiante</h2>
            <div>
              {isEditing ? (
                <>
                  <button onClick={handleCancel} disabled={guardando} style={{ marginRight: '10px', padding: '6px 12px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={guardando} style={{ padding: '6px 12px', borderRadius: '5px', backgroundColor: '#3182ce', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {guardando ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} style={{ padding: '6px 12px', borderRadius: '5px', backgroundColor: '#edf2f7', border: '1px solid #cbd5e0', cursor: 'pointer' }}>
                  ✏️ Editar Datos
                </button>
              )}
            </div>
          </div>

          {/* DATOS PERSONALES */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Datos Personales</h3>
            
            <p><strong>RUT:</strong> {isEditing ? (
              <input type="text" name="rut" value={formData.rut || ''} onChange={handleChange} disabled style={{ marginLeft: '10px', padding: '4px' }} title="El RUT no se puede editar" />
            ) : estudiante.rut}</p>
            
            <p><strong>Nombres:</strong> {isEditing ? (
              <>
                <input type="text" name="primer_nombre" value={formData.primer_nombre || ''} onChange={handleChange} placeholder="Primer Nombre" style={{ marginLeft: '10px', padding: '4px', marginRight: '5px' }} />
                <input type="text" name="segundo_nombre" value={formData.segundo_nombre || ''} onChange={handleChange} placeholder="Segundo Nombre" style={{ padding: '4px' }} />
              </>
            ) : `${estudiante.primer_nombre} ${estudiante.segundo_nombre || ''}`}</p>

            <p><strong>Apellidos:</strong> {isEditing ? (
              <>
                <input type="text" name="primer_apellido" value={formData.primer_apellido || ''} onChange={handleChange} placeholder="Primer Apellido" style={{ marginLeft: '10px', padding: '4px', marginRight: '5px' }} />
                <input type="text" name="segundo_apellido" value={formData.segundo_apellido || ''} onChange={handleChange} placeholder="Segundo Apellido" style={{ padding: '4px' }} />
              </>
            ) : `${estudiante.primer_apellido} ${estudiante.segundo_apellido || ''}`}</p>
            
            <p><strong>Sexo:</strong> {isEditing ? (
              <select name="sexo" value={formData.sexo || ''} onChange={handleChange} style={{ marginLeft: '10px', padding: '4px' }}>
                <option value="M">Masculino (M)</option>
                <option value="F">Femenino (F)</option>
                <option value="O">Otro (O)</option>
              </select>
            ) : estudiante.sexo}</p>

            <p><strong>Fecha de Nacimiento:</strong> {isEditing ? (
              <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento || ''} onChange={handleChange} style={{ marginLeft: '10px', padding: '4px' }} />
            ) : formatDateToDDMMYYYY(estudiante.fecha_nacimiento)}</p>
          </div>

          {/* INFORMACIÓN ACADÉMICA */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Información Académica</h3>
            
            <p><strong>ID Curso Actual:</strong> {isEditing ? (
              <input type="number" name="id_curso" value={formData.id_curso || ''} onChange={handleChange} style={{ marginLeft: '10px', padding: '4px' }} />
            ) : (estudiante.id_curso || 'Sin asignar')}</p>
            
            <p><strong>Fecha de Ingreso:</strong> {isEditing ? (
              <input type="date" name="fecha_ingreso" value={formData.fecha_ingreso || ''} onChange={handleChange} style={{ marginLeft: '10px', padding: '4px' }} />
            ) : formatDateToDDMMYYYY(estudiante.fecha_ingreso)}</p>
          </div>

          {/* ESTADO PIE / NEE */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: (isEditing ? formData.es_nee : estudiante.es_nee) ? '#ebf8fa' : '#f7fafc', borderRadius: '8px' }}>
            <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Programa de Integración Escolar (PIE)</h3>
            
            <p><strong>Pertenece a PIE:</strong> {isEditing ? (
              <label style={{ marginLeft: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="es_nee" checked={formData.es_nee || false} onChange={handleChange} style={{ marginRight: '5px' }} />
                Sí, es estudiante NEE
              </label>
            ) : (estudiante.es_nee ? '✅ Sí' : '❌ No')}</p>

            {estudiante.es_nee && !isEditing && (
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
            {isEditing && (
              <p style={{ fontSize: '12px', color: '#718096', marginTop: '10px' }}>
                *La asignación de profesionales PIE se administra desde la pestaña "Asignación PIE".
              </p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}