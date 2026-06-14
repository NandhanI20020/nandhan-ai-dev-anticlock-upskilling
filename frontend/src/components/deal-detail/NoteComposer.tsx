import { useState } from 'react';
import { useCreateNote } from '../../api/useDealDetail';

interface Props { dealId: string; overrideSaveFn?: (content: string) => Promise<unknown>; }

export default function NoteComposer({ dealId, overrideSaveFn }: Props) {
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);
  const createNote = useCreateNote(dealId);

  function handleSave() {
    if (!content.trim()) return;
    const fn = overrideSaveFn ?? ((c: string) => new Promise<unknown>((res, rej) => createNote.mutate(c, { onSuccess: res, onError: rej })));
    fn(content).then(() => { setContent(''); setFocused(false); }).catch(() => {});
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder="Add a note…"
        rows={focused ? 3 : 1}
        className="w-full px-3 py-2.5 text-sm resize-none focus:outline-none placeholder-gray-400"
      />
      {focused && (
        <div className="flex justify-end gap-2 px-3 pb-2">
          <button
            onClick={() => { setContent(''); setFocused(false); }}
            className="text-xs px-3 py-1.5 text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim() || createNote.isPending}
            className="text-xs px-3 py-1.5 text-white rounded-md cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: '#6F6EE8' }}
          >
            {createNote.isPending ? 'Saving…' : 'Save Note'}
          </button>
        </div>
      )}
    </div>
  );
}
