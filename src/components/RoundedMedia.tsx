import type { PropsWithChildren } from 'react';

type RoundedMediaProps = PropsWithChildren<{
  radius?: number;
  style?: React.CSSProperties;
}>;

export function RoundedMedia({ children, radius = 28, style }: RoundedMediaProps) {
  return (
    <div
      style={{
        borderRadius: radius,
        overflow: 'hidden',
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
