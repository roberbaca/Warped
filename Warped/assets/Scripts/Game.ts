
const {ccclass, property} = cc._decorator;

export enum GameStatus
{
    // Estados del juego
    Game_Tutorial = 0,      // tutorial state
    Game_Playing,           // game playing
    Game_Over,              // game Over
    Game_Victory            // Victory
}

@ccclass
export default class Game extends cc.Component
{

    @property(cc.Prefab)
    enemyPrefab:cc.Prefab  = null;

    @property(cc.Prefab)
    asteroidPrefab:cc.Prefab  = null;

    @property(cc.Prefab)
    powerUpPrefab:cc.Prefab  = null;
    
    @property(cc.Prefab)
    bossPrefab:cc.Prefab  = null;

    @property(cc.Sprite)
    HUD:cc.Sprite  = null;

    @property(cc.Node)
    warning:cc.Node  = null;

    @property(cc.Node)
    victory:cc.Node  = null;

    @property(cc.Node)
    tutorialMovement:cc.Node  = null;

    @property(cc.Node)
    tutorialHold:cc.Node  = null;

    @property(cc.Prefab)
    whiteScreenPrefab:cc.Prefab  = null;  

    isPlayerDead: boolean = false;
    isBoss: boolean = false;

    //Game State
    gameStatus: GameStatus = GameStatus.Game_Tutorial;   


    onLoad()
    {
        // activamos el sistema de Colisiones
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        cc.director.preloadScene("TitleScreen");
    }

    start () 
    {         
        this.gameStatus = GameStatus.Game_Tutorial;   
        this.schedule(this.tutorial1, 3, 0);     
    }

    update (dt) 
    {

        if (this.gameStatus == GameStatus.Game_Playing)
        {
            this.schedule(this.spawnAsteroids,2,8,0);    
        
            this.schedule(this.spawnEnemies,3,10,15);
            
            this.schedule(this.spawnPowerUp,50,5,40);   
            
            this.schedule(this.spawnBoss,1,0,80);     
        }

        if (this.gameStatus == GameStatus.Game_Victory)
        {
            this.victory.active = true;
            this.HUD.node.active = false;
            this.schedule(this.loadGame,30,0);
        }
    }

    tutorial1()
    {
        this.tutorialMovement.active = true;
        this.schedule(this.tutorial2, 3, 0);
    }
    
    tutorial2()
    {
        this.tutorialMovement.active = false;
        this.tutorialHold.active = true;
        this.schedule(this.gameON, 3, 0);
    }

    gameON()
    {
        this.tutorialHold.active = false;
        this.gameStatus = GameStatus.Game_Playing;
    }

    spawnEnemies()
    {
        if (this.gameStatus == GameStatus.Game_Playing && !this.isBoss)
        {
            var y_position = this.Rand(50,450);    
            var enemy = cc.instantiate(this.enemyPrefab);       
            enemy.setPosition(800, y_position);                 
            this.node.parent.addChild(enemy);      
        }
          
    }

    spawnAsteroids()
    {
        if (this.gameStatus == GameStatus.Game_Playing && !this.isBoss)
        {
            var y_position = this.Rand(100,350);    
            var asteroid = cc.instantiate(this.asteroidPrefab);       
            asteroid.setPosition(800, y_position);                 
            this.node.parent.addChild(asteroid);   
        }        
    }

    spawnPowerUp()
    {
        if (this.gameStatus == GameStatus.Game_Playing && !this.isBoss)
        {
            var y_position = this.Rand(100,350);    
            var powerup = cc.instantiate(this.powerUpPrefab);       
            powerup.setPosition(800, y_position);                 
            this.node.parent.addChild(powerup);      
        }     
    }

    spawnBoss()
    {
        this.isBoss = true;
        this.warning.active = true;
        var y_position = 240;
        var boss = cc.instantiate(this.bossPrefab);       
        boss.setPosition(1200, y_position);                 
        this.node.parent.addChild(boss); 
        this.schedule(this.hideWarning, 3,0);    

    }

    hideWarning()
    {
        this.warning.active = false;
    }
    
    spawnWhite()
    {       
        var white = cc.instantiate(this.whiteScreenPrefab);       
        white.setPosition(0,0);       
        white.zIndex = 0;          
        this.node.getChildByName("WhiteScreen").addChild(white);            
    }


    Rand(min: number, max: number): number 
    {
        // generador de numeros random
        return (Math.random() * (max - min + 1) | 0) + min;
    }  

    loadGame()
    {
        cc.director.loadScene("TitleScreen");
    }

}
