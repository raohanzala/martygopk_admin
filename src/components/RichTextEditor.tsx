import React, { useEffect, useCallback } from 'react';
import { Tiptap, useEditor, useTiptap } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  IoList,
  IoListOutline,
  IoRemove,
  IoCode,
  IoChatboxOutline,
} from 'react-icons/io5';
import { cn } from '@/utils/cn';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  disabled?: boolean;
}

function MenuBar() {
  const { editor, isReady } = useTiptap();

  if (!isReady || !editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-background rounded-t-md">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        ariaLabel="Bold"
      >
        <span className="font-bold text-sm">B</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        ariaLabel="Italic"
      >
        <span className="italic text-sm font-serif">I</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        ariaLabel="Strikethrough"
      >
        <IoRemove className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        ariaLabel="Inline code"
      >
        <IoCode className="w-4 h-4" />
      </ToolbarButton>
      <span className="w-px h-5 bg-border mx-1" aria-hidden />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        ariaLabel="Heading 1"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        ariaLabel="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        ariaLabel="Heading 3"
      >
        H3
      </ToolbarButton>
      <span className="w-px h-5 bg-border mx-1" aria-hidden />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        ariaLabel="Bullet list"
      >
        <IoListOutline className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        ariaLabel="Numbered list"
      >
        <IoList className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        ariaLabel="Blockquote"
      >
        <IoChatboxOutline className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  onClick,
  isActive,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'p-2 rounded transition-colors',
        isActive
          ? 'bg-primary/20 text-primary'
          : 'text-text-secondary hover:bg-background hover:text-text-primary'
      )}
    >
      {children}
    </button>
  );
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  minHeight = '320px',
  className,
  disabled = false,
}) => {
  const handleUpdate = useCallback(
    ({ editor }: { editor: { getHTML: () => string } }) => {
      onChange(editor.getHTML());
    },
    [onChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-text-primary',
      },
    },
  });

  // Sync content when value changes externally (e.g. when loading blog for edit)
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentHtml = editor.getHTML();
      // Avoid unnecessary updates and potential loops
      if (value !== currentHtml && (value || '<p></p>') !== currentHtml) {
        editor.commands.setContent(value || '', { emitUpdate: false });
      }
    }
  }, [editor, value]);

  // Update editable state when disabled changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        'border border-border rounded-md overflow-hidden bg-surface',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      <Tiptap instance={editor}>
        <MenuBar />
        <Tiptap.Loading>
          <div
            className="px-4 py-3 text-text-muted text-sm"
            style={{ minHeight: '200px' }}
          >
            Loading editor...
          </div>
        </Tiptap.Loading>
        <div style={{ minHeight }} className="[&_.ProseMirror]:min-h-[200px]">
          <Tiptap.Content />
        </div>
      </Tiptap>
    </div>
  );
};

export default RichTextEditor;
