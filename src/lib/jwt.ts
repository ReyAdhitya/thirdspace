const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** base64url -> bytes, without relying on atob being present. */
function base64UrlToBytes(input: string): Uint8Array {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bytes: number[] = [];

  for (let i = 0; i < padded.length; i += 4) {
    const c0 = B64.indexOf(padded[i]);
    const c1 = B64.indexOf(padded[i + 1]);
    const c2 = padded[i + 2] === '=' ? -1 : B64.indexOf(padded[i + 2]);
    const c3 = padded[i + 3] === '=' ? -1 : B64.indexOf(padded[i + 3]);

    bytes.push((c0 << 2) | (c1 >> 4));
    if (c2 >= 0) bytes.push(((c1 & 15) << 4) | (c2 >> 2));
    if (c3 >= 0) bytes.push(((c2 & 3) << 6) | c3);
  }
  return new Uint8Array(bytes);
}

function bytesToUtf8(bytes: Uint8Array): string {
  const Decoder = (globalThis as { TextDecoder?: typeof TextDecoder }).TextDecoder;
  if (Decoder) return new Decoder('utf-8').decode(bytes);

  // Manual UTF-8 walk so CJK names survive on runtimes without TextDecoder.
  let out = '';
  for (let i = 0; i < bytes.length; ) {
    const b = bytes[i];
    if (b < 0x80) {
      out += String.fromCharCode(b);
      i += 1;
    } else if (b < 0xe0) {
      out += String.fromCharCode(((b & 0x1f) << 6) | (bytes[i + 1] & 0x3f));
      i += 2;
    } else if (b < 0xf0) {
      out += String.fromCharCode(
        ((b & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f),
      );
      i += 3;
    } else {
      const cp =
        ((b & 0x07) << 18) |
        ((bytes[i + 1] & 0x3f) << 12) |
        ((bytes[i + 2] & 0x3f) << 6) |
        (bytes[i + 3] & 0x3f);
      const off = cp - 0x10000;
      out += String.fromCharCode(0xd800 + (off >> 10), 0xdc00 + (off & 0x3ff));
      i += 4;
    }
  }
  return out;
}

/**
 * Reads the claims out of a JWT. The signature is NOT verified: this app has
 * no backend, and the token is only used to fill a local profile. Anything
 * security-critical must verify server-side against Google's JWKS.
 */
export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T {
  const parts = token.split('.');
  if (parts.length < 2) throw new Error('bad-token');
  return JSON.parse(bytesToUtf8(base64UrlToBytes(parts[1]))) as T;
}
