import Game, { GameStatus } from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component 
{
    isHit: boolean = false;
    hitCount: number = 0;

    @property(cc.Prefab)
    enemyBulletPrefab:cc.Prefab  = null;

    @property
    rateOfFire:number = 2;

    @property
    speed: number = 120;

    @property(cc.AudioSource)
    explosionSound: cc.AudioSource = null;     

    @property(cc.AudioSource)
    shotSound: cc.AudioSource = null;   

    component: cc.Component;   
    
    // asignamos el componente del GameController
    gameController: Game = null;

    onLoad () 
    {         
        this.gameController = cc.Canvas.instance.node.getComponent("Game"); 
    }

    start () 
    {
        this.schedule(this.shot, this.rateOfFire, cc.macro.REPEAT_FOREVER);  
    }

    update (dt)
    {      

        // movimiento de la nave enemiga
        this.node.x -= this.speed * dt;

        // destruimos la nave si sale de la pantalla
        if (this.node.x < -440)
        {
            this.node.destroy();
        }          
        
        if (this.gameController.isPlayerDead)
        {
            this.node.destroy();
        }
      
          
    }

    onCollisionEnter(otherCollider,selfCollider)
    {
        if (otherCollider.name == "playerbullet<BoxCollider>" || otherCollider.name == "playerbullet45<BoxCollider>" || otherCollider.name == "playerbullet315<BoxCollider>")
        {
            // chequeo de colisiones y activo bandera
            this.isHit = true;    
            this.animExplosion();

            //destruimos la neve. Esperamos 0.4 seg a que termine la animacion de la explosion
            this.schedule(this.destroyEnemy,0.4,0); 

            // destruimos el playerBullet
            otherCollider.node.destroy();           
        }         
    }  

    shot()
    {
        if (!this.isHit)
        {
            this.animShot();
            var enemyBullet = cc.instantiate(this.enemyBulletPrefab);       
            enemyBullet.setPosition(this.node.position.x - 40,this.node.position.y);          
            this.node.parent.addChild(enemyBullet);     
        }
    }


    animShot()
    {   
        var anim = this.getComponent(cc.Animation);  
        anim.play('enemy');
        this.shotSound.play();
    }

    animExplosion()
    {   
        
        this.node.getChildByName("jet").active = false;
        var anim = this.getComponent(cc.Animation);  
        anim.stop('enemy');
        anim.play('explosion');
        this.explosionSound.play();
    }


    destroyEnemy()  
    {
        this.node.destroy();
    }    

}
