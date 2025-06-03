"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormatacaoConfig } from "@/app/page"
import { Palette, Type, ImageIcon, Layout } from "lucide-react"

interface FormatacaoControlsProps {
  formatacao: FormatacaoConfig
  updateFormatacao: (field: keyof FormatacaoConfig, value: string | number) => void
}

export function FormatacaoControls({ formatacao, updateFormatacao }: FormatacaoControlsProps) {
  const fontOptions = [
    "Montserrat",
    "Lato",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Roboto",
    "Open Sans",
    "Inter",
  ]

  return (
    <div className="space-y-6">
      {/* Tipografia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Tipografia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Família da Fonte</Label>
            <Select value={formatacao.fontFamily} onValueChange={(value) => updateFormatacao("fontFamily", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tamanho da Fonte do Texto ({formatacao.fontSize}px)</Label>
            <Slider
              value={[formatacao.fontSize]}
              onValueChange={(value) => updateFormatacao("fontSize", value[0])}
              min={10}
              max={24}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Tamanho da Fonte do Cabeçalho ({formatacao.headerFontSize}px)</Label>
            <Slider
              value={[formatacao.headerFontSize]}
              onValueChange={(value) => updateFormatacao("headerFontSize", value[0])}
              min={18}
              max={36}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Tamanho da Fonte dos Títulos ({formatacao.titleFontSize}px)</Label>
            <Slider
              value={[formatacao.titleFontSize]}
              onValueChange={(value) => updateFormatacao("titleFontSize", value[0])}
              min={14}
              max={28}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Altura da Linha ({formatacao.lineHeight})</Label>
            <Slider
              value={[formatacao.lineHeight]}
              onValueChange={(value) => updateFormatacao("lineHeight", value[0])}
              min={1.2}
              max={2.0}
              step={0.1}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Cores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Cor Primária</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={formatacao.primaryColor}
                onChange={(e) => updateFormatacao("primaryColor", e.target.value)}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={formatacao.primaryColor}
                onChange={(e) => updateFormatacao("primaryColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label>Cor Secundária</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={formatacao.secondaryColor}
                onChange={(e) => updateFormatacao("secondaryColor", e.target.value)}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={formatacao.secondaryColor}
                onChange={(e) => updateFormatacao("secondaryColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label>Cor de Fundo</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={formatacao.backgroundColor}
                onChange={(e) => updateFormatacao("backgroundColor", e.target.value)}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={formatacao.backgroundColor}
                onChange={(e) => updateFormatacao("backgroundColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label>Cor do Texto</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={formatacao.textColor}
                onChange={(e) => updateFormatacao("textColor", e.target.value)}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={formatacao.textColor}
                onChange={(e) => updateFormatacao("textColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Layout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Raio da Borda ({formatacao.borderRadius}px)</Label>
            <Slider
              value={[formatacao.borderRadius]}
              onValueChange={(value) => updateFormatacao("borderRadius", value[0])}
              min={0}
              max={20}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Espaçamento ({formatacao.spacing}px)</Label>
            <Slider
              value={[formatacao.spacing]}
              onValueChange={(value) => updateFormatacao("spacing", value[0])}
              min={12}
              max={48}
              step={4}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Imagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Tamanho do Logo ({formatacao.logoSize}px)</Label>
            <Slider
              value={[formatacao.logoSize]}
              onValueChange={(value) => updateFormatacao("logoSize", value[0])}
              min={40}
              max={120}
              step={5}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
