
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Expo } from "gsap";
import { Rect } from "../libs/rect";
import { Point } from "../libs/point";
import { Util } from "../libs/util";
import { Func } from "../core/func";

// -----------------------------------------
//
// -----------------------------------------
export class Segment extends MyDisplay {

  private _id:number;
  private _input:any;
  private _rot:number = 0; // 度数表記
  private _pos:Point = new Point();
  private _size:Rect = new Rect();
  private _inputType:string;
  private _noise:number = Util.instance.random(0, 1)

  constructor(opt:any) {
    super(opt)

    this._id = opt.id;
    this._c = this._id * 2;

    this._input = document.createElement('input');

    this._inputType = Util.instance.randomArr(['range', 'checkbox', 'radio', 'text'])
    this._input.setAttribute('type', this._inputType);

    if(this._inputType == 'range') {
      this._input.setAttribute('min', '0');
      this._input.setAttribute('max', '100');
      this._input.setAttribute('step', '1');
    }

    this.getEl().append(this._input);

    // スライダー行ったり来たりさせる
    if(this._inputType == 'range') {
      this._motion(this._id * 0.05);
    }

    this._resize();
  }


  private _motion(delay:number = 0): void {
    Tween.instance.a(this._input, {
      value:[0, 100]
    }, 1, delay, Expo.easeInOut, null, null, () => {
      Tween.instance.a(this._input, {
        value:0
      }, 1, 0, Expo.easeInOut, null, null, () => {
        this._motion();
      })
    })
  }


  public setRot(val:number): void {
    this._rot = val;
  }


  public getRot(): number {
    return this._rot;
  }


  public setPos(x:number, y:number): void {
    this._pos.x = x;
    this._pos.y = y;
  }


  public getPos(): Point {
    return this._pos;
  }


  public getPin(): Point {
    const radian = Util.instance.radian(this._rot);
    const x = this._pos.x + Math.cos(radian) * this._size.width;
    const y = this._pos.y + Math.sin(radian) * this._size.width;

    return new Point(x, y);
  }


  protected _update(): void {
    super._update();

    // 一定間隔で反転
    if(this._c % 20 == 0) {
      this._input.checked = !this._input.checked;
    }

    if(this._inputType == 'text') {
      const num = ~~(Util.instance.mix(5, 15, this._noise));
      this._input.value = ''
      for(let i = 0; i < num; i++) {
        this._input.value += Util.instance.randomArr('ABCDEFGHIKLMNOPRSTUVWXYZ0123456789'.split(''));
      }
    }
  }


  protected _resize(): void {
    super._resize();

    let itemW = 15 * Util.instance.mix(1, 3, this._noise);
    let itemH = itemW;
    if(this._inputType == 'range' || this._inputType == 'text') {
      itemW = Func.instance.val(50, Func.instance.sw() * 0.06);
      itemH = 20;
    }

    this._size.width = itemW + 5;
    this._size.height = itemH;

    Tween.instance.set(this._input, {
      width: this._size.width,
      height: this._size.height,
      y:-this._size.height * 0.5
    })
  }

}