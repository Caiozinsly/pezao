import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Phone, MapPin, Clock, Star, CheckCircle, Calendar, Instagram } from "lucide-react";
import bg from "@/assets/pezao.png";
import pequenosReparos from "@/assets/pequenos-reparos.jpg";
import instalacoes from "@/assets/instalacoes.jpg";
import manutencaoGeral from "@/assets/manutencao-geral.jpg";

const Index = () => {
  const servicos = [
    {
      icon: <Wrench className="h-8 w-8 text-blue-600" />, 
      titulo: "Pequenos Reparos",
      descricao: "Reparos residenciais e comerciais com qualidade",
      bgImage: pequenosReparos
    },
    {
      icon: <MapPin className="h-8 w-8 text-orange-500" />, 
      titulo: "Instalações",
      descricao: "Instalações elétricas, hidráulicas e mais",
      bgImage: instalacoes
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />, 
      titulo: "Manutenção Geral",
      descricao: "Manutenção preventiva e corretiva",
      bgImage: manutencaoGeral
    }
  ];

  const vantagens = [
    "✓ Profissional experiente e qualificado",
    "✓ Orçamento sem compromisso",
    "✓ Atendimento rápido e eficiente",
    "✓ Preços justos e competitivos",
    "✓ Garantia nos serviços executados",
    "✓ Atendimento de segunda à sábado"
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background images (responsive) */}
      <img
        src={bg}
        alt=""
        className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-center
          sm:w-full sm:h-full
          max-sm:w-auto max-sm:h-[60vh] max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:top-0"
        style={{
          zIndex: 0,
          minHeight: "100vh",
          maxWidth: "100vw",
        }}
        draggable={false}
      />

      {/* Overlay gradiente para manter contraste do texto */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-orange-50/80 z-10" />

      {/* Conteúdo acima do background */}
      <div className="relative z-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Wrench className="h-12 w-12 text-blue-600" />
              <h1 className="text-5xl font-bold text-blue-900"> PEZAO .</h1>
            </div>
            <p className="text-2xl text-blue-700 font-medium mb-4">Marido de Aluguel</p>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Soluções práticas para sua casa e empresa. Reparos, instalações e manutenção geral 
              com qualidade e confiança.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-3">
                <Link to="/agendamento" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Solicitar Orçamento
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <a href="https://wa.me/5514998742493" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  WhatsApp Direto
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-blue-800">
              <Phone className="h-5 w-5" />
              <span className="text-xl font-semibold">14 99874-2493</span>
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Nossos Serviços
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {servicos.map((servico, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow relative overflow-hidden">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20" 
                    style={{ backgroundImage: `url(${servico.bgImage})` }}
                  />
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-white/80" />
                  {/* Card Content */}
                  <CardHeader className="relative z-10">
                    <div className="flex justify-center mb-4">
                      {servico.icon}
                    </div>
                    <CardTitle className="text-xl">{servico.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-base">
                      {servico.descricao}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Vantagens */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Por que escolher o PEZÃO?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vantagens.map((vantagem, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow">
                  <div className="text-green-600 text-lg font-medium">
                    {vantagem}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Precisa de um serviço?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Solicite seu orçamento agora mesmo e tenha a tranquilidade de um trabalho bem feito!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
                <Link to="/agendamento" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Fazer Agendamento
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent border-white text-white hover:bg-white hover:text-blue-700">
                <a href="https://wa.me/5514998742493" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Chamar no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wrench className="h-6 w-6" />
              <span className="text-xl font-bold">PEZÃO - Marido de Aluguel</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Phone className="h-4 w-4" />
              <span>14 99874-2493</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Atendimento: Segunda à Sábado das 8h às 18h</span>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <Link to="/login" className="text-gray-400 hover:text-white text-sm">
                Painel Administrativo
              </Link>
            </div>
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground mt-4">
              <p>
                Desenvolvido por{" "}
                <a
                  href="https://www.instagram.com/caiozinsly/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  <Instagram className="h-4 w-4" />
                  Delinx - co.
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;