var items = [
	// 使用类
	{
		info: "直接获得大量的财富",
		useAble: true,
		start: () => { app.money = app.money.plus( app.removeCost.times(10) ); },
		runPerSec: () => {},
	},
	{
		info: "直接获得大量的声望",
		useAble: true,
		start: () => { app.renown = app.renown.plus( 1000 ); },
		runPerSec: () => {},
	},
	{
		info: "直接获得大量的寿元",
		useAble: true,
		start: () => {			
			app.life = app.life.plus(1000);
		},
		runPerSec: () => {},
	},
	{
		info: "直接获得大量的修为",
		useAble: true,
		start: () => { app.point = app.point.plus( app.level.max.div(5).round() ); },
		runPerSec: () => {},
	},
	{
		info: "直接获得当前境界一半容量的修为",
		useAble: true,
		start: () => { app.point = app.point.plus( app.level.max.div(2).round() ); },
		runPerSec: () => {},
	},
	{
		info: "精神时光屋，可瞬间修练100次",
		useAble: true,
		start: () => { app.point = app.point.plus( app.body.num.times(100) ); },
		runPerSec: () => {},
	},
	{
		info: "将当前的修为直接翻倍",
		useAble: true,
		start: () => { app.point = app.point.times(2); },
		runPerSec: () => {},
	},
	{
		info: "将当前的财富直接翻倍",
		useAble: true,
		start: () => { app.money = app.money.times(2); },
		runPerSec: () => {},
	},
	{
		info: "将当前的名气直接翻倍",
		useAble: true,
		start: () => { app.renown = app.renown.times(2); },
		runPerSec: () => {},
	},
	{
		info: "淨化心灵，提升正派心性10%",
		useAble: true,
		start: () => {	app.standPoint = app.standPoint.plus(1000);  },
		runPerSec: () => {},
	},
	{
		info: "污染心灵，逆天而行堕落10%",
		useAble: true,
		start: () => {	app.standPoint = app.standPoint.minus(1000);  },
		runPerSec: () => {},
	},
	{
		info: "将肉体能力提升一个等级",
		useAble: true,
		start: () => { 
			if( !app.body.top ){ 
				app.body = app.body.getNext(); 
				app.logTxt.splice(0, 0, "肉体强化！脱胎为"+app.body.name+"！");
			}
		},
		runPerSec: () => {},
	},
	{
		info: "将灵根提升一个等级",
		useAble: true,
		start: () => { 
			if( !app.talent.top ){ 
				app.talent = app.talent.getNext(); 
				app.logTxt.splice(0, 0, "灵根提升！升级为"+app.talent.name+"！");
			}
		},
		runPerSec: () => {},
	},
	{
		info: "将境界直接提升一个等级",
		useAble: true,
		start: () => { 
			if( !app.level.top ){ 
				app.level = app.level.getNext(); 
	        	app.logTxt.splice(0, 0, "修为积累，境界突破！进入"+app.level.name+"阶段！");
			}else{	
				app.logTxt.splice(0, 0, "境界无法提升，"+app.level.name+"阶段要认真修炼，勿借助外来法宝！");		
				app.level = app.level.getPrevious();
				app.logTxt.splice(0, 0, "修炼失败，身体破败不堪，倒退一个境界。");	
	        	//app._gotoNextWorld();
			}
		},
		runPerSec: () => {},
	},
	{
		info: "将升级消耗最低的功法提升一个等级",
		useAble: true,
		start: () => {
			if( app.skills.length == 0 ) return;
			var id = 0;
			for( var i = 0; i < app.skills.length; i++){
				if( app.skills[i].object.need.lessThan(app.skills[id].object.need) ){ id = i; }
			}
			if( app.skills[id].object.getNext() != null ){
				app.skills[id].object = app.skills[id].object.getNext();
				app.logTxt.splice(0, 0, "潜心修练"+app.skills[id].name+"，功力提升！");
			}
		},
		runPerSec: () => {},
	},
	{
		info: "丢弃所有法宝以大幅提升自身一般修为",
		useAble: true,
		start: () => {
			app.point = app.point.plus( app.level.max.div(100).times( app.items.length ) );
			app.items = [];
		},
		runPerSec: () => {},
	},
	{
		info: "再来一次!获得两个新法宝",
		useAble: true,
		start: () => {
			for( var i = 0; i < 2; i++ ){
				var newItem = {
					name  : randomItemName(),
					object: getRandomItem(),
				};
				app.logTxt.splice(0, 0, randomNewItemLog(newItem.name)+"！");
				app.items.splice(0, 0, newItem );
			}
		},
		runPerSec: () => {},
	},
	{
		info: "耗费所有财富，每5000金购买新法宝，最多买10个",
		useAble: true,
		start: () => {
			for( ; app.money.greaterThan(5000); app.money = app.money.minus(5000) ){
				var newItem = {
					name  : randomItemName(),
					object: getRandomItem(),
				};
				app.logTxt.splice(0, 0, randomNewItemLog(newItem.name)+"！");
				app.items.splice(0, 0, newItem );
				if( app.items.length > 10 ){ break; }
			}
		},
		runPerSec: () => {},
	},
	{
		info: "耗费所有名声寻找长生之道，每100名气换取10秒",
		useAble: true,
		start: () => {
			var t = app.renown.div(100).round();
			app.renown = app.renown.minus( t.times(100) );
			app.life = app.life.plus(t);
		},
		runPerSec: () => {},
	},
	{
		info: "换个地方重新出发，将立场回归中立",
		useAble: true,
		start: () => {
			app.standPoint = new BigNumber(0);
			app.stand = stands.find( app.standPoint );
		},
		runPerSec: () => {},
	},
	// 常驻类
	{
		info: "每秒获得等同修练十次的一般修为",
		useAble: false,
		start: () => { },
		runPerSec: () => { 
			app.pointPerSec = app.pointPerSec.plus( app.stand.num.times( app.body.num ) ); 
		},
	},
	{
		info: "每秒获得等同境界容量之万分之一的一般修为",
		useAble: false,
		start: () => { },
		runPerSec: () => { 
			app.pointPerSec = app.pointPerSec.plus( app.stand.num.times( app.level.max.div(100000) ) ); 
		},
	},
	{
		info: "每秒获得当前修为之万分之一的一般修为",
		useAble: false,
		start: () => { },
		runPerSec: () => { 
			app.pointPerSec = app.pointPerSec.plus( app.stand.num.times( app.point.div(100000) ) ); 
		},
	},
	{
		info: "每秒可获得1点财富",
		useAble: false,
		start: () => { },
		runPerSec: () => { app.money = app.money.plus(1); },
	},
	{
		info: "每秒可获得1点名气",
		useAble: false,
		start: () => { },
		runPerSec: () => { app.renown = app.renown.plus(1); },
	},
	{
		info: "每秒可获得1点寿元",
		useAble: false,
		start: () => { },
		runPerSec: () => { 
			app.life = app.life.plus(1);
		},
	},
	{
		info: "可持续增加正派心性",
		useAble: false,
		start: () => { },
		runPerSec: () => { app.standPerSec = app.standPerSec.plus(2); },
	},
	{
		info: "古神使用过的道具，持续堕落滋长魔性",
		useAble: false,
		start: () => { },
		runPerSec: () => { app.standPerSec = app.standPerSec.minus(2); },
	},
];

function getRandomItem(){
	var randItem = items[ Math.floor( Math.random() * items.length ) ];
	return randItem;
}