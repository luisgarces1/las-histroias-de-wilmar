'use client';

import React, { useState, useEffect, useRef } from 'react';
// IMPORTANTE: Asegúrate de instalar lucide-react (npm i lucide-react)
import { Volume2, VolumeX, MapPin, X, ChevronDown, Sparkles, Heart } from 'lucide-react';

/**
 * COMPONENTE: BelloLandingPage
 * 
 * Una landing page móvil-first interactiva para Bello, Antioquia.
 * Diseñada para alta conversión y carga rápida a través de códigos QR.
 * 
 * Dependencias sugeridas:
 * - npm install lucide-react
 * 
 * Si deseas usar animaciones de entrada premium, puedes integrar framer-motion:
 * - npm install framer-motion
 */

// Datos de los sitios históricos de Bello, Antioquia
const PLACES_DATA = [
  {
    id: 1,
    title: "Cerro Quitasol",
    subtitle: "Ecoturismo y Tradición",
    tag: "Ecoturismo",
    image: "/assets/images/cerro_quitasol.png", // Asegúrate de colocar la imagen en tu carpeta /public/assets/images/
    description: "El Cerro Quitasol es la joya geográfica y natural del norte del Valle de Aburrá. Esta imponente montaña, considerada por historiadores locales como una especie de pirámide ceremonial prehispánica debido a su forma, alberga senderos y caminos empedrados construidos por los antiguos indígenas Niquía que habitaron el valle.",
    funFact: "En la cima del cerro existen alineaciones de piedras que algunos astrónomos sostienen que servían a las tribus locales como un antiguo observatorio solar.",
    colSpan: "col-span-2",
    height: "h-48"
  },
  {
    id: 2,
    title: "Choza de Marco Fidel Suárez",
    subtitle: "Orgullo Histórico",
    tag: "Orgullo",
    image: "/assets/images/choza_marco_fidel.png",
    description: "Esta humilde cabaña de paredes de bahareque y techo de paja vio nacer y crecer a Marco Fidel Suárez, quien llegó a convertirse en Presidente de la República de Colombia entre 1918 y 1921. Hoy se conserva protegida dentro de una imponente estructura de vidrio que funciona como monumento nacional y museo en el corazón del municipio.",
    funFact: "Al no tener dinero para libros, Marco Fidel Suárez estudiaba mirando los textos a través de la ventana de una escuela local, demostrando una voluntad indomable.",
    colSpan: "col-span-1",
    height: "h-52"
  },
  {
    id: 3,
    title: "Ferrocarril de Antioquia",
    subtitle: "Conexión y Progreso",
    tag: "Progreso",
    image: "/assets/images/ferrocarril_antioquia.png",
    description: "La antigua Estación Bello y sus talleres mecánicos adyacentes fueron el corazón de la revolución industrial en Antioquia a principios del siglo XX. Por estas vías se transportaron las mercancías y el café que abrieron la economía antioqueña al comercio internacional, impulsando la fundación de industrias textileras.",
    funFact: "Los talleres mecánicos de Bello contaban con tecnología tan avanzada que allí mismo se ensamblaban y reparaban piezas gigantescas de trenes de vapor.",
    colSpan: "col-span-1",
    height: "h-52"
  },
  {
    id: 4,
    title: "Quebrada La García",
    subtitle: "Patrimonio Natural",
    tag: "Naturaleza",
    image: "/assets/images/quebrada_la_garcia.png",
    description: "La quebrada La García es el eje hídrico histórico que divide y recorre el casco urbano de Bello. A lo largo de sus orillas se asentaron los primeros barrios industriales y obreros, transformándose en la fuente de agua para las textileras y en el lugar de esparcimiento familiar de generaciones de bellanitas.",
    funFact: "La García nace en el Alto de Medina a más de 2,400 metros de altura y baja cruzando zonas vírgenes y cascadas antes de atravesar el centro urbano.",
    colSpan: "col-span-2",
    height: "h-40"
  }
];

