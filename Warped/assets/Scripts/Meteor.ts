import Game, { GameStatus } from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Meteor extends cc.Component 
{
    isHit: boolean = false;
    hitCount: number = 0;
    lives: number = 3;
    speedY:number = 0; // velocidad de movimiento en eje Y
    speedX:number = 0; // velocidad de movimiento en eje X

    @property
    rotationSpeed:number = 0; // velocidad de rotacion (angulo en grados)
    rotAngle: number = 0;   
    
    @property(cc.AudioSource)
    explosionSound: cc.AudioSource = null;     

    @property(cc.AudioSource)
    hitSound: cc.AudioSource = null;  

    @property(cc.Prefab)
    smallAsteroidsPrefab:cc.Prefab  = null;

    // asignamos el componente del GameController
    gameController: Game = null;

    onLoad()
    {
        this.gameController = cc.Canvas.instance.node.getComponent("Game"); 
    }

    start () 
    {
        this.speedX = this.Rand(-40,-70);
        this.speedY = this.Rand(-40,40);                    
    }

    update (dt) 
    {    

        // movimiento
        this.node.setPosition(this.node.x += this.speedX * dt, this.node.y += this.speedY * dt);
       
        // destruimos los meteoros cuando salen fuera de la pantalla
        if(this.node.y <= -390 || this.node.y >= 590)
        {
           this.node.destroy();
        }   

        if (this.hitCount >= this.lives)
        {
            this.animExplosion();

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
            this.hitCount++; 

            if (this.hitCount <= this.lives -1)
            {
                this.animHit();
            }            

            // destruimos el playerBullet
            otherCollider.node.destroy();               
        }         
    } 

    animExplosion()
    {        
        var anim = this.getComponent(cc.Animation);  
        anim.stop('asteroidHit');
        anim.play('asteroidExplosion');
        this.explosionSound.play();
        this.hitCount = 0;
    }

    animHit()
    {          
        var anim = this.getComponent(cc.Animation);  
        anim.play('asteroidHit');   
        this.hitSound.play();
        this.isHit = false;       
    }

    
    destroyEnemy()  
    {
        this.spawnSmallAsteroids();
        this.node.destroy();
    }    

    spawnSmallAsteroids()
    {
        var smallAsteroid = cc.instantiate(this.smallAsteroidsPrefab);       
        smallAsteroid.setPosition(this.node.position.x, this.node.position.y);          
        this.node.parent.addChild(smallAsteroid);  

        
        var smallAsteroid2 = cc.instantiate(this.smallAsteroidsPrefab);       
        smallAsteroid2.setPosition(this.node.position.x + 30, this.node.position.y + 30);          
        this.node.parent.addChild(smallAsteroid2); 

        var smallAsteroid3 = cc.instantiate(this.smallAsteroidsPrefab);       
        smallAsteroid3.setPosition(this.node.position.x -30, this.node.position.y -30);          
        this.node.parent.addChild(smallAsteroid3); 
        
    }
}
