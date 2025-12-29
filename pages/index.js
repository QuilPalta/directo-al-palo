import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión con las llaves que ya tienes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function IndexPrincipal() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function descargarNoticias() {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setNoticias(data);
      setCargando(false);
    }
    descargarNoticias();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* HEADER DE MARCA */}
      <header className="py-10 border-b border-yellow-600/20 bg-black flex flex-col items-center">
        <img src="/logo-directo-al-palo.jpg" alt="Logo" className="w-28 h-28 mb-4 border-2 border-yellow-500 rounded-full shadow-lg shadow-yellow-500/20" />
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          Directo <span className="text-yellow-500">Al Palo</span>
        </h1>
        <nav className="mt-6 flex gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-yellow-500 transition">Fútbol</a>
          <a href="#" className="hover:text-yellow-500 transition">WWE</a>
          <a href="#" className="hover:text-yellow-500 transition">Tenis</a>
          <a href="/colaboradores" className="text-yellow-600 border border-yellow-600 px-3 py-1 rounded hover:bg-yellow-600 hover:text-black transition">Redacción</a>
        </nav>
      </header>

      {/* GRILLA DE NOTICIAS */}
      <main className="max-w-6xl mx-auto p-6 md:p-12">
        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {noticias.map((nota) => (
              <article key={nota.id} className="flex flex-col group cursor-pointer">
                <div className="relative overflow-hidden aspect-video mb-4 border-b-4 border-yellow-600">
                  <img 
                    src={nota.imagen_url} 
                    alt={nota.titulo} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <span className="absolute top-2 left-2 bg-yellow-600 text-black text-[10px] font-black px-2 py-1 uppercase">
                    {nota.categoria}
                  </span>
                </div>
                <h2 className="text-2xl font-bold leading-none mb-3 group-hover:text-yellow-500 transition">
                  {nota.titulo}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 italic">
                  "{nota.cuerpo.substring(0, 100)}..."
                </p>
                <div className="mt-auto flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  <span>Por {nota.autor}</span>
                  <span>{new Date(nota.created_at).toLocaleDateString()}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="p-10 border-t border-zinc-900 text-center text-gray-600 text-[10px] tracking-widest uppercase">
        Directo Al Palo © 2025 | Quilpalta.online
      </footer>
    </div>
  );
}