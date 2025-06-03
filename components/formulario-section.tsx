"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormData } from "@/app/page"

interface FormularioSectionProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
}

export function FormularioSection({ formData, updateFormData }: FormularioSectionProps) {
  return (
    <div className="space-y-6">
      {/* Informações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Gerais do Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nomeProjeto">Nome do Projeto/Produto</Label>
            <Input
              id="nomeProjeto"
              value={formData.nomeProjeto}
              onChange={(e) => updateFormData("nomeProjeto", e.target.value)}
              placeholder="Ex: Revisão de Teses Tributárias"
            />
          </div>

          <div>
            <Label htmlFor="descricaoProjeto">Descrição do Projeto/Produto</Label>
            <Textarea
              id="descricaoProjeto"
              value={formData.descricaoProjeto}
              onChange={(e) => updateFormData("descricaoProjeto", e.target.value)}
              placeholder="Descrição detalhada do projeto..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="objetivoProjeto">Objetivo do Projeto/Produto (um item por linha)</Label>
            <Textarea
              id="objetivoProjeto"
              value={formData.objetivoProjeto}
              onChange={(e) => updateFormData("objetivoProjeto", e.target.value)}
              placeholder="Objetivo 1&#10;Objetivo 2&#10;Objetivo 3"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Público-Alvo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Público-Alvo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="perfilCliente">Perfil do Cliente (um item por linha)</Label>
            <Textarea
              id="perfilCliente"
              value={formData.perfilCliente}
              onChange={(e) => updateFormData("perfilCliente", e.target.value)}
              placeholder="Perfil 1&#10;Perfil 2&#10;Perfil 3"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="necessidadesCliente">Necessidades Específicas do Cliente</Label>
            <Textarea
              id="necessidadesCliente"
              value={formData.necessidadesCliente}
              onChange={(e) => updateFormData("necessidadesCliente", e.target.value)}
              placeholder="Necessidade 1&#10;Necessidade 2&#10;Necessidade 3"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="setoresAtuacao">Setores de Atuação</Label>
            <Textarea
              id="setoresAtuacao"
              value={formData.setoresAtuacao}
              onChange={(e) => updateFormData("setoresAtuacao", e.target.value)}
              placeholder="Setor 1&#10;Setor 2&#10;Setor 3"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Projeto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalhes do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metodologia">Metodologia</Label>
            <Textarea
              id="metodologia"
              value={formData.metodologia}
              onChange={(e) => updateFormData("metodologia", e.target.value)}
              placeholder="Etapa 1&#10;Etapa 2&#10;Etapa 3"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="entregaveis">Entregáveis</Label>
            <Textarea
              id="entregaveis"
              value={formData.entregaveis}
              onChange={(e) => updateFormData("entregaveis", e.target.value)}
              placeholder="Entregável 1&#10;Entregável 2&#10;Entregável 3"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="indicadoresSucesso">Indicadores de Sucesso</Label>
            <Textarea
              id="indicadoresSucesso"
              value={formData.indicadoresSucesso}
              onChange={(e) => updateFormData("indicadoresSucesso", e.target.value)}
              placeholder="Indicador 1&#10;Indicador 2&#10;Indicador 3"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Benefícios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Benefícios para o Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="beneficiosTangiveis">Benefícios Tangíveis</Label>
            <Textarea
              id="beneficiosTangiveis"
              value={formData.beneficiosTangiveis}
              onChange={(e) => updateFormData("beneficiosTangiveis", e.target.value)}
              placeholder="Benefício 1&#10;Benefício 2&#10;Benefício 3"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="beneficiosIntangiveis">Benefícios Intangíveis</Label>
            <Textarea
              id="beneficiosIntangiveis"
              value={formData.beneficiosIntangiveis}
              onChange={(e) => updateFormData("beneficiosIntangiveis", e.target.value)}
              placeholder="Benefício 1&#10;Benefício 2&#10;Benefício 3"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Diferenciais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Diferenciais Competitivos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pontosFortes">Pontos Fortes</Label>
            <Textarea
              id="pontosFortes"
              value={formData.pontosFortes}
              onChange={(e) => updateFormData("pontosFortes", e.target.value)}
              placeholder="Ponto forte 1&#10;Ponto forte 2&#10;Ponto forte 3"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="casosSucesso">Casos de Sucesso</Label>
            <Textarea
              id="casosSucesso"
              value={formData.casosSucesso}
              onChange={(e) => updateFormData("casosSucesso", e.target.value)}
              placeholder="Caso de sucesso 1&#10;Caso de sucesso 2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Aspectos Financeiros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aspectos Financeiros</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="modeloPrecificacao">Modelo de Precificação</Label>
            <Textarea
              id="modeloPrecificacao"
              value={formData.modeloPrecificacao}
              onChange={(e) => updateFormData("modeloPrecificacao", e.target.value)}
              placeholder="Modelo de precificação detalhado..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
