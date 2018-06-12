const	config					=	{
			logDir 		: 		'logs'
		},
		moment					=	require("moment"),
		mkdirp					=	require("mkdirp"),
		fs						=	require("fs"),
		interval				=	"\r\n";

let	currentInfoLog, currentWarningLog, currentErrorLog, currentLogTimer;
currentInfoLog		=	[];
currentWarningLog	=	[];
currentErrorLog		=	[];

module.exports	=	class {
	/**
	 * 信息日志
	 * @param	{string}	str			记录日志字符串
	 * @param	{string}	type		日志类型
	 * @param	{string}	url			请求的链接
	 */
	static info( str, type = "Normal", url ){
		this.log( str, type, url, "info" );
	}

	/**
	 * 警告日志
	 * @param	{string}	str			记录日志字符串
	 * @param	{string}	type		日志类型
	 * @param	{string}	url			请求的链接
	 */
	static warning( str, type = "Normal", url ){
		this.log( str, type, url, "warning" );
	}

	/**
	 * 错误日志
	 * @param	{string}	str			记录日志字符串
	 * @param	{string}	type		日志类型
	 * @param	{string}	url			请求的链接
	 */
	static error( str, type = "Normal", url ){
		this.log( str, type, url, "error" );
	}

	/**
	 * 打印日志
	 * @param	{string}	str			记录日志字符串
	 * @param	{string}	type		日志类型
	 * @param	{string}	level		日志的级别
	 * @param	{string}	url			请求的链接
	 */
	static log( str, type, url, level ){
		let currentTime, logStr;
		currentTime		=	moment().format( "HH:mm:ss" );
		logStr			=	"[ " + currentTime + " ][ " + type + " ][ " + str + " ]";
		if( url ){
			logStr		+=	"[ " + url + " ]";
		}
		logStr			+=	interval + interval;
		switch( level ){
			case "info":
				currentInfoLog.push( logStr );
			break;

			case "warning":
				currentWarningLog.push( logStr );
			break;

			case "error":
				currentErrorLog.push( logStr );
			break;
		}
		if( currentLogTimer === undefined ){
			currentLogTimer		=	setTimeout( this.writeFile, 1000 );
		}
	}

	/**
	 * 结束日志，写入文件
	 */
	static writeFile(){
		try{
			if( currentLogTimer !== undefined ){
				clearTimeout( currentLogTimer );
				currentLogTimer		=	undefined;
			}
			let dirName, info, warning, error;
			dirName			=	config.logDir + "/" + moment().format( "YYYY-MM-DD" );
			if( !fs.existsSync( dirName ) ){
				mkdirp.sync( dirName );
			}
			if( currentInfoLog.length > 0 ){
				info					=	currentInfoLog;
				currentInfoLog			=	[];
				fs.appendFile( dirName + "/info.log", info.join( "" ), ( err ) => {
					if( err ){
						console.log( err );
					}
				});
			}
			if( currentWarningLog.length > 0 ){
				warning					=	currentWarningLog;
				currentWarningLog		=	[];
				fs.appendFile( dirName + "/warning.log", warning.join( "" ), ( err ) => {
					if( err ){
						console.log( err );
					}
				});
			}
			if( currentErrorLog.length > 0 ){
				error					=	currentErrorLog;
				currentErrorLog			=	[];
				fs.appendFile( dirName + "/error.log", error.join( "" ), ( err ) => {
					if( err ){
						console.log( err );
					}
				});
			}
		}catch( e ){
			console.log( e );
		}
	}
};
