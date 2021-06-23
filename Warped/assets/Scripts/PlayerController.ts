import Game, { GameStatus } from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component 
{
// declaracion de variables 
moveUp:number = 0;
moveDown:number = 1;
lives: number = 3;

isKeyPressed: boolean = false;
isDoubleShoot: boolean = false;
isExploding: boolean = false;
isHit: boolean = false;
isGodMode = false;

@property(cc.AudioSource)
powerUpSnd: cc.AudioSource = null; 

@property(cc.AudioSource)
explosionSnd: cc.AudioSource = null;  

@property(cc.Prefab)
playerBulletPrefab:cc.Prefab  = null;

@property(cc.Prefab)
playerBulletPrefab45:cc.Prefab  = null;

@property(cc.Prefab)
playerBulletPrefab315:cc.Prefab  = null;

@property(cc.Sprite)
hud:cc.Sprite  = null;

@property
rateOfFire:number = 2;

@property
speed: number = 120;

holdKey: number = 0;

component: cc.Component;

// asignamos el componente del GameController
gameController: Game = null;

// eventos del teclado
moveShip(event)
{
    if (this.gameController.gameStatus == GameStatus.Game_Playing && !this.isExploding)
    {
        switch(event.keyCode)
        {
           
            case cc.macro.KEY.x:
                this.isKeyPressed = true;                
                
                if (this.moveUp == 0) 
                {
                    this.moveUp = 1;
                    this.moveDown = 0;                    
                    this.animDown();
                }
                else if (this.moveUp == 1)
                {
                    this.moveUp = 0;
                    this.moveDown = 1;                    
                    this.animUp();
                }           
            break;

            case cc.macro.KEY.l:
                this.isDoubleShoot = true;
            break;
        }
    }
}

stopShip(event)
{  
        switch(event.keyCode)
        {
            case cc.macro.KEY.x:
                  this.isKeyPressed = false;                                                                               
            break;
        }  
}



onLoad () 
{      
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.moveShip,this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.stopShip,this);    
    this.gameController = cc.Canvas.instance.node.getComponent("Game"); 
    cc.director.preloadScene("Game");
}

start () 
{
    
}

update (dt)
{  

     // movimiento de la nave
     // Efecto moebius. Cuando salimos de la pantalla, aparecemos por el lado opuesto.
     
    if (this.gameController.gameStatus == GameStatus.Game_Playing && !this.isExploding)
    {
        if (this.lives <= 0)
        {
            this.lives = 0;
        }

        if (this.lives == 3)
        {
            this.hud.getComponent(cc.Animation).play("hud_lives3");
        }

        if (this.lives == 2)
        {
            this.hud.getComponent(cc.Animation).play("hud_lives2");
        }

        if (this.lives == 1)
        {
            this.hud.getComponent(cc.Animation).play("hud_lives1");
        }

        if (this.lives == 0)
        {
            this.hud.getComponent(cc.Animation).play("hud_lives0");
        }

        if(this.moveUp == 1)
        {
            this.node.y += this.speed * dt;         

            if (this.node.y > 260)
            {
                 this.node.y = -260;
            }

        }  

        if(this.moveDown == 1)
        {
            this.node.y -= this.speed * dt;    

            if (this.node.y < -260)
            {
                this.node.y = 260;
            }
        }

        if (this.isKeyPressed)
        {       
            this.holdKey += dt;
        }
        else
        {
            this.holdKey = 0;
            this.speed = 120;   
        
            if (this.moveDown == 1)  
            {
                this.animUp();
            }
            else
            {
                this.animDown();
            }
        }

        if (this.isKeyPressed && this.holdKey > 0.2)
        {
            this.speed = 0;       
            this.animIdle();
        }    
     }
     

     if (this.gameController.gameStatus != GameStatus.Game_Victory && this.gameController.gameStatus != GameStatus.Game_Tutorial)
     {
        if (!this.isDoubleShoot && !this.isExploding)
        {        
           this.schedule(this.shot, this.rateOfFire, 0);
        }
   
        else if (this.isDoubleShoot && !this.isExploding)
        {        
           this.schedule(this.doubleShot, this.rateOfFire * 0.8, 0);
        }
     }   
     
     if (this.gameController.gameStatus == GameStatus.Game_Victory || this.gameController.gameStatus == GameStatus.Game_Tutorial)
     {
            this.isGodMode = true;
            this.node.y = 0;         
     }    
     else
     {
        this.isGodMode = false;
     } 
}

onCollisionEnter(otherCollider,selfCollider)
{
    // chequeo de colisiones y activo bandera
    this.isHit = true;         
    
    if (otherCollider.name == "power-up<BoxCollider>")
    {
        this.powerUpSnd.play();
        if (!this.isDoubleShoot)
        {
            this.isDoubleShoot = true;        
        }
        else
        {
            this.isDoubleShoot = false;        
        }        
    }
    else
    {
        if (!this.isGodMode)
        {
            this.node.getChildByName("jet").active = false;
            this.isExploding = true;   
            this.gameController.isPlayerDead = true;     
            this.animExplosion();
            this.explosionSnd.play();
            this.gameController.spawnWhite();
            otherCollider.node.destroy();
            this.lives--;

            if (this.lives > 0)
            {
                this.schedule(this.respawnPlayer,2.5,0);
                this.isGodMode = true;
            }
            else
            {
                this.schedule(this.gameOverScreen,2.5,0);                
            }
            
        }       
    }
}  

gameOverScreen()
{
    cc.director.loadScene("GameOver");
}

respawnPlayer()
{
    this.gameController.isPlayerDead = false;     
    this.node.getChildByName("jet").active = true;
    this.isExploding = false; 
    this.node.y = 0;
    this.schedule(this.godModeOff,5,0);
    
}

godModeOff()
{
    this.isGodMode = false;
}

shot()
{
    var playerBullet = cc.instantiate(this.playerBulletPrefab);       
    playerBullet.setPosition(this.node.position.x + 40,this.node.position.y);          
    this.node.parent.addChild(playerBullet);     
}

doubleShot()
{
    var playerBullet45 = cc.instantiate(this.playerBulletPrefab45);    
    var playerBullet315 = cc.instantiate(this.playerBulletPrefab315);          
    playerBullet45.setPosition(this.node.position.x + 40,this.node.position.y);  
    playerBullet315.setPosition(this.node.position.x + 40,this.node.position.y);              
    this.node.parent.addChild(playerBullet45);  
    this.node.parent.addChild(playerBullet315);        
}

animExplosion()
{   
    var anim = this.getComponent(cc.Animation);  
    anim.stop('playerDown');
    anim.stop('playerUp');
    anim.stop('playerIdle');
    anim.play('playerExplosion');
}


animUp()
{   
    var anim = this.getComponent(cc.Animation);  
    anim.play('playerUp');
}

animDown()
{ 
    var anim = this.getComponent(cc.Animation);   
    anim.play('playerDown');
}

animIdle()
{   
    var anim = this.getComponent(cc.Animation);
    anim.play('playerIdle');
}

stopAnims()
{
    var anim = this.getComponent(cc.Animation);
    anim.stop('playerDown');
    anim.stop('playerUp');
} 



destroyPlayer()
{
    this.node.destroy();
}    


}