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
  Check,
  Send,
  Bookmark
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

interface MagazineArticle {
  id: string;
  category: string;
  title: string;
  date: string;
  summary: string;
  image: string;
  content: string;
}

const MAGAZINE_ARTICLES: MagazineArticle[] = [
  {
    id: 'art-1',
    category: 'Educação & Inovação',
    title: 'Mentes do Vale: Estudantes do IFNMG conquistam destaque nacional',
    date: '09 de Junho, 2026',
    summary: 'Alunos de Almenara desenvolvem soluções tecnológicas inovadoras, provando que o talento da nossa juventude só precisa de infraestrutura e apoio para decolar.',
    image: '/images/estudantes.png',
    content: 'O Vale do Jequitinhonha abriga algumas das mentes mais brilhantes de Minas Gerais. Recentemente, um grupo de estudantes do Instituto Federal do Norte de Minas (IFNMG - Campus Almenara) conquistou premiação de destaque em uma feira nacional de tecnologia.\n\nContudo, a jornada desses estudantes expõe o descaso público crônico: transporte escolar precário e falta de subsídio para alimentação quase impediram a participação do grupo. \n\nThenperson, que acompanha de perto a realidade dos alunos, defende que a qualificação tecnológica é a principal ponte para empregos modernos: "Não basta os jovens serem brilhantes, o poder público precisa dar o suporte básico para que eles não tenham que desistir de estudar por falta de um ônibus seguro ou merenda de qualidade".'
  },
  {
    id: 'art-2',
    category: 'Cultura & Barro',
    title: 'Mulheres de Argila: A arte das paneleiras que sustenta famílias no Vale',
    date: '07 de Junho, 2026',
    summary: 'Moldando a identidade do Jequitinhonha com as próprias mãos, artesãs de Almenara e arredores geram renda e mantêm viva a tradição da cerâmica.',
    image: '/images/fotovalecima.png',
    content: 'O barro moldado à mão pelas artesãs do Vale do Jequitinhonha é reconhecido internacionalmente pela beleza e identidade única. Em Almenara, a produção de cerâmica e panelas de argila vai além da arte: é o sustento de dezenas de lares.\n\nApesar da importância cultural e econômica, as artesãs locais enfrentam enormes dificuldades para comercializar suas peças fora do Vale, esbarrando na falta de apoio logístico e taxas tributárias abusivas. \n\nThenperson defende a criação de uma cooperativa estruturada com incentivos fiscais para escoamento do artesanato: "Nossa cultura é nossa maior riqueza e orgulho. O governo precisa facilitar as vendas e desburocratizar a vida dessas mulheres guerreiras".'
  },
  {
    id: 'art-3',
    category: 'Agricultura & Água',
    title: 'Cisternas de Placas: A luta da agricultura familiar no combate à seca',
    date: '04 de Junho, 2026',
    summary: 'Produtores rurais debatem estratégias de convivência com o semiárido e a importância do Pronaf para pequenas lavouras de Almenara e Jordânia.',
    image: '/images/fotovalebaixo.png',
    content: 'A convivência com o clima semiárido é o desafio diário dos agricultores do Vale do Jequitinhonha. A implementação de cisternas de placas e poços artesianos comunitários é vital para a sobrevivência das pequenas plantações que abastecem as feiras locais.\n\nDurante encontros com associações de produtores rurais em Almenara, Jacinto e Jordânia, as famílias relataram a complexidade burocrática para conseguir crédito agrícola pelo Pronaf (Programa Nacional de Fortalecimento da Agricultura Familiar).\n\n"A agricultura familiar põe comida na mesa de Almenara. Precisamos de assistência técnica eficiente da Emater, poços artesianos que funcionem e crédito simplificado, sem papelada sem fim que assusta o produtor", pontua Thenperson.'
  }
];

