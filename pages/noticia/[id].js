import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DetalleNoticia() {
  const router = useRouter();
  const { id } = router.query;
  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function descargarNoticia() {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error al cargar la noticia:", error);
      } else {
        setNoticia(data);
      }
      setCargando(false);
    }

    descargarNoticia();
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="text-yellow-500 font-black animate-pulse tracking-widest uppercase">Cargando jugada...</div>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-400 uppercase tracking-widest">La noticia no existe o fue eliminada.</p>
        <button onClick={() => router.push('/')} className="mt-8 text-yellow-500 border border-yellow-500 px-6 py-2 hover:bg-yellow-500 hover:text-black transition font-bold">VOLVER AL INICIO</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-yellow-500 selection:text-black">
      <Head>
        <title>{noticia.titulo} | Directo Al Palo</title>
      </Head>

      <header className="p-4 border-b border-yellow-600/20 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <img src="/logo-directo-al-palo.jpg" alt="DAP" className="w-10 h-10 rounded-full border border-yellow-500" />
            <span className="font-black uppercase italic tracking-tighter text-lg md:text-xl">Directo <span className="text-yellow-500">Al Palo</span></span>
          </div>
          <button onClick={() => router.push('/')} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-yellow-500 transition">Regresar</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 pt-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-yellow-600 text-black text-[10px] font-black px-3 py-1 uppercase">{noticia.categoria}</span>
          <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            {new Date(noticia.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-tight md:leading-[0.95] mb-8 tracking-tighter uppercase italic">{noticia.titulo}</h1>

        <div className="flex items-center gap-3 mb-10 border-l-4 border-yellow-600 pl-4 bg-zinc-900/50 py-2">
          <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Escrito por</div>
          <div className="text-sm font-bold text-white uppercase italic tracking-tight">{noticia.autor}</div>
        </div>

        <div className="relative aspect-video mb-12 shadow-2xl">
          <img src={noticia.imagen_url || "/logo-directo-al-palo.jpg"} alt={noticia.titulo} className="w-full h-full object-cover border-b-8 border-yellow-600" />
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed whitespace-pre-line first-letter:text-6xl first-letter:font-black first-letter:text-yellow-500 first-letter:mr-3 first-letter:float-left">
            {noticia.cuerpo}
          </p>
        </div>

        <div className="mt-24 pt-10 border-t border-zinc-900 text-center">
          <p className="text-zinc-700 text-[10px] uppercase tracking-[0.4em] font-bold mb-8">Fin de la nota</p>
          <img src="/logo-directo-al-palo.jpg" alt="Logo" className="w-16 h-16 rounded-full mx-auto opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition duration-700 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
        </div>
      </main>

      <footer className="p-10 text-center text-zinc-800 text-[9px] uppercase tracking-widest font-bold">
        Directo Al Palo © 2025 | Quilpalta.online
      </footer>
    </div>
  );
}