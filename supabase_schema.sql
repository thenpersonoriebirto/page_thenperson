-- Supabase Schema for Thenperson Pre-Candidate Website

-- 1. Table for Agenda / Events
CREATE TABLE IF NOT EXISTS public.agenda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    time VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for Agenda
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;

-- Allow public read access to Agenda
CREATE POLICY "Allow public read access on agenda" 
ON public.agenda FOR SELECT 
TO public 
USING (true);

-- Allow authenticated admin write access to Agenda
CREATE POLICY "Allow authenticated insert access on agenda" 
ON public.agenda FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update access on agenda" 
ON public.agenda FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete access on agenda" 
ON public.agenda FOR DELETE 
TO authenticated 
USING (true);


-- 2. Table for News / Updates
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    image_url TEXT,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for News
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Allow public read access to News
CREATE POLICY "Allow public read access on news" 
ON public.news FOR SELECT 
TO public 
USING (true);

-- Allow authenticated admin write access to News
CREATE POLICY "Allow authenticated insert access on news" 
ON public.news FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update access on news" 
ON public.news FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete access on news" 
ON public.news FOR DELETE 
TO authenticated 
USING (true);


-- 3. Table for Contact Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow public write access to Messages (so visitors can send messages)
CREATE POLICY "Allow public insert access on messages" 
ON public.messages FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow only authenticated admin read/delete access to Messages
CREATE POLICY "Allow authenticated select access on messages" 
ON public.messages FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete access on messages" 
ON public.messages FOR DELETE 
TO authenticated 
USING (true);


-- 4. Seed initial mock data for local testing/deployment (optional)
-- Uncomment these if you want to seed the database tables immediately.
/*
INSERT INTO public.agenda (date, time, title, location, description) VALUES
('2026-06-12', '19:00', 'Encontro com Comerciantes Locais', 'CDL Almenara, Almenara - MG', 'Diálogo sobre incentivos ao comércio varejista do Vale do Jequitinhonha, redução de impostos regionais e capacitação para jovens empreendedores.'),
('2026-06-15', '14:30', 'Visita à Associação de Artesãos', 'Centro de Artesanato de Almenara, MG', 'Reunião para debater o fortalecimento da cultura do Vale, incentivo ao artesanato de barro regional e formas de exportar nossa arte para outros estados.'),
('2026-06-18', '09:00', 'Ação Social e Esporte é Saúde', 'Quadra Poliesportiva do Bairro Cidade Nova, Almenara - MG', 'Lançamento do torneio juvenil local e roda de conversa sobre o impacto do esporte e da saúde preventiva na juventude de nossa cidade.'),
('2026-06-22', '19:30', 'Plenária: O Futuro do Vale do Jequitinhonha', 'Câmara Municipal de Almenara - MG', 'Apresentação das principais diretrizes de pré-campanha voltadas à saúde de qualidade, geração de empregos na tecnologia e a defesa inabalável do nosso povo.');

INSERT INTO public.news (title, summary, content, date, image_url, category) VALUES
('Thenperson destaca a importância da Saúde Preventiva no Vale do Jequitinhonha', 'Em entrevista local, o pré-candidato enfatizou que investir em esporte e saúde básica poupa vidas e recursos públicos.', 'O Vale do Jequitinhonha carece de infraestrutura de saúde ágil e humana. Thenperson defende que a saúde começa na prevenção: "Precisamos de postos de saúde que funcionem e de incentivos para práticas esportivas na infância e na terceira idade. Cuidar das pessoas é o nosso dever principal".', '08 de Junho, 2026', '/images/jequitinhonha_landscape.png', 'Saúde e Bem-estar'),
('Da Multicell para a Liderança Comunitária: A trajetória de superação de Thenperson', 'Conheça a história do empreendedor que gerou dezenas de empregos em Almenara e agora quer representar a região no Congresso Nacional.', 'Como fundador da Multicell, Thenperson compreende as dificuldades de empreender no interior de Minas Gerais. Ele ressalta que o pequeno comerciante precisa de apoio, e não de entraves burocráticos. Sua história de vida inspira muitos jovens locais que buscam vencer através do trabalho correto e honesto.', '05 de Junho, 2026', '/images/thenperson_portrait.png', 'Trajetória'),
('Debate sobre Incentivos Fiscais para o Norte e Nordeste de Minas Gerais', 'Thenperson reúne-se com lideranças políticas para planejar projetos de atração de indústrias e empresas de tecnologia para a nossa região.', 'Atrair indústrias e empresas é o caminho definitivo para manter nossos jovens no Vale do Jequitinhonha. "Nossos talentos não podem ser obrigados a migrar para as grandes capitais por falta de emprego. Queremos que Almenara seja um polo de tecnologia e comércio", afirmou o pré-candidato.', '02 de Junho, 2026', '/images/jequitinhonha_landscape.png', 'Desenvolvimento');
*/
