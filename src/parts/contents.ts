
import { Func } from "../core/func";
import { Mouse } from "../core/mouse";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Point } from "../libs/point";
import { Util } from "../libs/util";
import { Segment } from "./segment";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _segment:Array<Segment> = [];
  private _mouse:Point = new Point();

  constructor(opt:any) {
    super(opt)

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();

    this._mouse.x = sw * 0.5;
    this._mouse.y = sh * 0.5;

    const num = 20
    for(let i = 0; i < num; i++) {
      const el = document.createElement('div')
      el.classList.add('item')
      this.getEl().append(el);
      const item = new Segment({
        el:el,
        id:i,
      })
      this._segment.push(item);

      item.setPos(this._mouse.x, this._mouse.y);
    }

    this._resize();
  }


  protected _update(): void {
    super._update();

    // マウス位置をイージング
    const tgMx = Mouse.instance.x;
    const tgMy = Mouse.instance.y;
    const ease = 0.2;
    this._mouse.x += (tgMx - this._mouse.x) * ease;
    this._mouse.y += (tgMy - this._mouse.y) * ease;

    this._segment.forEach((val,i) => {
      let x = 0;
      let y = 0;
      let dx;
      let dy;
      let prev;

      if(i == 0) {
        dx = this._mouse.x - val.getPos().x;
        dy = this._mouse.y - val.getPos().y;
      } else {
        prev = this._segment[i - 1];
        dx = prev.getPos().x - val.getPos().x;
        dy = prev.getPos().y - val.getPos().y;
      }

      const radian = Math.atan2(dy, dx); // ラジアン
      val.setRot(Util.instance.degree(radian)); // 度に変換

      const w = val.getPin().x - val.getPos().x
      const h = val.getPin().y - val.getPos().y

      if(i == 0) {
        x = this._mouse.x - w;
        y = this._mouse.y - h;
      } else {
        if(prev != undefined) {
          x = prev.getPos().x - w;
          y = prev.getPos().y - h;
        }
      }

      // 要素に反映
      Tween.instance.set(val.getEl(), {
        x:x,
        y:y,
        rotationZ:val.getRot()
      })

      val.setPos(x, y);
    })
  }
}