interface CitizenService {
  id: string;
  title: string;
  badge: string;
  badgeType: 'estudante' | 'familia' | 'produtor';
  shortDesc: string;
  howToApply: string;
  documents: string[];
  link: string;
}

const CITIZEN_SERVICES: CitizenService[] = [
  {
    id: 'serv-pe-de-meia',
    title: 'Poupança Estudantil - Programa Pé-de-Meia',
    badge: 'Estudantes',
    badgeType: 'estudante',
    shortDesc: 'Incentivo financeiro-educacional, na modalidade de poupança, destinado a estudantes do ensino médio público.',
    howToApply: 'A seleção é realizada automaticamente cruzando dados de matrícula escolar pública com o Cadastro Único (CadÚnico). As escolas enviam os dados diretamente ao Ministério da Educação. Certifique-se de que o CPF do estudante está regularizado.',
    documents: [
      'CPF regularizado do estudante (obrigatório)',
      'Inscrição ativa e atualizada no CadÚnico',
      'Matrícula ativa no Ensino Médio público',
      'Frequência escolar mínima de 80% registrada mensalmente'
    ],
    link: 'https://www.gov.br/mec/pt-br/pe-de-meia'
  },
  {
    id: 'serv-cadunico',
    title: 'Inscrição e Atualização do Cadastro Único (CadÚnico)',
    badge: 'Famílias',
    badgeType: 'familia',
    shortDesc: 'Acesso a programas federais como Bolsa Família, Tarifa Social de Energia Elétrica e isenção de taxas em concursos.',
    howToApply: 'Agende um atendimento no CRAS (Centro de Referência de Assistência Social) de Almenara ou procure a sede municipal do Cadastro Único. O cadastro deve ser atualizado obrigatoriamente a cada 2 anos.',
    documents: [
      'Documento com foto (RG) e CPF do Responsável Familiar',
      'Comprovante de residência atualizado (preferência conta de água ou luz)',
      'Documento de identificação de todos que moram na casa (RG, CPF ou Certidão)',
      'Comprovante de matrícula escolar recente das crianças e adolescentes'
    ],
    link: 'https://www.gov.br/mds/pt-br/acoes-e-programas/cadastro-unico'
  },
  {
    id: 'serv-pronaf',
    title: 'Crédito Pronaf para Pequenos Agricultores',
    badge: 'Produtores Rurais',
    badgeType: 'produtor',
    shortDesc: 'Financiamento com juros subsidiados para custeio de lavouras e investimentos na propriedade rural.',
    howToApply: 'Dirija-se ao escritório local da Emater-MG em Almenara para emissão do CAF (Cadastro Nacional da Agricultura Familiar) e desenvolvimento do projeto técnico de crédito para apresentação no banco.',
    documents: [
      'CAF (Cadastro Nacional da Agricultura Familiar) ativo',
      'Documento de identidade (RG) e CPF do produtor e do cônjuge',
      'Documento de propriedade da terra ou contrato de arrendamento/parceria',
      'Projeto técnico de viabilidade financeira (elaborado pela Emater)'
    ],
    link: 'https://www.gov.br/agricultura/pt-br/assuntos/mda/pronaf'
  }
];

interface YoutubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  category: string;
}

