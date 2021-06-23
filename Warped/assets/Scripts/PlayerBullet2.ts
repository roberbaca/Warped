
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component 
{

    @property
    // velocidad de movimiento
    speed:number = 0;

    @property
    angle: number = 0;  // angulo de movimiento (en grados)

    onLoad()
    {
       
    }

    start () 
    {
                             
    }

    update (dt) 
    {
          // movimiento
          this.node.setPosition(this.node.x += this.speed * Math.sin(this.deg2rad(this.angle)) * dt, this.node.y += this.speed * Math.cos(this.deg2rad(this.angle)) * dt);
       
          this.node.setRotation(this.angle);
   
          // destruimos el disparo cuando sale de la pantalla
          if(this.node.x >= 360)
          {
              this.node.destroy();
          }

    }  

    deg2rad(angle)
    {
        // pasamos de grados a radianes
        return this.angle * Math.PI / 180;
    }
}