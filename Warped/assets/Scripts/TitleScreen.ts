const {ccclass, property} = cc._decorator;

@ccclass
export default class TitleScreen extends cc.Component 
{

    @property(cc.Sprite)
    back1: cc.Sprite = null;

    @property(cc.Sprite)
    back2: cc.Sprite = null;

    @property(cc.Sprite)
    stars1: cc.Sprite = null;

    @property(cc.Sprite)
    stars2: cc.Sprite = null;

    @property(cc.Sprite)
    planet1: cc.Sprite = null;

    @property(cc.Sprite)
    planet2: cc.Sprite = null;

    @property(cc.Prefab)
    blackScreenFadeIn: cc.Prefab = null;

    @property(cc.Prefab)
    blackScreenFadeOut: cc.Prefab = null;

    @property(cc.Node)
    musicNode: cc.Node = null;

    @property(cc.Node)
    storyNode: cc.Node = null;

    @property(cc.Node)
    titleNode: cc.Node = null;
    
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
        cc.game.addPersistRootNode(this.musicNode);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.keyON,this);
        cc.director.preloadScene("Game");
   }

    start () 
    {

    }

    update(dt) 
    {
        // Parallax background - 3 layers

        // space
        this.back1.node.x -= 8 * dt;
        this.back2.node.x -= 8 * dt;      
       
        if (this.back1.node.x < -816)
        {
            this.back1.node.x = 816;
        }

        if (this.back2.node.x < -816)
        {
            this.back2.node.x = 816;
        }

        
        //stars
        this.stars1.node.x -= 16 * dt;
        this.stars2.node.x -= 16 * dt;      
       
        if (this.stars1.node.x < -816)
        {
            this.stars1.node.x = 816;
        }

        if (this.stars2.node.x < -816)
        {
            this.stars2.node.x = 816;
        }

        // planets
        this.planet1.node.x -= 40 * dt;
        this.planet2.node.x -= 40 * dt;      
       
        if (this.planet1.node.x < -816)
        {
            this.planet1.node.x = 1200;
        }

        if (this.planet2.node.x < -816)
        {
            this.planet2.node.x = 1600;
        }      

        if (this.startGame)
        {
            this.fadeIn();                
            this.schedule(this.fadeOut, 2.9, 0);  
            this.startGame = false;  
        }
          
    }

    fadeIn()
    {
        var black = cc.instantiate(this.blackScreenFadeIn);       
        black.setPosition(0,0);                   
        this.node.getChildByName("BlackScreen").addChild(black);      
        
    }

    fadeOut()
    {
        this.storyNode.active = true;
        this.titleNode.active = false;
        var black2 = cc.instantiate(this.blackScreenFadeOut);       
        black2.setPosition(0,0);                   
        this.node.getChildByName("BlackScreen").addChild(black2);
        this.schedule(this.fadeIn, 9, 0); 
        this.schedule(this.loadGame, 11, 0);                
    }

    loadGame()
    {
        cc.director.loadScene("Level");
    }
   
}
