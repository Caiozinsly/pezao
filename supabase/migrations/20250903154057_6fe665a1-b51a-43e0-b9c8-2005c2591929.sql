-- Create the agendamentos (bookings) table
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_cliente TEXT NOT NULL,
  telefone TEXT NOT NULL,
  endereco TEXT NOT NULL,
  tipo_servico TEXT NOT NULL,
  data_preferencial TIMESTAMP WITH TIME ZONE NOT NULL,
  descricao_problema TEXT,
  url_foto TEXT,
  status TEXT NOT NULL DEFAULT 'Novo',
  data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anyone can create bookings)
CREATE POLICY "Anyone can create agendamentos" 
ON public.agendamentos 
FOR INSERT 
WITH CHECK (true);

-- Create policies for admin access (we'll restrict this later with authentication)
CREATE POLICY "Admin can view all agendamentos" 
ON public.agendamentos 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can update agendamentos" 
ON public.agendamentos 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agendamentos_updated_at
BEFORE UPDATE ON public.agendamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for uploaded photos
INSERT INTO storage.buckets (id, name, public) VALUES ('agendamento-fotos', 'agendamento-fotos', true);

-- Create storage policies for photo uploads
CREATE POLICY "Anyone can upload photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'agendamento-fotos');

CREATE POLICY "Anyone can view uploaded photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'agendamento-fotos');