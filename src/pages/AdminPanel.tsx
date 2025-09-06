import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, User, Phone, MapPin, Eye, RefreshCw, LogOut } from "lucide-react";

interface Agendamento {
  id: string;
  nome_cliente: string;
  telefone: string;
  endereco: string;
  tipo_servico: string;
  data_preferencial: string;
  descricao_problema: string;
  url_foto: string;
  status: string;
  data_solicitacao: string;
  created_at: string;
}

const AdminPanel = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();

  const fetchAgendamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os agendamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setAgendamentos(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Novo': return 'bg-blue-500';
      case 'Confirmado': return 'bg-green-500';
      case 'Em Andamento': return 'bg-yellow-500';
      case 'Finalizado': return 'bg-gray-500';
      case 'Cancelado': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const sendWhatsAppMessage = (agendamento: Agendamento) => {
    const message = `Olá ${agendamento.nome_cliente}! 

Sobre sua solicitação de serviço:
*Tipo:* ${agendamento.tipo_servico}
*Data:* ${new Date(agendamento.data_preferencial).toLocaleDateString('pt-BR')}
*Endereço:* ${agendamento.endereco}

Vou entrar em contato para combinarmos os detalhes.

PEZÃO - Marido de Aluguel`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/55${agendamento.telefone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg inline-block mb-4">
            <h1 className="text-2xl font-bold">PEZÃO - Painel Administrativo</h1>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-foreground">Agendamentos</h2>
            <div className="flex gap-2">
              <Button onClick={fetchAgendamentos} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button onClick={signOut} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{agendamentos.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Novos</p>
                  <p className="text-2xl font-bold">
                    {agendamentos.filter(a => a.status === 'Novo').length}
                  </p>
                </div>
                <Badge className="bg-blue-500">Novo</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmados</p>
                  <p className="text-2xl font-bold">
                    {agendamentos.filter(a => a.status === 'Confirmado').length}
                  </p>
                </div>
                <Badge className="bg-green-500">Confirmado</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Finalizados</p>
                  <p className="text-2xl font-bold">
                    {agendamentos.filter(a => a.status === 'Finalizado').length}
                  </p>
                </div>
                <Badge className="bg-gray-500">Finalizado</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agendamentos Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Agendamentos</CardTitle>
            <CardDescription>
              Gerencie todos os agendamentos e solicitações de orçamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data Solicitação</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Tipo de Serviço</TableHead>
                    <TableHead>Data Preferencial</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agendamentos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    agendamentos.map((agendamento) => (
                      <TableRow key={agendamento.id}>
                        <TableCell>
                          {new Date(agendamento.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{agendamento.nome_cliente}</p>
                              <p className="text-xs text-muted-foreground">
                                {agendamento.endereco}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">{agendamento.telefone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{agendamento.tipo_servico}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(agendamento.data_preferencial).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={agendamento.status} 
                            onValueChange={(value) => updateStatus(agendamento.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Novo">Novo</SelectItem>
                              <SelectItem value="Confirmado">Confirmado</SelectItem>
                              <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                              <SelectItem value="Finalizado">Finalizado</SelectItem>
                              <SelectItem value="Cancelado">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendWhatsAppMessage(agendamento)}
                            >
                              WhatsApp
                            </Button>
                            {agendamento.url_foto && (
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                              >
                                <a 
                                  href={agendamento.url_foto} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;