const {ccclass, property} = cc._decorator;

@ccclass
export default class ScrollingBackground extends cc.Component 
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
    
   onLoad()
   {
        
   }

    start () 
    {

    }

    update(dt) 
    {
        // Parallax background - 3 layers

        // Layer1: space
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

        
        // Layer2: stars
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

        // Layer3: planets
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
    }    

}
