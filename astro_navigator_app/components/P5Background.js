
import { ReactP5Wrapper } from "@p5-wrapper/react";

function sketch(p5) {
  let stars = [];

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    for (let i = 0; i < 800; i++) {
      stars[i] = new Star();
    }
  };

  p5.draw = () => {
    p5.background(10, 10, 20);
    p5.translate(p5.width / 2, p5.height / 2);
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].show();
    }
  };

  class Star {
    constructor() {
      this.x = p5.random(-p5.width, p5.width);
      this.y = p5.random(-p5.height, p5.height);
      this.z = p5.random(p5.width);
      this.pz = this.z;
    }

    update() {
      this.z = this.z - 10;
      if (this.z < 1) {
        this.z = p5.width;
        this.x = p5.random(-p5.width, p5.width);
        this.y = p5.random(-p5.height, p5.height);
        this.pz = this.z;
      }
    }

    show() {
      p5.fill(255);
      p5.noStroke();

      const sx = p5.map(this.x / this.z, 0, 1, 0, p5.width);
      const sy = p5.map(this.y / this.z, 0, 1, 0, p5.height);

      const r = p5.map(this.z, 0, p5.width, 16, 0);
      p5.ellipse(sx, sy, r, r);

      const px = p5.map(this.x / this.pz, 0, 1, 0, p5.width);
      const py = p5.map(this.y / this.pz, 0, 1, 0, p5.height);

      this.pz = this.z;

      p5.stroke(255);
      p5.line(px, py, sx, sy);
    }
  }
}

export default function P5Background() {
  return <div className="fixed top-0 left-0 w-full h-full -z-10"><ReactP5Wrapper sketch={sketch} /></div>;
}
