import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Video, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Instagram, 
  Facebook, 
  Youtube, 
  ArrowRight, 
  Menu, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Heart, 
  Shield, 
  Smartphone,
  Info
} from 'lucide-react';
import { db, isSupabaseConfigured } from './supabaseClient';
import type { AgendaItem } from './supabaseClient';

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  youtubeId: string;
  description: string;
}

const PLAYLIST: VideoItem[] = [
  {
    id: '1',
    title: 'Janela do Vale | Entrevista com o Líder do Legislativo de Jordânia',
    duration: '1:34:10',
    youtubeId: 'NoyobbBU16Y',
    description: 'Entrevista com o líder do legislativo da Jordânia, abordando os desafios, oportunidades e aspectos culturais de ser jordaniense, além de reflexões sobre identidade, sociedade e desenvolvimento.'
  },
  {
    id: '2',
    title: 'Janela do Vale | Projeto "Janela do Vale" no Instituto Federal',
    duration: '0:45:20',
    youtubeId: 'X3mGpVnPMHk',
    description: 'Apresentação do projeto “Janela do Vale” no Instituto Federal, destacando iniciativas voltadas à educação, inovação e perspectivas para o futuro da região.'
  },
  {
    id: '3',
    title: 'Janela do Vale | Educação Inclusiva para Pessoas com Autismo',
    duration: '1:12:15',
    youtubeId: '1R3OHWWx1SE',
    description: 'Episódio sobre educação inclusiva para pessoas com autismo, discutindo práticas pedagógicas, inclusão escolar, acessibilidade e estratégias para melhorar o aprendizado e a participação dos estudantes.'
  }
];

interface StoryItem {
  id: string;
  title: string;
  image: string;
  headline: string;
  text: string;
  link: string;
  actionLabel: string;
}

const STORIES: StoryItem[] = [
  {
    id: 'bio',
    title: 'Origens',
    image: '/images/foto02.png',
    headline: 'Minha Família, Minha Base',
    text: 'Thenperson é comerciante local em Almenara. Sua história é pautada no trabalho honesto e nos valores de família para renovar o Vale do Jequitinhonha.',
    link: '#biografia',
    actionLabel: 'Ver Biografia'
  },
  {
    id: 'educacao',
    title: 'Estudantes',
    image: '/images/estudantes.png',
    headline: 'Voz Para a Juventude',
    text: 'Estudantes do IFNMG Almenara conquistam prêmios nacionais, mas enfrentam descaso com transporte e merenda. Apoiamos essa luta!',
    link: '#educacao',
    actionLabel: 'Apoiar Estudantes'
  },
  {
    id: 'agenda',
    title: 'Agenda',
    image: '/images/fotovalecima.png',
    headline: 'Pé na Estrada',
    text: 'Encontros olho no olho em Almenara e região. Acreditamos na presença constante do político no dia a dia das pessoas.',
    link: '#agenda',
    actionLabel: 'Ver Agenda'
  },
  {
    id: 'videos',
    title: 'Podcasts',
    image: '/images/imagempequena.png',
    headline: 'Janela do Vale',
    text: 'Nosso podcast traz as vozes de quem realmente vive o Vale. Assista a entrevistas exclusivas e debates fundamentais.',
    link: '#videos',
    actionLabel: 'Assista Agora'
  },
  {
    id: 'noticias',
    title: 'Notícias',
    image: '/images/foto04vale.png',
    headline: 'Desenvolvimento Já!',
    text: 'Informações e propostas por incentivos fiscais para o Norte e Nordeste de Minas Gerais. Mais indústrias, mais empregos.',
    link: '#links',
    actionLabel: 'Ver Canais'
  }
];

