/**
 * Services throw stable codes, never prose, so the UI can render the message
 * in the active locale instead of leaking one language into another.
 */
const KEY_OF: Record<string, string> = {
  'bad-credentials': 'errBadCredentials',
  'bad-email': 'errBadEmail',
  'weak-password': 'errWeakPassword',
  'email-taken': 'errEmailTaken',
  'not-found': 'errNotFound',
  'not-holder': 'errNotHolder',
  'empty-text': 'errEmptyText',
  'test-card': 'errTestCard',
  'title-required': 'errTitleRequired',
  'photos-denied': 'errPhotosDenied',
  banned: 'banned',
  'google-missing': 'googleMissing',
  'google-failed': 'errGoogleFailed',
  'google-cancelled': 'errGoogleCancelled',
  'bad-token': 'errGoogleFailed',
};

export function errorText(e: unknown, t: (key: string) => string): string {
  const raw = e instanceof Error ? e.message : '';
  const key = KEY_OF[raw];
  return key ? t(key) : raw || t('error');
}
