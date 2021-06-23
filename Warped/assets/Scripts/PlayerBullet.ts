import Game, { GameStatus } from "./Game";


const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerBullet extends cc.Component 
{

    @property  
    speed:number = 0;   // velocidad de movimiento
    
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
         // movimiento
         this.node.setPosition(this.node.x += this.speed * dt, this.node.y );
       
         // destruimos el disparo cuando sale de la pantalla
         if(this.node.x >= 360)
         {
             this.node.destroy();
         }
         
         if (this.gameController.gameStatus == GameStatus.Game_Victory)
         {
             this.node.destroy();
         }

         if (this.gameController.isPlayerDead)
         {
             this.node.destroy();
         }


    }  
}
