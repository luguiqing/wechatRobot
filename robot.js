//cnpm install wechaty qrcode-terminal
const QrcodeTerminal = require('qrcode-terminal');
const { Wechaty } = require('wechaty')
const log =	require("./lib/log");

Wechaty.instance() // Singleton
    .on('scan', (url, code) => {
    	let loginUrl = url.replace('qrcode', 'l')
	    QrcodeTerminal.generate(loginUrl)
	    log.info(`${url} -- 生成验证码`, 'scan', 'scan')
    })
    .on('login', user => {
    	log.info(`${user} -- 登录成功`, 'login', 'login')
    })
    .on('message', async (message) => {
    	const contact = message.from()
	    const content = message.content()
	    const room = message.room()
	    //log.info(`${contact} -- contact`, 'message', 'message')
	    //log.info(`${content} -- content`, 'message', 'message')
	    //log.info(`${room}-- room`, 'message', 'message')

	    if (room) {
	        log.info(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`, 'message', 'message')
	        //不处理群信息
	    } else {
	        log.info(`Contact: ${contact.name()} Content: ${content}`, 'message', 'message')
	        // 不处理自己发的消息
		    if (message.self()) {
		        return
		    }

		    if (/晚安/.test(content)) {
		        message.say('爱你呦')
		    }
	    }
    })
    .start()