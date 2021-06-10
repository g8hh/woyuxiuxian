var stands = {
	_0 : {
		name: '天命圣人',
		num : new BigNumber(1),
		filter: (pointPerSec) => {
			if( pointPerSec.greaterThan(0) ){ return pointPerSec.times(1.5); }
			else{ return pointPerSec.times(0.8); }
		},
	},
	_1 : {
		name: '名门正派',
		num : new BigNumber(1),
		filter: (pointPerSec) => {
			if( pointPerSec.greaterThan(0) ){ return pointPerSec.times(1.3); }
			else{ return pointPerSec.times(0.9); }
		},
	},
	_2 : {
		name: '刚正不阿',
		num : new BigNumber(1),
		filter: (pointPerSec) => {
			if( pointPerSec.greaterThan(0) ){ return pointPerSec.times(1.1); }
			else{ return pointPerSec; }
		},
	},
	_3 : {
		name: '中立无为',
		num : new BigNumber(1),
		filter: (pointPerSec) => {
			return pointPerSec.abs().times(0.9);
		},
	},
	_4 : {
		name: '阴险小人',
		num : new BigNumber(-1),
		filter: (pointPerSec) => {
			if( pointPerSec.lessThan(0) ){ return pointPerSec.abs().times(1.1); }
			else{ return pointPerSec.times(-1); }
		},
	},
	_5 : {
		name: '无恶不做',
		num : new BigNumber(-1),
		filter: (pointPerSec) => {
			if( pointPerSec.lessThan(0) ){ return pointPerSec.abs().times(1.3); }
			else{ return pointPerSec.times(-0.9); }
		},
	},
	_6 : {
		name: '混世魔头',
		num : new BigNumber(-1),
		filter: (pointPerSec) => {
			if( pointPerSec.lessThan(0) ){ return pointPerSec.abs().times(1.5); }
			else{ return pointPerSec.times(-0.8); }
		},
	},

	find : (num) => { 
		if( num.gt(8000) ){ return stands._0; }
		else if( num.gt(5000) ){ return stands._1; }
		else if( num.gt(2000) ){ return stands._2; }
		else if( num.gt(-2000) ){ return stands._3; }
		else if( num.gt(-5000) ){ return stands._4; }
		else if( num.gt(-8000) ){ return stands._5; }
		else{ return stands._6; }
	},
};


