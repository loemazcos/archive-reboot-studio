import type { AppConfig } from '@/lib/types';
import { APP_ICONS, FALLBACK_ICON } from '@/components/phone/appIcons';

const appImages = import.meta.glob<string>('../../assets/images/apps/*.*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const imageByName = Object.fromEntries(
  Object.entries(appImages).map(([path, url]) => [path.split('/').pop()?.split('.')[0] ?? path, url]),
);

type Props = { app: AppConfig; size?: number };

export default function AppGlyph({ app, size = 60 }: Props) {
  const imageUrl = app.image ? imageByName[app.image] : undefined;
  if (imageUrl) {
    // Some source images (calculator) have a white border baked in; zoom past it.
    const zoom = app.id === 'calc' ? 1.32 : 1;
    return (
      <span
        className="block shrink-0 overflow-hidden rounded-[22%] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
        style={{ width: size, height: size }}
      >
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          className="h-full w-full object-cover"
          style={zoom === 1 ? undefined : { transform: `scale(${zoom})` }}
        />
      </span>
    );
  }
  const Icon = APP_ICONS[app.icon] ?? FALLBACK_ICON;
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[22%] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.12)]"
      style={{
        width: size,
        height: size,
        backgroundImage: `linear-gradient(180deg, ${app.colors[0]}, ${app.colors[1]})`,
        color: app.ink,
      }}
    >
      <Icon size={Math.round(size * 0.5)} strokeWidth={1.8} aria-hidden="true" />
    </span>
  );
}
