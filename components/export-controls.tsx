"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  FileText,
  ImageIcon,
  FileIcon as FilePdf,
  Upload,
} from "lucide-react";
import { useState, useRef } from "react";
import type { FormData, FormatacaoConfig } from "@/app/page";
import html2canvas from "html2canvas";

interface ExportControlsProps {
  formData: FormData;
  formatacao: FormatacaoConfig;
  onImportData?: (data: {
    formData: FormData;
    formatacao: FormatacaoConfig;
  }) => void;
}

export function ExportControls({
  formData,
  formatacao,
  onImportData,
}: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPNG = async () => {
    let iframe = null; // Keep iframe reference for cleanup in finally block

    try {
      setIsExporting("png");

      const reportHTML = generateReportHTML(formData, formatacao);
      const fullHTML = getFullHTMLDocument(reportHTML, formData, formatacao);

      // 1. Create an off-screen iframe
      iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px"; // Position off-screen
      iframe.style.top = "-9999px";
      // It's often good to give the iframe a defined width from which content can be calculated,
      // especially if your report has a fixed-width layout.
      // Adjust this width based on your report's design.
      iframe.style.width = "1200px"; // Example width for rendering layout
      iframe.style.height = "1px"; // Minimal height, content will define its scrollHeight

      document.body.appendChild(iframe);

      // 2. Load HTML into iframe and wait for it to load
      await new Promise((resolve, reject) => {
        iframe.onload = resolve;
        iframe.onerror = () =>
          reject(new Error("Iframe failed to load content."));
        iframe.srcdoc = fullHTML; // Use srcdoc for self-contained HTML strings
      });

      // 3. Wait for content inside iframe to potentially finish rendering
      // (especially if there's JS, images, or complex CSS that takes a moment)
      // This delay might need adjustment or more sophisticated checks for complex content.
      await new Promise((resolve) => setTimeout(resolve, 300)); // e.g., 300ms delay

      const captureTarget = iframe.contentWindow.document.body;
      // If your report has a specific main container div inside the body, target that instead:
      // const captureTarget = iframe.contentWindow.document.getElementById('your-report-main-container-id');

      if (!captureTarget) {
        throw new Error(
          "Conteúdo do relatório não encontrado no iframe para captura."
        );
      }

      // Ensure the capture target has fully rendered its layout.
      // Styles within your fullHTML should ensure the body or container takes up needed space.

      // 4. Use html2canvas to capture the element
      const canvas = await html2canvas(captureTarget, {
        useCORS: true, // If your HTML loads images/fonts from other domains
        allowTaint: false, // Recommended to be false if useCORS is true and working
        backgroundColor: "#ffffff", // Set an explicit background color for the capture
        scale: window.devicePixelRatio || 2, // Improves quality on high-DPI screens (e.g., 2 for sharper)
        logging: process.env.NODE_ENV === "development", // Enable html2canvas logs only in development
        // Consider setting width/height if auto-detection by html2canvas is problematic,
        // using scrollWidth/scrollHeight of the captureTarget.
        // width: captureTarget.scrollWidth,
        // height: captureTarget.scrollHeight,
        // windowWidth: captureTarget.scrollWidth, // Helps with elements sized relative to viewport
        // windowHeight: captureTarget.scrollHeight,
      });

      // 5. Convert canvas to PNG and trigger download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "relatorio_comercial.png";
      link.href = image;
      document.body.appendChild(link); // Appending to body is required for Firefox
      link.click();
      document.body.removeChild(link); // Clean up the link

      // No need for blobUrl or newWindow for programmatic export
    } catch (error) {
      console.error("Erro ao exportar PNG:", error);
      alert(
        "Ocorreu um erro ao exportar como PNG. Verifique o console para mais detalhes."
      );
    } finally {
      if (iframe) {
        document.body.removeChild(iframe); // Always clean up the iframe
      }
      setIsExporting(null);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting("pdf");

      // Importa as bibliotecas necessárias
      const jsPDFModule = await import("jspdf");
      const { jsPDF } = jsPDFModule;

      // Cria o PDF diretamente usando texto
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Configurações de página
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const lineHeight = 6;
      let yPosition = margin;

      // Função para adicionar texto com quebra de linha
      const addText = (text: string, fontSize = 12, isBold = false) => {
        pdf.setFontSize(fontSize);
        if (isBold) {
          pdf.setFont("helvetica", "bold");
        } else {
          pdf.setFont("helvetica", "normal");
        }

        const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);

        // Verifica se precisa de nova página
        if (yPosition + lines.length * lineHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * lineHeight + 5;
      };

      // Adiciona o cabeçalho
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, 0, pageWidth, 40, "F");

      // Adiciona logo (texto FCB por enquanto)
      pdf.setTextColor(45, 46, 96);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("FCB ADVOGADOS", pageWidth - margin, 25, { align: "right" });

      pdf.setTextColor(45, 46, 96); // Cor azul FCB
      addText(formData.nomeProjeto || "[Nome do Projeto/Produto]", 18, true);

      yPosition = 50;

      // Adiciona o conteúdo
      pdf.setTextColor(0, 0, 0);

      addText("1. INFORMAÇÕES GERAIS DO PRODUTO", 14, true);
      addText("Nome do Projeto/Produto:", 12, true);
      addText(formData.nomeProjeto || "[Nome do Projeto/Produto]", 12);

      addText("Descrição do Projeto/Produto:", 12, true);
      addText(
        formData.descricaoProjeto || "[Descrição do Projeto/Produto]",
        12
      );

      addText("Objetivo do Projeto/Produto:", 12, true);
      const objetivos = formData.objetivoProjeto
        .split("\n")
        .filter((item) => item.trim());
      objetivos.forEach((obj) => addText(`• ${obj.trim()}`, 12));

      addText("2. PÚBLICO-ALVO", 14, true);
      addText("Perfil do Cliente:", 12, true);
      const perfis = formData.perfilCliente
        .split("\n")
        .filter((item) => item.trim());
      perfis.forEach((perfil) => addText(`• ${perfil.trim()}`, 12));

      addText("Necessidades Específicas do Cliente:", 12, true);
      const necessidades = formData.necessidadesCliente
        .split("\n")
        .filter((item) => item.trim());
      necessidades.forEach((nec) => addText(`• ${nec.trim()}`, 12));

      addText("Setores de Atuação:", 12, true);
      const setores = formData.setoresAtuacao
        .split("\n")
        .filter((item) => item.trim());
      setores.forEach((setor) => addText(`• ${setor.trim()}`, 12));

      addText("3. DETALHES DO PROJETO", 14, true);
      addText("Metodologia:", 12, true);
      const metodologias = formData.metodologia
        .split("\n")
        .filter((item) => item.trim());
      metodologias.forEach((met) => addText(`• ${met.trim()}`, 12));

      addText("Entregáveis:", 12, true);
      const entregaveis = formData.entregaveis
        .split("\n")
        .filter((item) => item.trim());
      entregaveis.forEach((ent) => addText(`• ${ent.trim()}`, 12));

      addText("Indicadores de Sucesso:", 12, true);
      const indicadores = formData.indicadoresSucesso
        .split("\n")
        .filter((item) => item.trim());
      indicadores.forEach((ind) => addText(`• ${ind.trim()}`, 12));

      addText("4. BENEFÍCIOS PARA O CLIENTE", 14, true);
      addText("Benefícios Tangíveis:", 12, true);
      const beneficiosTang = formData.beneficiosTangiveis
        .split("\n")
        .filter((item) => item.trim());
      beneficiosTang.forEach((ben) => addText(`• ${ben.trim()}`, 12));

      addText("Benefícios Intangíveis:", 12, true);
      const beneficiosIntang = formData.beneficiosIntangiveis
        .split("\n")
        .filter((item) => item.trim());
      beneficiosIntang.forEach((ben) => addText(`• ${ben.trim()}`, 12));

      addText("5. DIFERENCIAIS COMPETITIVOS", 14, true);
      addText("Pontos Fortes:", 12, true);
      const pontos = formData.pontosFortes
        .split("\n")
        .filter((item) => item.trim());
      pontos.forEach((ponto) => addText(`• ${ponto.trim()}`, 12));

      addText("Casos de Sucesso:", 12, true);
      const casos = formData.casosSucesso
        .split("\n")
        .filter((item) => item.trim());
      casos.forEach((caso) => addText(caso.trim(), 12));

      addText("6. ASPECTOS FINANCEIROS", 14, true);
      addText("Modelo de Precificação:", 12, true);
      const modelos = formData.modeloPrecificacao
        .split("\n")
        .filter((item) => item.trim());
      modelos.forEach((modelo) => addText(modelo.trim(), 12));

      // Adiciona rodapé
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFillColor(45, 46, 96);
        pdf.rect(0, pageHeight - 20, pageWidth, 20, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.text(
          `© ${new Date().getFullYear()} FCB Advogados. Todos os direitos reservados.`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      // Salva o PDF
      pdf.save(
        `relatorio-comercial-${formData.nomeProjeto
          .replace(/\s+/g, "-")
          .toLowerCase()}.pdf`
      );
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert(
        "Erro ao exportar como PDF. Tente novamente ou use a exportação HTML."
      );
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportHTML = () => {
    try {
      setIsExporting("html");

      // Gera o HTML do relatório
      const reportHTML = generateReportHTML(formData, formatacao);
      const fullHTML = getFullHTMLDocument(reportHTML, formData, formatacao);

      // Cria o download
      const blob = new Blob([fullHTML], { type: "text/html" });
      const link = document.createElement("a");
      link.download = `relatorio-comercial-${formData.nomeProjeto
        .replace(/\s+/g, "-")
        .toLowerCase()}.html`;
      link.href = URL.createObjectURL(blob);
      link.click();

      // Libera o URL
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    } catch (error) {
      console.error("Erro ao exportar HTML:", error);
      alert(
        "Erro ao exportar como HTML. Verifique o console para mais detalhes."
      );
    } finally {
      setIsExporting(null);
    }
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Valida se o arquivo tem a estrutura esperada
        if (data.formData && data.formatacao) {
          onImportData?.(data);
          alert("Dados importados com sucesso!");
        } else {
          alert(
            "Arquivo JSON inválido. Verifique se é um arquivo exportado pelo sistema."
          );
        }
      } catch (error) {
        console.error("Erro ao importar JSON:", error);
        alert(
          "Erro ao ler o arquivo JSON. Verifique se o arquivo está correto."
        );
      }
    };
    reader.readAsText(file);

    // Limpa o input para permitir reimportar o mesmo arquivo
    event.target.value = "";
  };

  // Função para gerar o documento HTML completo
  const getFullHTMLDocument = (
    reportHTML: string,
    formData: FormData,
    formatacao: FormatacaoConfig
  ) => {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.nomeProjeto} - FCB Advogados</title>
    <link href="https://fonts.googleapis.com/css2?family=${formatacao.fontFamily.replace(
      /\s+/g,
      "+"
    )}:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @media print {
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            @page {
                size: A4;
                margin: 0;
            }
            
            html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
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
</html>`;
  };

  const handleExportJSON = () => {
    try {
      setIsExporting("json");

      const data = {
        formData,
        formatacao,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.download = `relatorio-dados-${formData.nomeProjeto
        .replace(/\s+/g, "-")
        .toLowerCase()}.json`;
      link.href = URL.createObjectURL(blob);
      link.click();

      // Libera o URL
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    } catch (error) {
      console.error("Erro ao exportar JSON:", error);
      alert(
        "Erro ao exportar dados JSON. Verifique o console para mais detalhes."
      );
    } finally {
      setIsExporting(null);
    }
  };

  // Add this helper function to generate the report HTML
  const generateReportHTML = (
    formData: FormData,
    formatacao: FormatacaoConfig
  ) => {
    const renderList = (text: string) => {
      if (!text.trim()) return "<p>[Conteúdo não informado]</p>";
      const items = text.split("\n").filter((item) => item.trim());
      return `<ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">
      ${items
        .map((item) => `<li style="margin: 4px 0;">${item.trim()}</li>`)
        .join("")}
    </ul>`;
    };

    const renderParagraphs = (text: string) => {
      if (!text.trim()) return "<p>[Conteúdo não informado]</p>";
      const paragraphs = text.split("\n").filter((p) => p.trim());
      return paragraphs
        .map((paragraph) => `<p style="margin: 8px 0;">${paragraph.trim()}</p>`)
        .join("");
    };

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
    src="/images/fcb-logo.png" 
    alt="FCB Advogados" 
    style="width: ${Math.round(
      formatacao.logoSize * 2.5
    )}px; height: ${Math.round(
      formatacao.logoSize * 0.6
    )}px; object-fit: contain;"
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
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${
              formatacao.primaryColor
            };">
              Nome do Projeto/Produto:
            </h4>
            <p style="margin-bottom: 12px;">${
              formData.nomeProjeto || "[Nome do Projeto/Produto]"
            }</p>

            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${
              formatacao.primaryColor
            };">
              Descrição do Projeto/Produto:
            </h4>
            <div style="margin-bottom: 12px;">
              ${renderParagraphs(formData.descricaoProjeto)}
            </div>

            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${
              formatacao.primaryColor
            };">
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
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${
              formatacao.primaryColor
            };">
              Perfil do Cliente:
            </h4>
            ${renderList(formData.perfilCliente)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${
              formatacao.primaryColor
            };">
              Necessidades Específicas do Cliente:
            </h4>
            ${renderList(formData.necessidadesCliente)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${
              formatacao.primaryColor
            };">
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
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${
              formatacao.primaryColor
            };">
              Metodologia:
            </h4>
            ${renderList(formData.metodologia)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${
              formatacao.primaryColor
            };">
              Entregáveis:
            </h4>
            ${renderList(formData.entregaveis)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${
              formatacao.primaryColor
            };">
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
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${
              formatacao.primaryColor
            };">
              Benefícios Tangíveis:
            </h4>
            ${renderList(formData.beneficiosTangiveis)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${
              formatacao.primaryColor
            };">
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
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${
              formatacao.primaryColor
            };">
              Pontos Fortes:
            </h4>
            ${renderList(formData.pontosFortes)}

            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 12px; color: ${
              formatacao.primaryColor
            };">
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
            <h4 style="font-weight: 600; margin-bottom: 4px; color: ${
              formatacao.primaryColor
            };">
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
  `;
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: "none" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold">Exportar PNG</h3>
                <p className="text-sm text-gray-600">
                  Abrir em nova janela para captura
                </p>
              </div>
            </div>
            <Button
              onClick={handleExportPNG}
              className="w-full"
              variant="outline"
              disabled={isExporting !== null}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              {isExporting === "png" ? "Abrindo..." : "Exportar como PNG"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FilePdf className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold">Exportar PDF</h3>
                <p className="text-sm text-gray-600">
                  Salvar como documento PDF
                </p>
              </div>
            </div>
            <Button
              onClick={handleExportPDF}
              className="w-full"
              disabled={isExporting !== null}
            >
              <FilePdf className="h-4 w-4 mr-2" />
              {isExporting === "pdf" ? "Exportando..." : "Exportar como PDF"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="font-semibold">Exportar HTML</h3>
                <p className="text-sm text-gray-600">
                  Salvar como arquivo HTML
                </p>
              </div>
            </div>
            <Button
              onClick={handleExportHTML}
              className="w-full"
              variant="outline"
              disabled={isExporting !== null}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isExporting === "html" ? "Exportando..." : "Exportar como HTML"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Importar Dados</h3>
                <p className="text-sm text-gray-600">Carregar projeto salvo</p>
              </div>
            </div>
            <Button
              onClick={handleImportJSON}
              className="w-full"
              variant="outline"
              disabled={isExporting !== null}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar JSON
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-semibold">Exportar Dados</h3>
                <p className="text-sm text-gray-600">
                  Salvar dados em JSON para uso posterior
                </p>
              </div>
            </div>
            <Button
              onClick={handleExportJSON}
              className="w-full"
              variant="outline"
              disabled={isExporting !== null}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting === "json" ? "Exportando..." : "Exportar Dados"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Instruções de Uso</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>PNG:</strong> Abre o relatório em uma nova janela. Use as
              ferramentas de captura de tela do seu sistema ou clique com o
              botão direito e selecione "Salvar como...".
            </p>
            <p>
              <strong>PDF:</strong> Cria automaticamente um documento PDF
              profissional com múltiplas páginas se necessário.
            </p>
            <p>
              <strong>HTML:</strong> Cria um arquivo HTML independente que pode
              ser aberto em qualquer navegador.
            </p>
            <p>
              <strong>Importar Dados:</strong> Permite carregar um arquivo JSON
              previamente exportado para restaurar um projeto.
            </p>
            <p>
              <strong>Exportar Dados:</strong> Salva todos os dados e
              configurações para importar posteriormente ou fazer backup.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
