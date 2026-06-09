import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Video, 
  Phone, 
  Mail, 
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
  Award, 
  TrendingUp, 
  Smartphone,
  Info
} from 'lucide-react';
import { db, isSupabaseConfigured } from './supabaseClient';
import type { AgendaItem, NewsItem } from './supabaseClient';


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
  },
  {
    id: '4',
    title: 'Janela do Vale | Projeto "IF na Rua" em Almenara - MG',
    duration: '0:58:30',
    youtubeId: 'WK4qRmjrCGw',
    description: 'Vídeo mostrando o projeto “IF na Rua”, iniciativa do Instituto Federal Campus Almenara que leva ações educativas, informação e serviços à comunidade, fortalecendo a integração entre instituição e população.'
  }
];

function App() {
  // Database States
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingAgenda, setLoadingAgenda] = useState<boolean>(true);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  
  // UI States
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showSbBanner, setShowSbBanner] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  
  // Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
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

  // Fetch Agenda and News on mount
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

      try {
        const newsData = await db.getNews();
        setNews(newsData);
        setLoadingNews(false);
      } catch (err) {
        console.error('Failed to load news', err);
        setLoadingNews(false);
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

  // Form Input Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form Submission Handler
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick validation
    if (!contactForm.name || !contactForm.message) {
      setToast({
        show: true,
        message: 'Por favor, preencha seu nome e a mensagem.',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await db.saveMessage(contactForm);
      if (response.success) {
        setToast({
          show: true,
          message: 'Mensagem enviada com sucesso! Thenperson agradece o seu contato.',
          type: 'success'
        });
        setContactForm({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        throw new Error(response.error || 'Erro desconhecido.');
      }
    } catch (err: any) {
      setToast({
        show: true,
        message: `Ocorreu um erro ao enviar: ${err.message || 'Tente novamente.'}`,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation Click Handler (handles mobile drawer closing)
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const activeVideo = PLAYLIST[activeVideoIndex];

  return (
    <>
      {/* Background Neon Glows */}
      <div className="bg-glow-container" aria-hidden="true">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      {/* Supabase Status Banner */}
      {showSbBanner && (
        <div className="sb-banner">
          <Info size={16} color="var(--color-accent)" />
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

          {/* Desktop Nav */}
          <nav className={`nav-menu ${mobileMenuOpen ? 'nav-menu-open' : ''}`} role="navigation">
            <a href="#inicio" className="nav-link" onClick={handleNavLinkClick}>Início</a>
            <a href="#links" className="nav-link" onClick={handleNavLinkClick}>Redes</a>
            <a href="#biografia" className="nav-link" onClick={handleNavLinkClick}>Biografia</a>
            <a href="#agenda" className="nav-link" onClick={handleNavLinkClick}>Agenda</a>
            <a href="#videos" className="nav-link" onClick={handleNavLinkClick}>Vídeos</a>
            <a href="#noticias" className="nav-link" onClick={handleNavLinkClick}>Notícias</a>
            <a href="#contato" className="btn-contact" onClick={handleNavLinkClick}>
              <MessageSquare size={16} />
              Participe
            </a>
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
                <a href="#contato" className="btn-primary">
                  Apoiar Pré-Campanha
                  <ArrowRight size={18} />
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
                  <span className="highlight-label">Vive e trabalha em Almenara</span>
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

              {/* Floating badges for design aesthetics */}
              <div className="floating-badge badge-left">
                <div className="floating-badge-icon">
                  <Heart />
                </div>
                <div className="floating-badge-text">
                  <h4>Saúde e Bem-estar</h4>
                  <p>Prevenção em Primeiro Lugar</p>
                </div>
              </div>

              <div className="floating-badge badge-right">
                <div className="floating-badge-icon">
                  <Smartphone />
                </div>
                <div className="floating-badge-text">
                  <h4>Dono da Multicell</h4>
                  <p>Inovação e Tecnologia</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Links Hub Section (Cartão de Redes Sociais) */}
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
              {/* Sleek digital linktree-style card */}
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

              {/* Informative elements next to card */}
              <div className="hub-details">
                <h3 className="hub-heading">Engajamento que Conecta e Transforma</h3>
                <p className="hub-text">
                  Acreditamos em uma política feita olho no olho e de portas abertas. O uso ético das redes sociais nos ajuda a ouvir as dores do Vale do Jequitinhonha em tempo real. Escolha sua plataforma favorita e junte-se ao nosso movimento!
                </p>
                
                <div className="values-grid">
                  <div className="value-card">
                    <div className="value-icon-box">
                      <Shield />
                    </div>
                    <h3>Valores e Ética</h3>
                    <p>Conduta correta, respeito à família e governança baseada em princípios transparentes.</p>
                  </div>

                  <div className="value-card">
                    <div className="value-icon-box">
                      <Heart />
                    </div>
                    <h3>Foco na Saúde</h3>
                    <p>Mais apoio ao esporte regional, lazer e infraestrutura de saúde humanizada.</p>
                  </div>

                  <div className="value-card">
                    <div className="value-icon-box">
                      <TrendingUp />
                    </div>
                    <h3>Desenvolvimento</h3>
                    <p>Qualificação profissional, fomento ao comércio varejista e atração de tecnologia.</p>
                  </div>

                  <div className="value-card">
                    <div className="value-icon-box">
                      <Award />
                    </div>
                    <h3>Compromisso</h3>
                    <p>Uma voz forte no Congresso Nacional lutando pela dignidade de todo o Vale.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Biography Section */}
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
                  <strong>Thenperson</strong> representa o espírito do novo Vale do Jequitinhonha — uma terra de cultura viva e pulsante, habitada por um povo amável, acolhedor e profundamente batalhador, que hoje se desperta para um futuro de grandeza. Enquanto políticos tradicionais vivem em gabinetes nas capitais e só visitam Almenara de quatro em quatro anos para pedir votos e fazer falsas promessas, Thenperson vive, trabalha e caminha em nossa cidade todos os dias. Sua pré-campanha é o marco dessas mudanças reais que sopram sobre a nossa região.
                </p>
                <p>
                  Como empresário e fundador da <strong>Multicell</strong>, a mais tradicional loja de celulares e acessórios de Almenara, ele construiu sua trajetória gerando empregos e ajudando no crescimento econômico local. Diariamente, por trás do balcão, Thenperson conversa diretamente com as famílias e comerciantes, conhecendo na pele a força do comércio de nossa região. Ele acredita que o Jequitinhonha não é uma região de escassez, mas uma potência adormecida, pronta para prosperar com ética e determinação.
                </p>
                <p>
                  Homem de sólidos princípios cristãos e valores morais firmes, ele preza ativamente pela saúde e pela união familiar. Para ele, apoiar projetos de saúde básica preventiva e incentivar a prática do esporte juvenil são pilares inegociáveis para afastar a juventude das ruas e promover o bem-estar de toda a comunidade.
                </p>
                <p>
                  Sua pré-candidatura a Deputado Federal é a força de Almenara tomando a frente contra a velha política tradicional. Chega de sermos representados por quem não vive o nosso dia a dia e só quer o voto do Vale em época de eleição. O Jequitinhonha está pronto para vencer, e Thenperson é a liderança presente e honesta que guiará essa transformação para um futuro grandioso.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Education Highlight Section */}
        <section id="educacao" className="section section-alt" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div className="video-grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
              <div className="main-video-wrapper" style={{ height: 'auto', aspectRatio: '16/10', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
                <img 
                  src="/images/estudantes.png" 
                  alt="Thenperson reunido com dezenas de estudantes locais" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="hub-details">
                <span className="section-tag">Aliança Pela Educação</span>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '20px', fontWeight: 800 }}>
                  A Força da Nossa Juventude Contra o <span>Descaso Público</span>
                </h2>
                <p style={{ fontSize: '1.05rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                  Almenara e região abrigam mentes brilhantes. Nossos jovens ganham prêmios importantes de conhecimento e se destacam nacionalmente, incluindo os alunos do <strong>IFNMG (Instituto Federal do Norte de Minas Gerais)</strong> e de escolas públicas. No entanto, esses estudantes brilhantes sofrem diariamente com o descaso crônico do poder público tradicional: a falta de transporte seguro, a insegurança alimentar e a escassez de recursos limitam o futuro de quem quer crescer.
                </p>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                  Thenperson assumiu o compromisso de lutar por quem estuda. Ele tem se reunido com dezenas de estudantes e professores para ouvir suas demandas e propor melhorias como alimentação estudantil digna, subsídio de transporte intermunicipal e fomento à qualificação tecnológica. A juventude de Almenara é a força motora da nossa mudança. Nossa cidade está se unindo contra a velha política para garantir um amanhã de respeito e grandeza a todos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Agenda Section */}
        <section id="agenda" className="section section-alt">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Compromissos</span>
              <h2 className="section-title">Agenda de <span>Visitas e Debates</span></h2>
              <p className="section-subtitle">
                Acompanhe onde o Thenperson estará nos próximos dias. Venha conversar, debater ideias e somar com a nossa causa!
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
                  // Format date nicely from YYYY-MM-DD
                  const [year, month, day] = item.date.split('-');
                  const formattedDate = `${day}/${month}/${year}`;
                  
                  return (
                    <div key={item.id} className="agenda-card">
                      <div className="agenda-marker" aria-hidden="true"></div>
                      <div className="agenda-header">
                        <div className="agenda-date-time">
                          <span className="agenda-date">{formattedDate}</span>
                          <span className="agenda-time">
                            <Calendar size={14} />
                            {item.time}h
                          </span>
                        </div>
                        <div className="agenda-location">
                          <MapPin size={14} />
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

        {/* Videos Section */}
        <section id="videos" className="section">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Galeria</span>
              <h2 className="section-title">Espaço de <span>Vídeos</span></h2>
              <p className="section-subtitle">
                Assista aos nossos vídeos explicativos, pronunciamentos de pré-campanha e saiba quais são as nossas propostas para o Vale.
              </p>
            </div>
            
            <div className="video-grid">
              {/* Main player component */}
              <div className="main-video-wrapper">
                {/* Embed YouTube dynamic player using the active video id */}
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
              
              {/* Playlist Selector */}
              <div className="video-playlist">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', paddingLeft: '4px' }}>Outros Vídeos</h3>
                {PLAYLIST.map((video, idx) => (
                  <button 
                    key={video.id} 
                    className={`playlist-item ${idx === activeVideoIndex ? 'playlist-item-active' : ''}`}
                    onClick={() => setActiveVideoIndex(idx)}
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit' }}
                  >
                    <div className="playlist-thumb" aria-hidden="true">
                      <img src="/images/fotovalecima.png" alt="" className="playlist-thumb-img" />
                      <Video size={20} />
                    </div>
                    <div className="playlist-info">
                      <h4>{video.title}</h4>
                      <p>{video.duration} • {video.description.substring(0, 50)}...</p>
                    </div>
                  </button>
                ))}

                {/* Details under active video */}
                <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: 'var(--color-accent)', marginBottom: '8px', fontSize: '0.95rem' }}>Em Destaque</h4>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{activeVideo.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{activeVideo.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="noticias" className="section section-alt">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Atualizações</span>
              <h2 className="section-title">Notícias e <span>Informativos</span></h2>
              <p className="section-subtitle">
                Fique por dentro das últimas novidades da nossa pré-campanha e das discussões sobre Almenara e o Vale do Jequitinhonha.
              </p>
            </div>
            
            {loadingNews ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Carregando notícias...
              </div>
            ) : news.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Nenhuma notícia publicada no momento.
              </div>
            ) : (
              <div className="news-grid">
                {news.map((item) => (
                  <article key={item.id} className="news-card">
                    <div className="news-img-box">
                      <span className="news-category">{item.category}</span>
                      <img 
                        src={item.image_url || '/images/fotovalebaixo.png'} 
                        alt={item.title} 
                        className="news-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="news-content">
                      <span className="news-date">{item.date}</span>
                      <h3 className="news-card-title">{item.title}</h3>
                      <p className="news-summary">{item.summary}</p>
                      <button 
                        onClick={() => setSelectedNews(item)}
                        className="news-readmore"
                        style={{ background: 'none', border: 'none', font: 'inherit', padding: 0 }}
                      >
                        Leia Mais
                        <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact / Message Section */}
        <section id="contato" className="section">
          <div className="container contact-grid">
            <div className="contact-info">
              <span className="section-tag">Fale Conosco</span>
              <h2 className="contact-info-title">Envie sua <span>Mensagem</span></h2>
              <p className="contact-info-desc">
                Quer dar uma sugestão para Almenara? Tem ideias para melhorar a saúde no Vale do Jequitinhonha? Quer declarar apoio ou fazer uma pergunta? Escreva para nós! O Thenperson e sua equipe lerão cada mensagem.
              </p>

              <div className="contact-image-wrapper" style={{ marginBottom: '24px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <img 
                  src="/images/foto05perfil.png" 
                  alt="Thenperson e suas informações de contato de pré-campanha" 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              
              <div className="contact-methods">
                <div className="contact-method-card">
                  <div className="contact-method-icon" aria-hidden="true">
                    <Phone />
                  </div>
                  <div className="contact-method-details">
                    <h4>WhatsApp Oficial</h4>
                    <p>(33) 99999-9999</p>
                  </div>
                </div>

                <div className="contact-method-card">
                  <div className="contact-method-icon" aria-hidden="true">
                    <Mail />
                  </div>
                  <div className="contact-method-details">
                    <h4>E-mail de Contato</h4>
                    <p>contato@thenperson.com.br</p>
                  </div>
                </div>

                <div className="contact-method-card">
                  <div className="contact-method-icon" aria-hidden="true">
                    <MapPin />
                  </div>
                  <div className="contact-method-details">
                    <h4>Multicell Almenara</h4>
                    <p>Rua Hermano Souza, 276 - Almenara, MG</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container">
              <form onSubmit={handleSubmitMessage} aria-label="Formulário de contato">
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Nome Completo *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={contactForm.name}
                      onChange={handleInputChange}
                      placeholder="Ex: João da Silva" 
                      className="form-input" 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Telefone / WhatsApp</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={contactForm.phone}
                      onChange={handleInputChange}
                      placeholder="Ex: (33) 99999-9999" 
                      className="form-input" 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Endereço de E-mail</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={contactForm.email}
                    onChange={handleInputChange}
                    placeholder="Ex: joao@email.com" 
                    className="form-input" 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Sua Mensagem *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={contactForm.message}
                    onChange={handleInputChange}
                    placeholder="Escreva suas propostas, dúvidas ou palavras de incentivo..." 
                    className="form-textarea" 
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem para Thenperson'}
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>THENPERSON</h3>
              <p>
                Uma nova liderança de ética, valores corretos e saúde preventiva, pronta para defender e desenvolver o Vale do Jequitinhonha no Congresso Nacional.
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
                <li><a href="#links" className="footer-link">Redes Digitais</a></li>
                <li><a href="#biografia" className="footer-link">Biografia</a></li>
                <li><a href="#agenda" className="footer-link">Agenda</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Políticas e Apoio</h4>
              <ul>
                <li><a href="#videos" className="footer-link">Galeria de Vídeos</a></li>
                <li><a href="#noticias" className="footer-link">Informativos</a></li>
                <li><a href="#contato" className="footer-link">Fale Conosco</a></li>
                <li><a href="https://www.tse.jus.br" target="_blank" rel="noopener noreferrer" className="footer-link">Legislação Eleitoral</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} Thenperson - Pré-Candidato a Deputado Federal. Todos os direitos reservados.
            </p>
            <p>
              Desenvolvido de forma ética. Material informativo de pré-campanha em conformidade com a legislação vigente.
            </p>
          </div>
        </div>
      </footer>

      {/* News Article Modal (Popup details) */}
      {selectedNews && (
        <div className="modal-overlay" onClick={() => setSelectedNews(null)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedNews(null)}
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>
            <div className="modal-img-wrapper">
              <img 
                src={selectedNews.image_url || '/images/fotovalebaixo.png'} 
                alt={selectedNews.title} 
                className="modal-img"
              />
            </div>
            <div className="modal-body">
              <div className="modal-header-meta">
                <span className="modal-category">{selectedNews.category}</span>
                <span className="modal-date">{selectedNews.date}</span>
              </div>
              <h3 className="modal-title">{selectedNews.title}</h3>
              <div className="modal-text">
                {selectedNews.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} style={{ marginBottom: '16px' }}>{paragraph}</p>
                ))}
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
    </>
  );
}

export default App;
