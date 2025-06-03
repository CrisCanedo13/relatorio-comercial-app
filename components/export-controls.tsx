"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileText, ImageIcon, FileIcon as FilePdf, Upload, Printer } from "lucide-react"
import { useState, useRef } from "react"
import type { FormData, FormatacaoConfig } from "@/app/page"

interface ExportControlsProps {
  formData: FormData
  formatacao: FormatacaoConfig
  onImportData?: (data: { formData: FormData; formatacao: FormatacaoConfig }) => void
}

export function ExportControls({ formData, formatacao, onImportData }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePrint = () => {
    try {
      setIsExporting("print")

      // Cria uma nova janela com o relatório formatado para impressão
      const reportHTML = generateReportHTML(formData, formatacao)
      const printHTML = getPrintHTMLDocument(reportHTML, formData, formatacao)

      // Cria um blob URL
      const blob = new Blob([printHTML], { type: "text/html" })
      const blobUrl = URL.createObjectURL(blob)

      // Abre em nova janela para impressão
      const printWindow = window.open(blobUrl, "_blank", "width=800,height=1000")

      if (!printWindow) {
        alert("Por favor, permita pop-ups para esta funcionalidade.")
        URL.revokeObjectURL(blobUrl)
        return
      }

      // Aguarda o carregamento e inicia a impressão
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          URL.revokeObjectURL(blobUrl)
        }, 1000)
      }
    } catch (error) {
      console.error("Erro ao imprimir:", error)
      alert("Erro ao imprimir. Tente usar a exportação HTML.")
    } finally {
      setIsExporting(null)
    }
  }

  const handleExportPNG = async () => {
    try {
      setIsExporting("png")

      // Cria uma nova janela com o relatório otimizado para captura
      const reportHTML = generateReportHTML(formData, formatacao)
      const pngHTML = getPNGHTMLDocument(reportHTML, formData, formatacao)

      // Cria um blob URL
      const blob = new Blob([pngHTML], { type: "text/html" })
      const blobUrl = URL.createObjectURL(blob)

      // Abre em nova janela
      const newWindow = window.open(blobUrl, "_blank", "width=900,height=1200")

      if (!newWindow) {
        alert("Por favor, permita pop-ups para esta funcionalidade.")
        URL.revokeObjectURL(blobUrl)
        return
      }

      // Aguarda o carregamento e instrui o usuário
      newWindow.onload = () => {
        setTimeout(() => {
          alert(
            "Para salvar como PNG:\n\n" +
              "OPÇÃO 1 - Captura de tela:\n" +
              "• Windows: Win + Shift + S ou Print Screen\n" +
              "• Mac: Cmd + Shift + 4\n" +
              "• Linux: Print Screen ou Shift + Print Screen\n\n" +
              "OPÇÃO 2 - Salvar pelo navegador:\n" +
              "• Clique com botão direito → 'Salvar como...'\n" +
              "• Escolha formato PNG se disponível",
          )
          URL.revokeObjectURL(blobUrl)
        }, 1500)
      }
    } catch (error) {
      console.error("Erro ao exportar PNG:", error)
      alert("Erro ao exportar como PNG. Tente usar a exportação HTML.")
    } finally {
      setIsExporting(null)
    }
  }

  const handleExportPDF = async () => {
    try {
      setIsExporting("pdf")

      // Usa a função de impressão do navegador para gerar PDF
      const reportHTML = generateReportHTML(formData, formatacao)
      const pdfHTML = getPDFHTMLDocument(reportHTML, formData, formatacao)

      // Cria um blob URL
      const blob = new Blob([pdfHTML], { type: "text/html" })
      const blobUrl = URL.createObjectURL(blob)

      // Abre em nova janela para impressão como PDF
      const pdfWindow = window.open(blobUrl, "_blank", "width=800,height=1000")

      if (!pdfWindow) {
        alert("Por favor, permita pop-ups para esta funcionalidade.")
        URL.revokeObjectURL(blobUrl)
        return
      }

      // Aguarda o carregamento e instrui sobre impressão em PDF
      pdfWindow.onload = () => {
        setTimeout(() => {
          alert(
            "Para salvar como PDF:\n\n" +
              "1. Pressione Ctrl+P (Windows/Linux) ou Cmd+P (Mac)\n" +
              "2. Na janela de impressão, escolha 'Salvar como PDF'\n" +
              "3. Configure as margens como 'Mínimas'\n" +
              "4. Clique em 'Salvar'\n\n" +
              "A janela será aberta automaticamente para impressão.",
          )

          // Abre automaticamente o diálogo de impressão
          setTimeout(() => {
            pdfWindow.print()
          }, 2000)

          URL.revokeObjectURL(blobUrl)
        }, 1000)
      }
    } catch (error) {
      console.error("Erro ao exportar PDF:", error)
      alert("Erro ao exportar como PDF. Tente novamente ou use a exportação HTML.")
    } finally {
      setIsExporting(null)
    }
  }

  const handleExportHTML = () => {
    try {
      setIsExporting("html")

      // Gera o HTML do relatório
      const reportHTML = generateReportHTML(formData, formatacao)
      const fullHTML = getFullHTMLDocument(reportHTML, formData, formatacao)

      // Cria o download
      const blob = new Blob([fullHTML], { type: "text/html" })
      const link = document.createElement("a")
      link.download = `relatorio-comercial-${formData.nomeProjeto.replace(/\s+/g, "-").toLowerCase()}.html`
      link.href = URL.createObjectURL(blob)
      link.click()

      // Libera o URL
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
      }, 100)
    } catch (error) {
      console.error("Erro ao exportar HTML:", error)
      alert("Erro ao exportar como HTML. Verifique o console para mais detalhes.")
    } finally {
      setIsExporting(null)
    }
  }

  const handleImportJSON = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        // Valida se o arquivo tem a estrutura esperada
        if (data.formData && data.formatacao) {
          onImportData?.(data)
          alert("Dados importados com sucesso!")
        } else {
          alert("Arquivo JSON inválido. Verifique se é um arquivo exportado pelo sistema.")
        }
      } catch (error) {
        console.error("Erro ao importar JSON:", error)
        alert("Erro ao ler o arquivo JSON. Verifique se o arquivo está correto.")
      }
    }
    reader.readAsText(file)

    // Limpa o input para permitir reimportar o mesmo arquivo
    event.target.value = ""
  }

  const handleExportJSON = () => {
    try {
      setIsExporting("json")

      const data = {
        formData,
        formatacao,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const link = document.createElement("a")
      link.download = `relatorio-dados-${formData.nomeProjeto.replace(/\s+/g, "-").toLowerCase()}.json`
      link.href = URL.createObjectURL(blob)
      link.click()

      // Libera o URL
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
      }, 100)
    } catch (error) {
      console.error("Erro ao exportar JSON:", error)
      alert("Erro ao exportar dados JSON. Verifique o console para mais detalhes.")
    } finally {
      setIsExporting(null)
    }
  }

  // Função para gerar documento HTML otimizado para impressão
  const getPrintHTMLDocument = (reportHTML: string, formData: FormData, formatacao: FormatacaoConfig) => {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.nomeProjeto} - FCB Advogados</title>
    <link href="https://fonts.googleapis.com/css2?family=${formatacao.fontFamily.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                margin: 0;
                padding: 0;
            }
            
            .container {
                box-shadow: none !important;
                border-radius: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            .no-print {
                display: none !important;
            }
        }
        
        body { 
            font-family: ${formatacao.fontFamily}, sans-serif; 
            margin: 0; 
            padding: 0;
            background-color: white;
            font-size: ${formatacao.fontSize}px;
            line-height: ${formatacao.lineHeight};
            color: ${formatacao.textColor};
        }
        
        .container { 
            width: 100%;
            max-width: 210mm;
            margin: 0 auto; 
            background: ${formatacao.backgroundColor}; 
            min-height: 100vh;
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .print-button:hover {
            background: #0056b3;
        }
    </style>
    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 1000);
        }
    </script>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">🖨️ Imprimir</button>
    <div class="container">
        ${reportHTML}
    </div>
