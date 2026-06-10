import { useState, useEffect } from 'react';
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
  Info,
  TrendingUp,
  Activity,
  BookOpen,
  MessageSquare,
  Award,
  ChevronRight,
  Clock,
  User,
  Check
} from 'lucide-react';
import { db, isSupabaseConfigured } from './supabaseClient';
import type { AgendaItem, NewsItem } from './supabaseClient';

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  youtubeId: string;
  description: string;
  category: string;
}

const PLAYLIST: VideoItem[] = [
  {
    id: '1',
    title: 'Janela do Vale | Entrevista com o Líder do Legislativo de Jordânia',
    duration: '1:34:10',
    youtubeId: 'NoyobbBU16Y',
    description: 'Entrevista com o líder do legislativo da Jordânia, abordando os desafios, oportunidades e aspectos culturais de ser jordaniense, além de reflexões sobre identidade, sociedade e desenvolvimento do Vale do Jequitinhonha.',
    category: 'Desenvolvimento Regional'
  },
  {
    id: '2',
    title: 'Janela do Vale | Projeto "Janela do Vale" no Instituto Federal',
    duration: '0:45:20',
    youtubeId: 'X3mGpVnPMHk',
    description: 'Apresentação do projeto “Janela do Vale” no Instituto Federal, destacando iniciativas voltadas à educação, inovação tecnológica e perspectivas para o futuro dos jovens do Vale.',
    category: 'Educação e Futuro'
  },
  {
    id: '3',
    title: 'Janela do Vale | Educação Inclusiva para Pessoas com Autismo',
    duration: '1:12:15',
    youtubeId: '1R3OHWWx1SE',
    description: 'Episódio profundo sobre educação inclusiva para pessoas com autismo, discutindo práticas pedagógicas nas escolas do Vale, inclusão de verdade, acessibilidade e apoio às famílias.',
    category: 'Inclusão Social'
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
    id: 'origens',
    title: 'Origens',
    image: '/images/foto02.png',
    headline: 'Minha Família, Minha Base',
    text: 'Nascido e criado em Almenara, Thenperson tem suas raízes firmadas no trabalho, na honestidade familiar e na vida comunitária.',
    link: '#biografia',
    actionLabel: 'Conhecer História'
  },
  {
    id: 'multicell',
    title: 'Emprego',
    image: '/images/foto01.jpg',
    headline: 'Empreendedorismo Real',
    text: 'Como comerciante e fundador da Multicell, Thenperson entende a importância de gerar empregos de verdade para Almenara e região.',
    link: '#compromissos',
    actionLabel: 'Ver Propostas'
  },
  {
    id: 'juventude',
    title: 'Juventude',
    image: '/images/estudantes.png',
    headline: 'Apoio aos Estudantes',
    text: 'Estudantes do IFNMG Almenara e outras escolas merecem suporte. Luta contínua por transporte intermunicipal seguro e alimentação decente.',
    link: '#educacao',
    actionLabel: 'Aliança Estudantil'
  },
  {
    id: 'saude',
    title: 'Saúde',
    image: '/images/foto04vale.png',
    headline: 'Saúde e Prevenção',
    text: 'Apoio à saúde básica preventiva e ao esporte infanto-juvenil como ferramentas essenciais para a qualidade de vida e futuro das famílias.',
    link: '#compromissos',
    actionLabel: 'Ver Pilares'
  },
  {
    id: 'podcast',
    title: 'Podcast',
    image: '/images/imagempequena.png',
    headline: 'Janela do Vale',
    text: 'O podcast que traz as vozes autênticas do nosso povo. Diálogos sobre os reais problemas e belezas de nossas cidades.',
    link: '#videos',
    actionLabel: 'Assista Agora'
  }
];

interface PillarDetail {
  title: string;
  description: string;
  points: string[];
}

