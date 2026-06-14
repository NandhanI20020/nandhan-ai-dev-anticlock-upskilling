interface Avatar { initials: string; color: string; }
interface Props { avatars: Avatar[]; total: number; size?: number; }

export default function AvatarStack({ avatars, total, size = 6 }: Props) {
  const shown = avatars.slice(0, 3);
  const extra = total - shown.length;
  const px = `${size * 4}px`;
  return (
    <div className="flex items-center">
      {shown.map((a, i) => (
        <div
          key={i}
          className="rounded-full flex items-center justify-center text-white font-bold border-2 border-white"
          style={{ width: px, height: px, fontSize: `${size * 1.5}px`, backgroundColor: a.color, marginLeft: i > 0 ? `-${size}px` : 0, zIndex: shown.length - i }}
        >
          {a.initials}
        </div>
      ))}
      {extra > 0 && (
        <div
          className="rounded-full flex items-center justify-center text-xs font-semibold bg-gray-200 text-gray-600 border-2 border-white"
          style={{ width: px, height: px, marginLeft: `-${size}px` }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