</body>
</html>`
  }

  // Função para gerar documento HTML otimizado para PNG
  const getPNGHTMLDocument = (reportHTML: string, formData: FormData, formatacao: FormatacaoConfig) => {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.nomeProjeto} - FCB Advogados</title>
    <link href="https://fonts.googleapis.com/css2?family=${formatacao.fontFamily.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: ${formatacao.fontFamily}, sans-serif; 
            margin: 0; 
            padding: 20px;
            background-color: #f0f0f0;
            font-size: ${formatacao.fontSize}px;
            line-height: ${formatacao.lineHeight};
            color: ${formatacao.textColor};
        }
        
        .container { 
            width: 800px;
            margin: 0 auto; 
            background: ${formatacao.backgroundColor}; 
            border-radius: ${formatacao.borderRadius}px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .capture-info {
            position: fixed;
            top: 10px;
            left: 10px;
            background: #007bff;
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
            max-width: 300px;
        }
    </style>
</head>
<body>
    <div class="capture-info">
        📸 Use as ferramentas de captura de tela do seu sistema para salvar como PNG
    </div>
    <div class="container">
        ${reportHTML}
    </div>
</body>
</html>`
  }

  // Função para gerar documento HTML otimizado para PDF
  const getPDFHTMLDocument = (reportHTML: string, formData: FormData, formatacao: FormatacaoConfig) => {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.nomeProjeto} - FCB Advogados</title>
    <link href="https://fonts.googleapis.com/css2?family=${formatacao.fontFamily.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4;
            margin: 10mm;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                margin: 0;
                padding: 0;
            }
            
            .container {
                box-shadow: none !important;
                border-radius: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                page-break-inside: avoid;
            }
            
            .no-print {
                display: none !important;
            }
            
            section {
                page-break-inside: avoid;
                break-inside: avoid;
            }
        }
        
        body { 
            font-family: ${formatacao.fontFamily}, sans-serif; 
            margin: 0; 
            padding: 0;
            background-color: white;
            font-size: ${Math.max(formatacao.fontSize - 2, 12)}px;
            line-height: ${formatacao.lineHeight};
            color: ${formatacao.textColor};
        }
        
        .container { 
            width: 100%;
            max-width: 190mm;
            margin: 0 auto; 
            background: white; 
            min-height: 100vh;
        }
        
        .pdf-info {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #28a745;
            color: white;
            padding: 15px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 1000;
            max-width: 400px;
            line-height: 1.4;
        }
    </style>
