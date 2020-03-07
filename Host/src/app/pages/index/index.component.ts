import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as posenet from '@tensorflow-models/posenet';
import { from, defer, animationFrameScheduler, timer, of, Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { concatMap, tap, map, observeOn, takeUntil, repeat } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { loadImage$, onloadedmetadata$ } from 'src/app/@core/shared/utils';
import { viewClassName } from '@angular/compiler';
import { ApiService } from 'src/app/@core/services/api.service';
import { step } from '@tensorflow/tfjs-core';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  // 線條寬度，顏色
  lineWidth = 10;
  color = 'aqua';

  // Video Size

  camWidth = 1024;
  camHeight = 768;


  countImg = 0;
  countTime = 0;
  displayImg: HTMLImageElement = null;

  isFire = false;
  // Image

  shy = new Image();
  pixelsunglasses = new Image();
  sunglasses = new Image();
  // tslint:disable-next-line: variable-name
  thug_life = new Image();
  fire1 = new Image();
  fire2 = new Image();
  fire3 = new Image();
  fire4 = new Image();
  fire5 = new Image();
  fire6 = new Image();
  nyanstamp = new Image();

  imageList = {
    shy: [this.shy],
    pixelsunglasses: [this.pixelsunglasses],
    sunglasses: [this.sunglasses],
    thug_life: [this.thug_life],
    move_fire: [
      this.fire1,
      this.fire2,
      this.fire3,
      this.fire4,
      this.fire5,
      this.fire6
    ],
    nyanstamp: [this.nyanstamp]
  };

  imageLoadList$ = [
    loadImage$(this.shy),
    loadImage$(this.sunglasses),
    loadImage$(this.pixelsunglasses),
    loadImage$(this.thug_life),
    loadImage$(this.fire1),
    loadImage$(this.fire2),
    loadImage$(this.fire3),
    loadImage$(this.fire4),
    loadImage$(this.fire5),
    loadImage$(this.fire6),
    loadImage$(this.nyanstamp),


  ];

  imageObj$ = new BehaviorSubject<HTMLImageElement[]>(null);

  // Webcam

  @ViewChild('vid', { static: true }) vid: ElementRef;

  video: HTMLVideoElement;

  constructor(
    private apiService: ApiService,
  ) {


    this.apiService.socket$.subscribe((msg: any) => {
      console.log(msg);
      if (msg.message) {
        console.log(msg.message);
      }
      if (msg.sku) {
        this.imageObj$.next(this.imageList[msg.sku]);
        if (msg.sku === 'move_fire') {
          this.isFire = true;
        } else {
          this.isFire = false;
        }
      }
    });

    this.shy.src = 'assets/shy.png';
    this.pixelsunglasses.src = 'assets/pixelsunglasses.png';
    this.sunglasses.src = 'assets/sunglasses.png';
    this.thug_life.src = 'assets/thug_life.png';
    this.fire1.src = 'assets/fire1.png';
    this.fire2.src = 'assets/fire2.png';
    this.fire3.src = 'assets/fire3.png';
    this.fire4.src = 'assets/fire4.png';
    this.fire5.src = 'assets/fire5.png';
    this.fire6.src = 'assets/fire6.png';
    this.nyanstamp.src = 'assets/nyanstamp.png';
  }

  ngOnInit() {
    this.video = this.vid.nativeElement;
    // 初始化相機
    const action$ = (model: posenet.PoseNet) =>
      defer(() => model.estimateMultiplePoses(this.video)).pipe(
        observeOn(animationFrameScheduler),
        tap((predictions: posenet.Pose[]) => this.renderPredictions(predictions)),
        takeUntil(timer(1000)),
        repeat()
      );
    // 訂閱Observeable
    this.subs.add(
      // 下載模型
      this.webcamInit$().pipe(
        concatMap(() =>
          from(posenet.load({
            architecture: 'ResNet50',
            outputStride: 32,
            inputResolution: 257,
            quantBytes: 2
          }))),
        // 讀取圖片
        concatMap(model => forkJoin(this.imageLoadList$).pipe(map(() => model))),
        // 預測
        concatMap(model => action$(model)),
      ).subscribe()
    );
  }




  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // utils 計算工具
  calDistance(position1: { x: number, y: number }, position2: { x: number, y: number }, ): number {
    return Math.floor(Math.sqrt((position1.x - position2.x) ** 2 + (position1.y - position2.y) ** 2));
  }
  toTuple({ y, x }) {
    return [y, x];
  }

  // 初始化相機
  webcamInit$ = () =>
    from(navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true
      })
    ).pipe(
      map(stream => {
        this.video.srcObject = stream;
        // this.video.autoplay = true;
        return this.video;
      }),
      concatMap((video) => onloadedmetadata$(video))
    )


  // 預測完畫進去圖案上
  renderPredictions = (predictions: posenet.Pose[]) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // 設定寬高
    canvas.width = this.camWidth;
    canvas.height = this.camHeight;
    // 清空畫布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // 畫上Video
    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
    // 定義最低準確度達多少就畫圖  (15%)
    const minConfidence = 0.15;
    // 把每一個物件畫上去
    predictions.forEach(({ score, keypoints }) => {
      if (score >= minConfidence) {
        const distance = this.calDistance(keypoints[3].position, keypoints[4].position) * 2;
        if (distance < 150 && distance > 60) {
          this.drawSkeleton(keypoints, minConfidence, ctx);
          this.drawKeypoints(keypoints, minConfidence, ctx, distance);
        } else if (distance > 150) {
          this.drawKeypoints(keypoints, minConfidence, ctx, distance);
        }
      }
    });
  }

  CalcAngle({ px, py }, { ax, ay }) {
    return Math.atan((ax - px) / (ay - py));
  }

  drawKeypoints(keypoints: posenet.Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D, distance: number, scale = 1, ) {
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (keypoint.score < minConfidence) {
        continue;
      }
      const { y, x } = keypoint.position;

      const img = this.stepImg(this.imageObj$.value);
      if (img) {
        if (i > 5) {
          // this.drawPoint(ctx, y * scale, x * scale, 3, this.color);
        } else {
          if (i === 0) {
            // ctx.rotate(rol * Math.PI / 2);
            let imgY = distance > 150 ? y - (distance / 2) : y - (distance / 2) - (distance / 3);
            if (this.isFire) {
              imgY = imgY - (distance / 1.5);
            }
            ctx.drawImage(img, x - (distance / 2), imgY, distance, distance);
          }
        }
      }
    }
  }

  drawSkeleton(keypoints: posenet.Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D, scale = 1) {
    const adjacentKeyPoints =
      posenet.getAdjacentKeyPoints(keypoints, minConfidence);
    adjacentKeyPoints.forEach((keypoint) => {
      this.drawSegment(
        this.toTuple(keypoint[0].position), this.toTuple(keypoint[1].position), this.color,
        scale, ctx);
    });
  }

  drawSegment([ay, ax]: any, [by, bx]: any, color: string, scale: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  stepImg(imgList: HTMLImageElement[]) {
    if (imgList) {
      if (this.countTime >= 20 || this.displayImg === null) {
        this.countTime = 0;
        if (this.countImg >= (imgList.length - 1)) {
          this.countImg = 0;
        } else {
          this.countImg += 1;
        }
        this.displayImg = imgList[this.countImg];
      } else {
        this.countTime += 1;
      }
      return this.displayImg;
    } else {
      return null;
    }

  }
}
