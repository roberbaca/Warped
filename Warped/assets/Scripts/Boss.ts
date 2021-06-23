import Game, { GameStatus } from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Boss extends cc.Component 
{
    
    moveUp: boolean = true;
    moveDown: boolean = false;
    speed: number = 100;
    speedX: number = 150;
    rateOfFire:number = 2;
    isHit: boolean = false;
    hitCount: number = 0;
    energy: number = 10;

    @property(cc.Prefab)
    whiteScreenPrefab:cc.Prefab  = null;
   
    @property(cc.Prefab)
    bossBulletPrefab:cc.Prefab  = null;

    @property(cc.AudioSource)
    shotSound: cc.AudioSource = null;   

    @property(cc.AudioSource)
    hitSound: cc.AudioSource = null;   
    
    @property(cc.AudioSource)
    explosionSound: cc.AudioSource = null;  

    component: cc.Component; 

    // asignamos el componente del GameController
    gameController: Game = null;

    onLoad()
    {
        this.gameController = cc.Canvas.instance.node.getComponent("Game"); 
    }

    start () 
    {

    }

    update (dt) 
    {

        if (this.node.x > 520)
        {
            this.node.x -= this.speedX * dt;
            this.speed = 0;
        }        
        else
        {
            this.speed = 100;

            this.schedule(this.shot, this.rateOfFire, cc.macro.REPEAT_FOREVER);  
            

            if (this.moveUp)
            {
                this.node.y += this.speed * dt;
            }
               
            if (this.moveDown)
            {
                this.node.y -= this.speed * dt;
            }   
    
            if (this.node.y > 400)
            {
                this.moveDown = true;
                this.moveUp = false;
            }    
    
            if (this.node.y < 80)
            {
                this.moveUp = true;
                this.moveDown = false;
            }  
        } 
        
        if (this.hitCount >= this.energy)
        {
            this.animExplosion();

            this.fadeIn();

            this.gameController.gameStatus = GameStatus.Game_Victory;
            //destruimos el asteroide. Esperamos 0.4 seg a que termine la animacion de la explosion
            this.schedule(this.destroyEnemy,0.4,0);             
        }

    }

    onCollisionEnter(otherCollider,selfCollider)
    {
        if (otherCollider.name == "playerbullet<BoxCollider>" || otherCollider.name == "playerbullet45<BoxCollider>" || otherCollider.name == "playerbullet315<BoxCollider>")
        {
           // chequeo de colisiones y activo bandera
           this.isHit = true;  
           this.hitCount++; 

           if (this.hitCount <= this.energy -1)
           {
               this.animHit();
           }            

           // destruimos el playerBullet
           otherCollider.node.destroy();             
        }         
    }  

    shot()
    {         
        var bossBullet = cc.instantiate(this.bossBulletPrefab);       
        bossBullet.setPosition(this.node.position.x - 65,this.node.position.y + 40);          
        this.node.parent.addChild(bossBullet);   
        
        var bossBullet2 = cc.instantiate(this.bossBulletPrefab);       
        bossBullet2.setPosition(this.node.position.x - 65,this.node.position.y- 40);          
        this.node.parent.addChild(bossBullet2);  

        this.shotSound.play();
    }    
   

    destroyEnemy()  
    {        
        this.node.destroy();
    }  

    animExplosion()
    {        
        var anim = this.getComponent(cc.Animation);  
        anim.stop('bossHit');
        anim.play('bossExplosion');
        this.explosionSound.play();
        this.hitCount = 0;
    }

    animHit()
    {          
        var anim = this.getComponent(cc.Animation);  
        anim.play('bossHit');   
        this.hitSound.play();
        this.isHit = false;       
    }

    fadeIn()
    {
        var white = cc.instantiate(this.whiteScreenPrefab);       
        white.setPosition(320,240);                   
        this.node.parent.addChild(white);        
    }


}