var groups = [
	{
		info : "名震天下的古老宗门，快速增加正气，注重长生之道。每秒增加3点寿元 1点名气",
		start: () => {
			app.money = app.money.div(5).round();
			app.logTxt.splice(0, 0, "进入名门大派需要耗费不少开销，耗费8成财富");
		},
		run: () => {
			app.life = app.life.plus(3);
			app.standPerSec = app.standPerSec.plus(10);
			app.renown = app.renown.plus(1);
		},
		end: () => {
			app.life = app.life.plus(100);
			app.logTxt.splice(0, 0, "愿你找到志同道合之人，赐你些伤药以备不时之需。增加100点寿元");
		},
	},
	{
		info : "势力广大遍佈天下的帮派，快速累积经验增加修为。每秒增加一些修为和1点正气、2点名气",
		start: () => {
			app.itemCost = app.itemCost.times(0.6).round();
			app.itemInterval = app.itemInterval.minus(2);
			app.itemWait = 0;
			app.logTxt.splice(0, 0, "四处游历增广见闻，有更多机会寻觅机缘。秘境开启时间缩短");
		},
		run: () => {
			app.pointPerSec = app.pointPerSec.plus( app.point.div(5000) );
			app.standPerSec = app.standPerSec.plus(1);
			app.renown = app.renown.plus(2);
		},
		end: () => {
			var newItem = {
				name  : randomItemName(),
				object: getRandomItem(),
			};
			app.items.splice(0, 0, newItem );
			app.logTxt.splice(0, 0, "四海之内皆兄弟，有困难时就用此信物吧。获得随机法宝");
		},
	},
	{
		info : "专属于皇宫的太监之术，非常人所能修练。每秒增加一点修为和10点财富",
		start: () => {
			var minus = app.life.div(5).round();
			app.life = app.life.minus( minus );
			app.logTxt.splice(0, 0, "修习公公之道，愈先练功，必先自宫!损失2成寿元");
		},
		run: () => {
			app.pointPerSec = app.pointPerSec.plus( app.stand.num.times( app.point.div(10000) ) );
			app.money = app.money.plus(10);
		},
		end: () => {
			var randName = randomSkillName();
			app.skills.push( {
				name  : randName,
				object: getRandomSkill(),
			} );
			app.logTxt.splice(0, 0, "临走前摸走皇宫中深藏的未知奇术-"+randName);
		},
	},
	{
		info : "隐居山谷的秘宗，不问世事只专心于修道。每秒增加小量修为和损失1点名气",
		start: () => {
			app.renown = app.renown.div(2).round();
			app.logTxt.splice(0, 0, "要低调隐忍才能安心修练。损失一半名气");
		},
		run: () => {
			app.pointPerSec = app.pointPerSec.plus( app.stand.num.times( app.point.div(2000) ) );
			app.renown = app.renown.minus(1);
		},
		end: () => {
			app.renown = app.renown.plus(50);
			app.logTxt.splice(0, 0, "再度入世历练，闯出一番名号，恢复50点名气");
		},
	},
	{
		info : "无处安身的散修公会，虽然缺乏资源但却自由。每秒增加微量修为和1点寿元，损失1点财富",
		start: () => {
			app.point = app.point.times(1.3);
			app.logTxt.splice(0, 0, "修道上的问题，公会内的道友都很乐于帮忙。修为增加3成");
		},
		run: () => {
			app.life = app.life.plus(1);
			app.pointPerSec = app.pointPerSec.plus( app.stand.num.times( app.point.div(10000) ) );
			app.money = app.money.minus( 1 );
		},
		end: () => {
			app.logTxt.splice(0, 0, "还是去找个安稳的栖身之所吧。");
		},
	},
	{
		info : "为达目的不择手段的古神盟友，大量搜刮钱财。每秒增加小量邪派修为和邪气，增加5点财富",
		start: () => {
			if( app.renown.greaterThan(200) ){ app.renown = app.renown.minus(200); }
			else{ app.renown = new BigNumber(0); }
			app.logTxt.splice(0, 0, "跟这些宵小之辈同流合污只会败坏你的名声。减少200名气");
		},
		run: () => {
			app.pointPerSec = app.pointPerSec.minus( app.point.div(3000) );
			app.standPerSec = app.standPerSec.minus(4);
			app.money = app.money.plus( 5 );
		},
		end: () => {
			app.money = app.money.div(2).round();
			app.logTxt.splice(0, 0, "要走可以，可得先留下过路费才行。消耗5成财富");
		},
	},
	{
		info : "毁灭世界的古神收容所，牺牲寿元提升修为。每秒减少5点寿元，增加大量邪派修为和邪气，增加2点名气",
		start: () => {
			app.life = app.life.times(0.6).round();
			app.logTxt.splice(0, 0, "牺牲自由证明你的忠诚!损失4成寿元");
		},
		run: () => {
			app.life = app.life.minus(5);
			app.renown = app.renown.plus(2);
			app.pointPerSec = app.pointPerSec.minus( app.point.div(1000) );
			app.standPerSec = app.standPerSec.minus(10);
		},
		end: () => {
			app.point = app.point.div(100);
			app.logTxt.splice(0, 0, "散去你一身功力，以示惩罚!损失9成修为");
		},
	},
];








