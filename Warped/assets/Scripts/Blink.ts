// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component 
{  

    start () 
    {        
        this.fadeOut();       
    }  

    fadeOut()
    {
        var fo = cc.fadeOut(0.5);
        this.node.runAction(fo);
        this.schedule(this.fadeIn,0.5,0);
    }

    fadeIn()
    {
        var fi = cc.fadeIn(0.5);
        this.node.runAction(fi);
        this.schedule(this.fadeOut,0.5,0);
    }
  
}
