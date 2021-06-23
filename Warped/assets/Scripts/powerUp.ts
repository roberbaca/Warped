import Game, { GameStatus } from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class powerUp extends cc.Component 
{     
    @property   
    speed: number = 200;   

    component: cc.Component;    

    // asignamos el componente del GameController
    gameController: Game = null;
    
    onLoad () 
    {         
        this.gameController = cc.Canvas.instance.node.getComponent("Game"); 
    }

    start () 
    {
       
    }

    update (dt)
    {  

        // movimiento
        this.node.x -= this.speed * dt;

        // destruimos el objeto si sale de la pantalla
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

        if (otherCollider.tag = "player")
        {                          
          this.destroyPowerUp();           
        }         
    }       

    destroyPowerUp()
    {       
        this.node.destroy();
    }    
}