var ghost = [
	{
		info : "耗费8成财富 0",
		start: () => {
			app.money = app.money.div(5).round();
			app.money = app.money.plus(1000);
			app.logTxt.splice(0, 0, "上玄真尊看到你十分可怜，送你1000金币。");
			app.logTxt.splice(0, 0, "古神十分需要金钱，掠夺了你8成财富。");
		},
	},
	
	
	
	
	
	
	{
		info : "秘境缓慢 1",
		start: () => {
			app.itemCost = app.itemCost.times(60).round();
			app.itemInterval = app.itemInterval.minus(2);
			app.itemWait = 0;
			app.logTxt.splice(0, 0, "你拿着钱献祭给古神，但是不够虔诚，古神有一些生气，密境开启缓慢。");
		},
	},
	
	
	
	
	
	
	{
		info : "损失2成寿元 2",
		start: () => {
			var minus = app.life.div(5).round();
			app.life = app.life.minus( minus );
			app.logTxt.splice(0, 0, "你摔了一下，损失两成寿元。");
			app.logTxt.splice(0, 0, "你…太丑了，古神不想理你。");
		},
	},
	
	
	
	
	
	{
		info : "损失名气获取修为 3",
		start: () => {
			app.point = app.point.plus( app.level.max.div(5).round() );
			app.renown = app.renown.div(2).round();
			app.logTxt.splice(0, 0, "因祸得福，挑战古神并与古神撕战逃跑，获得大量修为。");
			app.logTxt.splice(0, 0, "你打扰到了古神，损失一半名气。");
		},
	},
	
	
	{
		info : "修炼3000次，大量修为。 4",
		start: () => {
			app.point = app.point.times(1.3);
			app.point = app.point.plus( app.body.num.times(3000) ); 
			app.logTxt.splice(0, 0, "恭喜恭喜！你在密境里遇见传说中的上玄真尊，获得修炼3000次！");
			app.logTxt.splice(0, 0, "你并没有找到古神，钱掉落在了密境，发现神秘功法，修为增加3成。");
		},
	},
	
	
	{
		info : "哼 5",
		start: () => {
			app.standPoint = app.standPoint.minus(1000); 
			if( app.renown.greaterThan(200) ){ app.renown = app.renown.minus(200); }
			else{ app.renown = new BigNumber(0); }
			var t = app.renown.div(100).round();
			app.renown = app.renown.minus( t.times(100) );
			app.life = app.life.plus(t);
			app.logTxt.splice(0, 0, "信仰古神，追求长生，减少200名气，剩余名气化为寿命，堕落身心10%");
		},
	},
	
	{
		info : "可怜哦 6",
		start: () => {
			app.life = app.life.times(0.7).round();
			app.point = app.point.div(100);
			app.standPoint = app.standPoint.minus(1000);
			app.logTxt.splice(0, 0, "夺舍失败，但是你身上有了古神的气息，堕落10%");
			app.logTxt.splice(0, 0, "古神在夺取你的身体！你损失3成寿元并且损失9成修为！");

		},
	},
	

		{
		info : "可怜哦 7",
		start: () => {
			app.money = app.money.times(2);
			app.renown = app.renown.times(2);
			app.logTxt.splice(0, 0, "获得双倍金钱，双倍声望。");
			app.logTxt.splice(0, 0, "古神：你和上玄老头有过交集？…拿去吧，这是你的奖赏。");
		},
	},
	
		{
		info : "寿命增加 8",
		start: () => {
			app.itemCost = app.itemCost.times(60).round();
			app.itemInterval = app.itemInterval.minus(2);
			app.itemWait = 0;
			app.logTxt.splice(0, 0, "寿命每秒增加10，密境时间增加。");
			app.logTxt.splice(0, 0, "你是下一个神，哦，我说的是寿命。");
		},
		run: () => { app.life = app.life.plus(10); },
	},
	
		{
		info : "正属性 9",
		start: () => {
			app.standPoint = app.standPoint.plus(1000);
			app.money = app.money.plus(1000);
			app.logTxt.splice(0, 0, "获得金币1000，净化身心10%");
			app.logTxt.splice(0, 0, "上玄真尊：这不是你应该来的地方，拿着这钱走吧。");

		},
	},
	
	
			{
		info : "广告 10",
		start: () => {
			app.money = app.money.plus(5000);
			app.logTxt.splice(0, 0, "送你5000金币！开心吧！");
			app.logTxt.splice(0, 0, "古神：我要打个广告，请你加qq群：292994508 道友很多！");

		},
	},
	
			{
		info : "境界提升 11",
		start: () => {
			runPerSec: () => { 
			app.pointPerSec = app.pointPerSec.plus( app.stand.num.times( app.point.div(100000) ) ); 
		},
			app.logTxt.splice(0, 0, "你在古神庙前摔了一跤，古神祝福了你，每秒获得万分之一的一般修为。");

		},
	},
	
			{
		info : "可怜哦 12",
		start: () => {
			app.logTxt.splice(0, 0, "欧洲人？只有0.3%的道友能看到这句话，可惜，本尊不喜欢欧洲人。");

		},
	},
	
	
	
			{
		info : "夺舍成功 13",
		start: () => {
			app.logTxt.splice(0, 0, "你持续掉血中，每秒损失50寿元。");
			app.logTxt.splice(0, 0, "古神攻击到了你，你逃到了。");
			app.logTxt.splice(0, 0, "古神感觉到你威胁到了他。");
			app.logTxt.splice(0, 0, "你是下一个神，不过，现在还不是。");
		},
		run: () => { app.life = app.life.minus(50); },
	},
	
];


