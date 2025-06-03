"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormularioSection } from "@/components/formulario-section"
import { RelatorioPreview } from "@/components/relatorio-preview"
import { FormatacaoControls } from "@/components/formatacao-controls"
import { ExportControls } from "@/components/export-controls"

export interface FormData {
  nomeProjeto: string
  descricaoProjeto: string
  objetivoProjeto: string
  perfilCliente: string
  necessidadesCliente: string
  setoresAtuacao: string
  metodologia: string
  entregaveis: string
  indicadoresSucesso: string
  beneficiosTangiveis: string
  beneficiosIntangiveis: string
  pontosFortes: string
  casosSucesso: string
  modeloPrecificacao: string
}

export interface FormatacaoConfig {
  fontFamily: string
  fontSize: number
  headerFontSize: number
  titleFontSize: number
  lineHeight: number
  logoSize: number
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: number
  spacing: number
}

const defaultFormData: FormData = {
  nomeProjeto: "Recuperação de ITCMD Pago Indevidamente sobre VGBL/PGBL",
  descricaoProjeto:
    "Análise e revisão de teses tributárias aplicáveis aos processos do cliente, visando otimizar a carga tributária e identificar oportunidades de recuperação de créditos.",
  objetivoProjeto: "Reduzir a carga tributária do cliente.\nMaximizar a eficiência fiscal.",
  perfilCliente: "Empresas de médio e grande porte no setor industrial.\nPessoas físicas com patrimônio elevado.",
  necessidadesCliente:
    "Necessidade de otimização fiscal.\nCompliance tributário.\nRecuperação de valores pagos indevidamente.",
  setoresAtuacao: "Indústria.\nComércio.\nServiços.\nSetor financeiro.",
  metodologia:
    "Análise preliminar de processos atuais.\nElaboração de diagnóstico.\nApresentação de propostas de melhoria.\nImplementação das soluções jurídicas.",
  entregaveis: "Relatório de diagnóstico.\nPropostas de teses tributárias.\nPlano de ação.\nPareceres jurídicos.",
  indicadoresSucesso:
    "Redução percentual da carga tributária.\nQuantidade de créditos tributários recuperados.\nSatisfação do cliente.\nNúmero de processos finalizados com êxito.",
  beneficiosTangiveis:
    "Economia financeira.\nRecuperação de créditos.\nRedução de passivos tributários.\nAumento do fluxo de caixa.",
  beneficiosIntangiveis:
    "Segurança jurídica.\nConformidade com a legislação.\nMelhoria na gestão fiscal.\nReputação e credibilidade.",
  pontosFortes: "Experiência comprovada.\nEquipe especializada.\nMetodologia eficaz.\nAtendimento personalizado.",
  casosSucesso:
    "Recuperação de R$ 5 milhões em ITCMD para cliente do setor imobiliário.\nRedução de 30% da carga tributária anual para empresa de serviços.",
  modeloPrecificacao:
    "Honorários de êxito calculados sobre o benefício econômico efetivamente obtido pelo cliente.\nPossibilidade de honorários fixos para análise inicial e diagnóstico.",
}

const defaultFormatacao: FormatacaoConfig = {
  fontFamily: "Montserrat",
  fontSize: 14,
  headerFontSize: 24,
  titleFontSize: 18,
  lineHeight: 1.6,
  logoSize: 80,
  primaryColor: "#2D2E60",
  secondaryColor: "#F56F16",
  backgroundColor: "#FFF8F0",
  textColor: "#2D2E60",
  borderRadius: 8,
  spacing: 24,
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [formatacao, setFormatacao] = useState<FormatacaoConfig>(defaultFormatacao)
  const [activeTab, setActiveTab] = useState("formulario")

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateFormatacao = (field: keyof FormatacaoConfig, value: string | number) => {
    setFormatacao((prev) => ({ ...prev, [field]: value }))
  }

  const handleImportData = (data: { formData: FormData; formatacao: FormatacaoConfig }) => {
    setFormData(data.formData)
    setFormatacao(data.formatacao)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerador de Relatório Comercial</h1>
          <p className="text-gray-600">FCB Advogados - Ferramenta de criação de propostas comerciais</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="formulario">Formulário</TabsTrigger>
            <TabsTrigger value="formatacao">Formatação</TabsTrigger>
            <TabsTrigger value="preview">Visualização</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="formulario">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <FormularioSection formData={formData} updateFormData={updateFormData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formatacao">
            <Card>
              <CardHeader>
                <CardTitle>Opções de Formatação</CardTitle>
              </CardHeader>
              <CardContent>
                <FormatacaoControls formatacao={formatacao} updateFormatacao={updateFormatacao} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <RelatorioPreview formData={formData} formatacao={formatacao} />
          </TabsContent>

          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <ExportControls formData={formData} formatacao={formatacao} onImportData={handleImportData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
