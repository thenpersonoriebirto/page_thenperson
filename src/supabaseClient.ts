import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are valid and not placeholders
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Initial mock data for Agenda
export interface AgendaItem {
  id: string;
  date: string; // "YYYY-MM-DD"
  time: string;
  title: string;
  location: string;
  description: string;
}

const defaultAgenda: AgendaItem[] = [
  {
    id: '1',
    date: '2026-06-12',
    time: '19:00',
    title: 'Encontro com Comerciantes Locais',
    location: 'CDL Almenara, Almenara - MG',
    description: 'Diálogo sobre incentivos ao comércio varejista do Vale do Jequitinhonha, redução de impostos regionais e capacitação para jovens empreendedores.',
  },
  {
    id: '2',
    date: '2026-06-15',
    time: '14:30',
    title: 'Visita à Associação de Artesãos',
    location: 'Centro de Artesanato de Almenara, MG',
    description: 'Reunião para debater o fortalecimento da cultura do Vale, incentivo ao artesanato de barro regional e formas de exportar nossa arte para outros estados.',
  },
  {
    id: '3',
    date: '2026-06-18',
    time: '09:00',
    title: 'Ação Social e Esporte é Saúde',
    location: 'Quadra Poliesportiva do Bairro Cidade Nova, Almenara - MG',
    description: 'Lançamento do torneio juvenil local e roda de conversa sobre o impacto do esporte e da saúde preventiva na juventude de nossa cidade.',
  },
  {
    id: '4',
    date: '2026-06-22',
    time: '19:30',
    title: 'Plenária: O Futuro do Vale do Jequitinhonha',
    location: 'Câmara Municipal de Almenara - MG',
    description: 'Apresentação das principais diretrizes de pré-campanha voltadas à saúde de qualidade, geração de empregos na tecnologia e a defesa inabalável do nosso povo.',
  }
];

// Initial mock data for News
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  image_url: string;
  category: string;
}

const defaultNews: NewsItem[] = [
  {
    id: '1',
    title: 'Thenperson destaca a importância da Saúde Preventiva no Vale do Jequitinhonha',
    summary: 'Em entrevista local, o pré-candidato enfatizou que investir em esporte e saúde básica poupa vidas e recursos públicos.',
    content: 'O Vale do Jequitinhonha carece de infraestrutura de saúde ágil e humana. Thenperson defende que a saúde começa na prevenção: "Precisamos de postos de saúde que funcionem e de incentivos para práticas esportivas na infância e na terceira idade. Cuidar das pessoas é o nosso dever principal".',
    date: '08 de Junho, 2026',
    image_url: '/images/foto04vale.png',
    category: 'Saúde e Bem-estar',
  },
  {
    id: '2',
    title: 'Da Multicell para a Liderança Comunitária: A trajetória de superação de Thenperson',
    summary: 'Conheça a história do empreendedor que gerou dezenas de empregos em Almenara e agora quer representar a região no Congresso Nacional.',
    content: 'Como fundador da Multicell, Thenperson compreende as dificuldades de empreender no interior de Minas Gerais. Ele ressalta que o pequeno comerciante precisa de apoio, e não de entraves burocráticos. Sua história de vida inspira muitos jovens locais que buscam vencer através do trabalho correto e honesto.',
    date: '05 de Junho, 2026',
    image_url: '/images/foto01.jpg',
    category: 'Trajetória',
  },
  {
    id: '3',
    title: 'Debate sobre Incentivos Fiscais para o Norte e Nordeste de Minas Gerais',
    summary: 'Thenperson reúne-se com lideranças políticas para planejar projetos de atração de indústrias e empresas de tecnologia para a nossa região.',
    content: 'Atrair indústrias e empresas é o caminho definitivo para manter nossos jovens no Vale do Jequitinhonha. "Nossos talentos não podem ser obrigados a migrar para as grandes capitais por falta de emprego. Queremos que Almenara seja um polo de tecnologia e comércio", afirmou o pré-candidato.',
    date: '02 de Junho, 2026',
    image_url: '/images/fotovalebaixo.png',
    category: 'Desenvolvimento',
  }
];

// Simulation functions using localStorage
export const db = {
  getAgenda: async (): Promise<AgendaItem[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('agenda')
          .select('*')
          .order('date', { ascending: true });
        if (!error && data) return data as AgendaItem[];
        console.warn('Error fetching agenda from Supabase, using mock data:', error);
      } catch (err) {
        console.error('Supabase query failed, using mock data:', err);
      }
    }
    
    // Fallback: Check localStorage or load defaults
    const local = localStorage.getItem('thenperson_agenda');
    if (local) {
      return JSON.parse(local);
    }
    localStorage.setItem('thenperson_agenda', JSON.stringify(defaultAgenda));
    return defaultAgenda;
  },

  getNews: async (): Promise<NewsItem[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as NewsItem[];
        console.warn('Error fetching news from Supabase, using mock data:', error);
      } catch (err) {
        console.error('Supabase query failed, using mock data:', err);
      }
    }
    
    // Fallback: Check localStorage or load defaults
    const local = localStorage.getItem('thenperson_news');
    if (local) {
      return JSON.parse(local);
    }
    localStorage.setItem('thenperson_news', JSON.stringify(defaultNews));
    return defaultNews;
  },

  saveMessage: async (messageData: { name: string; email: string; phone: string; message: string }): Promise<{ success: boolean; error?: string }> => {
    const timestamp = new Date().toISOString();
    
    if (supabase) {
      try {
        const { error } = await supabase
          .from('messages')
          .insert([{ ...messageData, created_at: timestamp }]);
        if (!error) return { success: true };
        console.warn('Error saving message to Supabase, using localStorage:', error);
      } catch (err: any) {
        console.error('Supabase insert failed, using localStorage:', err);
      }
    }

    // Fallback: Save to localStorage
    try {
      const local = localStorage.getItem('thenperson_messages');
      const messages = local ? JSON.parse(local) : [];
      messages.push({ id: crypto.randomUUID(), ...messageData, created_at: timestamp });
      localStorage.setItem('thenperson_messages', JSON.stringify(messages));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao salvar mensagem localmente.' };
    }
  }
};