var god = [
	{
		info : "耗费8成财富 0",
		start: () => {
			app.money = app.money.div(5).round();
			app.logTxt.splice(0, 0, "古神在嘲笑你，可怜的凡人。");
			app.logTxt.splice(0, 0, "为了信仰，神裔拿走了你8成财富。");
		},
	},
	
	{
		info : "秘境时间增加 1",
		start: () => {
			app.itemCost = app.itemCost.times(60).round();
			app.itemInterval = app.itemInterval.minus(2);
			app.itemWait = 0;
			app.logTxt.splice(0, 0, "古神：可怜的凡人，被正义所充斥头脑。");
			app.logTxt.splice(0, 0, "神裔为了子民，用了你的时间去开启了秘境，密境开启缓慢，但人民你的信仰增加了。");
		},
	},
	
	{
		info : "损失2成寿元 2",
		start: () => {
			var minus = app.life.div(5).round();
			app.life = app.life.minus( minus );
			app.logTxt.splice(0, 0, "神裔：谢谢你为全体子民做出的贡献，损失两成寿元。");
			app.logTxt.splice(0, 0, "古神：又被神的信仰所欺骗？没有黑暗，就没有光明。");
		},
	},
	
	{
		info : "损失名气获取修为 3",
		start: () => {
			app.point = app.point.plus( app.level.max.div(5).round() );
			app.renown = app.renown.div(2).round();
			app.logTxt.splice(0, 0, "古神：没有灰色，只有光，与暗。");
			app.logTxt.splice(0, 0, "神裔挑战古神中，因古神被世人所信仰，古神落荒而逃。你获得大量修为。");
			app.logTxt.splice(0, 0, "因为你并没有夸赞神裔，损失一半名气。");
			
		},
	},
	
	{
		info : "修炼3000次，大量修为。 4",
		start: () => {
			app.point = app.point.times(1.3);
			app.point = app.point.plus( app.body.num.times(1000) ); 
			app.logTxt.splice(0, 0, "古神：混沌，将把你重铸…");
			app.logTxt.splice(0, 0, "恭喜恭喜！你在密境里遇见传说中的上玄真尊，获得修炼1000次！");
			app.logTxt.splice(0, 0, "古神来临，你勇战古神，修为增加3成，信仰增加。");
		},
	},
	
	{
		info : "堕落身心 5",
		start: () => {
			app.standPoint = app.standPoint.minus(1000); 
			if( app.renown.greaterThan(200) ){ app.renown = app.renown.minus(200); }
			else{ app.renown = new BigNumber(0); }
			var t = app.renown.div(100).round();
			app.renown = app.renown.minus( t.times(100) );
			app.life = app.life.plus(t);
			app.logTxt.splice(0, 0, "古神：秩序为虚，混沌为实");
			app.logTxt.splice(0, 0, "质疑信仰，减少200名气，剩余名气化为寿命，堕落身心10%");
		},
	},
	
	{
		info : "可怜哦 6",
		start: () => {
			app.life = app.life.times(0.7).round();
			app.point = app.point.div(100);
			app.standPoint = app.standPoint.plus(3000);
			app.logTxt.splice(0, 0, "神裔信仰影响了你，正派心性增加30%");
			app.logTxt.splice(0, 0, "为了正义！你损失3成寿元并且损失9成修为！");

		},
	},
	
		{
		info : "可怜哦 7",
		start: () => {
			app.money = app.money.times(2);
			app.renown = app.renown.times(2);
			app.logTxt.splice(0, 0, "古神：混沌的邪恶，光明的正义…你付出了什么才得到的这些？");
			app.logTxt.splice(0, 0, "获得双倍金钱，双倍声望。");
			app.logTxt.splice(0, 0, "神裔：拿着吧，这是你应得的，小家伙。");
		},
	},

		{
		info : "寿命增加 8",
		start: () => {
			app.life = app.life.plus(100000);
			app.itemCost = app.itemCost.times(60).round();
			app.itemInterval = app.itemInterval.minus(2);
			app.itemWait = 0;
			app.logTxt.splice(0, 0, "寿命增加10,000，密境时间增加。");
			app.logTxt.splice(0, 0, "神裔与古神争斗失败，寿元丢失给了贡献者。");

		},
	},
	
		{
		info : "金币增加 9",
		start: () => {
			app.standPoint = app.standPoint.plus(1000);
			app.money = app.money.plus(1000);
			app.logTxt.splice(0, 0, "获得金币1,000，正派心性增加10%");
			app.logTxt.splice(0, 0, "上玄真尊：古神？哈哈我昨天和他下棋我赢了");

		},
	},
	
			{
		info : "金币增加 10",
		start: () => {
			app.money = app.money.plus(5000);
			app.logTxt.splice(0, 0, "误入神裔库房，获得5,000金币！");

		},
	},
	
			{
		info : "境界提升 11",
		start: () => {
			app.life = app.life.plus(100000);
			app.logTxt.splice(0, 0, "你仿佛看到了古神？寿元增加100,000");

		},
	},
	
			{
		info : "欧洲人 12",
		start: () => {
			app.logTxt.splice(0, 0, "恭喜你，获得勇士祝福，每秒寿元增加10点。");
		},
		run: () => { app.renown = app.renown.plus(10); },
	},
	
			{
		info : "革命？ 13",
		start: () => {
			app.life = app.life.minus(10000);
			app.logTxt.splice(0, 0, "古神：革命！是不可避免的…");
			app.logTxt.splice(0, 0, "损失10000寿元。");
			app.logTxt.splice(0, 0, "神裔：你是不是知道了什么？小家伙…");

		},
	},
	
];

