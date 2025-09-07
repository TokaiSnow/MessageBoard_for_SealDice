//代码基于Szzrain的漂流瓶更改
//原作者github主页：https://github.com/Szzrain

// ==UserScript==
// @name         海豹留言板
// @author       TokaiSnow
// @version      1.0.0
/* @description  用 .写留言 (内容) 和 .读留言 就可以使用了。
   骰主可以使用.审核留言 查看待审核队列中的第一个留言。使用.同意过审留言/.拒绝过审留言 选择是否过审。这两种指令都会将留言弹出队列。
   骰主可以使用.查看留言板 来查看所有已有留言，并且使用.删除留言 （编号）来删除指定留言。
   */ 
// @license      MIT
// @homepageURL  https://github.com/TokaiSnow
// ==/UserScript==
if (!seal.ext.find('留言板')) {
    const ext = seal.ext.new('留言板', 'TokaiSnow', '1.0.0');
    // 创建一个命令
    const cmdhrow = seal.ext.newCmdItemInfo();
    seal.ext.register(ext);
    const board = JSON.parse(ext.storageGet("board") || '[]');
    const preboard = JSON.parse(ext.storageGet("preboard") || '[]');

    //扔瓶子
    cmdhrow.name = '写留言';
    cmdhrow.help = '用.写留言 ';
    cmdhrow.solve = (ctx, msg, cmdArgs) => {
        // console.log("triggered")
        let val = cmdArgs.getArgN(1)
        let sendName = ctx.player.name
        switch (val) {
            case 'help': {
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
                return ret;
            }
            default: {
                let item = {"from":msg.sender.nickname}
                preboard.push(msg.message.substring(4))
                // console.log(board)
                ext.storageSet("preboard", JSON.stringify(preboard))
                seal.replyToSender(ctx, msg, "你将想说的话写在留言板上，人群熙熙攘攘…")
                return seal.ext.newCmdExecuteResult(true);
            }
        }
        return seal.ext.newCmdExecuteResult(true);
    }
    // 注册命令
    ext.cmdMap['写留言'] = cmdhrow;

    //捡瓶子
    const cmdget = seal.ext.newCmdItemInfo();
    cmdget.name = '读留言';
    cmdget.help = '随机阅读一段留言';
    cmdget.solve = (ctx, msg, cmdArgs) => {
        // console.log("triggered")
        let val = cmdArgs.getArgN(1)
        let sendName = ctx.player.name
        switch (val) {
            case 'help': {
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
                return ret;
            }
            default: {
                if (board.length <= 0) {
                    if(Math.random>0.98)
                        seal.replyToSender(ctx,msg,"小小的白山，大大的能量~")
                    else
                        seal.replyToSender(ctx, msg, "留言板上空空如也")
                    return seal.ext.newCmdExecuteResult(true);
                }
                let result = Math.floor(Math.random() * board.length)
                let text = board[result]
                // console.log(board)
                // board.splice(result,1)
                // console.log(board)
                // ext.storageSet("board", JSON.stringify(board))
                seal.replyToSender(ctx, msg, "你看到了一段留言:"+text)
                return seal.ext.newCmdExecuteResult(true);
            }
        }
        return seal.ext.newCmdExecuteResult(true);
    }
    // 注册命令
    ext.cmdMap['读留言'] = cmdget;
    
    // 删除留言
    const cmddel = seal.ext.newCmdItemInfo();
    cmddel.name = '删除留言';
    cmddel.help = '删除指定编号的留言';
    cmddel.solve = (ctx, msg, cmdArgs) => {
        // console.log("triggered")
        let val = cmdArgs.getArgN(1)
        let sendName = ctx.player.name
        switch (val) {
            case 'help': {
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
                return ret;
            }
            default: {
                id=parseInt(val,10)
                if (id < 0 || id>=board.length) {
                    seal.replyToSender(ctx, msg, "错误的留言编号")
                    return seal.ext.newCmdExecuteResult(true);
                }
                board.splice(id,1)
                ext.storageSet("board", JSON.stringify(board))
                seal.replyToSender(ctx, msg, "你删除了一段留言")
                return seal.ext.newCmdExecuteResult(true);
            }
        }
        return seal.ext.newCmdExecuteResult(true);
    }
    // 注册命令
    ext.cmdMap['删除留言'] = cmddel;

    // 展示所有留言
    const cmdshow = seal.ext.newCmdItemInfo();
    cmdshow.name = '查看留言板';
    cmdshow.help = '查看所有已有留言';
    cmdshow.solve = (ctx, msg, cmdArgs) => {
        // console.log("triggered")
        let val = cmdArgs.getArgN(1)
        let sendName = ctx.player.name
        switch (val) {
            case 'help': {
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
                return ret;
            }
            default: {
                if(sendId!="QQ:2661869060" && sendId!="QQ:1220126228"){
                    seal.replyToSender(ctx, msg, "仅骰主有权限查看所有留言")
                    return seal.ext.newCmdExecuteResult(true);
                }
                if(board.length<=0){
                    seal.replyToSender(ctx, msg, "留言板上没有任何留言")
                    return seal.ext.newCmdExecuteResult(true);
                }
                text=""
                for(let i=0;i<board.length;i+=1){
                    text=text+i+'\n'
                    text=text+board[i]+'\n'
                }
                // ext.storageSet("board", JSON.stringify(board))
                seal.replyToSender(ctx, msg, text)
                return seal.ext.newCmdExecuteResult(true);
            }
        }
        return seal.ext.newCmdExecuteResult(true);
    }
    // 注册命令
    ext.cmdMap['查看留言板'] = cmdshow;

    // 审核留言
    const cmdcensor = seal.ext.newCmdItemInfo();
    cmdcensor.name = '审核留言';
    cmdcensor.help = '查看第一条待审核留言';
    cmdcensor.solve = (ctx, msg, cmdArgs) => {
        // console.log("triggered")
        let val = cmdArgs.getArgN(1)
        let sendId = ctx.player.userId
        switch (val) {
            case 'help': {
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
                return ret;
            }
            default: {
                if(sendId!="QQ:2661869060" && sendId!="QQ:1220126228"){
                    seal.replyToSender(ctx, msg, "仅骰主有权限审核留言")
                    return seal.ext.newCmdExecuteResult(true);
                }
                if(preboard.length<=0){
                    seal.replyToSender(ctx, msg, "没有待审核的留言")
                    return seal.ext.newCmdExecuteResult(true);
                }
                text=preboard[0]
                seal.replyToSender(ctx, msg, "text")
                return seal.ext.newCmdExecuteResult(true);
            }
        }
        return seal.ext.newCmdExecuteResult(true);
    }
    // 注册命令
    ext.cmdMap['审核留言'] = cmdcensor;

    // 同意过审留言
    const cmdagree = seal.ext.newCmdItemInfo();
    cmdagree.name = '同意过审留言';
    cmdagree.help = '过审第一条待审核留言';
    cmdagree.solve = (ctx, msg, cmdArgs) => {
        // console.log("triggered")
        let val = cmdArgs.getArgN(1)
        let sendId = ctx.player.userId
        switch (val) {
            case 'help': {
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
                return ret;
            }
            default: {
                if(sendId!="QQ:2661869060" && sendId!="QQ:1220126228"){
                    seal.replyToSender(ctx, msg, "仅骰主有权限审核留言")
                    return seal.ext.newCmdExecuteResult(true);
                }
                if(preboard.length<=0){
                    seal.replyToSender(ctx, msg, "没有待审核的留言")
                    return seal.ext.newCmdExecuteResult(true);
                }
                board.push(preboard[0])
                seal.replyToSender(ctx, msg, "留言已过审！内容为：\n"+preboard[0])
                preboard.splice(0,1)
                ext.storageSet("board", JSON.stringify(board))
                ext.storageSet("preboard", JSON.stringify(preboard))
                return seal.ext.newCmdExecuteResult(true);
            }
        }
        return seal.ext.newCmdExecuteResult(true);
    }
    // 注册命令
    ext.cmdMap['同意过审留言'] = cmdagree;

    // 拒绝过审留言
    const cmddisagree = seal.ext.newCmdItemInfo();
    cmddisagree.name = '拒绝过审留言';
    cmddisagree.help = '拒绝过审第一条待审核留言';
    cmddisagree.solve = (ctx, msg, cmdArgs) => {
        // console.log("triggered")
        let val = cmdArgs.getArgN(1)
        let sendId = ctx.player.userId
        switch (val) {
            case 'help': {
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
                return ret;
            }
            default: {
                if(sendId!="QQ:2661869060" && sendId!="QQ:1220126228"){
                    seal.replyToSender(ctx, msg, "仅骰主有权限审核留言")
                    return seal.ext.newCmdExecuteResult(true);
                }
                if(preboard.length<=0){
                    seal.replyToSender(ctx, msg, "没有待审核的留言")
                    return seal.ext.newCmdExecuteResult(true);
                }
                seal.replyToSender(ctx, msg, "留言已拒绝过审！内容为：\n"+preboard[0])
                preboard.splice(0,1)
                ext.storageSet("preboard", JSON.stringify(preboard))
                return seal.ext.newCmdExecuteResult(true);
            }
        }
        return seal.ext.newCmdExecuteResult(true);
    }
    // 注册命令
    ext.cmdMap['拒绝过审留言'] = cmddisagree;
}