function App() {
  // Device Detection for responsive classes
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Database States
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [loadingAgenda, setLoadingAgenda] = useState<boolean>(true);
  
  // UI States
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showSbBanner, setShowSbBanner] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  
  // Stories States
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [storyPaused, setStoryPaused] = useState<boolean>(false);
  
  // Toast Notification State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Track scroll for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Agenda on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const agendaData = await db.getAgenda();
        setAgenda(agendaData);
        setLoadingAgenda(false);
      } catch (err) {
        console.error('Failed to load agenda', err);
        setLoadingAgenda(false);
      }
    };

    fetchInitialData();
  }, []);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Stories Navigation Helper: Prev
  const handlePrevStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setStoryProgress(0);
    } else {
      setStoryProgress(0);
    }
  };

  // Stories Navigation Helper: Next
  const handleNextStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex < STORIES.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setStoryProgress(0);
    } else {
      setActiveStoryIndex(null);
    }
  };

  // Stories CTA Handler
  const handleStoryCTA = (link: string) => {
    setActiveStoryIndex(null);
    setTimeout(() => {
      if (link.startsWith('#')) {
        const element = document.getElementById(link.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    }, 100);
  };

  // Auto-advance Stories
  useEffect(() => {
    if (activeStoryIndex === null || storyPaused) return;

    const timer = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          if (activeStoryIndex < STORIES.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 1;
      });
    }, 50); // 100 steps * 50ms = 5000ms (5s) per story

    return () => clearInterval(timer);
  }, [activeStoryIndex, storyPaused]);

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const activeVideo = PLAYLIST[activeVideoIndex];

  return (
    <div className={`app-wrapper device-${isMobile ? 'mobile' : 'desktop'}`}>
      {/* Background Glows */}
      <div className="bg-glow-container" aria-hidden="true">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      {/* Supabase Status Banner */}
      {showSbBanner && (
        <div className="sb-banner">
          <Info size={16} color="var(--color-primary)" />
          <span>
            {isSupabaseConfigured 
              ? 'Conectado com sucesso ao Supabase Backend!' 
              : 'Rodando em Modo de Simulação (dados armazenados no navegador). Conecte ao Supabase inserindo as chaves no arquivo `.env`.'}
          </span>
          <button 
            className="sb-banner-btn" 
            onClick={() => setShowSbBanner(false)}
            aria-label="Fechar aviso"
          >
            Entendi
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container header-container">
          <a href="#inicio" className="logo" aria-label="Thenperson Home">
            <Shield className="logo-icon" />
            <span>THENPERSON</span>
          </a>

          {/* Responsive Nav */}
          <nav className={`nav-menu ${mobileMenuOpen ? 'nav-menu-open' : ''}`} role="navigation">
            <a href="#inicio" className="nav-link" onClick={handleNavLinkClick}>Início</a>
            <a href="#links" className="nav-link" onClick={handleNavLinkClick}>Redes</a>
            <a href="#biografia" className="nav-link" onClick={handleNavLinkClick}>Biografia</a>
            <a href="#agenda" className="nav-link" onClick={handleNavLinkClick}>Agenda</a>
            <a href="#videos" className="nav-link" onClick={handleNavLinkClick}>Vídeos</a>
            <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="btn-cta-header" onClick={handleNavLinkClick}>Faça Parte</a>
          </nav>

          {/* Mobile menu toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Stories Tray Section */}
      <section className="stories-section">
        <div className="container">
          <div className="stories-tray">
            {STORIES.map((story, idx) => (
              <button 
                key={story.id} 
                className="story-bubble-wrapper"
                onClick={() => {
                  setActiveStoryIndex(idx);
                  setStoryProgress(0);
                }}
              >
                <div className="story-bubble-ring">
                  <img src={story.image} alt={story.title} className="story-bubble-img" />
                </div>
                <span className="story-bubble-title">{story.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <main>
        {/* Hero Section */}
        <section id="inicio" className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-badge-dot" aria-hidden="true"></span>
                <span>Pré-candidato a Deputado Federal</span>
              </div>
              
              <h1 className="hero-title">
                Determinação e Valores para Defender o <span>Vale do Jequitinhonha</span>
              </h1>
              
              <p className="hero-description">
                Thenperson é empresário (fundador da Multicell em Almenara), engajado socialmente, apaixonado por saúde, esporte e focado no crescimento de nossa gente. Um líder correto que preza pelo equilíbrio e pela honestidade.
              </p>
              
              <div className="hero-buttons">
                <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="btn-orange">
                  Faça Parte
                  <ArrowRight size={18} />
                </a>
                <a href="#agenda" className="btn-primary">
                  Acompanhar Agenda
                </a>
                <a href="#biografia" className="btn-secondary">
                  Conhecer História
                </a>
              </div>
              
              <div className="hero-highlights">
                <div className="highlight-item">
                  <span className="highlight-number">100%</span>
                  <span className="highlight-label">Foco no Vale</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-number">Multicell</span>
                  <span className="highlight-label">Gerando Oportunidades</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-number">Sempre Presente</span>
                  <span className="highlight-label">Mora e trabalha em Almenara</span>
                </div>
              </div>
            </div>
            
            <div className="hero-image-wrapper">
              <div className="hero-image-glow" aria-hidden="true"></div>
              <div className="hero-image-frame">
                <img 
                  src="/images/foto01.jpg" 
                  alt="Thenperson sorrindo com olhar confiante" 
                  className="hero-image"
                  loading="eager"
                />
              </div>

              {/* Floating badges */}
              <div className="floating-badge badge-left">
                <div className="floating-badge-icon">
                  <Heart />
                </div>
                <div className="floating-badge-text">
                  <h4>Saúde e Esporte</h4>
                  <p>Prevenção e Bem-estar</p>
                </div>
              </div>

              <div className="floating-badge badge-right">
                <div className="floating-badge-icon">
                  <Smartphone />
                </div>
                <div className="floating-badge-text">
                  <h4>Multicell Almenara</h4>
                  <p>Inovação e Trabalho</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Videos Section - Contexto: Vídeos Emocionais / Vale (Terracota + Areia + Azul) */}
        <section id="videos" className="section">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Janela do Vale</span>
              <h2 className="section-title">Galeria de <span>Vídeos</span></h2>
              <p className="section-subtitle">
                Assista aos episódios do nosso podcast, pronunciamentos de pré-campanha e saiba quais são as nossas propostas para a região do Vale.
              </p>
            </div>
            
            <div className="desktop-video-layout">
              {/* Main player component */}
              <div className="main-video-container">
                <div className="main-video-wrapper">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    style={{ border: 'none' }}
                  ></iframe>
                </div>
                
                {/* Details under active video */}
                <div className="active-video-details">
                  <span className="active-video-tag">Em Destaque</span>
                  <h3 className="active-video-title">{activeVideo.title}</h3>
                  <p className="active-video-desc">{activeVideo.description}</p>
                </div>
              </div>
              
              {/* Playlist Selector below the player */}
              <div className="other-videos-section">
                <h3 className="other-videos-heading">Outros Episódios</h3>
                <div className="other-videos-grid">
                  {PLAYLIST.map((video, idx) => {
                    if (idx === activeVideoIndex) return null;
                    return (
                      <button 
                        key={video.id} 
                        className="other-video-card"
                        onClick={() => setActiveVideoIndex(idx)}
                      >
                        <div className="other-video-thumb">
                          <img src="/images/imagempequena.png" alt="" className="other-video-thumb-img" />
                          <div className="play-overlay">
                            <Video size={24} />
                          </div>
                          <span className="other-video-duration">{video.duration}</span>
                        </div>
                        <div className="other-video-info">
                          <h4>{video.title}</h4>
                          <p>{video.description.substring(0, 120)}...</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Links Hub Section (Canais Digitais) */}
        <section id="links" className="section section-alt">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Redes Digitais</span>
              <h2 className="section-title">Nossos <span>Canais Oficiais</span></h2>
              <p className="section-subtitle">
                Acompanhe o dia a dia, novidades, posicionamentos e entre em contato direto com a nossa equipe.
              </p>
            </div>
            
            <div className="hub-grid">
              {/* Digital linktree card */}
              <div className="link-card-container">
                <div className="lc-avatar-wrapper">
                  <div className="lc-avatar-glow" aria-hidden="true"></div>
                  <img 
                    src="/images/foto01.jpg" 
                    alt="Thenperson" 
                    className="lc-avatar"
                  />
                </div>
                
                <h3 className="lc-name">Thenperson</h3>
                <p className="lc-tagline">@thenperson</p>
                
                <div className="lc-links-list">
                  <a href="https://instagram.com/thenperson" target="_blank" rel="noopener noreferrer" className="lc-link-item">
                    <span className="lc-link-icon-name">
                      <Instagram className="lc-link-icon lc-link-icon-instagram" />
                      Instagram Oficial
                    </span>
                    <ExternalLink size={14} className="lc-arrow" />
                  </a>

                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="lc-link-item">
                    <span className="lc-link-icon-name">
                      <Facebook className="lc-link-icon lc-link-icon-facebook" />
                      Página no Facebook
                    </span>
                    <ExternalLink size={14} className="lc-arrow" />
                  </a>

                  <a href="https://www.youtube.com/@janeladovalepodcast" target="_blank" rel="noopener noreferrer" className="lc-link-item">
                    <span className="lc-link-icon-name">
                      <Youtube className="lc-link-icon lc-link-icon-youtube" />
                      Canal no YouTube
                    </span>
                    <ExternalLink size={14} className="lc-arrow" />
                  </a>

                  <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="lc-link-item">
                    <span className="lc-link-icon-name">
                      <Phone className="lc-link-icon lc-link-icon-whatsapp" />
                      WhatsApp de Campanha
                    </span>
                    <ExternalLink size={14} className="lc-arrow" />
                  </a>

                  <a href="https://goo.gl/maps/multicell-almenara" target="_blank" rel="noopener noreferrer" className="lc-link-item">
                    <span className="lc-link-icon-name">
                      <Smartphone className="lc-link-icon lc-link-icon-multicell" />
                      Visite a Multicell Almenara
                    </span>
                    <ExternalLink size={14} className="lc-arrow" />
                  </a>
                </div>
              </div>

              {/* Informative elements */}
              <div className="hub-details">
                <h3 className="hub-heading">Diálogo Aberto: O Vale com Voz e Vez</h3>
                <p className="hub-text">
                  Acreditamos em uma política construída de forma participativa, presente nos bairros e no comércio de Almenara e região. O uso das ferramentas digitais é nossa ponte para escutar, planejar e dar voz ao povo do Jequitinhonha. Escolha sua rede social favorita e participe da nossa caminhada.
                </p>
                <div style={{ marginTop: '10px' }}>
                  <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="btn-orange" style={{ width: 'fit-content' }}>
                    Faça Parte
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Biography Section - Contexto: Autoridade / Propostas (Azul Institucional predominante) */}
        <section id="biografia" className="section">
          <div className="container bio-grid">
            <div className="bio-images-grid">
              <div className="bio-img-wrapper bio-img-wrapper-tall">
                <img 
                  src="/images/foto01.jpg" 
                  alt="Thenperson em retrato oficial" 
                  className="bio-img"
                  loading="lazy"
                />
              </div>
              <div className="bio-img-wrapper">
                <img 
                  src="/images/fotovalecima.png" 
                  alt="Vale do Jequitinhonha ao amanhecer" 
                  className="bio-img"
                  loading="lazy"
                />
              </div>
              <div className="bio-img-wrapper">
                <img 
                  src="/images/foto02.png" 
                  alt="Thenperson com sua família" 
                  className="bio-img"
                  loading="lazy"
                />
              </div>
            </div>
            
            <div className="bio-content">
              <span className="section-tag">História e Valores</span>
              <h2>Quem é <span>Thenperson</span>?</h2>
              
              <blockquote className="bio-quote">
                "Nossas raízes definem nosso compromisso, e minha presença diária ao lado do nosso povo define minha luta."
              </blockquote>
              
              <div className="bio-paragraphs">
                <p>
                  <strong>Thenperson</strong> representa o espírito do novo Vale do Jequitinhonha — uma terra de cultura viva e pulsante, habitada por um povo amável, acolhedor e batalhador, que hoje se desperta para um futuro de grandeza. Enquanto políticos tradicionais só visitam Almenara de quatro em quatro anos em época eleitoral, Thenperson vive, trabalha e caminha em nossa cidade diariamente. Sua trajetória é construída com pé no chão e proximidade real com a nossa gente.
                </p>
                <p>
                  Como empresário e fundador da <strong>Multicell</strong>, a mais tradicional loja de celulares e acessórios de Almenara, ele conquistou espaço gerando empregos e apoiando o comércio local. Por trás do balcão, dialogando diretamente com a comunidade, ele conhece na pele a força empreendedora da região e os desafios do setor produtivo do Norte e Nordeste de Minas Gerais.
                </p>
                <p>
                  Homem de sólidos princípios cristãos e values morais firmes, ele preza pela união familiar, pela saúde preventiva e pelo incentivo ao esporte juvenil. Para ele, afastar a juventude das ruas através do esporte e estruturar a saúde de base são pilares inegociáveis para garantir o desenvolvimento e a dignidade humana a cada família.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Education Highlight Section - Contexto: Denúncias/Problemas (Azul Escuro Predominante + Detalhes em Terracota Escuro) */}
        <section id="educacao" className="section">
          <div className="container">
            <div className="video-grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
              <div className="main-video-wrapper">
                <img 
                  src="/images/estudantes.png" 
                  alt="Thenperson reunido com dezenas de estudantes locais" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
              <div className="hub-details">
                <span className="section-tag">Aliança Pela Educação</span>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '20px', fontWeight: 800 }}>
                  A Força da Nossa Juventude Contra o <span>Descaso Público</span>
                </h2>
                <p style={{ fontSize: '1.05rem', marginBottom: '16px' }}>
                  Almenara e região abrigam mentes brilhantes. Nossos jovens se destacam nacionalmente em Olimpíadas de Conhecimento e projetos de inovação, como os alunos do <strong>IFNMG (Instituto Federal do Norte de Minas Gerais)</strong>. No entanto, esses estudantes brilhantes sofrem diariamente com o descaso crônico do poder público tradicional: a falta de transporte escolar seguro, a precariedade da merenda e a escassez de apoio limitam o futuro de quem quer crescer.
                </p>
                <p style={{ fontSize: '1.05rem' }}>
                  Thenperson assumiu o compromisso de lutar por quem estuda. Ele tem se reunido com estudantes e educadores para estruturar propostas pelo subsídio do transporte intermunicipal, alimentação estudantil de qualidade e fomento à tecnologia. A juventude do Vale do Jequitinhonha merece respeito, infraestrutura e oportunidades reais para prosperar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Agenda Section */}
        <section id="agenda" className="section section-alt">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Presença Constante</span>
              <h2 className="section-title">Compromisso e <span>Presença</span></h2>
              <p className="section-subtitle">
                Acompanhe as datas de nossas reuniões de trabalho, visitas comunitárias e debates sobre as propostas para a nossa região.
              </p>
            </div>

            {loadingAgenda ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Carregando agenda...
              </div>
            ) : agenda.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Nenhum compromisso agendado para os próximos dias.
              </div>
            ) : (
              <div className="agenda-timeline">
                {agenda.map((item) => {
                  const [year, month, day] = item.date.split('-');
                  const formattedDate = `${day}/${month}/${year}`;
                  
                  return (
                    <div key={item.id} className="agenda-card">
                      <div className="agenda-marker" aria-hidden="true"></div>
                      <div className="agenda-header">
                        <div className="agenda-date-time">
                          <span className="agenda-date">{formattedDate}</span>
                          <span className="agenda-time">
                            <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
                            {item.time}h
                          </span>
                        </div>
                        <div className="agenda-location">
                          <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                          {item.location}
                        </div>
                      </div>
                      <h3 className="agenda-title">{item.title}</h3>
                      <p className="agenda-desc">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer - Contexto: Credibilidade / Rodapé (Azul credibilidade predominante) */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>THENPERSON</h3>
              <p>
                Uma nova liderança fundada no trabalho correto, em valores familiares e na saúde preventiva, pronta para defender e alavancar o desenvolvimento do Vale do Jequitinhonha.
              </p>
              <div className="footer-socials">
                <a href="https://instagram.com/thenperson" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="https://www.youtube.com/@janeladovalepodcast" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="YouTube">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
            
            <div className="footer-links-col">
              <h4>Navegação</h4>
              <ul>
                <li><a href="#inicio" className="footer-link">Início</a></li>
                <li><a href="#links" className="footer-link">Canais Digitais</a></li>
                <li><a href="#biografia" className="footer-link">Biografia</a></li>
                <li><a href="#agenda" className="footer-link">Agenda de Visitas</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Transparência</h4>
              <ul>
                <li><a href="#videos" className="footer-link">Galeria de Vídeos</a></li>
                <li><a href="https://www.tse.jus.br" target="_blank" rel="noopener noreferrer" className="footer-link">Legislação Eleitoral</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} Thenperson - Pré-Candidato a Deputado Federal. Todos os direitos reservados.
            </p>
            <p>
              Material informativo de pré-campanha em total conformidade com a legislação eleitoral vigente.
            </p>
          </div>
        </div>
      </footer>

      {/* Fullscreen Stories Card Popup Viewer (Gives smartphone mockup experience on desktop) */}
      {activeStoryIndex !== null && (
        <div 
          className="story-viewer"
          onTouchStart={() => setStoryPaused(true)}
          onTouchEnd={() => setStoryPaused(false)}
          onMouseDown={() => setStoryPaused(true)}
          onMouseUp={() => setStoryPaused(false)}
        >
          <div className="story-viewer-container">
            {/* Story header progress bars */}
            <div className="story-progress-container">
              {STORIES.map((_, idx) => (
                <div key={idx} className="story-progress-bar-bg">
                  <div 
                    className="story-progress-bar-fg" 
                    style={{ 
                      width: idx < activeStoryIndex ? '100%' : idx === activeStoryIndex ? `${storyProgress}%` : '0%' 
                    }}
                  ></div>
                </div>
              ))}
            </div>

            <div className="story-header-info">
              <div className="story-profile">
                <img src="/images/foto01.jpg" alt="" className="story-avatar" />
                <span className="story-username">thenperson</span>
              </div>
              <button className="story-close-btn" onClick={() => setActiveStoryIndex(null)} aria-label="Fechar Story">
                <X size={20} />
              </button>
            </div>

            {/* Tap areas to navigate */}
            <div className="story-tap-areas">
              <button className="story-tap-left" onClick={handlePrevStory} aria-label="Story anterior"></button>
              <button className="story-tap-right" onClick={handleNextStory} aria-label="Próximo story"></button>
            </div>

            <div className="story-card-body">
              <img src={STORIES[activeStoryIndex].image} alt="" className="story-image" />
              <div className="story-content-overlay">
                <h3 className="story-headline">{STORIES[activeStoryIndex].headline}</h3>
                <p className="story-text">{STORIES[activeStoryIndex].text}</p>
                <button 
                  className="story-cta-btn" 
                  onClick={() => handleStoryCTA(STORIES[activeStoryIndex].link)}
                >
                  <span>{STORIES[activeStoryIndex].actionLabel}</span>
                  <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}
          role="status"
        >
          <div className="toast-icon">
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          </div>
          <span className="toast-text">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