</head>
<body>
    <div class="pdf-info no-print">
        📄 <strong>Para salvar como PDF:</strong><br>
        1. Pressione Ctrl+P (ou Cmd+P no Mac)<br>
        2. Escolha "Salvar como PDF"<br>
        3. Configure margens como "Mínimas"<br>
        4. Clique em "Salvar"
    </div>
    <div class="container">
        ${reportHTML}
    </div>
</body>
</html>`
  }

  // Função para gerar o documento HTML completo
  const getFullHTMLDocument = (reportHTML: string, formData: FormData, formatacao: FormatacaoConfig) => {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.nomeProjeto} - FCB Advogados</title>
    <link href="https://fonts.googleapis.com/css2?family=${formatacao.fontFamily.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @media print {
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            @page {
                size: A4;
                margin: 15mm;
            }
            
            .container {
                box-shadow: none !important;
                margin: 0 !important;
            }
        }
        
        body { 
            font-family: ${formatacao.fontFamily}, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5;
            font-size: ${formatacao.fontSize}px;
            line-height: ${formatacao.lineHeight};
            color: ${formatacao.textColor};
        }
        
        .container { 
            width: 210mm;
            max-width: 100%;
            margin: 0 auto; 
            background: ${formatacao.backgroundColor}; 
            border-radius: ${formatacao.borderRadius}px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        ${reportHTML}
    </div>
</body>
</html>`
  }

  // Add this helper function to generate the report HTML
  const generateReportHTML = (formData: FormData, formatacao: FormatacaoConfig) => {
    const renderList = (text: string) => {
      if (!text.trim()) return "<p>[Conteúdo não informado]</p>"
      const items = text.split("\n").filter((item) => item.trim())
      return `<ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">
      ${items.map((item) => `<li style="margin: 4px 0;">${item.trim()}</li>`).join("")}
    </ul>`
    }

    const renderParagraphs = (text: string) => {
      if (!text.trim()) return "<p>[Conteúdo não informado]</p>"
      const paragraphs = text.split("\n").filter((p) => p.trim())
      return paragraphs.map((paragraph) => `<p style="margin: 8px 0;">${paragraph.trim()}</p>`).join("")
    }

    return `
    <div style="
      font-family: ${formatacao.fontFamily}, sans-serif;
      font-size: ${formatacao.fontSize}px;
      line-height: ${formatacao.lineHeight};
      color: ${formatacao.textColor};
      background-color: ${formatacao.backgroundColor};
      overflow: hidden;
    ">
      <!-- Header -->
      <header style="padding: 24px; position: relative; background-color: #f5f5f5;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div style="width: 66%; padding-right: 16px;">
            <h1 style="
              font-size: ${formatacao.headerFontSize}px;
              color: ${formatacao.primaryColor};
              font-weight: bold;
              text-transform: uppercase;
              text-align: left;
              margin: 0;
            ">
              ${formData.nomeProjeto || "[Nome do Projeto/Produto]"}
            </h1>
          </div>
          <div style="
            position: absolute;
            top: 16px;
            right: 16px;
          ">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FCB_fundo%20transparente_assinatura_imagem_AL-DVzHiQaovpgYD4mSDbNfetuSDMyE2e.png" 
              alt="FCB Advogados" 
              style="width: ${Math.round(formatacao.logoSize * 2.5)}px; height: ${Math.round(formatacao.logoSize * 0.6)}px; object-fit: contain;"
              onerror="this.style.display='none'"
            />
          </div>
        </div>
      </header>

      <!-- Content -->
      <div style="padding: ${formatacao.spacing}px;">
        <!-- Seção 1: INFORMAÇÕES GERAIS DO PRODUTO -->
        <section style="margin-bottom: ${formatacao.spacing}px;">
          <h2 style="
            font-size: ${formatacao.titleFontSize}px;
            color: ${formatacao.primaryColor};
            font-weight: bold;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${formatacao.secondaryColor};
          ">
            1. INFORMAÇÕES GERAIS DO PRODUTO
          </h2>
          <div style="margin-left: 16px;">
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${formatacao.primaryColor};">
              Nome do Projeto/Produto:
            </h4>
            <p style="margin-bottom: 12px;">${formData.nomeProjeto || "[Nome do Projeto/Produto]"}</p>

            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${formatacao.primaryColor};">
              Descrição do Projeto/Produto:
            </h4>
            <div style="margin-bottom: 12px;">
              ${renderParagraphs(formData.descricaoProjeto)}
            </div>

            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${formatacao.primaryColor};">
              Objetivo do Projeto/Produto:
            </h4>
            ${renderList(formData.objetivoProjeto)}
          </div>
        </section>

        <!-- Seção 2: PÚBLICO-ALVO -->
        <section style="margin-bottom: ${formatacao.spacing}px;">
          <h2 style="
            font-size: ${formatacao.titleFontSize}px;
            color: ${formatacao.primaryColor};
            font-weight: bold;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${formatacao.secondaryColor};
          ">
            2. PÚBLICO-ALVO
          </h2>
          <div style="margin-left: 16px;">
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${formatacao.primaryColor};">
              Perfil do Cliente:
            </h4>
            ${renderList(formData.perfilCliente)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${formatacao.primaryColor};">
              Necessidades Específicas do Cliente:
            </h4>
            ${renderList(formData.necessidadesCliente)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${formatacao.primaryColor};">
              Setores de Atuação:
            </h4>
            ${renderList(formData.setoresAtuacao)}
          </div>
        </section>

        <!-- Seção 3: DETALHES DO PROJETO -->
        <section style="margin-bottom: ${formatacao.spacing}px;">
          <h2 style="
            font-size: ${formatacao.titleFontSize}px;
            color: ${formatacao.primaryColor};
            font-weight: bold;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${formatacao.secondaryColor};
          ">
            3. DETALHES DO PROJETO
          </h2>
          <div style="margin-left: 16px;">
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${formatacao.primaryColor};">
              Metodologia:
            </h4>
            ${renderList(formData.metodologia)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${formatacao.primaryColor};">
              Entregáveis:
            </h4>
            ${renderList(formData.entregaveis)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${formatacao.primaryColor};">
              Indicadores de Sucesso:
            </h4>
            ${renderList(formData.indicadoresSucesso)}
          </div>
        </section>

        <!-- Seção 4: BENEFÍCIOS PARA O CLIENTE -->
        <section style="margin-bottom: ${formatacao.spacing}px;">
          <h2 style="
            font-size: ${formatacao.titleFontSize}px;
            color: ${formatacao.primaryColor};
            font-weight: bold;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${formatacao.secondaryColor};
          ">
            4. BENEFÍCIOS PARA O CLIENTE
          </h2>
          <div style="margin-left: 16px;">
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${formatacao.primaryColor};">
              Benefícios Tangíveis:
            </h4>
            ${renderList(formData.beneficiosTangiveis)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${formatacao.primaryColor};">
              Benefícios Intangíveis:
            </h4>
            ${renderList(formData.beneficiosIntangiveis)}
          </div>
        </section>

        <!-- Seção 5: DIFERENCIAIS COMPETITIVOS -->
        <section style="margin-bottom: ${formatacao.spacing}px;">
          <h2 style="
            font-size: ${formatacao.titleFontSize}px;
            color: ${formatacao.primaryColor};
            font-weight: bold;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${formatacao.secondaryColor};
          ">
            5. DIFERENCIAIS COMPETITIVOS
          </h2>
          <div style="margin-left: 16px;">
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${formatacao.primaryColor};">
              Pontos Fortes:
            </h4>
            ${renderList(formData.pontosFortes)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${formatacao.primaryColor};">
              Casos de Sucesso:
            </h4>
            ${renderParagraphs(formData.casosSucesso)}
          </div>
        </section>

        <!-- Seção 6: ASPECTOS FINANCEIROS -->
        <section style="margin-bottom: ${formatacao.spacing}px;">
          <h2 style="
            font-size: ${formatacao.titleFontSize}px;
            color: ${formatacao.primaryColor};
            font-weight: bold;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${formatacao.secondaryColor};
          ">
            6. ASPECTOS FINANCEIROS
          </h2>
          <div style="margin-left: 16px;">
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${formatacao.primaryColor};">
              Modelo de Precificação:
            </h4>
            ${renderParagraphs(formData.modeloPrecificacao)}
          </div>
        </section>
      </div>

      <!-- Footer -->
      <footer style="
        text-align: center;
        padding: 16px;
        background-color: ${formatacao.primaryColor};
        color: white;
        font-size: 12px;
      ">
        <p style="margin: 0 0 4px 0;">© ${new Date().getFullYear()} FCB Advogados. Todos os direitos reservados.</p>
        <p style="margin: 0;">Este material é informativo e não constitui aconselhamento jurídico.</p>
      </footer>
    </div>
  `
  }

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: "none" }} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Printer className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Imprimir</h3>
                <p className="text-sm text-gray-600">Imprimir diretamente</p>
              </div>
            </div>
            <Button onClick={handlePrint} className="w-full" disabled={isExporting !== null}>
              <Printer className="h-4 w-4 mr-2" />
              {isExporting === "print" ? "Preparando..." : "Imprimir"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FilePdf className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold">Exportar PDF</h3>
                <p className="text-sm text-gray-600">Salvar como PDF</p>
              </div>
            </div>
            <Button onClick={handleExportPDF} className="w-full" disabled={isExporting !== null}>
              <FilePdf className="h-4 w-4 mr-2" />
              {isExporting === "pdf" ? "Preparando..." : "Exportar PDF"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold">Exportar PNG</h3>
                <p className="text-sm text-gray-600">Captura de tela</p>
              </div>
            </div>
            <Button onClick={handleExportPNG} className="w-full" variant="outline" disabled={isExporting !== null}>
              <ImageIcon className="h-4 w-4 mr-2" />
              {isExporting === "png" ? "Preparando..." : "Exportar PNG"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="font-semibold">Exportar HTML</h3>
                <p className="text-sm text-gray-600">Arquivo independente</p>
              </div>
            </div>
            <Button onClick={handleExportHTML} className="w-full" variant="outline" disabled={isExporting !== null}>
              <FileText className="h-4 w-4 mr-2" />
              {isExporting === "html" ? "Exportando..." : "Exportar HTML"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Importar</h3>
                <p className="text-sm text-gray-600">Carregar projeto</p>
              </div>
            </div>
            <Button onClick={handleImportJSON} className="w-full" variant="outline" disabled={isExporting !== null}>
              <Upload className="h-4 w-4 mr-2" />
              Importar JSON
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-semibold">Backup</h3>
                <p className="text-sm text-gray-600">Salvar dados</p>
              </div>
            </div>
            <Button onClick={handleExportJSON} className="w-full" variant="outline" disabled={isExporting !== null}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting === "json" ? "Salvando..." : "Exportar Dados"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">📋 Instruções de Uso</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800 mb-1">🖨️ Imprimir</p>
              <p>Abre uma janela otimizada para impressão direta. Ideal para impressoras físicas.</p>
            </div>

            <div className="p-3 bg-red-50 rounded-lg">
              <p className="font-medium text-red-800 mb-1">📄 PDF</p>
              <p>Abre janela com instruções para salvar como PDF usando Ctrl+P → "Salvar como PDF".</p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800 mb-1">📸 PNG</p>
              <p>Abre janela otimizada para captura de tela. Use Win+Shift+S (Windows) ou Cmd+Shift+4 (Mac).</p>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="font-medium text-orange-800 mb-1">🌐 HTML</p>
              <p>Baixa arquivo HTML independente que funciona em qualquer navegador.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
