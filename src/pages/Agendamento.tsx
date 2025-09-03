import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload, Phone, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  nome_cliente: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  endereco: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  tipo_servico: z.string().min(1, "Selecione o tipo de serviço"),
  data_preferencial: z.date({
    required_error: "Selecione uma data preferencial",
  }),
  descricao_problema: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const tiposServico = [
  "Pequenos Reparos",
  "Instalações Elétricas",
  "Encanamento",
  "Pintura",
  "Montagem de Móveis",
  "Reparos Gerais",
  "Manutenção Geral",
  "Outros"
];

export default function Agendamento() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_cliente: "",
      telefone: "",
      endereco: "",
      tipo_servico: "",
      descricao_problema: "",
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `agendamento-fotos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('agendamento-fotos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('agendamento-fotos')
        .getPublicUrl(filePath);

      setUploadedImage(data.publicUrl);
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar imagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Salvar no banco de dados
      const { error } = await supabase
        .from('agendamentos')
        .insert({
          nome_cliente: data.nome_cliente,
          telefone: data.telefone,
          endereco: data.endereco,
          tipo_servico: data.tipo_servico,
          data_preferencial: data.data_preferencial.toISOString(),
          descricao_problema: data.descricao_problema || '',
          url_foto: uploadedImage,
        });

      if (error) throw error;

      // Preparar mensagem para WhatsApp
      const mensagem = `*NOVA SOLICITAÇÃO - PEZÃO MARIDO DE ALUGUEL*

*Cliente:* ${data.nome_cliente}
*Telefone:* ${data.telefone}
*Endereço:* ${data.endereco}
*Tipo de Serviço:* ${data.tipo_servico}
*Data Preferencial:* ${format(data.data_preferencial, "dd/MM/yyyy")}
${data.descricao_problema ? `*Descrição:* ${data.descricao_problema}` : ''}
${uploadedImage ? `*Foto:* ${uploadedImage}` : ''}

Solicitação feita através do site.`;

      // Codificar para URL
      const mensagemCodificada = encodeURIComponent(mensagem);
      
      // Redirecionar para WhatsApp
      const whatsappUrl = `https://wa.me/5514998742493?text=${mensagemCodificada}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Sucesso!",
        description: "Agendamento solicitado! Você será redirecionado para o WhatsApp.",
      });

      // Limpar formulário
      form.reset();
      setUploadedImage(null);

    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wrench className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-blue-900">PEZÃO</h1>
          </div>
          <p className="text-xl text-blue-700 font-medium">Marido de Aluguel</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Wrench className="h-4 w-4" />
              Pequenos Reparos
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Instalações
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              Manutenção Geral
            </span>
          </div>
        </div>

        {/* Formulário */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Solicitar Agendamento e Orçamento</CardTitle>
            <CardDescription className="text-blue-100">
              Preencha os dados below e entraremos em contato via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome_cliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone/WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(14) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, número, bairro, cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipo_servico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Serviço</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o serviço" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposServico.map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>
                                {tipo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="data_preferencial"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data Preferencial</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="descricao_problema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Problema (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva detalhadamente o problema ou serviço necessário..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Upload de Foto */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Foto do Problema (Opcional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Clique para enviar uma foto do problema
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG até 10MB
                      </p>
                    </label>
                    {uploadedImage && (
                      <div className="mt-4">
                        <p className="text-sm text-green-600 mb-2">✓ Imagem enviada com sucesso!</p>
                        <img
                          src={uploadedImage}
                          alt="Imagem enviada"
                          className="max-w-32 h-auto mx-auto rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg py-3"
                >
                  {isSubmitting ? "Enviando..." : "Solicitar Agendamento e Orçamento"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer com contato */}
        <div className="text-center mt-8 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Phone className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-blue-900">14 99874-2493</span>
          </div>
          <p className="text-sm text-gray-600">
            Atendimento de Segunda à Sábado das 8h às 18h
          </p>
        </div>
      </div>
    </div>
  );
}