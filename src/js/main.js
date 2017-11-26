function loop(init, condition, callback, increment) {
	return new Promise(function(resolve, reject) {
	  init().then(function _loop() {
		condition().then(function(result) {
		  if (result)
			callback().then(increment).then(_loop, reject);
		  else
			resolve();
		}, reject);
	  }, reject);
	});
  }
	var i = 0;
	var pointarray = [];
	var panos=[];
	var pano_num = 0;
	var panoids = [];
	var messageController;
	var url = "http://rode2rome.hamalab.org/"	
$(function(){
	var messageDiv = $("#messageDiv");
	var errorDiv = $("#errorDiv");
	messageController = new MessageController(
		$("#lome_message"),
		$("#js_loadCircle"),
		$("#js_apiStart"),
		$("#js_progressBar")
	);
	function showError( message ) {
		errorDiv.innerHTML = message;
	  }
  
	  function showMessage( message ) {
		messageDiv.innerHTML += message;
	  }
  
	  function getPanoids(positions, callback){
		messageController.State(messageController.state.load_panoid_start);
		panoids = [];
  
		// ストリートビューを表示する HTML 要素
		var panoramaDiv = document.getElementById("pano");
	
		var i;
		var length = positions.length;
  
		loop(function() {
		  return new Promise(function(resolve, reject) {
			i = 0;
			resolve();
		  });
		}, function() {
		  return new Promise(function(resolve, reject) {
			resolve(i < length);
		  });
		}, function() {
		  return new Promise(function(resolve, reject) {
			new Promise(function(sub_resolve, sub_reject) {
			  var lat = positions[i].lat();
			  var lng = positions[i].lng();
					  // 目標物（建物等）の座標
			  var thePosition = new google.maps.LatLng(lat, lng);
			  var panodata = undefined;
			  // ストリートビューオブジェクト
			  var panorama;
			  // ストリートビュー画像があるかどうか調べる
			  var svs = new google.maps.StreetViewService; 
			  svs.getPanorama({
			  // 目標物の座標
			  location: thePosition
			  // 撮影地点の選択方式。最も近い地点を選ぶ NEAREST がデフォルト。
			  // BEST なら Google が最も適切と判断した地点となる
			  , preference: google.maps.StreetViewPreference.NEAREST
			  // 指定座標からどれだけ離れた撮影地点までを選択するかメートル単位で設定。
			  // デフォルトでは50
			  , radius: 50
			  // 画像の種類を選択する。OUTDOOR ならインドアビューを除外
			  , source: google.maps.StreetViewSource.OUTDOOR
			  
			  }, function(panoramaData, status) {
				switch (status) {
				case google.maps.StreetViewStatus.OK:
				  // 画像あり。ストリートビューを表示する
				  panorama = new google.maps.StreetViewPanorama(panoramaDiv, {
					position: panoramaData.location.latLng,
					zoom: 1,
					visible: false
				  });
				  panorama.setPano(panoramaData.location.pano);
				  var id = panorama.getPano();
				  if (id !== "") {
					panodata = {
						"panoid" : id,
						"lat"     : lat,
						"lng"     : lng
					}
				  }
				  break;
				case google.maps.StreetViewStatus.UNKNOWN_ERROR:
				  // エラー時の処理
				  break;
				case google.maps.StreetViewStatus.ZERO_RESULTS:
				  // 画像が見つからないときの処理
				  break;
				}
				sub_resolve(panodata);
			  });
			}).then(function(panodata) {
				if (panodata != undefined){
					panoids.push(panodata);
				}
			  resolve();
			});
		  });
		}, function() {
		  return new Promise(function(resolve, reject) {
			i++;
			resolve();
		  });
		}).then(function() {
			var indexKeyList = [], result = [];
			panoids.forEach( function ( e ) {
				// indexKeyListに存在しないpanoidだけ、resultに追加する
				if (indexKeyList.indexOf(e.panoid) === -1) {
					indexKeyList.push(e.panoid);
					result.push(e);
				}
			} );
			panoids = result;
			console.log(panoids);
			messageController.State(messageController.state.load_panoid_finish);		  
			callback();
		});
	  }
	
	  function showReadyAPIMessage() {
  
	  }
	  function createPanoidsAPI() {
		// console.log(panoids);
	  }
  
	  window.addEventListener( 'load', function() {
  
		showMessage( 'Starting...<br/>' );
  
		loader = new GSVPANO.PanoLoader( {
		  zoom: 3
		} );
  
		loader.onSizeChange = function() {
		  showMessage( 'Size changed' );
		};
		;
  
		loader.onPanoramaData = function( result ) {
		  showMessage( 'Panorama OK.<br/>Load started' );
		}
  
		loader.onNoPanoramaData = function( status ) {
		  showError("Could not retrieve panorama for the following reason: " + status);
		}
  
		loader.onProgress = function( p ) {
		  showMessage( '.' );
		};
  
		loader.onError = function( message ) {
		  showMessage( 'Error: ' + message );
		};
  
		loader.onPanoramaLoad = function() {
  
	//			showMessage( ' finished.<br/>' );
		  document.body.appendChild( this.canvas );
		  showMessage( 'Panorama loaded, street view data ' + this.copyright + '.<br/>' );
		  var png = this.canvas.toDataURL();
		  var blob = Base64toBlob(png);
		  saveBlob(blob,"imgs/sample.png");
		  document.getElementById("newImg").src = png;
		};
  
		loader.onPanoramasave = function(){
			showMessage("latlng"+panos[i]);
			loader.load(panos[i]);
			i++;
		}
  
		// Google Maps API 設定
	  var mapDiv = document.getElementById("map_canvas");
	  var map = new google.maps.Map(mapDiv, {
		center : new google.maps.LatLng(34.8349692, 134.692602),
		navigationControl: true,
		draggableCursor: 'crosshair',draggingCursor: 'move',
		zoom : 15,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	  });
	  var berkeley = {lat: 37.869085, lng: -122.254775};
	  function processSVData(data, status) {
	  if (status === 'OK') {
		
	  } else {
		console.error('Street View data not found for this location.');
	  }
	}
  
	  //クリックイベント設定
	  google.maps.event.addListener(map, 'click', function(event){
		console.log(event.latLng);
		pointarray.push(event.latLng);
		var marker = new google.maps.Marker({
			position:event.latLng,
			title:"Start Point",
			Zindex:i
		});
		i++;
		marker.setMap(map);
		if(pointarray.length>=2){
			// ルート検索の条件
		  var request = {
			  origin: pointarray[0], // 出発地
			  destination: pointarray[1], // 目的地
  
			  travelMode: google.maps.DirectionsTravelMode.WALKING, // 交通手段(歩行。DRIVINGの場合は車)
		  };
		  var d = new google.maps.DirectionsService(); // ルート検索オブジェクト
		  var r = new google.maps.DirectionsRenderer({ // ルート描画オブジェクト
			  map: map, // 描画先の地図
			  preserveViewport: true, // 描画後に中心点をずらさない
		  });
  
		  // ルート検索
		  d.route(request, function(result, status){
			  // OKの場合ルート描画
			  if (status == google.maps.DirectionsStatus.OK) {
				  r.setDirections(result);
				  for (var i=0; i<result.routes.length; i++) {
					var panopoint = result.routes[i];
  
					for (var j=0; j<panopoint.legs.length; j++) {
					  //var latlng = panopoint.overview_path[j];
					  for(var k=0; k<panopoint.legs[j].steps.length;k++){
  
						var splitdist = panopoint.legs[j].steps[k].distance.value/5; //2m感覚で分割
						var beforepoint = panopoint.legs[j].steps[k].start_location;
  
						//showMessage("splitdist:"+splitdist);
						for(var l=0;l<=splitdist;l++){//ルートを2mごとに区切る
						  var tmppoint = new google.maps.LatLng(beforepoint.lat()+(panopoint.legs[j].steps[k].end_location.lat()-panopoint.legs[j].steps[k].start_location.lat())/splitdist, beforepoint.lng()+(panopoint.legs[j].steps[k].end_location.lng()-panopoint.legs[j].steps[k].start_location.lng())/splitdist);
						  //showMessage("lat:"+(panopoint.legs[j].steps[k].start_location.lat())+"\n");
						  panos.push(tmppoint);											
								new google.maps.Marker({position:tmppoint, map:map});
						  //setTimeout(loader.load(tmppoint),1000);
						  beforepoint = tmppoint;
						}
					  }
					  //loader.load(latlng);
					}
  
					console.log(panos);
					getPanoids(panos, createPanoidsAPI);
				  }
			}
		  });
  
		}
  
	  });
	});
	// ルート情報をサーバにアップロード
	var setRoutesDateOnServer = function() {
		return new Promise(function(resolve, reject) {
				var uri = url + "?setroute"
				console.log(uri);
				$.ajax(uri,
				{
					type: 'post',
					data: panoids,
					dataType: 'json'
				}
			)
			// 検索成功時にはページに結果を反映
			.done(function(data) {
				resolve();				
				console.log("成功");
			})
			// 検索失敗時には、その旨をダイアログ表示
			.fail(function() {
				resolve();		
				console.error("失敗")		
			});			
		})
	  };
	// パノラマ画像をサーバに作成
	var createPanoramaImageOnServer = function(){
		var length = panoids.length;
		var i;
		messageController.State(messageController.state.progress_start);
		return loop(function() {
		  return new Promise(function(resolve, reject) {
			i = 0;
			resolve();
		  });
		}, function() {
		  return new Promise(function(resolve, reject) {
			resolve(i < length);
		  });
		}, function() {
		  return new Promise(function(resolve, reject) {
				var panoid = panoids[i].panoid;
				var uri = url + "create/?panoid=" + panoid;
				console.log(uri);
				$.ajax(uri,
				{
					type: 'get',
					dataType: 'json'
				}
			)
			// 検索成功時にはページに結果を反映
			.done(function(data) {
				resolve();				
				console.log("成功");
			})
			// 検索失敗時には、その旨をダイアログ表示
			.fail(function() {
				resolve();		
				console.error("失敗")		
			});			
		  });
		}, function() {
		  return new Promise(function(resolve, reject) {
			i++;
			messageController.State(
				messageController.state.progress_change, 
				{
					"current" : i,
					"length"  : length
				}
			);			
			resolve();
		  });
		});
	}
	$("#js_apiStart").on('click', function(){
		setRoutesDateOnServer()
		.then(createPanoramaImageOnServer)
		.then(function(){
			console.log("complete");
		})
	});
  
});