const PILLARS_DETAILS: PillarDetail[] = [
  {
    title: 'Desenvolvimento Econômico & Comércio Local',
    description: 'Como comerciante e fundador da Multicell, Thenperson conhece as barreiras para empreender. Seu plano foca em criar um ecossistema favorável aos pequenos negócios regionais:',
    points: [
      'Luta por incentivos fiscais específicos para indústrias e empresas que se instalarem no Norte e Nordeste de Minas.',
      'Parcerias para capacitação de microempreendedores e facilitação de crédito regional.',
      'Defesa da redução da burocracia estadual e federal sobre o pequeno comércio varejista.',
      'Criação de feiras de negócios intermunicipais para escoar a produção artesanal e agrícola local.'
    ]
  },
  {
    title: 'Saúde Preventiva & Esporte Juvenil',
    description: 'A saúde de qualidade começa na prevenção. Thenperson defende que incentivar o esporte afasta jovens das ruas e melhora o bem-estar social:',
    points: [
      'Destinação de emendas para estruturar postos de saúde de base nas comunidades rurais e bairros carentes.',
      'Apoio e financiamento de projetos sociais de futebol, vôlei e esportes nas comunidades do Vale.',
      'Programas de check-up de saúde itinerantes para exames básicos preventivos nas cidades vizinhas.',
      'Construção e reforma de quadras poliesportivas em áreas de vulnerabilidade social.'
    ]
  },
  {
    title: 'Educação Técnica & Qualificação Tecnológica',
    description: 'Preparar a nossa juventude para os empregos do futuro é a maior arma de transformação social. Nossas propostas incluem:',
    points: [
      'Garantir o subsídio e a segurança no transporte intermunicipal dos estudantes do Instituto Federal (IFNMG) e universidades.',
      'Luta por merendas escolares nutritivas e de qualidade para as escolas públicas regionais.',
      'Fomento a laboratórios de informática e cursos gratuitos de programação, marketing digital e empreendedorismo.',
      'Parcerias com empresas de tecnologia nacionais para contratação remota de jovens qualificados no Vale.'
    ]
  }
];

