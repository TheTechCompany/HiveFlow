import React, { useRef, useEffect } from 'react';
import {
  RichTextEditor as MuiRichTextEditor,
  type RichTextEditorRef,
} from 'mui-tiptap';
import {
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonStrikethrough,
  MenuButtonCode,
  MenuButtonBulletedList,
  MenuButtonOrderedList,
  MenuButtonTaskList,
  MenuButtonBlockquote,
  MenuButtonUndo,
  MenuButtonRedo,
  MenuButtonEditLink
} from 'mui-tiptap';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Box } from '@mui/material';

// ── Types ───────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  /** HTML content to load */
  value?: string;
  /** Called with HTML whenever content changes */
  onChange?: (html: string) => void;
  /** Called when a checklist item is toggled, with details about the change */
  onChecklistToggle?: (event: {
    text: string;
    checked: boolean;
    /** Index of the item in the current checklist (0-based) */
    index: number;
    /** The full HTML after the toggle */
    html: string;
  }) => void;
  /** Placeholder when empty */
  placeholder?: string;
  /** Min height of the editor area (applied as CSS) */
  minHeight?: number;
  /** When false, renders static read-only HTML (no toolbar, no editing) */
  editable?: boolean;
}

// ── Extensions ──────────────────────────────────────────────────────

const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
];

