import { useState, useRef, useMemo } from 'react';
import JoditEditor, { IJoditEditorProps } from 'jodit-react';
import { importWordDocument, exportToWord } from './utils/wordUtils';
import './App.css';

export interface WordEditorProps {
  placeholder?: string;
  initialContent?: string;
  height?: number;
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
  onChange?: (content: string) => void;
  className?: string;
}

function App({
  placeholder = 'Comece a escrever seu texto...',
  initialContent = '',
  height = 600,
  showHeader = true,
  title = 'Editor de Texto',
  subtitle = 'Crie e edite documentos com facilidade',
  onChange,
  className = '',
}: WordEditorProps) {
  const editor = useRef(null);
  const [content, setContent] = useState(initialContent);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      alert('Por favor, selecione um arquivo .docx');
      return;
    }

    setIsImporting(true);
    try {
      const htmlContent = await importWordDocument(file);
      setContent(htmlContent);
      onChange?.(htmlContent);
    } catch (error) {
      alert('Erro ao importar o documento. Tente novamente.');
      console.error(error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = async () => {
    if (!content.trim()) {
      alert('O documento está vazio. Adicione conteúdo antes de exportar.');
      return;
    }

    setIsExporting(true);
    try {
      await exportToWord(content, 'documento.docx');
    } catch (error) {
      alert('Erro ao exportar o documento. Tente novamente.');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange?.(newContent);
  };

  const config: IJoditEditorProps['config'] = useMemo(
    () => ({
      readonly: false,
      placeholder,
      buttons:
        'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,classSpan,lineHeight,superscript,subscript,file,image,video,speechRecognize,spellcheck,cut,|,undo,redo,|,align,hr,link,table',
      theme: 'default',
      height,
    }),
    [placeholder, height]
  );

  return (
    <div className={`app-container ${className}`}>
      {showHeader && (
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">{title}</h1>
            <p className="app-subtitle">{subtitle}</p>
          </div>
        </header>
      )}

      <main className="editor-wrapper">
        <div className="editor-container">
          <div className="editor-toolbar">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".docx"
              style={{ display: 'none' }}
            />
            <button
              onClick={handleImportClick}
              disabled={isImporting}
              className="toolbar-button import-button"
            >
              {isImporting ? 'Importando...' : '📥 Importar Word'}
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || !content.trim()}
              className="toolbar-button export-button"
            >
              {isExporting ? 'Exportando...' : '📤 Exportar Word'}
            </button>
          </div>

          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={handleContentChange}
            onChange={() => {}}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