function getRandomGroup(){
	var rand = Math.random();

	if( rand < 0.15 )		{ return groups[0]; }
	else if( rand < 0.4 ) 	{ return groups[1]; }
	else if( rand < 0.5 )	{ return groups[2]; }
	else if( rand < 0.6 ) 	{ return groups[3]; }
	else if( rand < 0.85 ) 	{ return groups[4]; }
	else if( rand < 0.95 ) 	{ return groups[5]; }
	else 					{ return groups[6]; }
}

function getRandomGroup1(){
	var rand = Math.random();

	if( rand < 0.15 )		{ return ghost[0]; }
	else if( rand < 0.3 ) 	{ return ghost[1]; }
	else if( rand < 0.4 )	{ return ghost[2]; }
	else if( rand < 0.45 ) 	{ return ghost[3]; }
	else if( rand < 0.55 ) 	{ return ghost[4]; }
	else if( rand < 0.65 ) 	{ return ghost[5]; }
	else if( rand < 0.68 ) 	{ return ghost[6]; }
	else if( rand < 0.72 ) 	{ return ghost[7]; }
	else if( rand < 0.79 ) 	{ return ghost[8]; }
	else if( rand < 0.83 ) 	{ return ghost[9]; }
	else if( rand < 0.89 ) 	{ return ghost[10]; }
	else if( rand < 0.93 ) 	{ return ghost[11]; }
	else if( rand < 0.99 ) 	{ return ghost[12]; }
	else 					{ return ghost[13]; }
}

function getRandomGroup2(){
	var rand = Math.random();

	if( rand < 0.15 )		{ return god[0]; }
	else if( rand < 0.3 ) 	{ return god[1]; }
	else if( rand < 0.4 )	{ return god[2]; }
	else if( rand < 0.45 ) 	{ return god[3]; }
	else if( rand < 0.55 ) 	{ return god[4]; }
	else if( rand < 0.65 ) 	{ return god[5]; }
	else if( rand < 0.68 ) 	{ return god[6]; }
	else if( rand < 0.72 ) 	{ return god[7]; }
	else if( rand < 0.79 ) 	{ return god[8]; }
	else if( rand < 0.83 ) 	{ return god[9]; }
	else if( rand < 0.89 ) 	{ return god[10]; }
	else if( rand < 0.93 ) 	{ return god[11]; }
	else if( rand < 0.99 ) 	{ return god[12]; }
	else 					{ return god[13]; }
}