import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Calendar, Phone, MapPin, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Agendamento {
  id: string;
  nome_cliente: string;
  telefone: string;
  endereco: string;
  tipo_servico: string;
  data_preferencial: string;
  descricao_problema: string | null;
  url_foto: string | null;
  status: string;
  data_solicitacao: string;
}

const statusOptions = ["Novo", "Confirmado", "Em Andamento", "Finalizado", "Cancelado"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Novo":
      return "bg-blue-100 text-blue-800";
    case "Confirmado":
      return "bg-green-100 text-green-800";
    case "Em Andamento":
      return "bg-yellow-100 text-yellow-800";
    case "Finalizado":
      return "bg-gray-100 text-gray-800";
    case "Cancelado":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Admin() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data_solicitacao', { ascending: false });

      if (error) throw error;

      setAgendamentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar agendamentos",
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

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });

      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600 mt-1">PEZÃO - Marido de Aluguel</p>
            </div>
            <Button
              onClick={fetchAgendamentos}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {agendamentos.length}
              </div>
              <p className="text-sm text-gray-600">Total de Agendamentos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {agendamentos.filter(a => a.status === "Novo").length}
              </div>
              <p className="text-sm text-gray-600">Novos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {agendamentos.filter(a => a.status === "Em Andamento").length}
              </div>
              <p className="text-sm text-gray-600">Em Andamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {agendamentos.filter(a => a.status === "Finalizado").length}
              </div>
              <p className="text-sm text-gray-600">Finalizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos</CardTitle>
            <CardDescription>
              Lista de todos os agendamentos solicitados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agendamentos.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Nenhum agendamento encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data Solicitação</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo de Serviço</TableHead>
                      <TableHead>Data Preferencial</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agendamentos.map((agendamento) => (
                      <TableRow key={agendamento.id}>
                        <TableCell>
                          {format(new Date(agendamento.data_solicitacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {agendamento.nome_cliente}
                        </TableCell>
                        <TableCell>{agendamento.tipo_servico}</TableCell>
                        <TableCell>
                          {format(new Date(agendamento.data_preferencial), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={agendamento.status}
                            onValueChange={(value) => updateStatus(agendamento.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  <Badge className={getStatusColor(status)}>
                                    {status}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedAgendamento(agendamento)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Detalhes do Agendamento</DialogTitle>
                                  <DialogDescription>
                                    Informações completas da solicitação
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedAgendamento && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Cliente</label>
                                        <p className="text-lg">{selectedAgendamento.nome_cliente}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Status</label>
                                        <Badge className={getStatusColor(selectedAgendamento.status)}>
                                          {selectedAgendamento.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                          <Phone className="h-4 w-4" />
                                          Telefone
                                        </label>
                                        <p>{selectedAgendamento.telefone}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Tipo de Serviço</label>
                                        <p>{selectedAgendamento.tipo_servico}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        Endereço
                                      </label>
                                      <p>{selectedAgendamento.endereco}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Data Preferencial</label>
                                        <p>{format(new Date(selectedAgendamento.data_preferencial), "dd/MM/yyyy", { locale: ptBR })}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Data da Solicitação</label>
                                        <p>{format(new Date(selectedAgendamento.data_solicitacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                                      </div>
                                    </div>

                                    {selectedAgendamento.descricao_problema && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Descrição do Problema</label>
                                        <p className="mt-1 p-3 bg-gray-50 rounded border text-sm">
                                          {selectedAgendamento.descricao_problema}
                                        </p>
                                      </div>
                                    )}

                                    {selectedAgendamento.url_foto && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Foto</label>
                                        <div className="mt-1">
                                          <img
                                            src={selectedAgendamento.url_foto}
                                            alt="Foto do problema"
                                            className="max-w-full h-auto rounded border"
                                          />
                                          <a
                                            href={selectedAgendamento.url_foto}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                                          >
                                            <ExternalLink className="h-4 w-4" />
                                            Ver imagem completa
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a
                                href={`https://wa.me/55${agendamento.telefone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Phone className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}