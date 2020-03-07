import { Observable, of } from 'rxjs';

export const loadImage$ = (imageObj: HTMLImageElement): Observable<(observer: any) => void> => {
  return of((observer: any) => {
    imageObj.onload = () => {
      observer.onNext(imageObj);
      observer.onCompleted();
    };
    imageObj.onerror = (err) => {
      observer.onError(err);
    };
  });
};
export const onloadedmetadata$ = (video: HTMLVideoElement): Observable<(observer: any) => void> => {
  return of((observer: any) => {
    video.onloadedmetadata = () => {
      video.play();
      observer.onNext(video);
      observer.onCompleted();
    };
    video.onerror = (err) => {
      observer.onError(err);
    };
  });
};
