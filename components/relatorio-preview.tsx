"use client"

import type React from "react"
import Image from "next/image"
import type { FormData, FormatacaoConfig } from "@/app/page"

interface RelatorioPreviewProps {
  formData: FormData
  formatacao: FormatacaoConfig
}

export function RelatorioPreview({ formData, formatacao }: RelatorioPreviewProps) {
  const renderList = (text: string) => {
    if (!text.trim()) return null
    const items = text.split("\n").filter((item) => item.trim())
    return (
      <ul className="list-disc list-inside ml-4 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item.trim()}</li>
        ))}
      </ul>
    )
  }

  const renderParagraphs = (text: string) => {
    if (!text.trim()) return null
    const paragraphs = text.split("\n").filter((p) => p.trim())
    return (
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph.trim()}</p>
        ))}
      </div>
    )
  }

  const customStyles = {
    fontFamily: formatacao.fontFamily,
    fontSize: `${formatacao.fontSize}px`,
    lineHeight: formatacao.lineHeight,
    color: formatacao.textColor,
    backgroundColor: formatacao.backgroundColor,
    borderRadius: `${formatacao.borderRadius}px`,
    "--primary-color": formatacao.primaryColor,
    "--secondary-color": formatacao.secondaryColor,
    "--spacing": `${formatacao.spacing}px`,
  } as React.CSSProperties

  const headerStyle = {
    fontSize: `${formatacao.headerFontSize}px`,
    color: formatacao.primaryColor,
  }

  const titleStyle = {
    fontSize: `${formatacao.titleFontSize}px`,
    color: formatacao.primaryColor,
  }

  return (
    <div id="relatorio-preview" className="max-w-4xl mx-auto">
      <div className="shadow-2xl rounded-lg overflow-hidden" style={customStyles}>
        {/* Header */}
        <header className="p-6 relative" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="flex justify-between items-start mb-3">
            <div className="w-full md:w-2/3 pr-4">
              <h1 className="font-bold uppercase text-left" style={headerStyle}>
                {formData.nomeProjeto || "[Nome do Projeto/Produto]"}
              </h1>
            </div>
            <div className="absolute top-4 right-4">
              <Image
                src="/images/fcb-logo.png"
                alt="FCB Advogados"
                width={Math.round(formatacao.logoSize * 2.5)}
                height={Math.round(formatacao.logoSize * 0.6)}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: `${formatacao.spacing}px` }}>
          {/* Seção 1: INFORMAÇÕES GERAIS DO PRODUTO */}
          <section style={{ marginBottom: `${formatacao.spacing}px` }}>
            <h2
              className="font-bold mb-3 pb-2"
              style={{
                ...titleStyle,
                borderBottom: `2px solid ${formatacao.secondaryColor}`,
              }}
            >
              1. INFORMAÇÕES GERAIS DO PRODUTO
            </h2>
            <div style={{ marginLeft: "16px" }}>
              <h4 className="font-semibold mb-1" style={{ color: formatacao.primaryColor }}>
                Nome do Projeto/Produto:
              </h4>
              <p className="mb-3">{formData.nomeProjeto || "[Nome do Projeto/Produto]"}</p>

              <h4 className="font-semibold mb-1" style={{ color: formatacao.primaryColor }}>
                Descrição do Projeto/Produto:
              </h4>
              <div className="mb-3">
                {renderParagraphs(formData.descricaoProjeto) || <p>[Descrição do Projeto/Produto]</p>}
              </div>

              <h4 className="font-semibold mb-1" style={{ color: formatacao.primaryColor }}>
                Objetivo do Projeto/Produto:
              </h4>
              {renderList(formData.objetivoProjeto) || <p>[Objetivo do Projeto/Produto]</p>}
            </div>
          </section>

          {/* Seção 2: PÚBLICO-ALVO */}
          <section style={{ marginBottom: `${formatacao.spacing}px` }}>
            <h2
              className="font-bold mb-3 pb-2"
              style={{
                ...titleStyle,
                borderBottom: `2px solid ${formatacao.secondaryColor}`,
              }}
            >
              2. PÚBLICO-ALVO
            </h2>
            <div style={{ marginLeft: "16px" }}>
              <h4 className="font-semibold mb-1" style={{ color: formatacao.primaryColor }}>
                Perfil do Cliente:
              </h4>
              {renderList(formData.perfilCliente) || <p>[Perfil do Cliente]</p>}

              <h4 className="font-semibold mb-1 mt-3" style={{ color: formatacao.primaryColor }}>
                Necessidades Específicas do Cliente:
              </h4>
              {renderList(formData.necessidadesCliente) || <p>[Necessidades Específicas do Cliente]</p>}

              <h4 className="font-semibold mb-1 mt-3" style={{ color: formatacao.primaryColor }}>
                Setores de Atuação:
              </h4>
              {renderList(formData.setoresAtuacao) || <p>[Setores de Atuação]</p>}
            </div>
          </section>

          {/* Seção 3: DETALHES DO PROJETO */}
          <section style={{ marginBottom: `${formatacao.spacing}px` }}>
            <h2
              className="font-bold mb-3 pb-2"
              style={{
                ...titleStyle,
                borderBottom: `2px solid ${formatacao.secondaryColor}`,
              }}
            >
              3. DETALHES DO PROJETO
            </h2>
            <div style={{ marginLeft: "16px" }}>
              <h4 className="font-semibold mb-1" style={{ color: formatacao.primaryColor }}>
                Metodologia:
              </h4>
              {renderList(formData.metodologia) || <p>[Metodologia]</p>}

              <h4 className="font-semibold mb-1 mt-3" style={{ color: formatacao.primaryColor }}>
                Entregáveis:
              </h4>
              {renderList(formData.entregaveis) || <p>[Entregáveis]</p>}

              <h4 className="font-semibold mb-1 mt-3" style={{ color: formatacao.primaryColor }}>
                Indicadores de Sucesso:
              </h4>
              {renderList(formData.indicadoresSucesso) || <p>[Indicadores de Sucesso]</p>}
            </div>
          </section>

          {/* Seção 4: BENEFÍCIOS PARA O CLIENTE */}
          <section style={{ marginBottom: `${formatacao.spacing}px` }}>
            <h2
              className="font-bold mb-3 pb-2"
              style={{
                ...titleStyle,
                borderBottom: `2px solid ${formatacao.secondaryColor}`,
              }}
            >
              4. BENEFÍCIOS PARA O CLIENTE
            </h2>
            <div style={{ marginLeft: "16px" }}>
              <h4 className="font-semibold mb-1" style={{ color: formatacao.primaryColor }}>
                Benefícios Tangíveis:
              </h4>
              {renderList(formData.beneficiosTangiveis) || <p>[Benefícios Tangíveis]</p>}

              <h4 className="font-semibold mb-1 mt-3" style={{ color: formatacao.primaryColor }}>
                Benefícios Intangíveis:
              </h4>
              {renderList(formData.beneficiosIntangiveis) || <p>[Benefícios Intangíveis]</p>}
            </div>
          </section>

          {/* Seção 5: DIFERENCIAIS COMPETITIVOS */}
          <section style={{ marginBottom: `${formatacao.spacing}px` }}>
            <h2
              className="font-bold mb-3 pb-2"
              style={{
                ...titleStyle,
                borderBottom: `2px solid ${formatacao.secondaryColor}`,
              }}
            >
              5. DIFERENCIAIS COMPETITIVOS
            </h2>
            <div style={{ marginLeft: "16px" }}>
              <h4 className="font-semibold mb-1" style={{ color: formatacao.primaryColor }}>
                Pontos Fortes:
              </h4>
              {renderList(formData.pontosFortes) || <p>[Pontos Fortes]</p>}

              <h4 className="font-semibold mb-1 mt-3" style={{ color: formatacao.primaryColor }}>
                Casos de Sucesso:
              </h4>
              {renderParagraphs(formData.casosSucesso) || <p>[Casos de Sucesso]</p>}
            </div>
          </section>

          {/* Seção 6: ASPECTOS FINANCEIROS */}
          <section style={{ marginBottom: `${formatacao.spacing}px` }}>
            <h2
              className="font-bold mb-3 pb-2"
              style={{
                ...titleStyle,
                borderBottom: `2px solid ${formatacao.secondaryColor}`,
              }}
            >
              6. ASPECTOS FINANCEIROS
            </h2>
            <div style={{ marginLeft: "16px" }}>
              <h4 className="font-semibold mb-1" style={{ color: formatacao.primaryColor }}>
                Modelo de Precificação:
              </h4>
              {renderParagraphs(formData.modeloPrecificacao) || <p>[Modelo de Precificação]</p>}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer
          className="text-center py-4 text-white text-xs rounded-b-lg"
          style={{ backgroundColor: formatacao.primaryColor }}
        >
          <p>© {new Date().getFullYear()} FCB Advogados. Todos os direitos reservados.</p>
          <p>Este material é informativo e não constitui aconselhamento jurídico.</p>
        </footer>
      </div>
    </div>
  )
}