// ── Editor ──────────────────────────────────────────────────────────

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  onChecklistToggle,
  placeholder = 'Write something…',
  minHeight = 200,
  editable = true,
}) => {
  const rteRef = useRef<RichTextEditorRef>(null);
  const prevChecklistRef = useRef<Map<number, boolean>>(new Map());

  // Sync external value changes (e.g. switching between tasks)
  useEffect(() => {
    const editor = rteRef.current?.editor;
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
      // Reset checklist tracking when content is replaced externally
      prevChecklistRef.current = buildChecklistMap(editor.getJSON());
    }
  }, [value]);

  // ── Read-only static HTML rendering ───────────────────────────
  if (!editable) {
    if (!value) {
      return (
        <Box
          sx={{
            minHeight: `${minHeight}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.disabled',
            fontStyle: 'italic',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            bgcolor: 'action.hover',
          }}
        >
          No description
        </Box>
      );
    }

    return (
      <Box
        className="ProseMirror-static"
        sx={{
          minHeight: `${minHeight}px`,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
          bgcolor: 'action.hover',
          // basic prose styling (exclude task-list elements)
          '& h2': { fontSize: '1.25rem', fontWeight: 600, mt: 2, mb: 1 },
          '& h3': { fontSize: '1.1rem', fontWeight: 600, mt: 1.5, mb: 0.5 },
          '& p': { mb: 1, '&:last-child': { mb: 0 } },
          '& ul:not([data-type="taskList"]), & ol': { pl: 3, mb: 1 },
          '& li:not([data-type="taskItem"])': { mb: 0.25 },
          '& blockquote': {
            borderLeft: '3px solid',
            borderColor: 'divider',
            pl: 2,
            ml: 0,
            mr: 0,
            my: 1,
            color: 'text.secondary',
          },
          '& code': {
            bgcolor: 'grey.200',
            px: 0.5,
            py: 0.125,
            borderRadius: 0.5,
            fontSize: '0.875em',
            fontFamily: 'monospace',
          },
          '& s': { textDecoration: 'line-through' },
          // ── Task-list (static read-only) ─────────────────────
          // Reset list defaults
          '& [data-type="taskList"]': {
            listStyle: 'none',
            pl: 0,
            mb: 1,
          },
          // Each task-item row
          '& [data-type="taskItem"]': {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            mb: '2px',
            listStyle: 'none',
          },
          // Checkbox label
          '& [data-type="taskItem"] > label': {
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0,
            m: 0,
            p: 0,
            cursor: 'default',
            minHeight: '1.5em', // match line-height so checkbox centres on text
          },
          // Hide TipTap's checkboxStyler span (used only in editor for custom styling)
          '& [data-type="taskItem"] > label > span': {
            display: 'none',
          },
          '& [data-type="taskItem"] > label > input[type="checkbox"]': {
            m: 0,
            pointerEvents: 'none',
          },
          // Content div
          '& [data-type="taskItem"] > div': {
            flex: 1,
            minWidth: 0,
          },
          // Suppress p margins inside task items
          '& [data-type="taskItem"] > div p': {
            m: 0,
          },
          // Checked → strikethrough
          '& [data-type="taskItem"][data-checked="true"] > div': {
            textDecoration: 'line-through',
            color: 'text.disabled',
          },
          // Nested task list indent
          '& [data-type="taskList"] [data-type="taskList"]': {
            pl: 3,
            mb: 0,
          },
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }

  // ── Editable editor ───────────────────────────────────────────
  return (
    <Box
      sx={{
        '& .ProseMirror': {
          minHeight: `${minHeight}px`,
        },
        '& .MuiTiptap-RichTextContent-root': {
          minHeight: `${minHeight}px`,
        },
      }}
    >
      <MuiRichTextEditor
        ref={rteRef}
        extensions={extensions}
        content={value}
        onUpdate={({ editor }) => {
          const html = editor.getHTML();
          onChange?.(html === '<p></p>' ? '' : html);

          // Detect checklist toggles
          if (onChecklistToggle) {
            const json = editor.getJSON();
            const newMap = buildChecklistMap(json);
            const prevMap = prevChecklistRef.current;

            // Find items that changed
            const allKeys = new Set([
              ...prevMap.keys(),
              ...newMap.keys(),
            ]);
            for (const key of allKeys) {
              const prevChecked = prevMap.get(key);
              const newChecked = newMap.get(key);
              if (prevChecked !== undefined && newChecked !== undefined && prevChecked !== newChecked) {
                const item = getChecklistItemAt(json, key);
                if (item) {
                  onChecklistToggle({ text: item.text, checked: newChecked, index: key, html });
                }
                break; // Only report one change per update
              }
            }
            prevChecklistRef.current = newMap;
          }
        }}
        editorDependencies={[]}
        renderControls={() => (
          <MenuControlsContainer>
            <MenuButtonUndo />
            <MenuButtonRedo />
            <MenuDivider />
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonStrikethrough />
            <MenuButtonCode />
            <MenuDivider />
            <MenuButtonBulletedList />
            <MenuButtonOrderedList />
            <MenuButtonTaskList />
            <MenuButtonBlockquote />
            <MenuButtonEditLink />
          </MenuControlsContainer>
        )}
        RichTextFieldProps={{
          placeholder,
          variant: 'outlined',
        }}
      />
    </Box>
  );
};

export default RichTextEditor;

// ── Helper for checklist extraction ─────────────────────────────────

/**
 * Build a Map<index, checked> from the editor JSON for diffing.
 * The index is the 0-based position among all taskItems in document order.
 */
function buildChecklistMap(doc: Record<string, unknown>): Map<number, boolean> {
  const map = new Map<number, boolean>();
  let idx = 0;

  function walk(node: any) {
    if (node.type === 'taskItem') {
      map.set(idx++, !!node.attrs?.checked);
    }
    if (node.content) {
      for (const child of node.content) walk(child);
    }
  }

  walk(doc);
  return map;
}

/**
 * Get a checklist item by its 0-based index from the editor JSON.
 */
function getChecklistItemAt(
  doc: Record<string, unknown>,
  targetIndex: number,
): { text: string; checked: boolean } | null {
  let idx = 0;

  function walk(node: any): { text: string; checked: boolean } | null {
    if (node.type === 'taskItem') {
      if (idx === targetIndex) {
        let text = '';
        if (node.content) {
          for (const child of node.content) {
            if (child.type === 'text') text += child.text ?? '';
            if (child.type === 'paragraph') text += extractText(child);
          }
        }
        return { text: text.trim(), checked: !!node.attrs?.checked };
      }
      idx++;
    }
    if (node.content) {
      for (const child of node.content) {
        const found = walk(child);
        if (found) return found;
      }
    }
    return null;
  }

  return walk(doc);
}

/**
 * Extract checklist items from TipTap JSON content.
 * Returns an array of { text, checked } objects.
 *
 * Usage:
 *   import { extractChecklist } from './RichTextEditor';
 *   const items = extractChecklist(editor.getJSON());
 */
export function extractChecklist(
  doc: Record<string, unknown>,
): Array<{ text: string; checked: boolean }> {
  const items: Array<{ text: string; checked: boolean }> = [];

  function walk(node: any) {
    if (node.type === 'taskItem') {
      let text = '';
      if (node.content) {
        for (const child of node.content) {
          if (child.type === 'text') text += child.text ?? '';
          if (child.type === 'paragraph') text += extractText(child);
        }
      }
      items.push({ text: text.trim(), checked: !!node.attrs?.checked });
    }
    if (node.content) {
      for (const child of node.content) walk(child);
    }
  }

  walk(doc);
  return items;
}

function extractText(node: any): string {
  if (node.type === 'text') return node.text ?? '';
  if (node.content) return node.content.map(extractText).join('');
  return '';
}

/**
 * Extract checklist items from HTML description content.
 * Parses TipTap's task-list HTML: <li data-type="taskItem" data-checked="true|false">
 * Returns an array of { text, checked } objects.
 *
 * Usage:
 *   import { extractChecklistFromHtml } from './RichTextEditor';
 *   const items = extractChecklistFromHtml(task.description);
 *   // items.length === 0 means no checklist items exist
 *   // items.filter(i => i.checked).length → completed count
 */
export function extractChecklistFromHtml(
  html: string | null | undefined,
): Array<{ text: string; checked: boolean }> {
  if (!html) return [];

  // Parse into a temporary DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const items: Array<{ text: string; checked: boolean }> = [];
  const taskItems = doc.querySelectorAll<HTMLLIElement>('[data-type="taskItem"]');

  taskItems.forEach((li) => {
    const checked = li.getAttribute('data-checked') === 'true';
    // Text is inside the <div> child (TipTap wraps content in <div>)
    const contentDiv = li.querySelector(':scope > div');
    const text = (contentDiv?.textContent ?? '').trim();
    items.push({ text, checked });
  });

  return items;
}
