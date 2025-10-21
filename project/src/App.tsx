import { useState, useRef, useMemo } from 'react';
import JoditEditor, { IJoditEditorProps } from 'jodit-react';
import { importWordDocument, exportToWord } from './utils/wordUtils';
import './App.css';

function App({ placeholder }: { placeholder?: string }) {
  const editor = useRef(null);
  const [content, setContent] = useState('');
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

  const config: IJoditEditorProps['config'] = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Comece a escrever seu texto...',
      buttons:
        'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,classSpan,lineHeight,superscript,subscript,file,image,video,speechRecognize,spellcheck,cut,|,undo,redo,|,align,hr,link,table',
      theme: 'default',
      height: 600,
    }),
    [placeholder]
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Editor de Texto</h1>
          <p className="app-subtitle">Crie e edite documentos com facilidade</p>
        </div>
      </header>

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
            onBlur={(newContent) => setContent(newContent)}
            onChange={() => {}}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
