import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** The official four-colour Google G. Not a letter in a font. */
export function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.1c4.16-3.83 6.57-9.47 6.57-16.17z"
      />
      <Path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.1-5.52c-1.97 1.32-4.49 2.1-7.46 2.1-5.74 0-10.6-3.87-12.34-9.09H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <Path
        fill="#FBBC05"
        d="M11.66 28.16c-.44-1.32-.69-2.73-.69-4.16s.25-2.84.69-4.16v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.86l7.32-5.7z"
      />
      <Path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.14l7.32 5.7c1.74-5.22 6.6-9.09 12.34-9.09z"
      />
    </Svg>
  );
}