// メッセージの状態を管理するクラス
class MessageController {
	// コンストラクタ
	constructor(messageDiv, circle, apiStartButton, progressBar) {
	  this.messageDiv = messageDiv;
	  this.circle = circle;
	  this.apiStartButton = apiStartButton;
	  this.progressBar = progressBar;
	  this.state = {
		  "load_panoid_start" : 0 ,
		  "load_panoid_finish" : 1,
		  "progress_start" : 2,
		  "progress_change" : 3,
	  };
	}
	// 状態によって色々変えるメソッド
	State(state, data = undefined) {
		switch(state) {
			case this.state.load_panoid_start :
				this.circle.show();
				this.messageDiv.text("パノラマ情報を取得しています");
			break;
			case this.state.load_panoid_finish :
				this.circle.hide();
				this.messageDiv.text("パノラマ情報取得に成功しました");
			break;
			case this.state.progress_start :
				this.messageDiv.text("パノラマ画像をサーバに生成しています");			
				this.progressBar.parent().show();
				this.progressBar.css('width', '0%');
			break;
			case this.state.progress_change :
				var progress = data.current / data.length * 100;
				this.messageDiv.text("パノラマ画像をサーバに生成しています 実行件数" + data.current + "/" + data.length);		
				this.progressBar.css('width', progress + '%');
			break;
			default :
			break;
		}
	}
  }
   