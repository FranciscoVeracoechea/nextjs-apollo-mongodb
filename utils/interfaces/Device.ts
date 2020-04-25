export interface Device {
  readonly media: '(max-width: 599px)' | '(max-width: 960px)' | '(max-width: 1600px)' | '(min-width: 1601px)',
  readonly pagination: 3 | 6 | 9 | 12,
  readonly resolutionKind: 'mobile' | 'tablet' | 'desktop' | 'tv',
  readonly isTouch?: boolean,
}
