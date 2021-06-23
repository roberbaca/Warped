
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component
 {
    startGame: boolean = false;

    // eventos del teclado
    keyON(event)
    {       
        switch(event.keyCode)
        {
            case cc.macro.KEY.x:
                    this.startGame = true;
                break;
               
        }
    }

    onLoad()
    {        
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.keyON,this);
         cc.director.preloadScene("Level");
    }

    update(dt)
    {
        if (this.startGame)
        {      
            this.loadGame();            
        }
    }     

    loadGame()
    {
        cc.director.loadScene("Level");
    }
}
