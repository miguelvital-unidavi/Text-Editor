import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const importWordDocument = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Erro ao importar documento:', error);
    throw new Error('Falha ao importar o documento Word');
  }
};

export const exportToWord = async (htmlContent: string, filename: string = 'documento.docx') => {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const paragraphs: Paragraph[] = [];

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun(text)],
            })
          );
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        if (tagName === 'p' || tagName === 'div') {
          const text = element.textContent?.trim();
          if (text) {
            const textRun = new TextRun({
              text: text,
              bold: element.querySelector('strong, b') !== null,
              italics: element.querySelector('em, i') !== null,
              underline: element.querySelector('u') !== null ? {} : undefined,
            });

            paragraphs.push(
              new Paragraph({
                children: [textRun],
              })
            );
          }
        } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
          const text = element.textContent?.trim();
          if (text) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: text,
                    bold: true,
                    size: tagName === 'h1' ? 32 : tagName === 'h2' ? 28 : 24,
                  }),
                ],
                heading: tagName === 'h1' ? 'Heading1' : tagName === 'h2' ? 'Heading2' : 'Heading3',
              })
            );
          }
        } else if (tagName === 'ul' || tagName === 'ol') {
          const items = element.querySelectorAll('li');
          items.forEach((li) => {
            const text = li.textContent?.trim();
            if (text) {
              paragraphs.push(
                new Paragraph({
                  children: [new TextRun(text)],
                  bullet: tagName === 'ul' ? { level: 0 } : undefined,
                  numbering: tagName === 'ol' ? { level: 0, reference: 'default-numbering' } : undefined,
                })
              );
            }
          });
        } else if (tagName === 'br') {
          paragraphs.push(new Paragraph({ children: [new TextRun('')] }));
        } else {
          Array.from(element.childNodes).forEach(processNode);
        }
      }
    };

    Array.from(tempDiv.childNodes).forEach(processNode);

    if (paragraphs.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(tempDiv.textContent || '')],
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  } catch (error) {
    console.error('Erro ao exportar documento:', error);
    throw new Error('Falha ao exportar o documento Word');
  }
};
