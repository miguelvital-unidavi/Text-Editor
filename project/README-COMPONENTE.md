# Word Editor Component

Um componente React completo para edição de textos com suporte a importação e exportação de documentos Word (.docx).

## Características

- Editor de texto rico baseado em Jodit
- Importação de arquivos Word (.docx)
- Exportação para Word (.docx)
- Totalmente customizável
- TypeScript support

## Instalação

Primeiro, instale as dependências necessárias:

```bash
npm install jodit-react mammoth docx file-saver
npm install --save-dev @types/file-saver
```

## Como usar

### Uso básico

```tsx
import { WordEditor } from './caminho-para-o-componente';

function App() {
  return <WordEditor />;
}
```

### Com customização

```tsx
import { WordEditor } from './caminho-para-o-componente';

function App() {
  const handleChange = (content: string) => {
    console.log('Conteúdo atualizado:', content);
  };

  return (
    <WordEditor
      placeholder="Digite seu texto aqui..."
      initialContent="<p>Conteúdo inicial</p>"
      height={500}
      showHeader={true}
      title="Meu Editor"
      subtitle="Editor personalizado"
      onChange={handleChange}
      className="meu-editor-custom"
    />
  );
}
```

### Sem header

```tsx
import { WordEditor } from './caminho-para-o-componente';

function App() {
  return (
    <WordEditor
      showHeader={false}
      height={400}
    />
  );
}
```

## Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `placeholder` | `string` | `'Comece a escrever seu texto...'` | Texto placeholder do editor |
| `initialContent` | `string` | `''` | Conteúdo HTML inicial |
| `height` | `number` | `600` | Altura do editor em pixels |
| `showHeader` | `boolean` | `true` | Exibir ou ocultar o header |
| `title` | `string` | `'Editor de Texto'` | Título do header |
| `subtitle` | `string` | `'Crie e edite documentos com facilidade'` | Subtítulo do header |
| `onChange` | `(content: string) => void` | `undefined` | Callback chamado quando o conteúdo muda |
| `className` | `string` | `''` | Classes CSS adicionais |

## Arquivos necessários

Para usar este componente em outro projeto, copie os seguintes arquivos:

```
src/
  ├── App.tsx          # Componente principal
  ├── App.css          # Estilos
  ├── index.ts         # Exports
  └── utils/
      └── wordUtils.ts # Utilitários para Word
```

## Funções utilitárias

Você também pode usar as funções utilitárias separadamente:

```tsx
import { importWordDocument, exportToWord } from './caminho-para-o-componente';

// Importar documento
const handleImport = async (file: File) => {
  const htmlContent = await importWordDocument(file);
  console.log(htmlContent);
};

// Exportar documento
const handleExport = async (htmlContent: string) => {
  await exportToWord(htmlContent, 'meu-documento.docx');
};
```

## Customização de estilos

Você pode sobrescrever os estilos usando a prop `className` e CSS customizado:

```tsx
<WordEditor className="meu-editor" />
```

```css
.meu-editor .app-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
}

.meu-editor .toolbar-button {
  border-radius: 4px;
}
```

## Dependências

- `react` >= 18.2.0
- `jodit-react` = 1.3.39
- `mammoth` >= 1.11.0
- `docx` >= 9.5.1
- `file-saver` >= 2.0.5
