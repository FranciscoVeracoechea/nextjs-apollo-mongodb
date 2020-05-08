import { BehaviorSubject, fromEvent } from 'rxjs';
import { Device } from '../../utils/interfaces/Device';
import { match } from '../../utils/functional';
import { debounceTime, tap } from 'rxjs/operators';


const isTouch = () => 'ontouchstart' in window || 'ontouchstart' in document.documentElement;
const initialState: Device = {
  media: '(max-width: 599px)',
  pagination: 3,
  resolutionKind: 'mobile',
  isTouch: false,
};
const deviceData: readonly Device[] = [
  {
    media: '(max-width: 599px)',
    pagination: 3,
    resolutionKind: 'mobile',
  },
  {
    media: '(max-width: 960px)',
    pagination: 6,
    resolutionKind: 'tablet',
  },
  {
    media: '(max-width: 1600px)',
    pagination: 9,
    resolutionKind: 'desktop',
  },
  {
    media: '(min-width: 1601px)',
    pagination: 12,
    resolutionKind: 'tv',
  },
];
const device$ = new BehaviorSubject(initialState);

export const getCurrent = () => deviceData.find(d => match(d.media).matches);

export const updateDevice = () =>  device$.next({
  ...getCurrent() || initialState,
  isTouch: isTouch(),
});


export const Device$ = device$.asObservable();

export const get = () => device$.getValue();

export const resize$ = () => fromEvent(window, 'resize').pipe(
  debounceTime(250),
  tap(() => updateDevice()),
); 