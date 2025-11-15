import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

const Contacto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('¡Mensaje enviado! Te contactaremos pronto.');
      setFormData({ nombre: '', email: '', mensaje: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#1e293b' }}>
      {/* Header */}
      <header style={{
        background: '#d73719',
        borderBottom: '1px solid #b02b13',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'white',
            position: 'absolute',
            left: '16px'
          }}
        >
          <ArrowLeft style={{ width: '24px', height: '24px', color: 'white' }} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>
          Contacto
        </h1>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px 16px' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          <div style={{
            background: '#2d3748',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>
              ¿Necesitas ayuda?
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
              Completa el formulario y nos pondremos en contacto contigo lo antes posible.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="nombre" style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#1e293b',
                    border: '2px solid #334155',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="Tu nombre"
                  onFocus={(e) => e.target.style.borderColor = '#d73719'}
                  onBlur={(e) => e.target.style.borderColor = '#334155'}
                />
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#1e293b',
                    border: '2px solid #334155',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="tu@email.com"
                  onFocus={(e) => e.target.style.borderColor = '#d73719'}
                  onBlur={(e) => e.target.style.borderColor = '#334155'}
                />
              </div>

              <div>
                <label htmlFor="mensaje" style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#1e293b',
                    border: '2px solid #334155',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: 'white',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  onFocus={(e) => e.target.style.borderColor = '#d73719'}
                  onBlur={(e) => e.target.style.borderColor = '#334155'}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  background: isSubmitting ? '#6b7280' : 'linear-gradient(135deg, #d73719 0%, #b02b13 100%)',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(215, 55, 25, 0.4)',
                  opacity: isSubmitting ? 0.5 : 1,
                  transition: 'all 0.3s'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send style={{ width: '20px', height: '20px' }} />
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          </div>

          <div style={{
            background: '#2d3748',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <Mail style={{ width: '32px', height: '32px', color: '#d73719', margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8', margin: 0 }}>
              También puedes escribirnos a{' '}
              <a 
                href="mailto:contacto@alcanzalavictoria.com" 
                style={{ fontWeight: '600', color: '#d73719', textDecoration: 'none' }}
              >
                contacto@alcanzalavictoria.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
