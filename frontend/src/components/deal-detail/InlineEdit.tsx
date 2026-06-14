import { useState, useRef, useEffect } from 'react';

interface Props {
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'number' | 'date';
  className?: string;
  displayClassName?: string;
  placeholder?: string;
}

export default function InlineEdit({ value, onSave, type = 'text', className = '', displayClassName = '', placeholder = '—' }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function activate() {
    setDraft(value);
    setEditing(true);
  }

  function save() {
    setEditing(false);
    if (draft !== value) onSave(draft);
  }

  function cancel() {
    setEditing(false);
    setDraft(value);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') cancel();
        }}
        className={`border border-[#6F6EE8] rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F6EE8]/30 bg-white ${className}`}
      />
    );
  }

  return (
    <span
      onClick={activate}
      title="Click to edit"
      className={`cursor-text hover:bg-gray-100 rounded px-1 -mx-1 transition-colors ${displayClassName}`}
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </span>
  );
}
