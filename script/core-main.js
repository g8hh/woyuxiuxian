var point = new BigNumber(0.0);

var app = new Vue({ 
	el: '#app',
	data: {
		// Css
		backCss : {
			background: '#333333',
		},
		nameCss : {
			width: '100px',
		},
		buttonCss : {
			width: '60%',
			'font-size': '200%',
		},
		centerCss : {
			background: '#efefef',
		},
		tableCss : {
			width : '95%',
			margin : 'auto',
			background: '#ffffff',
		},
		tableRowCss : {
			background: '#888888',
		},
		Tr0css : {
			color: '#e6ffff',
			fontSize: '120%',
			'font-weight': 'bold',
			background: '#000066',
		},
		Tr1css : {
			background: '#e6e6ff',
		},
		Tr2css : {
			background: '#e6ffd6',
		},
		Tr3css : {
			background: '#ffffd6',
		},
		Tr4css : {
			background: '#f2d6ff',
		},
		logCss : {
			background: '#ffffff',
			height: '300px',
			overflow: 'scroll',
		},
		dataCss : {
			width: '70%',
		},


		// 读秒器
		timerId : null,
		fpsInterval : 100,
		then : 0,

		secInterval : 1000,
		secThen : 0,
		itemWait : 10,
		groupWait : 30,
		group1Wait : 150,
		group2Wait : 200,
		
		autosaveSec : 0,

		// 点数
		worldTimes : 0,
		life : new BigNumber(500),
		pastLife : new BigNumber(0),
		renown : new BigNumber(100),
		money : new BigNumber(100),

		stand : stands._3,
		standPoint : new BigNumber(1.0), // 10000 ~ -10000 
		standPerSec : new BigNumber(0),  // 10 ~ -10

		group : { exist: false, object: null, name: '散修', },
		group1 : { exist: false, object: null, name: '献祭赌博', },
		group2 : { exist: false, object: null, name: '信仰神裔', },
		groupInterval : new BigNumber(10),
		groupInterval1 : new BigNumber(10),
		groupInterval2 : new BigNumber(10),

		point : new BigNumber(0.0),
		pointPerSec: new BigNumber(0.0),

		level : level._0,
		talent: talent._0,
		body : body._0,

		skills : [],
		removeCost : new BigNumber(100),

		items : [],
		itemInterval : new BigNumber(5),
		itemCost : new BigNumber(10000),

		// 显示用
		name: "空",
		born: true,
		world : [ "基础" ],
  		logTxt: [], 
  		record: "",

 		numFilter: { 
 			txt: (str) => {
 				var rev = str.split('').reverse().join('');

	 			var ret = []; 
	 			for(i = 0; i < rev.length; i += 3 ){
	 				ret.push( rev.substr( i, 3) );
	 			}
	 			return ret.join(',').split('').reverse().join('');
 			} 
 		},
	},
	methods: {
		// 读秒器
		_startTimer: () => {
			app.then = new Date().getTime();
			app.timerId = window.requestAnimationFrame( app._timer );
		},
		_timer: () => { 
        	var now     = new Date().getTime();
	        var elapsed = now - app.then;

	        if( elapsed > app.fpsInterval ){
	            app.then = now - (elapsed % app.fpsInterval);

	            app._countAutoAdd();
				app._show();
	        }

	        var secElapsed = now - app.secThen;
	        if( secElapsed > app.secInterval ){
	            app.secThen = now - (secElapsed % app.secInterval);
 				
 				app._countPerSec();
	        }
			//自动存档，30秒一次
			if( app.autosaveSec > 300 ){
				app.autosaveSec = 0;
	            app._autoSaveData();
	        }
			app.autosaveSec = app.autosaveSec + 1;		
			
	        if( app.life.eq(0) || app.life.lessThan(0) ){ //寿命判断
				app._goEnd(); 
			}
	        else{ 
				app.timerId = window.requestAnimationFrame( app._timer ); 
			}
		},
		// 点数
		_addByBody: () => {
			if( app.life.greaterThan(0) ){
				app.point = app.point.plus( app.body.num );
			}
		},
		_countAutoAdd: () => {	
			app.point = app.point.plus( app.pointPerSec );

 			// 限制处理
 			if( app.point.lessThan(0) ){ app.point = new BigNumber(0); }
		},
		_countPointPerSec: () => {
			app.pointPerSec = new BigNumber(0);
			app.standPerSec = new BigNumber(0);
			for( s of app.skills ){ s.object.run(); } 
			for( i of app.items ){  i.object.runPerSec(); }

			if( app.group.exist ){ app.group.object.run(); }
			app.standPoint = app.standPoint.plus( app.standPerSec );
			app.stand = stands.find( app.standPoint );

			app.pointPerSec = app.stand.filter( app.pointPerSec );

			app.life = app.life.minus( Math.floor( app.items.length/5 ) );
		},
		

		
		
		
		_countPerSec: () => {		
			app._countPointPerSec();

 			app.life = app.life.minus(1);
 			app.pastLife = app.pastLife.plus(1);
 			app.itemWait = app.itemWait > 0 ? app.itemWait -1 : 0;
 			app.groupWait = app.groupWait > 0 ? app.groupWait -1 : 0;
			app.group1Wait = app.group1Wait > 0 ? app.group1Wait -1 : 0;
			app.group2Wait = app.group2Wait > 0 ? app.group2Wait -1 : 0;

 			// 限制处理
 			if( app.money.lt(0) ){ app.money = new BigNumber(0); }
 			if( app.renown.lt(0) ){ app.renown = new BigNumber(0); }
 			if( app.standPoint.gt(10000) ){ app.standPoint = new BigNumber(10000); }
 			else if( app.standPoint.lt(-10000) ){app.standPoint = new BigNumber(-10000); }
		},
		_talentLvUp: () => {
			if( !app.point.lessThan( app.talent.need ) ){
				app.point = app.point.minus( app.talent.need );
				app.talent = app.talent.getNext();

				app.logTxt.splice(0, 0, "灵根提升！升级为"+app.talent.name+"！");
			}
		},
		_bodyLvUp: () => {
			if( !app.point.lessThan( app.body.need ) ){
				app.point = app.point.minus( app.body.need );
				app.body = app.body.getNext();

				app.logTxt.splice(0, 0, "肉体强化！脱胎为"+app.body.name+"！");
			}
		},
		_skillLvUp: ( i ) => {
			if( !app.point.lessThan( app.skills[i].object.need ) ){
				app.point = app.point.minus( app.skills[i].object.need );
				app.skills[i].object = app.skills[i].object.getNext();

				app.logTxt.splice(0, 0, "潜心修练"+app.skills[i].name+"，功力提升！");
			}
		},
		_getNewSkill: () => {
			if( app.talent.num.greaterThan( app.skills.length ) &&
				!app.point.lessThan( app.level.max.div(2) ) ){
				app.point = app.point.div( app.skills.length+2 ).round();

				var randName = randomSkillName();
				app.skills.push( {
					name  : randName,
					object: getRandomSkill(),
				} );

				app.logTxt.splice(0, 0, randomNewSkillLog(randName)+"！");
			}
		},
		_skillRemove: (id) => {
			if( !app.money.lessThan(app.removeCost) ){
				app.money = app.money.minus(app.removeCost);
				app.removeCost = app.removeCost.plus(10);
				app.skills.splice(id, 1);
			}
		},
		_getNewItem: () => {
			if( !( app.point.lessThan( app.level.max.div(2) ) ) && 
				!( app.point.lessThan( app.itemCost ) ) ){
				app.point = app.point.div( 10 ).round();
				app.itemCost = app.itemCost.times(1.1).round();
				app.itemInterval = app.itemInterval.plus(1);
				app.itemWait = app.itemInterval.toNumber();

				var randName = randomItemName();
				var _item = getRandomItem();
				var newItem = {
					name  : randName,
					object: _item,
				};

				app.logTxt.splice(0, 0, randomNewItemLog(randName)+"！");
				app.items.splice(0, 0, newItem );
			}
		},
		_useItem: (id) => {
			if( app.items[id].object.useAble ){
				var used = app.items.splice(id, 1)[0];
				used.object.start();
			}
		},
		_removeItems: (id) => {
			app.items = [];
	        app.logTxt.splice(0, 0, "作减求空!果断放弃所有因缘，重新来过");
		},
		_joinGroup: () => {
			if( !app.renown.lessThan(100) ){
				app.renown = app.renown.minus(100);
				app.group = { 
					exist: true, 
					object: getRandomGroup(), 
					name: randomGroupName(), 
				};
				app.group.object.start();
			}
		},
		
		
		//消耗8成金币
		_joinGroup1: () => {
			if( !app.money.lessThan(500) ){
				app.money = app.money.div(5).round();
				app.group1 = { 
					exist: false, 
					object: getRandomGroup1(), 
					name: '远古之神', 
				};
				app.group1.object.start();
			}
		},
		//消耗9成寿元
		_joinGroup2: () => {
			if( !app.life.lessThan(1000) ){
				app.life = app.life.div(5).round();
				app.group2 = { 
					exist: false, 
					object: getRandomGroup2(), 
					name: '正义联盟',  
				};
				app.group2.object.start();
			}
		},
		
		
		
		
		_exitGroup: () => {
			app.group.object.end();
			app.group = { exist: false, object: null, name: '散修', };

			app.groupInterval = app.groupInterval.plus(10);
			app.groupInterval1 = app.groupInterval1.plus(10);
			app.groupInterval2 = app.groupInterval2.plus(10);
			app.groupWait = app.groupInterval.toNumber();
			app.groupWait = app.groupInterval1.toNumber();
			app.groupWait = app.groupInterval2.toNumber();
		},
		_exitGroup1: () => {
			app.group1.object.end();
			app.group1 = { exist: false, object: null, name: '散修', };
			app.groupInterval1 = app.groupInterval1.plus(10);
			app.group1Wait = app.groupInterval1.toNumber();
		},
		_exitGroup2: () => {
			app.group2.object.end();
			app.group2 = { exist: false, object: null, name: '散修', };
			app.groupInterval2 = app.groupInterval2.plus(10);
			app.group2Wait = app.groupInterval2.toNumber();
		},
		// 显示用
		_setName: () => {
			app.born = false;
		},
		_show: () => {
	        while( app.point.greaterThan( app.level.max ) ){
	        	if( app.level.getNext() == null ){
	        		app._gotoNextWorld();
	        		break;
	        	}
	        	app.level = app.level.getNext();
	        	app.life = app.life.plus(app.level.life);

	        	app.logTxt.splice(0, 0, "修为积累，境界突破！进入"+app.level.name+"阶段！");
	        }

		},
		_gotoNextWorld: () => {
			app.worldTimes += 1;
			app.world.splice( 0, 0, randomWorldName() );

			app.point = new BigNumber(0);
			app.pointPerSec = new BigNumber(0);
			app.level = level._0;
			app.body = body._0; 
			app.standPoint = new BigNumber(0);
		
			app.renown = new BigNumber(10);
			app.money = new BigNumber(100);

			app.group = { exist: false, object: null, name: '散修', };
			app.group1 = { exist: false, object: null, name: '散修', };
			app.group2 = { exist: false, object: null, name: '散修', };
			app.groupInterval = new BigNumber(60);
			app.groupInterval1 = new BigNumber(60);
			app.groupInterval2 = new BigNumber(60);
			app.groupWait = app.groupInterval.toNumber();
			app.group1Wait = app.groupInterval1.toNumber();
			app.group2Wait = app.groupInterval2.toNumber();

			if( app.skills.length > 0 ){
				var leftSkill = app.skills[ Math.floor( Math.random() * app.skills.length ) ];
				for(var i = 0; i < 4; i++){
					if( leftSkill.object.getPrev() != null ){
						leftSkill.object = leftSkill.object.getPrev();
					}
				}
				app.skills = [ leftSkill ];
				app.talent = talent._1;
			}else{
				app.skills = [ ];
				app.talent = talent._0;
			}
			app.removeCost = new BigNumber(100).plus( 10 * app.worldTimes );

			var tmpItems = [];
			for( i of app.items ){ tmpItems.push(i); }
			if( tmpItems.length > 0 ){			
				var leftItem = tmpItems[ Math.floor( Math.random() * tmpItems.length ) ];
				app.items = [ leftItem ];
			}else{
				app.items = [];
			}
			app.itemCost = new BigNumber(10000);
			app.itemInterval = new BigNumber(10);
			app.itemWait = app.itemInterval.toNumber();

			app.logTxt.splice(0, 0, "境界圆满，破碎虚空！超脱当前世界进入"+app.world[0]+"界！");
		}, 
		_showData: () => {
			var data = {};
			data.point = app.point.round().toString();
			data.level = app.level.id;
			data.body = app.body.id;
			data.talent = app.talent.id;

			data.name = app.name;
			data.world = app.world;
			data.worldTimes = app.worldTimes;
			data.life = app.life.toString();
			data.pastLife = app.pastLife.toString();
			data.money = app.money.toString();
			data.renown = app.renown.toString();
        	data.standPoint = app.standPoint.toString();

			data.skills = [];
			for(s of app.skills){
				data.skills.push({
					name: s.name,
					id: s.object.id,
				});
			}

			data.items = [];
			for(i of app.items){
				data.items.push({
					name: i.name,
					id: items.indexOf(i.object),
				});
			}
			data.itemCost = app.itemCost.toString();
			data.itemInterval = app.itemInterval.toString();
			app.record = LZString.compressToEncodedURIComponent( JSON.stringify(data) );
			//手动存档保存在cookie中，缓存三十天
			$.cookie('auto_save', LZString.compressToEncodedURIComponent( JSON.stringify(data) ), { expires: 30 });
		},
		_loadData: () => {
			try{
			    var record = LZString.decompressFromEncodedURIComponent( app.record );
			    if( !record ){ alert("存档输入错误，请检查内容，如仍然无法读取存档，请加作者Q群进行了解更多。"); return; }

        		var data = JSON.parse( record );

        		app.point = new BigNumber( data.point );
        		app.level = level[ data.level ];
        		app.body = body[ data.body ];
        		app.talent = talent[data.talent ];

        		app.name = data.name;
        		app.world = data.world;
        		app.worldTimes = data.worldTimes;
        		app.life = new BigNumber( data.life );
        		app.pastLife = new BigNumber( data.pastLife );
        		app.money = new BigNumber( data.money );
        		app.renown = new BigNumber( data.renown );
        		app.standPoint = new BigNumber( data.standPoint );
				app.stand = stands.find( app.standPoint );

        		app.logTxt = [];

        		app.skills = [];
        		for( s of data.skills ){
        			app.skills.push({
        				name: s.name,
        				object: skills[s.id],
        			});
        		}

        		app.items = [];
        		for( i of data.items ){
        			app.items.push({
        				name: i.name,
        				object: items[ i.id ],
        			});
        		}
        		app.itemCost = new BigNumber(data.itemCost);
        		app.itemInterval = new BigNumber(data.itemInterval);
				app.itemWait = app.itemInterval.toNumber();

		    }catch(e){ alert(e); }
		},
		_clearData: () => {
			var isClear = confirm("果断放弃所有因缘，重新来过！");
			if (isClear==true)
			{
				console.log("重新来过");
				$.cookie('auto_save', null);
				window.location.reload(true);
			}
			else
			{
				console.log("继续修仙");
			}
		},
		_autoSaveData: () => {
			//TODO::每分钟自动保存
			var data = {};
			data.point = app.point.round().toString();
			data.level = app.level.id;
			data.body = app.body.id;
			data.talent = app.talent.id;

			data.name = app.name;
			data.world = app.world;
			data.worldTimes = app.worldTimes;
			data.life = app.life.toString();
			data.pastLife = app.pastLife.toString();
			data.money = app.money.toString();
			data.renown = app.renown.toString();
        	data.standPoint = app.standPoint.toString();

			data.skills = [];
			for(s of app.skills){
				data.skills.push({
					name: s.name,
					id: s.object.id,
				});
			}

			data.items = [];
			for(i of app.items){
				data.items.push({
					name: i.name,
					id: items.indexOf(i.object),
				});
			}
			data.itemCost = app.itemCost.toString();
			data.itemInterval = app.itemInterval.toString();
			//自动存档保存在cookie中，缓存三十天
			$.cookie('auto_save', LZString.compressToEncodedURIComponent( JSON.stringify(data) ), { expires: 30 });
			console.log('saved');
		},
		_autoLoadData: () => {
			//首次启动时自动检查是否有缓存存档，如果有则读取数据
			var record = LZString.decompressFromEncodedURIComponent($.cookie('auto_save'));
			if(record){
				try{
					var data = JSON.parse( record );
					app.point = new BigNumber( data.point );
					app.level = level[ data.level ];
					app.body = body[ data.body ];
					app.talent = talent[data.talent ];

					app.name = data.name;
					app.world = data.world;
					app.worldTimes = data.worldTimes;
					app.life = new BigNumber( data.life );
					app.pastLife = new BigNumber( data.pastLife );
					app.money = new BigNumber( data.money );
					app.renown = new BigNumber( data.renown );
					app.standPoint = new BigNumber( data.standPoint );
					app.stand = stands.find( app.standPoint );

					app.logTxt = [];

					app.skills = [];
					for( s of data.skills ){
						app.skills.push({
							name: s.name,
							object: skills[s.id],
						});
					}

					app.items = [];
					for( i of data.items ){
						app.items.push({
							name: i.name,
							object: items[ i.id ],
						});
					}
					app.itemCost = new BigNumber(data.itemCost);
					app.itemInterval = new BigNumber(data.itemInterval);
					app.itemWait = app.itemInterval.toNumber();
				}
				catch(e){ 
					alert(e); 
				}
			}
			console.log('loaded');
		},
		_goEnd: () => { 
			alert( "寿元已尽，请来世再修吧！" );
			$.cookie('auto_save', null); 
		},
	},
});
app._startTimer();
app._autoLoadData();
