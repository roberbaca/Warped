import Game, { GameStatus } from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component
{
    isHit: boolean = false;   
    speedY:number = 0; // velocidad de movimiento en eje Y   
    speedX:number = 0; // velocidad de movimiento en eje X

    @property
    rotationSpeed:number = 0; // velocidad de rotacion (angulo en grados)
    rotAngle: number = 0;   
    
    @property(cc.AudioSource)
    explosionSound: cc.AudioSource = null;     

    // asignamos el componente del GameController
    gameController: Game = null;

    onLoad()
    {
       this.gameController = cc.Canvas.instance.node.getComponent("Game"); 
    }

    start () 
    {
        this.speedX = this.Rand(-150,150);
        this.speedY = this.Rand(-150,150);                   
    }

    update (dt) 
    {    
        // movimiento
        this.node.setPosition(this.node.x += this.speedX * dt, this.node.y += this.speedY * dt);
       
        // destruimos los meteoros cuando salen fuera de la pantalla
        if(this.node.y <= -290 || this.node.y >= 590)
        {
           this.node.destroy();
        }   

        if (this.isHit)
        {
            //destruimos el asteroide. Esperamos 0.4 seg a que termine la animacion de la explosion
            this.schedule(this.destroyEnemy,0.4,0);             
        }

        if (this.gameController.isPlayerDead)
        {
            this.node.destroy();
        }
    }

    Rand(min: number, max: number): number 
    {
        // generador de numeros random
        return (Math.random() * (max - min + 1) | 0) + min;
    }  

    deg2rad(angle)
    {
        // pasamos de grados a radianes
        return this.rotationSpeed * Math.PI / 180;
    }

    onCollisionEnter(otherCollider,selfCollider)
    {
        if (otherCollider.name == "playerbullet<BoxCollider>" || otherCollider.name == "playerbullet45<BoxCollider>" || otherCollider.name == "playerbullet315<BoxCollider>")
        {
            // chequeo de colisiones y activo bandera
            this.isHit = true;             
            this.animExplosion();
            // destruimos el playerBullet            
            otherCollider.node.destroy();           
        }         
    } 

    animExplosion()
    {        
        var anim = this.getComponent(cc.Animation);      
        anim.play('smallAsteroidExplosion');
        this.explosionSound.play();   
    }   
    
    destroyEnemy()  
    {
        this.node.destroy();
    }    
}