function App() {
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
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  
  // UI States
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showSbBanner, setShowSbBanner] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activePillarIndex, setActivePillarIndex] = useState<number | null>(null);
  const [agendaFilter, setAgendaFilter] = useState<string>('todos');
  
  // Stories States
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [storyPaused, setStoryPaused] = useState<boolean>(false);

  // News Modal State
  const [activeNewsItem, setActiveNewsItem] = useState<NewsItem | null>(null);

  // Form State
  const [selectedInterest, setSelectedInterest] = useState<string>('Emprego e Desenvolvimento');
  const [formName, setFormName] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formMessage, setFormMessage] = useState<string>('');
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  
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

  // Scroll Progress Bar state
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      // Sticky header
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
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

  // Contact Form Submission Handler
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formMessage) {
      setToast({
        show: true,
        message: 'Por favor, preencha nome, WhatsApp e sua ideia.',
        type: 'error'
      });
      return;
    }

    setFormSubmitting(true);
    const fullMessageContent = `[Sugestão principal: ${selectedInterest}] - ${formMessage}`;
    const result = await db.saveMessage({
      name: formName,
      email: formEmail || 'nao-informado@thenperson.com.br',
      phone: formPhone,
      message: fullMessageContent
    });

    setFormSubmitting(false);

    if (result.success) {
      setToast({
        show: true,
        message: 'Ideia enviada com sucesso! Obrigado por somar na nossa caminhada.',
        type: 'success'
      });
      // Reset fields
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormMessage('');
    } else {
      setToast({
        show: true,
        message: result.error || 'Erro ao enviar a mensagem. Tente novamente.',
        type: 'error'
      });
    }
  };

  const activeVideo = PLAYLIST[activeVideoIndex];

  // Filter Agenda items based on selection
  const filteredAgenda = agenda.filter(item => {
    if (agendaFilter === 'todos') return true;
    if (agendaFilter === 'comercio') {
      return item.title.toLowerCase().includes('comerciante') || item.title.toLowerCase().includes('empresa') || item.location.toLowerCase().includes('cdl');
    }
    if (agendaFilter === 'reuniao') {
      return item.title.toLowerCase().includes('reunião') || item.title.toLowerCase().includes('encontro') || item.title.toLowerCase().includes('visita');
    }
    if (agendaFilter === 'plenaria') {
      return item.title.toLowerCase().includes('plenária') || item.title.toLowerCase().includes('câmara');
    }
    return true;
  });

  return (
    <div className={`app-wrapper device-${isMobile ? 'mobile' : 'desktop'}`}>
      
      {/* Scroll Progress Bar at the top */}
      <div 
        className="top-scroll-progress" 
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      ></div>

      {/* Background Glows */}
      <div className="bg-glow-container" aria-hidden="true">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
        <div className="bg-glow-3"></div>
      </div>

      {/* Supabase Status Banner */}
      {showSbBanner && (
        <div className="sb-banner">
          <div className="sb-banner-content">
            <Info size={16} />
            <span>
              {isSupabaseConfigured 
                ? 'Conexão ativa com o Supabase!' 
                : 'Rodando com simulador local de dados. Conecte ao Supabase inserindo as chaves no arquivo `.env`.'}
            </span>
          </div>
          <button 
            className="sb-banner-btn" 
            onClick={() => setShowSbBanner(false)}
            aria-label="Fechar aviso"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container header-container">
          <a href="#inicio" className="logo" aria-label="Thenperson Home">
            <Shield className="logo-icon" />
            <div className="logo-text">
              <span className="logo-title">THENPERSON</span>
              <span className="logo-subtitle">PRÉ-CANDIDATO</span>
            </div>
          </a>

          {/* Responsive Nav */}
          <nav className={`nav-menu ${mobileMenuOpen ? 'nav-menu-open' : ''}`} role="navigation">
            <a href="#inicio" className="nav-link" onClick={handleNavLinkClick}>Início</a>
            <a href="#compromissos" className="nav-link" onClick={handleNavLinkClick}>Pilares</a>
            <a href="#videos" className="nav-link" onClick={handleNavLinkClick}>Vídeos</a>
            <a href="#biografia" className="nav-link" onClick={handleNavLinkClick}>Trajetória</a>
            <a href="#noticias" className="nav-link" onClick={handleNavLinkClick}>Notícias</a>
            <a href="#agenda" className="nav-link" onClick={handleNavLinkClick}>Agenda</a>
            <a href="#sugestao" className="nav-link nav-link-special" onClick={handleNavLinkClick}>Deixe Sua Voz</a>
            <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="btn-cta-header" onClick={handleNavLinkClick}>
              Faça Parte
              <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </a>
          </nav>

          {/* Mobile menu toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Stories Tray Section */}
      <section className="stories-section">
        <div className="container">
          <div className="stories-tray-container">
            <h4 className="stories-tray-label">Destaques da Semana</h4>
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
        </div>
      </section>

      <main>
        {/* Hero Section */}
        <section id="inicio" className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-badge-dot" aria-hidden="true"></span>
                <span>Pré-candidato a Deputado Federal - MG</span>
              </div>
              
              <h1 className="hero-title">
                Liderança de palavra para defender o <span>Vale do Jequitinhonha</span>
              </h1>
              
              <p className="hero-description">
                Thenperson é comerciante local em Almenara, fundador da <strong>Multicell</strong>. Diferente de políticos tradicionais que só aparecem de quatro em quatro anos em época eleitoral, ele vive, trabalha e caminha diariamente com a comunidade.
              </p>
              
              <div className="hero-buttons">
                <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="btn-orange">
                  Apoiar Pré-Campanha
                  <ArrowRight size={18} />
                </a>
                <a href="#compromissos" className="btn-primary">
                  Nossas Bandeiras
                </a>
                <a href="#sugestao" className="btn-secondary">
                  Dar Sugestão
                </a>
              </div>
            </div>
            
            <div className="hero-image-wrapper">
              <div className="hero-image-glow" aria-hidden="true"></div>
              <div className="hero-image-frame">
                <img 
                  src="/images/thenperson_portrait.png" 
                  alt="Thenperson" 
                  className="hero-image"
                  loading="eager"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/foto01.jpg";
                  }}
                />
              </div>

              {/* Floating badges */}
              <div className="floating-badge badge-left scale-hover">
                <div className="floating-badge-icon badge-icon-blue">
                  <Activity size={18} />
                </div>
                <div className="floating-badge-text">
                  <h4>Saúde e Esporte</h4>
                  <p>Foco na Prevenção</p>
                </div>
              </div>

              <div className="floating-badge badge-right scale-hover">
                <div className="floating-badge-icon badge-icon-orange">
                  <Smartphone size={18} />
                </div>
                <div className="floating-badge-text">
                  <h4>Empreendedorismo</h4>
                  <p>Multicell Almenara</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Statistics Panel */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-bg">
                  <User size={24} className="stat-icon" />
                </div>
                <div className="stat-info">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Presente no Jequitinhonha</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-bg">
                  <Award size={24} className="stat-icon" />
                </div>
                <div className="stat-info">
                  <span className="stat-number">Multicell</span>
                  <span className="stat-label">Geração de Emprego Local</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-bg">
                  <Heart size={24} className="stat-icon" />
                </div>
                <div className="stat-info">
                  <span className="stat-number">Valores</span>
                  <span className="stat-label">Família e Princípios Cristãos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Campaign Pillars & Compromissos Section */}
        <section id="compromissos" className="section section-alt">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">A Força das Ideias</span>
              <h2 className="section-title">Nossos Pilares de <span>Mudança</span></h2>
              <p className="section-subtitle">
                Propostas sólidas construídas a partir das reais necessidades que ouvimos todos os dias na nossa região. Clique nos cartões para ler as propostas detalhadas.
              </p>
            </div>

            <div className="pillars-grid">
              {/* Pillar 1 */}
              <div 
                className={`pillar-card ${activePillarIndex === 0 ? 'pillar-card-active' : ''}`}
                onClick={() => setActivePillarIndex(activePillarIndex === 0 ? null : 0)}
              >
                <div className="pillar-header-group">
                  <div className="pillar-icon-wrapper">
                    <TrendingUp size={28} />
                  </div>
                  <h3>Desenvolvimento & Comércio</h3>
                </div>
                <p>
                  Estímulo para micro e pequenas empresas regionais, geração de emprego de verdade e incentivos fiscais para o Norte e Nordeste de Minas Gerais.
                </p>
                <button className="pillar-toggle-btn">
                  {activePillarIndex === 0 ? 'Ver menos' : 'Ver propostas completas'}
                  <ChevronRight size={16} className={`pillar-chevron ${activePillarIndex === 0 ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Pillar 2 */}
              <div 
                className={`pillar-card ${activePillarIndex === 1 ? 'pillar-card-active' : ''}`}
                onClick={() => setActivePillarIndex(activePillarIndex === 1 ? null : 1)}
              >
                <div className="pillar-header-group">
                  <div className="pillar-icon-wrapper">
                    <Activity size={28} />
                  </div>
                  <h3>Saúde Preventiva & Esporte</h3>
                </div>
                <p>
                  Apoio à saúde básica nas comunidades rurais, exames de rotina e projetos esportivos para guiar jovens por caminhos produtivos.
                </p>
                <button className="pillar-toggle-btn">
                  {activePillarIndex === 1 ? 'Ver menos' : 'Ver propostas completas'}
                  <ChevronRight size={16} className={`pillar-chevron ${activePillarIndex === 1 ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Pillar 3 */}
              <div 
                className={`pillar-card ${activePillarIndex === 2 ? 'pillar-card-active' : ''}`}
                onClick={() => setActivePillarIndex(activePillarIndex === 2 ? null : 2)}
              >
                <div className="pillar-header-group">
                  <div className="pillar-icon-wrapper">
                    <BookOpen size={28} />
                  </div>
                  <h3>Educação & Tecnologia</h3>
                </div>
                <p>
                  Valorização dos estudantes locais, segurança nos transportes escolares intermunicipais e inserção no mercado digital de trabalho.
                </p>
                <button className="pillar-toggle-btn">
                  {activePillarIndex === 2 ? 'Ver menos' : 'Ver propostas completas'}
                  <ChevronRight size={16} className={`pillar-chevron ${activePillarIndex === 2 ? 'rotate-90' : ''}`} />
                </button>
              </div>
            </div>

            {/* Expansible Detailed Pillars Drawer */}
            {activePillarIndex !== null && (
              <div className="pillar-details-drawer animate-slide-in">
                <div className="pillar-details-header">
                  <h4>{PILLARS_DETAILS[activePillarIndex].title}</h4>
                  <button className="pillar-details-close" onClick={(e) => { e.stopPropagation(); setActivePillarIndex(null); }}>
                    <X size={20} />
                  </button>
                </div>
                <div className="pillar-details-body">
                  <p className="pillar-intro-text">{PILLARS_DETAILS[activePillarIndex].description}</p>
                  <ul className="pillar-points-list">
                    {PILLARS_DETAILS[activePillarIndex].points.map((pt, i) => (
                      <li key={i} className="pillar-point-item">
                        <Check size={18} className="pillar-point-check" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pillar-drawer-cta">
                    <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="btn-orange">
                      Quero Apoiar Esta Proposta
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Masterclass Podcast Video Section */}
        <section id="videos" className="section">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Janela do Vale Podcast</span>
              <h2 className="section-title">A Voz das <span>Nossas Cidades</span></h2>
              <p className="section-subtitle">
                Assista a episódios fundamentais sobre o Vale do Jequitinhonha, debatendo desafios reais da saúde, inovação estudantil e histórias locais.
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
                  <div className="active-video-meta">
                    <span className="active-video-tag">{activeVideo.category}</span>
                    <span className="active-video-duration">
                      <Clock size={14} style={{ marginRight: '4px' }} />
                      {activeVideo.duration}
                    </span>
                  </div>
                  <h3 className="active-video-title">{activeVideo.title}</h3>
                  <p className="active-video-desc">{activeVideo.description}</p>
                </div>
              </div>
              
              {/* Playlist Selector */}
              <div className="other-videos-section">
                <h3 className="other-videos-heading">Outros Episódios</h3>
                <div className="other-videos-grid">
                  {PLAYLIST.map((video, idx) => (
                    <button 
                      key={video.id} 
                      className={`other-video-card ${idx === activeVideoIndex ? 'other-video-card-active' : ''}`}
                      onClick={() => setActiveVideoIndex(idx)}
                    >
                      <div className="other-video-thumb">
                        <img src="/images/imagempequena.png" alt="" className="other-video-thumb-img" />
                        <div className="play-overlay">
                          <Video size={20} />
                        </div>
                        <span className="other-video-duration">{video.duration}</span>
                      </div>
                      <div className="other-video-info">
                        <span className="other-video-tag-card">{video.category}</span>
                        <h4>{video.title}</h4>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Biography Section */}
        <section id="biografia" className="section section-alt">
          <div className="container bio-grid">
            <div className="bio-images-grid">
              <div className="bio-img-wrapper bio-img-wrapper-tall border-glow">
                <img 
                  src="/images/foto05perfil.png" 
                  alt="Thenperson em Almenara" 
                  className="bio-img"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/foto01.jpg";
                  }}
                />
              </div>
              <div className="bio-img-wrapper shadow-hover">
                <img 
                  src="/images/fotovalecima.png" 
                  alt="Paisagem Jequitinhonha" 
                  className="bio-img"
                  loading="lazy"
                />
              </div>
              <div className="bio-img-wrapper shadow-hover">
                <img 
                  src="/images/foto02.png" 
                  alt="Família Thenperson" 
                  className="bio-img"
                  loading="lazy"
                />
              </div>
            </div>
            
            <div className="bio-content">
              <span className="section-tag">Origens e Trajetória</span>
              <h2>Quem é <span>Thenperson</span>?</h2>
              
              <blockquote className="bio-quote">
                "O Vale não precisa de políticos que aparecem a cada quatro anos com promessas vazias. Precisamos de presença diária, trabalho real e valores sólidos."
              </blockquote>
              
              <div className="bio-paragraphs">
                <p>
                  <strong>Thenperson</strong> representa as raízes honestas e batalhadoras do Vale do Jequitinhonha. Nascido, criado e estabelecido em Almenara, MG, ele é reconhecido na comunidade pelo seu trabalho sério de mais de uma década como comerciante local, sendo o fundador da tradicional loja <strong>Multicell Almenara</strong>.
                </p>
                <p>
                  Seu compromisso com a região não vem de teorias de gabinete, mas da vivência diária. Por trás do balcão e no comércio local, Thenperson conhece as dificuldades do setor produtivo, a necessidade de capacitação para a juventude e a luta das famílias brasileiras por dignidade.
                </p>
                <p>
                  Homem de firmes <strong>valores familiares e princípios cristãos</strong>, ele enxerga o esporte infanto-juvenil e a saúde básica como os principais eixos de blindagem social e desenvolvimento do Vale. Com honestidade, proximidade real com o povo e espírito de trabalho, ele propõe uma caminhada de renovação séria.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Education Highlight (Public Neglect Protest Section) */}
        <section id="educacao" className="section section-dark-accent">
          <div className="container">
            <div className="protest-grid">
              <div className="protest-image-wrapper">
                <img 
                  src="/images/estudantes.png" 
                  alt="Thenperson e estudantes do Vale" 
                  className="protest-image"
                />
              </div>
              <div className="protest-content">
                <span className="section-tag tag-on-dark">Aliança Pela Educação</span>
                <h2>A Garra da Juventude Contra o <span>Descaso Público</span></h2>
                <p>
                  Almenara abriga jovens talentosos que conquistam premiações nacionais no <strong>IFNMG (Instituto Federal do Norte de Minas Gerais)</strong>. No entanto, esses estudantes brilhantes enfrentam no dia a dia a falta crônica de infraestrutura: transporte escolar rural precário, falta de subsídio intermunicipal e merendas deficientes.
                </p>
                <p>
                  Thenperson apoia e se une à voz dos estudantes por respeito e suporte digno. Mais que um dever do governo, garantir transporte seguro e alimentação escolar de qualidade é preservar as mentes que desenharão o futuro do nosso Vale do Jequitinhonha.
                </p>
                <div style={{ marginTop: '20px' }}>
                  <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="btn-orange">
                    Apoiar Nossos Estudantes
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News / Notícias do Vale Section */}
        <section id="noticias" className="section">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Acontece no Vale</span>
              <h2 className="section-title">Últimas <span>Notícias</span></h2>
              <p className="section-subtitle">
                Acompanhe os nossos posicionamentos, discussões públicas e artigos informativos sobre o futuro das nossas cidades.
              </p>
            </div>

            {loadingNews ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Buscando artigos do Vale...
              </div>
            ) : news.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Nenhuma novidade publicada recentemente.
              </div>
            ) : (
              <div className="news-grid">
                {news.map((item) => (
                  <article key={item.id} className="news-card">
                    <div className="news-card-img-wrapper">
                      <img src={item.image_url} alt={item.title} className="news-card-img" />
                      <span className="news-card-category">{item.category}</span>
                    </div>
                    <div className="news-card-content">
                      <span className="news-card-date">{item.date}</span>
                      <h3 className="news-card-title">{item.title}</h3>
                      <p className="news-card-summary">{item.summary}</p>
                      <button 
                        className="btn-read-news"
                        onClick={() => setActiveNewsItem(item)}
                      >
                        Ler Matéria Completa
                        <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Interactive Event Agenda Section */}
        <section id="agenda" className="section section-alt">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Sempre nas Ruas</span>
              <h2 className="section-title">Nossa Agenda de <span>Presença</span></h2>
              <p className="section-subtitle">
                Confira os locais que estamos visitando, reuniões públicas e debates sobre o Vale do Jequitinhonha.
              </p>
            </div>

            {/* Agenda Filtering Tabs */}
            <div className="agenda-tabs">
              <button 
                className={`agenda-tab-btn ${agendaFilter === 'todos' ? 'active' : ''}`}
                onClick={() => setAgendaFilter('todos')}
              >
                Todos Compromissos
              </button>
              <button 
                className={`agenda-tab-btn ${agendaFilter === 'comercio' ? 'active' : ''}`}
                onClick={() => setAgendaFilter('comercio')}
              >
                Comércio & Empresas
              </button>
              <button 
                className={`agenda-tab-btn ${agendaFilter === 'reuniao' ? 'active' : ''}`}
                onClick={() => setAgendaFilter('reuniao')}
              >
                Associações & Visitas
              </button>
              <button 
                className={`agenda-tab-btn ${agendaFilter === 'plenaria' ? 'active' : ''}`}
                onClick={() => setAgendaFilter('plenaria')}
              >
                Plenárias Cívicas
              </button>
            </div>

            {loadingAgenda ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Carregando calendário de visitas...
              </div>
            ) : filteredAgenda.length === 0 ? (
              <div className="agenda-empty-state">
                <Calendar size={48} className="agenda-empty-icon" />
                <p>Nenhum compromisso correspondente na agenda. Que tal sugerir uma visita?</p>
                <a href="#sugestao" className="btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>Sugerir Visita</a>
              </div>
            ) : (
              <div className="agenda-timeline">
                {filteredAgenda.map((item) => {
                  const [year, month, day] = item.date.split('-');
                  const formattedDate = `${day}/${month}/${year}`;
                  
                  return (
                    <div key={item.id} className="agenda-card scale-hover">
                      <div className="agenda-marker" aria-hidden="true"></div>
                      <div className="agenda-header">
                        <div className="agenda-date-time">
                          <span className="agenda-date">{formattedDate}</span>
                          <span className="agenda-time">
                            <Clock size={14} style={{ marginRight: '4px', color: 'var(--color-primary)' }} />
                            {item.time}h
                          </span>
                        </div>
                        <div className="agenda-location">
                          <MapPin size={14} style={{ marginRight: '4px', color: 'var(--color-primary)' }} />
                          {item.location}
                        </div>
                      </div>
                      <h3 className="agenda-title">{item.title}</h3>
                      <p className="agenda-desc">{item.description}</p>
                      <div className="agenda-footer-card">
                        <a 
                          href={`https://wa.me/5533999999999?text=Ol%C3%A1%20Thenperson%2C%20gostaria%20de%20confirmar%20presen%C3%A7a%20no%20evento%20${encodeURIComponent(item.title)}%20dia%20${formattedDate}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="agenda-confirm-btn"
                        >
                          Confirmar Presença no WhatsApp
                          <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Suggestion Box & Contact Form ("Deixe Sua Voz") */}
        <section id="sugestao" className="section">
          <div className="container suggestion-form-container">
            <div className="suggestion-grid">
              
              <div className="suggestion-info">
                <span className="section-tag">Participação Ativa</span>
                <h2>Deixe sua sugestão para um <span>Vale Forte</span></h2>
                <p className="suggestion-desc-text">
                  Nossa caminhada é construída com ideias e propostas coletivas. Qual é o principal problema da sua cidade ou o que você sonha ver realizado no Jequitinhonha? Deixe sua contribuição abaixo:
                </p>

                <div className="interest-selector-title">Selecione sua bandeira principal:</div>
                <div className="interest-selector-grid">
                  {[
                    'Emprego e Desenvolvimento',
                    'Saúde Básica e Prevenção',
                    'Esporte e Apoio à Juventude',
                    'Melhorias no IFNMG e Educação'
                  ].map((interest) => (
                    <button 
                      key={interest}
                      type="button"
                      className={`interest-tag-btn ${selectedInterest === interest ? 'active' : ''}`}
                      onClick={() => setSelectedInterest(interest)}
                    >
                      {selectedInterest === interest && <Check size={14} style={{ marginRight: '4px' }} />}
                      {interest}
                    </button>
                  ))}
                </div>

                <div className="suggestion-quote-card">
                  <MessageSquare className="suggestion-quote-icon" />
                  <p className="suggestion-quote-text">
                    "A política de verdade ouve antes de falar. Cada ideia que você envia aqui ajuda a montar propostas reais para o Congresso."
                  </p>
                </div>
              </div>

              <div className="suggestion-form-box">
                <h3 className="form-box-title">Formulário de Apoio & Ideias</h3>
                <form onSubmit={handleSubmitMessage} className="modern-form">
                  <div className="form-group">
                    <label htmlFor="name">Nome Completo *</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="Ex: Maria José Souza"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">WhatsApp com DDD *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        placeholder="Ex: (33) 99999-9999"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">E-mail (opcional)</label>
                      <input 
                        type="email" 
                        id="email" 
                        placeholder="Ex: seuemail@provedor.com"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Qual é a sua proposta ou sugestão para o Vale? *</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      placeholder="Descreva o problema do seu bairro, sua sugestão de melhoria ou mande seu apoio para Thenperson..."
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-submit-form"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? 'Enviando ideia...' : 'Enviar Minha Sugestão'}
                    <ArrowRight size={18} style={{ marginLeft: '6px' }} />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* Digital Hub channels */}
        <section id="links" className="section section-alt">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Conectados Sempre</span>
              <h2 className="section-title">Nossos Canais <span>Digitais</span></h2>
              <p className="section-subtitle">
                Acompanhe os nossos posicionamentos diários no Instagram, debata no Facebook, assista aos vídeos e fale diretamente conosco.
              </p>
            </div>

            <div className="hub-grid">
              
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
                      Canal do YouTube
                    </span>
                    <ExternalLink size={14} className="lc-arrow" />
                  </a>

                  <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="lc-link-item">
                    <span className="lc-link-icon-name">
                      <Phone className="lc-link-icon lc-link-icon-whatsapp" />
                      WhatsApp Direto
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

              <div className="hub-details">
                <h3 className="hub-heading">Diálogo Aberto e Transparente</h3>
                <p className="hub-text">
                  Acreditamos em uma política moderna, pautada na verdade e no contato direto. Através das nossas redes sociais compartilhamos propostas de fiscalização, reuniões públicas e relatos sobre as cidades de Almenara, Jordânia, Jacinto, Salto da Divisa, Bandeira e todo o Vale. Escolha seu canal preferido e venha participar!
                </p>
                <div style={{ marginTop: '24px' }}>
                  <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="btn-orange">
                    Entrar no Grupo de Apoio
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>

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
                Uma pré-candidatura independente, pautada em valores cristãos, defesa do comércio varejista, saúde preventiva e segurança de transporte para a nossa juventude do Vale do Jequitinhonha.
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
                <li><a href="#compromissos" className="footer-link">Pilares & Bandeiras</a></li>
                <li><a href="#videos" className="footer-link">Vídeos e Podcast</a></li>
                <li><a href="#biografia" className="footer-link">Quem é Thenperson</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Engajamento</h4>
              <ul>
                <li><a href="#noticias" className="footer-link">Últimas Notícias</a></li>
                <li><a href="#agenda" className="footer-link">Agenda de Eventos</a></li>
                <li><a href="#sugestao" className="footer-link">Deixar Sugestão</a></li>
                <li><a href="https://www.tse.jus.br" target="_blank" rel="noopener noreferrer" className="footer-link">Legislação Eleitoral</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} Thenperson - Pré-Candidato a Deputado Federal. Todos os direitos reservados.
            </p>
            <p className="footer-disclaimer">
              Material informativo de pré-campanha política produzido em total conformidade com a Lei Federal nº 9.504/1997 e orientações do TSE.
            </p>
          </div>
        </div>
      </footer>

      {/* Fullscreen Stories Card Popup Viewer */}
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

      {/* Fullscreen News Reader Modal */}
      {activeNewsItem !== null && (
        <div className="news-modal-overlay" onClick={() => setActiveNewsItem(null)}>
          <div className="news-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="news-modal-header">
              <span className="news-modal-category">{activeNewsItem.category}</span>
              <button 
                className="news-modal-close-btn" 
                onClick={() => setActiveNewsItem(null)}
                aria-label="Fechar artigo"
              >
                <X size={24} />
              </button>
            </div>
            <div className="news-modal-scroll-body">
              <div className="news-modal-image-wrapper">
                <img src={activeNewsItem.image_url} alt="" className="news-modal-img" />
              </div>
              <div className="news-modal-content-details">
                <span className="news-modal-date">{activeNewsItem.date}</span>
                <h1 className="news-modal-title">{activeNewsItem.title}</h1>
                <p className="news-modal-summary-italic">"{activeNewsItem.summary}"</p>
                <div className="news-modal-text-paragraphs">
                  {activeNewsItem.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="news-modal-footer">
                <h4>Ficou com alguma dúvida ou quer debater essa pauta?</h4>
                <p>Mande sua mensagem e colabore com as propostas do Vale.</p>
                <div className="news-modal-footer-buttons">
                  <a 
                    href={`https://wa.me/5533999999999?text=Ol%C3%A1%20Thenperson%2C%20li%20a%20mat%C3%A9ria%20"${encodeURIComponent(activeNewsItem.title)}"%20e%20gostaria%20de%20conversar%20sobre.`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-orange"
                  >
                    Conversar sobre este tema
                    <Phone size={16} style={{ marginLeft: '6px' }} />
                  </a>
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      const element = document.getElementById('sugestao');
                      setActiveNewsItem(null);
                      if (element) {
                        setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                      }
                    }}
                  >
                    Deixar uma sugestão
                  </button>
                </div>
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
