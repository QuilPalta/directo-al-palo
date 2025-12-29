import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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

      if (noticia.imagen) {
        // Generamos un nombre único y limpio para la imagen
        const extension = noticia.imagen.name.split('.').pop();
        const nombreArchivo = `${Date.now()}.${extension}`;
        
        // Subida al bucket 'imagenes-noticias'
        const { data: dataFoto, error: errorFoto } = await supabase.storage
          .from('imagenes-noticias')
          .upload(nombreArchivo, noticia.imagen, {
            cacheControl: '3600',
            upsert: false
          });

        if (errorFoto) throw errorFoto;

        // Obtenemos la URL pública
        const { data: dataUrl } = supabase.storage
          .from('imagenes-noticias')
          .getPublicUrl(nombreArchivo);
        
        urlImagenFinal = dataUrl.publicUrl;
      }

      // Inserción en la tabla de noticias
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

      alert("¡Noticia publicada con éxito!");
      setNoticia({ titulo: '', categoria: 'Futbol', cuerpo: '', imagen: null, autor: '' });

    } catch (error) {
      console.error("Error completo de Supabase:", error);
      alert(`Error: ${error.message || "Fallo en la comunicación con el servidor"}`);
    } finally {
      setPublicando(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-yellow-600/30 p-8 rounded-xl shadow-2xl">
        <header className="flex items-center gap-6 mb-8 border-b border-yellow-600/20 pb-6">
          <img 
            src="/logo-directo-al-palo.jpg" 
            alt="Logo" 
            className="w-20 h-20 rounded-full border-2 border-yellow-500 shadow-lg shadow-yellow-500/20" 
          />
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              Directo <span className="text-yellow-500">Al Palo</span>
            </h1>
            <p className="text-yellow-500 font-bold tracking-widest text-[10px] uppercase">Redacción de Colaboradores</p>
          </div>
        </header>

        <form onSubmit={enviarNoticia} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-yellow-500 uppercase mb-2 tracking-widest">Titular</label>
              <input 
                type="text" 
                name="titulo"
                value={noticia.titulo}
                onChange={manejarCambio}
                className="bg-zinc-800 border-0 p-3 rounded text-white focus:ring-1 focus:ring-yellow-500 outline-none text-sm" 
                placeholder="Título de la noticia..."
                required 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-yellow-500 uppercase mb-2 tracking-widest">Autor</label>
              <input 
                type="text" 
                name="autor"
                value={noticia.autor}
                onChange={manejarCambio}
                className="bg-zinc-800 border-0 p-3 rounded text-white focus:ring-1 focus:ring-yellow-500 outline-none text-sm" 
                placeholder="Tu nombre"
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-yellow-500 uppercase mb-2 tracking-widest">Categoría</label>
              <select 
                name="categoria"
                value={noticia.categoria}
                onChange={manejarCambio}
                className="bg-zinc-800 border-0 p-3 rounded text-white focus:ring-1 focus:ring-yellow-500 outline-none text-sm"
              >
                <option value="Futbol">Fútbol</option>
                <option value="WWE">WWE</option>
                <option value="Tenis">Tenis</option>
                <option value="Varios">Varios</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-yellow-500 uppercase mb-2 tracking-widest">Imagen</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={manejarImagen}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-yellow-600 file:text-black hover:file:bg-yellow-500 cursor-pointer" 
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-black text-yellow-500 uppercase mb-2 tracking-widest">Contenido</label>
            <textarea 
              name="cuerpo"
              value={noticia.cuerpo}
              onChange={manejarCambio}
              rows="10" 
              className="bg-zinc-800 border-0 p-4 rounded text-white focus:ring-1 focus:ring-yellow-500 outline-none resize-none text-sm leading-relaxed"
              placeholder="Escribe la noticia completa..."
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={publicando}
            className={`w-full py-4 rounded font-black uppercase tracking-widest text-sm transition-all ${
              publicando 
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
                : 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-lg shadow-yellow-600/20'
            }`}
          >
            {publicando ? 'PUBLICANDO...' : 'SUBIR A DIRECTO AL PALO'}
          </button>
        </form>
      </div>
    </div>
  );
}