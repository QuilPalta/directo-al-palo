import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de conexión (Usa tus datos del Paso 1)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PanelColaboradores() {
  const [publicando, setPublicando] = useState(false);
  const [noticia, setNoticia] = useState({
    titulo: '',
    categoria: 'Futbol',
    cuerpo: '',
    imagen: null,
    autor: ''
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNoticia({ ...noticia, [name]: value });
  };

  const manejarImagen = (e) => {
    setNoticia({ ...noticia, imagen: e.target.files[0] });
  };

  const enviarNoticia = async (e) => {
    e.preventDefault();
    setPublicando(true);

    try {
      let urlImagenFinal = '';

      // 1. Subir la imagen al Storage
      if (noticia.imagen) {
        const nombreArchivo = `${Date.now()}-${noticia.imagen.name}`;
        const { data: dataFoto, error: errorFoto } = await supabase.storage
          .from('imagenes-noticias')
          .upload(nombreArchivo, noticia.imagen);

        if (errorFoto) throw errorFoto;

        // Obtener la URL pública de la foto
        const { data: dataUrl } = supabase.storage
          .from('imagenes-noticias')
          .getPublicUrl(nombreArchivo);
        
        urlImagenFinal = dataUrl.publicUrl;
      }

      // 2. Insertar los datos en la tabla 'noticias'
      const { error: errorInsert } = await supabase
        .from('noticias')
        .insert([
          { 
            titulo: noticia.titulo, 
            categoria: noticia.categoria, 
            cuerpo: noticia.cuerpo, 
            autor: noticia.autor,
            imagen_url: urlImagenFinal 
          }
        ]);

      if (errorInsert) throw errorInsert;

      alert("¡Noticia de Directo Al Palo publicada correctamente!");
      setNoticia({ titulo: '', categoria: 'Futbol', cuerpo: '', imagen: null, autor: '' });

    } catch (error) {
      console.error("Error completo:", error);
      alert("Hubo un error al publicar.");
    } finally {
      setPublicando(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-yellow-600/30 p-8 rounded-xl shadow-2xl">
        <header className="flex items-center gap-6 mb-8 border-b border-yellow-600/20 pb-6">
          <img 
            src="/logo-directo-al-palo.jpg" 
            alt="Logo Directo Al Palo" 
            className="w-20 h-20 rounded-full border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" 
          />
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Directo Al Palo</h1>
            <p className="text-yellow-500 font-medium tracking-widest text-xs uppercase">Gestión de Colaboradores</p>
          </div>
        </header>

        <form onSubmit={enviarNoticia} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-yellow-500 uppercase mb-2">Título de la Noticia</label>
              <input 
                type="text" 
                name="titulo"
                value={noticia.titulo}
                onChange={manejarCambio}
                className="bg-zinc-800 border-0 p-3 rounded text-white focus:ring-2 focus:ring-yellow-500 outline-none transition" 
                placeholder="Titular impactante..."
                required 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-yellow-500 uppercase mb-2">Firma (Autor)</label>
              <input 
                type="text" 
                name="autor"
                value={noticia.autor}
                onChange={manejarCambio}
                className="bg-zinc-800 border-0 p-3 rounded text-white focus:ring-2 focus:ring-yellow-500 outline-none transition" 
                placeholder="Tu nombre"
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-yellow-500 uppercase mb-2">Sección</label>
              <select 
                name="categoria"
                value={noticia.categoria}
                onChange={manejarCambio}
                className="bg-zinc-800 border-0 p-3 rounded text-white focus:ring-2 focus:ring-yellow-500 outline-none transition"
              >
                <option value="Futbol">Fútbol</option>
                <option value="WWE">WWE</option>
                <option value="Tenis">Tenis</option>
                <option value="Varios">Varios</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-yellow-500 uppercase mb-2">Imagen de Portada</label>
              <input 
                type="file" 
                onChange={manejarImagen}
                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-yellow-600 file:text-black hover:file:bg-yellow-500 file:cursor-pointer" 
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-yellow-500 uppercase mb-2">Contenido de la Nota</label>
            <textarea 
              name="cuerpo"
              value={noticia.cuerpo}
              onChange={manejarCambio}
              rows="10" 
              className="bg-zinc-800 border-0 p-4 rounded text-white focus:ring-2 focus:ring-yellow-500 outline-none resize-none leading-relaxed"
              placeholder="Escribe el cuerpo de la noticia aquí..."
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={publicando}
            className={`w-full py-4 rounded-lg font-black uppercase tracking-widest transition-all ${
              publicando 
                ? 'bg-zinc-700 cursor-not-allowed' 
                : 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-[0_5px_15px_rgba(202,138,4,0.4)] hover:-translate-y-1'
            }`}
          >
            {publicando ? 'Subiendo datos...' : 'Publicar en Directo Al Palo'}
          </button>
        </form>
      </div>
    </div>
  );
}