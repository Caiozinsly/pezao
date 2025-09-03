import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Calendar, Phone, MapPin, Wrench, Upload, MessageCircle } from "lucide-react";

const formSchema = z.object({
  nome_cliente: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  endereco: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  tipo_servico: z.string().min(1, "Selecione um tipo de serviço"),
  data_preferencial: z.string().min(1, "Selecione uma data"),
  descricao_problema: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const BookingForm = () => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_cliente: "",
      telefone: "",
      endereco: "",
      tipo_servico: "",
      data_preferencial: "",
      descricao_problema: "",
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file);
    } else {
      toast({
        title: "Erro no arquivo",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('agendamento-fotos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('agendamento-fotos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      let photoUrl = null;
      
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile);
        if (!photoUrl) {
          toast({
            title: "Erro no upload",
            description: "Não foi possível fazer upload da foto. Tente novamente.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const { error } = await supabase
        .from('agendamentos')
        .insert({
          nome_cliente: data.nome_cliente,
          telefone: data.telefone,
          endereco: data.endereco,
          tipo_servico: data.tipo_servico,
          data_preferencial: data.data_preferencial,
          descricao_problema: data.descricao_problema,
          url_foto: photoUrl,
        });

      if (error) throw error;

      // Prepare WhatsApp message
      const message = `*NOVA SOLICITAÇÃO DE SERVIÇO*

*Cliente:* ${data.nome_cliente}
*Telefone:* ${data.telefone}
*Endereço:* ${data.endereco}
*Tipo de Serviço:* ${data.tipo_servico}
*Data Preferencial:* ${new Date(data.data_preferencial).toLocaleDateString('pt-BR')}
*Descrição:* ${data.descricao_problema || 'Não informada'}
${photoUrl ? `*Foto:* ${photoUrl}` : ''}

_Enviado pelo site PEZÃO - Marido de Aluguel_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/5514998742493?text=${encodedMessage}`;
      
      toast({
        title: "Agendamento enviado!",
        description: "Você será redirecionado para o WhatsApp para finalizar o contato.",
      });

      // Redirect to WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

      // Reset form
      form.reset();
      setPhotoFile(null);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar seu agendamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg inline-block mb-4">
            <h1 className="text-2xl font-bold">PEZÃO</h1>
            <p className="text-sm opacity-90">Marido de Aluguel</p>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Solicite seu Orçamento</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pequenos reparos, instalações e manutenção geral. 
            Preencha o formulário abaixo e receba seu orçamento via WhatsApp!
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <Wrench className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Pequenos Reparos</h3>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Wrench className="h-8 w-8 text-secondary mx-auto mb-2" />
              <h3 className="font-semibold">Instalações</h3>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Wrench className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Manutenção Geral</h3>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Formulário de Agendamento
            </CardTitle>
            <CardDescription>
              Preencha seus dados e descreva o serviço que você precisa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telefone/WhatsApp
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="(14) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Endereço
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, número, bairro, cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo_servico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Serviço</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="reparo-eletrico">Reparo Elétrico</SelectItem>
                          <SelectItem value="reparo-hidraulico">Reparo Hidráulico</SelectItem>
                          <SelectItem value="instalacao-eletrica">Instalação Elétrica</SelectItem>
                          <SelectItem value="instalacao-hidraulica">Instalação Hidráulica</SelectItem>
                          <SelectItem value="pintura">Pintura</SelectItem>
                          <SelectItem value="montagem-moveis">Montagem de Móveis</SelectItem>
                          <SelectItem value="manutencao-geral">Manutenção Geral</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
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
                    <FormItem>
                      <FormLabel>Data Preferencial</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao_problema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Problema</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva detalhadamente o problema ou serviço que você precisa..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Foto do Problema (Opcional)
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="cursor-pointer"
                  />
                  {photoFile && (
                    <p className="text-sm text-muted-foreground">
                      Arquivo selecionado: {photoFile.name}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg py-6"
                  disabled={isSubmitting}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Enviando..." : "Solicitar Agendamento e Orçamento"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Ou entre em contato diretamente:{" "}
            <a 
              href="https://wa.me/5514998742493" 
              className="text-primary font-semibold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              (14) 99874-2493
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;