const REGIONAL_VIDEOS: YoutubeVideo[] = [
  {
    id: 'v1',
    youtubeId: 'NoyobbBU16Y',
    title: 'Entrevista sobre Gestão, Comércio e Desafios de Almenara e Região',
    category: 'Gestão e Comércio'
  },
  {
    id: 'v2',
    youtubeId: 'X3mGpVnPMHk',
    title: 'Visita de Apoio e Diálogo com Estudantes do IFNMG Almenara',
    category: 'Educação Técnica'
  },
  {
    id: 'v3',
    youtubeId: '1R3OHWWx1SE',
    title: 'Painel sobre Inclusão Social e Educação para Pessoas com Autismo',
    category: 'Ação Social'
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
  
  // UI States
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showSbBanner, setShowSbBanner] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activePillarIndex, setActivePillarIndex] = useState<number | null>(null);
  const [agendaFilter, setAgendaFilter] = useState<string>('todos');
  
  // Revista / Magazine States
  const [activeRevistaTab, setActiveRevistaTab] = useState<string>('videos');
  const [selectedArticle, setSelectedArticle] = useState<MagazineArticle | null>(null);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  


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
            <a href="#videos" className="nav-link" onClick={handleNavLinkClick}>Vídeos</a>
            <a href="#biografia" className="nav-link" onClick={handleNavLinkClick}>Trajetória</a>
            <a href="#revista" className="nav-link" onClick={handleNavLinkClick}>Revista & Serviços</a>
            <a href="#agenda" className="nav-link" onClick={handleNavLinkClick}>Agenda</a>
            <a href="#sugestao" className="nav-link nav-link-special" onClick={handleNavLinkClick}>Deixe Sua Voz</a>
            <a href="#compromissos" className="nav-link" onClick={handleNavLinkClick}>Pilares</a>
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



      <main>
        {/* YouTube Channel Hub Header (Hero) */}
        <section id="inicio" className="channel-hub-header">
          <div className="channel-banner-container">
            <img 
              src="/images/fotovalecima.png" 
              alt="Thenperson no Vale do Jequitinhonha" 
              className="channel-banner-img" 
            />
            <div className="channel-banner-overlay"></div>
          </div>
          
          <div className="container">
            <div className="channel-profile-area">
              <div className="channel-avatar-wrapper">
                <img 
                  src="/images/foto01.jpg" 
                  alt="Thenperson" 
                  className="channel-avatar-img" 
                />
                <div className="channel-avatar-ring"></div>
              </div>
              
              <div className="channel-info-block">
                <div className="channel-badge">
                  <Shield size={14} style={{ marginRight: '6px', color: 'var(--color-laranja)' }} />
                  <span>Pré-candidato a Deputado Federal</span>
                </div>
                
                <h1 className="channel-title">Thenperson</h1>
                
                <div className="channel-meta-row">
                  <span className="channel-handle">@thenperson</span>
                  <span className="channel-dot">•</span>
                  <span className="channel-stat">Almenara - MG</span>
                  <span className="channel-dot">•</span>
                  <span className="channel-stat">Fundador da Multicell</span>
                  <span className="channel-dot">•</span>
                  <span className="channel-stat-badge">100% Presente</span>
                </div>
                
                <p className="channel-description">
                  Comerciante local de Almenara, pautado no trabalho sério, na defesa dos valores cristãos, da saúde preventiva e do incentivo ao esporte juvenil. Uma liderança real que caminha diariamente ao lado de nossa gente.
                </p>
                
                <div className="channel-actions-row">
                  <div className="channel-buttons">
                    <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="btn-orange">
                      Apoiar Pré-Campanha
                      <ArrowRight size={16} />
                    </a>
                    <a href="#revista" className="btn-primary">
                      Revista & Serviços
                    </a>
                    <a href="#sugestao" className="btn-secondary">
                      Dar Sugestão
                    </a>
                  </div>
                  
                  <div className="channel-social-links">
                    <a href="https://instagram.com/thenperson" target="_blank" rel="noopener noreferrer" className="channel-social-btn" title="Instagram">
                      <Instagram size={18} />
                    </a>
                    <a href="https://www.youtube.com/@janeladovalepodcast" target="_blank" rel="noopener noreferrer" className="channel-social-btn" title="YouTube">
                      <Youtube size={18} />
                    </a>
                    <a href="https://wa.me/5533999999999" target="_blank" rel="noopener noreferrer" className="channel-social-btn" title="WhatsApp Direct">
                      <Phone size={18} />
                    </a>
                  </div>
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
            <div className="bio-instagram-stack">
              {/* Instagram Card 1 (Now standard-post) */}
              <a 
                href="https://instagram.com/thenperson" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="instagram-bio-card standard-post border-glow"
              >
                <div className="instagram-card-header">
                  <img src="/images/foto01.jpg" alt="" className="instagram-avatar-tiny" />
                  <div className="instagram-header-info">
                    <span className="instagram-username">
                      thenperson
                      <Shield size={10} style={{ fill: 'var(--color-azul)', stroke: 'var(--color-azul)', marginLeft: '2px' }} />
                    </span>
                    <span className="instagram-location">Almenara, MG</span>
                  </div>
                  <span className="instagram-dots">•••</span>
                </div>
                <div className="instagram-card-img-wrapper standard">
                  <img 
                    src="/images/foto05perfil.png" 
                    alt="Thenperson em Almenara" 
                    className="instagram-card-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/foto01.jpg";
                    }}
                  />
                </div>
                <div className="instagram-card-actions">
                  <div className="instagram-actions-left">
                    <Heart size={16} className="instagram-action-icon" />
                    <MessageSquare size={16} className="instagram-action-icon" />
                    <Send size={16} className="instagram-action-icon" />
                  </div>
                  <Bookmark size={16} className="instagram-action-icon" />
                </div>
                <div className="instagram-card-caption">
                  <p><strong>thenperson</strong> Caminhando pelo Vale, ouvindo as reais necessidades da nossa gente e debatendo soluções concretas para o futuro de Minas Gerais. 🇧🇷🙌</p>
                  <span className="instagram-cta-link">
                    Ver no Instagram <ArrowRight size={10} />
                  </span>
                </div>
              </a>

              {/* Instagram Card 2 (Now standard-post) */}
              <a 
                href="https://instagram.com/thenperson" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="instagram-bio-card standard-post shadow-hover"
              >
                <div className="instagram-card-header">
                  <img src="/images/foto01.jpg" alt="" className="instagram-avatar-tiny" />
                  <div className="instagram-header-info">
                    <span className="instagram-username">
                      thenperson
                      <Shield size={10} style={{ fill: 'var(--color-azul)', stroke: 'var(--color-azul)', marginLeft: '2px' }} />
                    </span>
                    <span className="instagram-location">Família</span>
                  </div>
                  <span className="instagram-dots">•••</span>
                </div>
                <div className="instagram-card-img-wrapper standard">
                  <img 
                    src="/images/foto02.png" 
                    alt="Família Thenperson" 
                    className="instagram-card-img"
                    loading="lazy"
                  />
                </div>
                <div className="instagram-card-actions">
                  <div className="instagram-actions-left">
                    <Heart size={16} className="instagram-action-icon" />
                    <MessageSquare size={16} className="instagram-action-icon" />
                    <Send size={16} className="instagram-action-icon" />
                  </div>
                  <Bookmark size={16} className="instagram-action-icon" />
                </div>
                <div className="instagram-card-caption">
                  <p><strong>thenperson</strong> A família é a base de tudo, nosso principal pilar de princípios e valores cristãos. Um domingo abençoado a todos! 🙏✨</p>
                  <span className="instagram-cta-link">
                    Ver no Instagram <ArrowRight size={10} />
                  </span>
                </div>
              </a>
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

        {/* Revista do Vale & Portal de Serviços ao Cidadão */}
        <section id="revista" className="section revista-section">
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-tag">Portal do Cidadão</span>
              <h2 className="section-title">Revista do Vale & <span>Serviços</span></h2>
              <p className="section-subtitle">
                Mais do que política, compromisso com a verdade. Acompanhe notícias da nossa gente, guias de utilidade pública para acesso a benefícios do governo e vídeos da nossa região.
              </p>
            </div>

            {/* Revista Tabs */}
            <div className="revista-tabs">
              <button 
                className={`revista-tab-btn ${activeRevistaTab === 'videos' ? 'active' : ''}`}
                onClick={() => setActiveRevistaTab('videos')}
              >
                O Vale em Vídeo
              </button>
              <button 
                className={`revista-tab-btn ${activeRevistaTab === 'noticias' ? 'active' : ''}`}
                onClick={() => setActiveRevistaTab('noticias')}
              >
                Notícias da Nossa Gente
              </button>
              <button 
                className={`revista-tab-btn ${activeRevistaTab === 'beneficios' ? 'active' : ''}`}
                onClick={() => setActiveRevistaTab('beneficios')}
              >
                Guia de Benefícios Sociais
              </button>
            </div>

            {/* TAB CONTENT: NOTICIAS DA NOSSA GENTE */}
            {activeRevistaTab === 'noticias' && (
              <div className="revista-tab-content animate-slide-in">
                <div className="revista-magazine-layout">
                  {/* Main Featured Article */}
                  <div className="magazine-featured-card" onClick={() => setSelectedArticle(MAGAZINE_ARTICLES[0])}>
                    <div className="magazine-featured-img-wrapper">
                      <img src={MAGAZINE_ARTICLES[0].image} alt="" className="magazine-featured-img" />
                      <span className="magazine-category-badge">{MAGAZINE_ARTICLES[0].category}</span>
                    </div>
                    <div className="magazine-featured-info">
                      <span className="magazine-date">{MAGAZINE_ARTICLES[0].date}</span>
                      <h3>{MAGAZINE_ARTICLES[0].title}</h3>
                      <p>{MAGAZINE_ARTICLES[0].summary}</p>
                      <button className="magazine-read-btn">
                        Ler Reportagem Completa
                        <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                      </button>
                    </div>
                  </div>

                  {/* Secondary Articles List */}
                  <div className="magazine-side-list">
                    {MAGAZINE_ARTICLES.slice(1).map((article) => (
                      <div 
                        key={article.id} 
                        className="magazine-side-card"
                        onClick={() => setSelectedArticle(article)}
                      >
                        <div className="magazine-side-img-wrapper">
                          <img src={article.image} alt="" className="magazine-side-img" />
                        </div>
                        <div className="magazine-side-info">
                          <span className="magazine-side-category">{article.category}</span>
                          <h4>{article.title}</h4>
                          <span className="magazine-side-date">{article.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: GUIA DE BENEFÍCIOS SOCIAIS */}
            {activeRevistaTab === 'beneficios' && (
              <div className="revista-tab-content animate-slide-in">
                <div className="services-intro-box">
                  <h4>Utilidade Pública: Conheça seus Direitos</h4>
                  <p>Facilitamos o acesso à informação para que o cidadão de Almenara e do Vale do Jequitinhonha saiba como solicitar e consultar os principais programas sociais e linhas de fomento rural do Estado e União.</p>
                </div>
                
                <div className="services-accordion-grid">
                  {CITIZEN_SERVICES.map((service) => {
                    const isExpanded = expandedServiceId === service.id;
                    return (
                      <div 
                        key={service.id} 
                        className={`service-accordion-card ${isExpanded ? 'active' : ''}`}
                        onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                      >
                        <div className="service-card-header">
                          <div className="service-card-title-group">
                            <span className={`service-badge-pill badge-${service.badgeType}`}>
                              {service.badge}
                            </span>
                            <h3>{service.title}</h3>
                          </div>
                          <span className="service-expand-trigger">
                            {isExpanded ? 'Ocultar' : 'Como Acessar'}
                            <ChevronRight size={16} className={`service-chevron ${isExpanded ? 'rotate-90' : ''}`} />
                          </span>
                        </div>
                        
                        {isExpanded && (
                          <div className="service-card-body animate-slide-in" onClick={(e) => e.stopPropagation()}>
                            <p className="service-short-desc">{service.shortDesc}</p>
                            
                            <div className="service-section-block">
                              <h5>Como funciona a solicitação:</h5>
                              <p>{service.howToApply}</p>
                            </div>

                            <div className="service-section-block">
                              <h5>Documentos e Requisitos Principais:</h5>
                              <ul className="service-docs-list">
                                {service.documents.map((doc, idx) => (
                                  <li key={idx}>
                                    <Check size={16} className="service-doc-check" />
                                    <span>{doc}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="service-card-footer">
                              <a 
                                href={service.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-primary"
                              >
                                Visitar Canal Oficial do Governo
                                <ExternalLink size={14} style={{ marginLeft: '6px' }} />
                              </a>
                              <a 
                                href={`https://wa.me/5533999999999?text=Ol%C3%A1%20Thenperson%2C%20estava%20lendo%20o%20Guia%20de%20Servi%C3%A7os%20do%20site%20e%20fiquei%20com%20d%C3%BAvida%20sobre%20o%20${encodeURIComponent(service.title)}`}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-secondary"
                              >
                                Dúvidas no WhatsApp
                                <Phone size={14} style={{ marginLeft: '6px' }} />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: O VALE EM VÍDEO */}
            {activeRevistaTab === 'videos' && (
              <div className="revista-tab-content animate-slide-in">
                <div className="videos-tab-grid">
                  {REGIONAL_VIDEOS.map((video) => (
                    <div key={video.id} className="youtube-magazine-card">
                      <div className="youtube-magazine-iframe-wrapper">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          allowFullScreen
                          style={{ border: 'none' }}
                        ></iframe>
                      </div>
                      <div className="youtube-magazine-info">
                        <span className="youtube-magazine-category">{video.category}</span>
                        <h4>{video.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

        {/* Campaign Pillars & Compromissos Section (Placed last) */}
        <section id="compromissos" className="section">
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
                <li><a href="#videos" className="footer-link">Vídeos e Podcast</a></li>
                <li><a href="#biografia" className="footer-link">Quem é Thenperson</a></li>
                <li><a href="#revista" className="footer-link">Revista & Serviços</a></li>
                <li><a href="#compromissos" className="footer-link">Pilares & Bandeiras</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Engajamento</h4>
              <ul>
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



      {/* Magazine Fullscreen Article Reader Modal */}
      {selectedArticle !== null && (
        <div className="news-modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="news-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="news-modal-header">
              <span className="news-modal-category">{selectedArticle.category}</span>
              <button 
                className="news-modal-close-btn" 
                onClick={() => setSelectedArticle(null)}
                aria-label="Fechar artigo"
              >
                <X size={24} />
              </button>
            </div>
            <div className="news-modal-scroll-body">
              <div className="news-modal-image-wrapper">
                <img src={selectedArticle.image} alt="" className="news-modal-img" />
              </div>
              <div className="news-modal-content-details">
                <span className="news-modal-date">{selectedArticle.date}</span>
                <h1 className="news-modal-title">{selectedArticle.title}</h1>
                <p className="news-modal-summary-italic">"{selectedArticle.summary}"</p>
                <div className="news-modal-text-paragraphs">
                  {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="news-modal-footer">
                <h4>O que você acha disso?</h4>
                <p>Contribua com suas propostas para o escoamento cultural e melhoria do Vale.</p>
                <div className="news-modal-footer-buttons">
                  <a 
                    href={`https://wa.me/5533999999999?text=Ol%C3%A1%20Thenperson%2C%20li%20a%20mat%C3%A9ria%20"${encodeURIComponent(selectedArticle.title)}"%20na%20sua%20Revista%20do%20Vale%20e%20gostaria%20de%20conversar.`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-orange"
                  >
                    Conversar no WhatsApp
                    <Phone size={16} style={{ marginLeft: '6px' }} />
                  </a>
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      const element = document.getElementById('sugestao');
                      setSelectedArticle(null);
                      if (element) {
                        setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                      }
                    }}
                  >
                    Enviar uma Sugestão
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen News Reader Modal (Keep original list support if needed) */}
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