export default function BelloLandingPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [activePlace, setActivePlace] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Manejar el toggle del audio de fondo (wilmar.mpeg)
  const toggleSound = () => {
    if (audioRef.current) {
      const isPaused = audioRef.current.paused;
      if (isPaused) {
        if (audioRef.current.currentTime === 0) {
          audioRef.current.currentTime = 119;
        }
        audioRef.current.play().catch(err => console.log("Error al reproducir audio:", err));
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  // Manejar la apertura del modal de sitio
  const openModal = (place) => {
    setActivePlace(place);
    setIsModalOpen(true);
    // Revisar si ya votó en este sitio previamente usando localStorage
    const voted = localStorage.getItem(`voted_place_${place.id}`);
    setHasVoted(!!voted);
    document.body.style.overflow = 'hidden';
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    // Esperar a que termine la animación de salida
    setTimeout(() => {
      setActivePlace(null);
    }, 300);
  };

  // Manejar la votación en la encuesta
  const handleVote = (option) => {
    if (!activePlace) return;
    localStorage.setItem(`voted_place_${activePlace.id}`, option);
    setHasVoted(true);
  };

  // Prevenir scroll accidental y manejar el bucle del audio
  useEffect(() => {
    const audioEl = audioRef.current;
    const handleAudioEnded = () => {
      if (audioEl) {
        audioEl.currentTime = 119;
        audioEl.play().catch(err => console.log("Error al reiniciar bucle de audio:", err));
      }
    };

    if (audioEl) {
      audioEl.addEventListener('ended', handleAudioEnded);
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (audioEl) {
        audioEl.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, []);

  return (
    <div className="bg-[#04060A] text-slate-100 min-h-screen antialiased overflow-x-hidden">
      {/* Contenedor móvil centrado en escritorio */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#0B0F19] shadow-2xl relative border-x border-slate-900">
        
        {/* ========================================================== */}
        <!-- HERO SECTION: VIDEO VERTICAL -->
        {/* ========================================================== */}
        <section className="h-[100dvh] w-full relative overflow-hidden flex flex-col justify-between">
          {/* Video en bucle */}
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" // Reemplazar con '/video-bello.mp4' en producción
            poster="/assets/images/video_poster.png"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />

          {/* Audio de Fondo (wilmar.mpeg) */}
          <audio
            ref={audioRef}
            src="/assets/audio/wilmar.mpeg"
            preload="auto"
          />

          {/* Sombra de contraste */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10 pointer-events-none" />

          {/* Branding Superior */}
          <header className="w-full px-4 pt-4 z-20">
            <div className="bg-[#0B0F19]/65 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center justify-between border border-white/5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="/assets/images/host_profile.jpeg"
                    alt="Anfitrión Local"
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-md shadow-emerald-500/20"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0B0F19] rounded-full" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Presentado por</span>
                  <h2 className="text-sm font-bold text-white tracking-tight">Wilmar Salgado</h2>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-slate-200">Bello, Ant.</span>
              </div>
            </div>
          </header>

          {/* Botón de Silencio Flotante */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2">
            <button
              onClick={toggleSound}
              className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform border border-white/20 shadow-lg relative group"
              aria-label="Silenciar / Activar sonido"
            >
              {/* Onda animada si está silenciado */}
              {isMuted && (
                <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
              )}
              
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-slate-300" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-500" />
              )}
            </button>
            <span className={`text-[10px] bg-[#0B0F19]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest font-bold ${isMuted ? 'text-slate-300' : 'text-emerald-500'}`}>
              {isMuted ? 'Muted' : 'On'}
            </span>
          </div>

          {/* Pie de Página del Hero / Llamado a la Acción */}
          <div className="px-6 pb-8 z-20 w-full flex flex-col items-center">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Orgullo Bellanita
              </span>
              <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                ¿Sabías que Bello tiene historias que desafían el tiempo?
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-xs mx-auto font-light">
                Escucha la historia en video arriba o explora los lugares históricos a continuación.
              </p>
            </div>

            <a
              href="#explore"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold text-center flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-transform duration-200"
            >
              <span>🔍 Descubre la historia oculta de Bello</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>
        </section>

        {/* ========================================================== */}
        <!-- CONTENIDO INTERACTIVO: BENTO GRID -->
        {/* ========================================================== */}
        <section id="explore" className="py-10 px-5 bg-gradient-to-b from-[#0B0F19] to-[#05080E] relative border-t border-white/5 scroll-mt-2">
          {/* Brillos ambientales de fondo */}
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="mb-8 relative z-10">
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Explorador Histórico
            </h3>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">
              Sitios Icónicos
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Toca una tarjeta para desbloquear datos ocultos y opinar.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 gap-4 relative z-10">
            {PLACES_DATA.map((place) => (
              <button
                key={place.id}
                onClick={() => openModal(place)}
                className={`${place.colSpan} ${place.height} relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-emerald-500/30 text-left flex flex-col justify-end p-4 transition-all duration-300 transform active:scale-95 group`}
              >
                <img
                  src={place.image}
                  alt={place.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

                <div className="relative z-20">
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {place.tag}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5 leading-tight">{place.title}</h4>
                  <p className="text-[10px] text-slate-300 mt-1 line-clamp-2 font-light">
                    {place.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer de la página */}
          <footer className="mt-12 text-center relative z-10 border-t border-white/5 pt-8">
            <p className="text-xs text-slate-400 font-light">
              Diseñado con <Heart className="w-3 h-3 text-emerald-500 inline-block align-middle" /> por y para Bello, Antioquia.
            </p>
            <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest font-semibold">
              Experiencia Interactiva No Partidaria • 2026
            </p>
          </footer>
        </section>

        {/* ========================================================== */}
        <!-- DYNAMIC MODAL & SURVEY -->
        {/* ========================================================== */}
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center bg-black/70 transition-opacity duration-300 ${
            isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Fondo para cerrar al tocar fuera */}
          <div className="absolute inset-0 cursor-pointer" onClick={closeModal} />

          {/* Caja del Modal */}
          <div
            className={`w-full max-w-md bg-[#0F1628]/90 backdrop-blur-xl border border-white/10 rounded-t-[2.5rem] overflow-hidden flex flex-col relative z-10 transition-transform duration-300 ease-out max-h-[85vh] ${
              isModalOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <div className="w-12 h-1.5 bg-slate-600/50 rounded-full mx-auto my-3.5 shrink-0" />

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#0B0F19]/85 border border-white/10 flex items-center justify-center text-slate-300 active:scale-90 transition-transform shadow-lg z-20"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {activePlace && (
              <div className="overflow-y-auto px-6 pb-10 pt-2 no-scrollbar">
                <div className="w-full h-44 rounded-2xl overflow-hidden relative shadow-inner mb-5">
                  <img
                    src={activePlace.image}
                    alt={activePlace.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
                </div>

                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {activePlace.tag}
                </span>

                <h3 className="text-2xl font-black text-white tracking-tight mt-3 leading-none">
                  {activePlace.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 italic font-medium">
                  {activePlace.subtitle}
                </p>

                <p className="text-sm text-slate-300 mt-4 leading-relaxed font-light">
                  {activePlace.description}
                </p>

                {/* Dato curioso */}
                <div className="mt-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400 block mb-1 uppercase tracking-wide">
                    💡 ¿Sabías que...?
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium italic">
                    {activePlace.funFact}
                  </p>
                </div>

                {/* Encuesta Social */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-bold text-white mb-4">¿Conocías este dato sobre este sitio?</h4>

                  {!hasVoted ? (
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleVote('yes')}
                        className="flex-1 py-3.5 px-4 rounded-xl border border-white/10 bg-white/5 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500/10 hover:border-emerald-500/30 active:scale-95 transition-all duration-200"
                      >
                        <span>👍</span> Sí, genial
                      </button>
                      <button
                        onClick={() => handleVote('no')}
                        className="flex-1 py-3.5 px-4 rounded-xl border border-white/10 bg-white/5 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-blue-500/10 hover:border-blue-500/30 active:scale-95 transition-all duration-200"
                      >
                        <span>😲</span> No, me sorprendió
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
                      <p className="text-xs font-bold text-emerald-400">
                        ¡Gracias por vivir la historia de Bello con nosotros!
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Tu curiosidad mantiene vivo nuestro legado local.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
