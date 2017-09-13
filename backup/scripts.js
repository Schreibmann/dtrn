var AccessDenied = "У вас нет полномочий для выполнения данной операции.";
var Auth;
var Path;
var checkPrd = 180;
var Device= new Object();
var Power= new Object();
Power['curTime'] = 0;
Power['curFileSize'] = 0;
var Users = new Object();
Users['Admin']='Администратор';
Users['Control']='Управление';
Users['User']='Только  чтение';
var CheckBoxState = new Object();
var indicators = new Object();
var Settings = new Object();
Settings ={};
var CurSettings = new Object();
var iniPath = 'ini/';
var breakdownsName = new Object();
var UploadDir = '/files/';
var FullTime = 92000;
var percent1 = FullTime/100;
var curProgress =0;
var noMoreMessages = false;
var RestartIntervalId = -1;
var BreakFlagIntervalId = -1;
var takeSettingsIntervalIdFast = -1;
var takeSettingsIntervalIdSlow = -1;
var checkBoxChanged = false;
var oldMsgNo = -2;
var reqNo = 0;
var FirstBreakDown = true;
var FirstBreakDownSub = true;
var FirstAuthWin = true;
//var FirstSettings = true;
//var FirstAdm = true;
var needAuth_settings = true;
var needAuth_alarm = true;
var needAuth_adm = true;
var currentWindow = '';
var number_edit_val;
var NowUnload = false;

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); };

function changeValue(pid,text){
	var elem = $(pid);
	if (elem.length > 0) {
		if (elem.is("p")){
			elem.html(text);
		} else {
			elem.val(text);
		}
	}
	
} 

function showAlert(doing){
	var alarmset = document.getElementById('throw_alert');
	if (doing == "show"){
		alarmset.style.visibility= "visible";
	}else {
		alarmset.style.visibility= "hidden";
	}
}

function MessageBox(msg){
	changeValue(alert_message,msg);
	showAlert("show");
}

function NoAccess(){
	MessageBox(AccessDenied);
}

function putTextToIndicator(){
	var IsRO  = false;
	for(var key in indicators){
		var  pid = '#'+key;
		var value = indicators[key];
		var menuHide = $('#menu').css('visibility') != "visible";
		var prefix = key.substr(0,2);
		if ((prefix == "md") || (prefix == "pw")) {
		}else if (key.substr(0,5) == "alarm") {
		}else if (key == "modulation"){
			changeModulation(value);
			if (menuHide){
				changeValue('#MO',value);
			}
		} else if (key == "pCH"){
			changeValue(pid,value); 
			if (menuHide){
				changeValue('#CH',value);
			}
		} else if (key == "pRO"){
			if (value == "ON") {
				IsRO  = true;
				$('#pTX').css('color','gray');
			} else {
				$('#pTX').css('color','black');
			};
			if (menuHide){
				changeValue('#RO',value);
			}
		}else if ((key == "pRX") || (key == "pSX") || (key == "pTX")){
			var measure = pid+'mesure';
			if (IsRO && menuHide && (key == "pTX"))  {
				changeValue(pid,"--.---,---"); 
				$(measure).css('visibility','hidden');	
				changeValue('#TX',value); 
			} else {
				changeValue(pid,value); 
				if (checkInput(value,0, 10)){
					$(measure).css('visibility','visible');
					if (menuHide){
						if (key == "pRX") {
						   changeValue('#RX',value); 
						} else if (key == "pSX") {
							if (Device['type'] != "Transmitter"){
								changeValue('#RX',value); 
							};
							if (Device['type'] != "Receiver"){
								changeValue('#TX',value); 
							};
						} else if (key == "pTX") {
						   changeValue('#TX',value); 
						}
					}
				} else {
					$(measure).css('visibility','hidden');	
				}
			}
		}else if (key == "dAlarm"){
			if (value == "OK") {
				$('#dAlarmr').css('visibility','hidden');
				$('#dAlarmy').css('visibility','hidden');
				$('#dAlarmg').css('visibility','visible');
			} else if (value == "War") {
				$('#dAlarmr').css('visibility','hidden');
				$('#dAlarmg').css('visibility','hidden');
				$('#dAlarmy').css('visibility','visible');
			}else {
				$('#dAlarmg').css('visibility','hidden');
				$('#dAlarmy').css('visibility','hidden');
				$('#dAlarmr').css('visibility','visible');
				
			} 
		}else if (key == "dPTT"){
			if (Device['type'] != "Receiver"){
				if (value == "ON") {
					$('#dPTT_off').css('visibility','hidden');
					$('#dPTT_red').css('visibility','visible');
				} else {
					$('#dPTT_red').css('visibility','hidden');
					$('#dPTT_off').css('visibility','visible');
				}
			}
		}else if (key == "bPTT"){
			var pttButton = document.getElementById('pttButton');
			var btest = document.getElementById('btest');
			if (value == "ON") {
				pttButton.src = "img/buttons/k888.gif";
				btest.src = "img/buttons/k22.gif";
			} else if (value == "OFF") {
				pttButton.src = "img/buttons/k999.gif";
				btest.src = "img/buttons/testOff.gif";
			}else {
				pttButton.src = "img/buttons/k9999.gif";
				btest.src = "img/buttons/kser.gif";
			} 
		}else if (key == "b220"){
			var pwr220 = document.getElementById('pwr220');
			if (value == "ON") {
				pwr220.src = "img/buttons/k888.gif";
			} else if (value == "OFF") {
				pwr220.src = "img/buttons/k999.gif";
			}else {
				pwr220.src = "img/buttons/k9999.gif";
			} 
		}else if (key == "bcountCH"){
			var countCH = document.getElementById('bcountCH');
			if (value == "1000C") {
				countCH.src = "img/buttons/1000C.gif";
			} else if (value == "1000A") {
				countCH.src = "img/buttons/1000A.gif";
			}else {
				countCH.src = "img/buttons/tuner_grey.gif";
			} 
		}else if ((key == "pRFTUNE") || (key == "pRL") || (key == "pRM") || (key == "pRH") || (key == "pTimePT")){
			if (menuHide){
				changeValue(pid,value);
			}		
		}else if ((key == "bpanelLock") || (key == "bfreqLock") || (key == "bBacklight") || (key == "bSpeaker")){
			if (value == "ON") {
				$(pid).attr("checked",true);
			} else {
				$(pid).attr("checked",false);
			}
		}else if (key == "message") {
			if (!noMoreMessages){
			   var MsgNo = indicators['msgNo'];
			   if (oldMsgNo != MsgNo) {
	                if ((oldMsgNo < -1) && (MsgNo >= 0))
					   value = "";
					oldMsgNo = MsgNo;
					if (value != "") {
						noMoreMessages=true;
						MessageBox(value);
						noMoreMessages=false;
					}
			   }
			};
		}else if (key == "msgNo"){
		}else if (key == "reqNo"){
		    if (value == reqNo.toString()) {
			  if (!menuHide){
				changeValue('#CH',indicators['iCH']);
				changeValue('#TX',indicators['iTX']);
				changeValue('#RX',indicators['iRX']);
				changeValue('#MO',indicators['iMO']);
				changeValue('#RO',indicators['iRO']);
				}
				reqNo++;
			};
		}else if ((key == "iCH") || (key == "iTX") || (key == "iRX") || (key == "iMO") || (key == "iRO")){
		}else {
			changeValue(pid,value); 
			if ($(pid).css('visibility') == "visible"){
				switch (key){
					case 'pB2':
						if (value == "ON"){
							$('#dB2g').css('visibility','visible');
						}else{
							$('#dB2g').css('visibility','hidden');
						}
					break;
					case 'pB3': 
						if (value == "TUNE"){
							$('#dB3g').css('visibility','visible');
							$('#dB3r').css('visibility','hidden');
						}else{
							$('#dB3g').css('visibility','hidden');
							$('#dB3r').css('visibility','visible');
						}	
					break;
					case 'pB4': 
						if (value == "20dB"){
							$('#dB4g').css('visibility','visible');
						}else{
							$('#dB4g').css('visibility','hidden');
						}
					break;
					case 'pB5': 
						if (value == "ON"){
							$('#dB5g').css('visibility','visible');
						}else{
							$('#dB5g').css('visibility','hidden');
						}
					break;
					case 'pB6': 
						if (value == "OPEN"){
							$('#dB6g').css('visibility','visible');
						}else{
							$('#dB6g').css('visibility','hidden');
						}
					break;
					case 'pB7': 
						if (value == "ВКЛ"){
							$('#dB7g').css('visibility','visible');
						}else{
							$('#dB7g').css('visibility','hidden');
						}
					break;
					default:
				}
			}
		}	
	}
}

function putTextToBreakdowns(){
	var pid;
	var tr;
	var trState;
	var trKey;
	var Hide6_11 = Device['type'] == "Transmitter";
	for (var key in breakdownsName){
		if (Hide6_11 && ((key == "md6name") || (key == "md11name"))) {
		} else {
			pid = '#'+key;
			trKey =key.replace(/name/g,"State");
			tr = pid;
			tr = tr.replace(/name/g,"On");
			trState = '#' +trKey;
			var value = indicators[trKey];
			$(trState).html(value);
			if ($(tr).is(":checked")){
				$(pid).css('color','black');
				if (value == "ERR" ){
					$(trState).css('color','red');
				}else  if (value == "OK"){
					$(trState).css('color','green');
				}else {
					$(trState).css('color','blue');
					$(trState).css('background-color','transparent');
				}
			}else{
				$(trState).css('color','gray');
				$(pid).css('color','gray');
			}
		}
	}
}

function putTextToBreakdownsName(){
	var Hide6_11 = Device['type'] == "Transmitter";
	for (var key in breakdownsName){
		if (Hide6_11 && ((key == "md6name") || (key == "md11name"))) {
		} else {
			var  pid = '#'+key;
			changeValue(pid,breakdownsName[key]);
		}
	}
}

function setCheckBoxState(){
	for(var key in CheckBoxState){
		var  pid = '#'+key;
		if  (key != "pCheckPeriod"){
			var value = CheckBoxState[key] == "true";
			$(pid).attr("checked",value);
		}else{
			checkPrd=CheckBoxState[key];
			changeValue(pid,checkPrd);
		}		
	}
}

function resumeCheckPeriod(){
	if (Auth != "Admin"){
		changeValue('#pCheckPeriod',checkPrd);
	}
}

function resumeCheckBox(id){
	if (Auth != "Admin"){
//		window.alert('fignia'+Auth);
		var state = CheckBoxState[id] == "true";
		$('#'+id).attr("checked",state);
		return false;
	}else{
//	    var tr = '#'+id;
	    var state = $('#'+id).is(":checked");
//		$('#'+id).attr("checked",state);
//		window.alert(id+"  "+state);
		CheckBoxState[id]=state.toString();
		writeCheckBoxToIni();
		return true;
	}
}



function changeCheckPeriod(){
	if (Auth == "Admin"){
		checkPrd = $('#pCheckPeriod').val();
		$.ajax({ 
				type: "POST",
				url: "changeCheckPeriod.php",
				data: "newPeriod="+ $('#pCheckPeriod').val() + "&path="+ iniPath,
				success:  function(html){ 
//					MessageBox(html);
				}
			  });
	}else{
		NoAccess();
	}
}

function changeModulation(mod){
	var tmp = mod;
	for (i =1; i<5; i++){
		var  tmp2 ="#iR"+i;
		$(tmp2).css('visibility','hidden');
		tmp2 ='#dR'+i+"g";	
		$(tmp2).css('visibility','hidden');
		tmp2 ='#dR'+i+"o";	
		$(tmp2).css('visibility','visible');
	}
	switch (tmp){
		case "J3E": $('#iR1').css('visibility','visible');
					$('#dR1g').css('visibility','visible');
					$('#dR1o').css('visibility','hidden');
		break;
		case "J2B": $('#iR2').css('visibility','visible'); 
					$('#dR2g').css('visibility','visible');
					$('#dR2o').css('visibility','hidden');
		break;
		case "R3E": $('#iR3').css('visibility','visible');
					$('#dR3g').css('visibility','visible');
					$('#dR3o').css('visibility','hidden');
		break;
		case "SSB": $('#iR4').css('visibility','visible'); 
					$('#dR4g').css('visibility','visible');
					$('#dR4o').css('visibility','hidden');
		break;
		default:
	};
}


function keyVal(obj,arr){ //разбор  строчки в  значение =  ключ
	for (i = 0; i < arr.length; i++) {
        var elem = arr[i].trim();
		if (elem.length > 0) {
			var first = elem.charAt(0);
			if (first == ";")  {
				/*ignore comments*/
			} else if (first == "#")  {
				return true;
			} else {
				var nameVal = elem.split("=");
				obj[nameVal['0']]= nameVal['1'];
			}
		}
	}
	return false;
}

jQuery.exists = function(selector) {
   return ($(selector).length > 0);
}

function changeDeviceType(){
	if (Auth == "Admin"){
		createFile($("#PortNum").val());
		createFile($("#DeviceType").val());
		logout();
	}else{
		NoAccess();
	}	
}

function changeDeviceName(){
	if (Auth == "Admin"){
		var NewName = $("#DeviceNameInput").val();
		SendValueToDarton("name",NewName);
		Device['name'] = NewName;
		ChangeTitle(NewName);
	}else{
		NoAccess();
	}
}

function SetBtnyVisibility(key,state){
	$('#b'+key).css('visibility',state);
	$('#i'+key).css('visibility',state);
	$('#p'+key).css('visibility',state);
	$('#i'+key+'b').css('visibility',state);
	$('#d'+key+'o').css('visibility',state);
	$('#n'+key).css('visibility',state);
}


function putConstructDeviceType(){ //построение  интерфейса  основного окна
	var haveSend = 'visible';
	var haveRecv = 'visible';
	var DevType = Device['type'];
	if (DevType == "Transmitter") {
	   haveRecv = 'hidden';
	} else if (DevType == "Receiver"){
	   haveSend = 'hidden';
	};
	
	$('#progressBar').addClass("ie_opacity");
	
	SetBtnyVisibility('L1','visible');
	SetBtnyVisibility('L2','visible');
	$('#imgChannel').css('visibility','visible');
	SetBtnyVisibility('L3',haveRecv);
	SetBtnyVisibility('L4',haveRecv);
	$('#imgShift').css('visibility',haveRecv);
	
	SetBtnyVisibility('B1',haveSend);
	SetBtnyVisibility('B2',haveSend);
	SetBtnyVisibility('B3',haveSend);
	SetBtnyVisibility('B4',haveRecv);
	SetBtnyVisibility('B5',haveRecv);
	SetBtnyVisibility('B6',haveRecv);
	SetBtnyVisibility('B7',haveRecv);
	
	SetBtnyVisibility('R1','visible');
	SetBtnyVisibility('R2','visible');
	SetBtnyVisibility('R3','visible');
	SetBtnyVisibility('R4','visible');
	
	SetBtnyVisibility('Alarm','visible');
	SetBtnyVisibility('Settings','visible');
	
	//$('#showTblBtn').css('visibility',haveSend);

	$('#pSXmesure').css('visibility','hidden');
	if (DevType != "Transceiver"){
		$('#divRO').css('visibility','hidden');
	};
	
	
	
	if (DevType == "Transmitter"){
		$('#divRX').css('visibility','hidden');
		$('#pRXmesure').css('visibility','hidden');
		$('#pRX').css('visibility','hidden');
		$('#pSHIFTmesure').css('visibility','hidden');
		$('#pSH').css('visibility','hidden');
	}else if (DevType == "Receiver"){
		$('#divTX').css('visibility','hidden');
		$('#divRFTUNE').css('visibility','hidden');
		$('#divRL').css('visibility','hidden');
		$('#divRM').css('visibility','hidden');
		$('#divRH').css('visibility','hidden');
		$('#divVSWR').css('visibility','hidden');
		$('#divTimeCW').css('visibility','hidden');
		$('#subbreakdownAlarm').css('visibility','hidden');
		$('#countCH').css('visibility','hidden');
		$('#CWHoldTimer').css('visibility','hidden');
		$('#pTXmesure').css('visibility','hidden');
		$('#pTX').css('visibility','hidden');
		$('#divPTT').css('visibility','hidden');
		$('#dPTT_name').css('visibility','hidden');
		$('#submenu2').css('visibility','hidden');
		//$('#showTblBtn').css('visibility','hidden');
		
	}
	$('#DeviceType').val(DevType);
	$('#PortNum').val("Port"+Device['port']);
	$('#j2bCorr').val(Device['j2bCorr']);
	$('#log').val(Device['LogMode']);
	$('#maxDelay').val(Device['addTimeout']);
	$('#B').val(Device['B']);
	$('#L').val(Device['L']);
	$('#K').val(Device['K']);
	var TwoFreq = true;
	if (Device['ShowTwoFreq'] == "true")
		{TwoFreq = false;}
	$('#ShowTwoFreq').attr("checked",TwoFreq);
	
	if ($.browser.msie8) {
	$('#authWin').css('height', '105');
}
}

function takeAuth(perm)
{
	Auth = perm;
	/*var Logout = document.getElementById('bLogout');
	if (Auth == "Admin") {
		Logout.src = "img/buttons/adm_exit.gif";
	} else if (Auth == "Control") {
		Logout.src = "img/buttons/exit_manage.gif";
	} else {
		Logout.src = "img/buttons/exit_read.gif";
	}*/
};

function readInd(){
	clearTimeout(takeSettingsIntervalIdFast);
	clearTimeout(takeSettingsIntervalIdSlow);
	if ($.browser.msie8) {
		takeSettingsIntervalIdSlow = setTimeout('readInd()',1500);
	}else{
		takeSettingsIntervalIdSlow = setTimeout('readInd()',1000);
	}
	
	$.ajax({ 
		type: "GET",
		url: Device['path']+"toWebPanel.ini",
		success:  function(html){ 
			var arrS = html.split(String.fromCharCode(10));
			var Res = keyVal(indicators, arrS);
			if (Res) {
				putTextToIndicator();
				var breakdownVisible = $('#breakdown').css('visibility') == "visible";
				if (breakdownVisible)
					putTextToBreakdowns();
				if (FirstBreakDownSub) {
					$('#breakdownSub').addClass("radiusBorder10");
					FirstBreakDownSub = false;
				};
				
			};
			takeSettingsIntervalIdFast = setTimeout('readInd()',250);
		},
		error:	function(html){ 
			takeSettingsIntervalIdFast = setTimeout('readInd()',500);
		}
	});
}


function fillTable() //заполняем табличку значениями из device.ini
{
	var T1 = Device['T1'].split('|');
	var T2 = Device['T2'].split('|');
	
	for (i=0;i<T1.length;i++)
	{
	var edit_val = T1[i].split(' ');
	$('#T1_edit'+(i+1)+'_1').html(edit_val[0]);
	$('#T1_edit'+(i+1)+'_2').html(edit_val[1]);
	}	
	
		for (i=0;i<T2.length;i++)
	{
	var edit_val = T2[i].split(' ');
	$('#T2_edit'+(i+1)+'_1').html(edit_val[0]);
	$('#T2_edit'+(i+1)+'_2').html(edit_val[1]);
	}	

		for (i=1;i<=9;i++)
		{
			if ($('#T1_edit'+i+'_1').html() == '') {$('#T1_edit'+i+'_1').html('&nbsp');}
			if ($('#T1_edit'+i+'_2').html() == '') {$('#T1_edit'+i+'_2').html('&nbsp');}
			if ($('#T2_edit'+i+'_1').html() == '') {$('#T2_edit'+i+'_1').html('&nbsp');}
			if ($('#T2_edit'+i+'_2').html() == '') {$('#T2_edit'+i+'_2').html('&nbsp');}
		}
		
	$('#B').val(Device['B']);
	$('#L').val(Device['L']);
	
		var B = parseFloat($('#B').val());
		var L = parseFloat($('#L').val());
		var val = 2 * B * L;
		$('#K').val(val); 
		//MessageBox(val);
	
}

function saveTable() //сохраняем  в fromWebPanel.ini
{
	var T1 = '';
	var T2 = '';


	for (i=1;i<=9;i++)
	{
		var val1 = $('#T1_edit'+i+'_1').html().trim();
		var val2 = $('#T1_edit'+i+'_2').html().trim();
		var val3 = $('#T2_edit'+i+'_1').html().trim();
		var val4 = $('#T2_edit'+i+'_2').html().trim();

		var V1 = (val1 != undefined) && (val1 != null) && (val1 != '')  && (val1 != '&nbsp;') ? val1 : '0';
		var V2 = (val2 != undefined) && (val2 != null) && (val2 != '') && (val2 != '&nbsp;') ? val2 : '0';

		//alert(V1+' '+V2);

		if ((V1 != '0') || (V2 != '0')) {
			T1 += V1 + ' ' + V2 + '|';
		}

		var V3 = (val3 != undefined) && (val3 != null) && (val3 != '') && (val3 != '&nbsp;') ? val3 : '0';
		var V4 = (val4 != undefined) && (val4 != null) && (val4 != '') && (val4 != '&nbsp;') ? val4 : '0';

		if ((V3 != '0') || (V4 != '0')) {
			T2 += V3 + ' ' + V4 + '|';
		}
	}
	
    T1 = T1.replace(new RegExp("&amp;",'g'),"0");
	T1 = T1.replace(new RegExp("=",'g'),"0");
    T2 = T2.replace(new RegExp("&amp;",'g'),"0");
	T2 = T2.replace(new RegExp("=",'g'),"0");
	
    var B = $('#B').val();
	//var K = $('#K').val();
	var L = $('#L').val();

	/*Device['T1'] = T1;
	Device['T2'] = T2;
	Device['B'] = B;
	Device['L'] = L;
	//Device['K'] = K;*/

	var datastr = "T1="+T1+"&T2="+T2+"&B="+B+"&L="+L;
	$.ajax({ 
		type: "POST",
		url: "createfilew.php",
		data: "path="+ Device['path']+"&"+datastr
	}); 

	showTable('hide');

}

function showTable(doing){ //открытие - закрытие таблицы
	if (doing == "show"){ 	
				
		$.ajax({ 
		type: "GET",
		url: iniPath+"device.ini",
		success:function(s){
				var arrS = s.toString().split(String.fromCharCode(10));
				keyVal(Device, arrS);
				fillTable();
				$('#UMTable').css('visibility', 'visible');
		}
	});
	number_edit_val = null;	
	} 
	else 
	{
	
		for (i=1;i<=9;i++)
		{
		$('#T1_edit'+i+'_1').html('');
		$('#T1_edit'+i+'_2').html('');
		$('#T2_edit'+i+'_1').html('');
		$('#T2_edit'+i+'_2').html('');
		}
	number_edit_val = null;	
	$('#UMTable').css('visibility', 'hidden');
	}	
}

function requestEnv(){ //запрос  переменного окружения
	$( document ).ajaxError(function(event, jqxhr, settings, exception) {
		var CmdUrl = Device['path']+"toWebPanel.ini";
		var ReadUrl = settings.url.split('?')[0];
		if ((ReadUrl != CmdUrl) && (ReadUrl != 'var/log/Datron.bak') && (ReadUrl != 'var/log/Datron.log') && (NowUnload != true)) 
			alert("Ошибка "+exception+" при чтении "+ReadUrl);
	});
	$.ajaxSetup({
		cache: false
	});	
	$.ajax({ 
		type: "GET",
		url: iniPath+"device.ini",
		success:function(s){
				var arrS = s.toString().split(String.fromCharCode(10));
				keyVal(Device, arrS);
				putConstructDeviceType();
				ChangeTitle(Device['name']);
				createFile('Login');
				readInd();
				
				//fillTable();
		}
	});
	$.ajax({ 
		type: "GET",
		url: iniPath+"breakDownName.ini",
		success:  function(s){ 
				var arrS = s.toString().split(String.fromCharCode(10));
				keyVal(breakdownsName, arrS);
				putTextToBreakdownsName();
				if (FirstBreakDownSub) {
					$('#breakdownSub').addClass("radiusBorder10");
					FirstBreakDownSub = false;
				};
		}
	});
	MouseInit();
	checkWinAuth ('SettingsWin');
	checkWinAuth ('AlarmWin');
	checkWinAuth ('ConfWin');
	//NowUnload = false;
}

function ChangeTitle(newTitle){
	$('#DeviceNameInput').val(newTitle);
	$('#deviceName').html(newTitle);
	document.title = newTitle;
}

function changePSWD(){ //отправка  данных для  смены  пароля
	if (Auth != "Admin"){
		NoAccess();
	}else{	
		var tmp = $('#chpass').serializeArray();
		var  datastr = "";
		if ($('#newpass').val() != $('#confirmpass').val()){
			MessageBox("Проверьте правильность подтверждения пароля!");
		}else{
			$.each(tmp, function(i, field){
				/*if (field.value)*/ datastr = datastr + field.name +"="+ field.value + "&"; } );
			$.ajax({ 
				type: "POST",
				url: "changePSWD.php",
				data:  datastr+"path="+iniPath,
				success: function(html)
				{ 
					 MessageBox(html); 
					 setTimeout("location.reload()", 500);
				}
			});
		}
	}
}

function checkInput(word,minlength, maxlength){
	if (word.length > maxlength || word.length <= minlength){
		return(false);
	} else {
		for (var i=0; i< word.length; i++){
			if (word.charAt(i)!="0" && word.charAt(i)!="1" && word.charAt(i)!="2" && word.charAt(i)!="3" && word.charAt(i)!="4" && word.charAt(i)!="5" && word.charAt(i)!="6" && word.charAt(i)!="7" && word.charAt(i)!="8" && word.charAt(i)!="9" && word.charAt(i)!="-" && word.charAt(i)!="." && word.charAt(i)!=","){
				return(false);
			}
		}
		return(true);
	}	
}

function putValue2Settings(nameI){ //присвоение  значений   настроек  в  массив текущих настроек
	if (Auth != "User"){
		var elem = "#"+nameI;
		if($(elem).val()){	
			Settings[nameI] =  $(elem).val();
		}	
	//	MessageBox(Settings[nameI]);
	} else {
		NoAccess();
	}
}


function logout(){
	clearTimeout(takeSettingsIntervalIdFast);
	clearTimeout(takeSettingsIntervalIdSlow);
	showAdm('hide');
	SettingsMenu('hide','');
	BreakDownMenu('hide');
	$('#showTblBtn').css('visibility','hidden');
	setTimeout("location.reload()", 500);
}

function CheckPass()
{
		var pass = $('#passwrd').val();
			$.ajax({ 
				type: "POST",
				url: "lgn.php",
				data: "pass="+pass+'&login='+currentWindow,
				success: function(html)
				{
				
				if ((html == 'good_pass') || (html == 'no_pass'))
				{
					if (currentWindow == 'SettingsWin')  
					{							
							takeAuth('Admin');
							SettingsMenu("show","");						
					}
					else if (currentWindow == 'ConfWin')  
					{
							takeAuth('Admin');
							showAdm("show");
					}
					else if (currentWindow == 'AlarmWin')  
					{
							takeAuth('Admin');
							$('#subbreakdownAdm').css('visibility','hidden');
					}
				}
				else MessageBox(html);
				}
			});
			
			CloseAuth();
			//$('#passwrd').val('');
		
}

function CloseAuth() {
$('#authForm').css('visibility','hidden');
$('#passwrd').val('');
}

function checkWinAuth (win)
{
	$.ajax({ 
	type: "POST",
	url: "lgn.php",
	data: 'pass=&login='+win,
	success: function(html)
	{
		if (html == 'no_pass') 	
		{
			switch (win) 
			{
				case "SettingsWin" : 	{	
				needAuth_settings = false;
				break;				
				} 
				
				case "AlarmWin" : 	{	
				needAuth_alarm = false;
				break;				
				} 

				case "ConfWin" : 	{	
				needAuth_adm = false;
				break;				
				} 
				
			}
		}
	}	
	});	
}

//***************************************
function BtnDo(buttonid)
{
	if (buttonid == 'bSettingsp') { //настройки
		currentWindow = 'SettingsWin'; 
		if (needAuth_settings == false)	{	
			takeAuth('Admin');
			SettingsMenu("show","");
		} else {
			$('#authForm').css('visibility','visible');	
			$('#passwrd').val('');
			$('#passwrd').focus();
		}
	} else if (buttonid == 'bAlarmp') { //аварии
		currentWindow = 'AlarmWin'; 
		BreakDownMenu("show"); 
		if (needAuth_alarm == false) {
			takeAuth('Admin');
			$('#subbreakdownAdm').css('visibility','hidden');
		} else {
			takeAuth('User');
		}
	} else if (buttonid == 'Conf') { //конфигурация
		currentWindow = 'ConfWin';  
		if (needAuth_adm == false)	{	
			takeAuth('Admin');
			showAdm("show");
		} else{
			$('#authForm').css('visibility','visible');
			$('#passwrd').val(''); 
			$('#passwrd').focus();
			if (FirstAuthWin) {
				$('#authWin').addClass("radiusBorder_"); 
				FirstAuthWin = false;
			}
		}	
	} else if (buttonid == 'AdmAlarm') {
		$('#authForm').css('visibility','visible'); $('#passwrd').val(''); $('#passwrd').focus();
	} else {
		pressButton(buttonid);
	}
}
//*******************************************

function refreshFirmware() {
	pressButton('refreshFirmware');
	UploadBar('hide');
}
			
function restartDevice(a){
	if (Auth == "Admin"){
		pressButton('reboot');
		showAdm('hide');
		SettingsMenu('hide','');
		BreakDownMenu('hide');
		clearTimeout(takeSettingsIntervalIdFast);
		clearTimeout(takeSettingsIntervalIdSlow);
		$.ajax({ 
				type: "POST",
				url: "restartDevice.php",
				data: "level="+a,
				success:function(html){
						curProgress = 0;
						$('#progressBar').css('visibility','visible');						
						RestartIntervalId = setInterval('progressBar()',percent1);
					} 
				});
	}else{
		NoAccess();
	}
}

function progressBar(){
	$('#barStick').css('width',String(curProgress)+'%');
	$('#barValue').html(curProgress+'%');
	curProgress++;
	if (curProgress > 100){
		clearInterval(RestartIntervalId);
		$('#progressBar').css('visibility','hidden');
		logout();
	}
	
}

function pressButton(id){
	if (Auth != "User"){	
		createFile(id);
	} else {
		NoAccess();
	}
}

function AdmPressButton(id){
	if (Auth != "Admin"){	
		createFile(id);
	} else {
		NoAccess();
	}
}

function pressCheckBox(id){
	var checkbox = $("#"+id);
	var state = checkbox.is(":checked");
	var newstate = !state;
	checkbox.attr("checked",newstate);
	pressButton(id);
}

function createFile(id){//создание  командного файла
	$.ajax({ 
			type: "POST",
			url: "createfile.php",
			data: "idbut="+id+"&path="+Device['path']
			});
}

function writeCheckBoxToIni(){
   if (Auth == "Admin"){	
		var tofile ="";
		var elem = "";
		for (var i=1; i<=18; i++){
			elem = "md"+i+"On"; 
			tofile = tofile +"&"+elem +"=";
			tofile = tofile + $("#"+elem).is(":checked");
			if (i <= 14) {
				elem = "pw"+i+"On";
				tofile = tofile + "&"+ elem +"=";
				tofile = tofile + $("#"+elem).is(":checked");
			}
		}
		tofile = tofile + "&alarm1On=";
		tofile = tofile + $("#alarm1On").is(":checked");
		tofile = tofile + "&alarm2On=";
		tofile = tofile + $("#alarm2On").is(":checked");
		tofile = tofile + "&pCheckPeriod="+checkPrd;
		$.ajax({ 
				type: "POST",
				url: "createCheckBox.php",
				data: tofile
				});	
	}else{
	
	}		
}

function SendValueToDarton(id,value){
	if (Auth != "User"){
		var datastr = id+"="+value;
		$.ajax({ 
			type: "POST",
			url: "createfilew.php",
			data:  "path="+ Device['path']+"&"+datastr
		});	
	} else {	
	    NoAccess();
	}
}

function SendValToDarton(id){
	if (Auth != "User"){
		var datastr = 'p'+id+"="+$('#p'+id).val();
		$.ajax({ 
			type: "POST",
			url: "createfilew.php",
			data:  "path="+ Device['path']+"&"+datastr
		});	
	} else {	
	    NoAccess();
	}
}

function SendTwoValToDarton(id,type){
	if (Auth != "User"){
	    reqNo = Math.floor(Math.random()*100000 + 1);
		var datastr = id+"="+$('#'+id).val() + "&type="+type + "&reqNo="+reqNo.toString();
		$.ajax({ 
			type: "POST",
			url: "createfilew.php",
			data:  "path="+ Device['path']+"&"+datastr
		});
	} else {	
		NoAccess();
	}
}
function sentDataFromMenu(form){ //отправка  значений    настроек в  файл, для  передачи  управляющей  программе
	var tmp = $('#'+form).serializeArray();
	$.each(tmp, function(i, field){if (field.value) Settings[field.name]= field.value;} );
	var  datastr = $.param(Settings);
	$.ajax({ 
		type: "POST",
		url: "createfilew.php",
		data:  "path="+ Device['path']+"&"+datastr
	});
}

function SettingsMenu(elem,form){ //процедура открытия, скрытия   окна  меню
	var menuset = document.getElementById('menu');
	if (elem == "show"){
		menuset.style.visibility = "visible";
	}else if (elem == "apply"){
		if (Auth != "User"){
			sentDataFromMenu(form);	
			menuset.style.visibility = "hidden";
		} else {
			NoAccess();
		}
	}else{
		menuset.style.visibility = "hidden";
	}	
}

function BreakFlag(){
	if ($('#breakdown').css('visibility') == 'visible'){
		createFile('bAlarm');
	}

}

function BreakDownMenu(state){ //процедура открытия, скрытия   окна  аварий
	var menuset = document.getElementById('breakdown');
	if (state == "show"){
		$.ajax({ 
			type: "GET",
			url: iniPath+"checkBox.ini",
			success:  function(s){ 
					var arrS = s.toString().split(String.fromCharCode(10));
					var Res = keyVal(CheckBoxState, arrS);
					if (Res) {
						setCheckBoxState();
						putTextToBreakdowns();
						checkBoxChanged = false;
						createFile('bAlarm');
						BreakFlagIntervalId = setInterval('BreakFlag()',30000);
						menuset.style.visibility = "visible";
						$('#checkboxes').css('visibility', 'visible');
						$('#subbreakdownAdm').css('visibility','visible');
						if (FirstBreakDown) {
							$('#subbreakdownState').addClass("radiusBorder_");
							$('#subbreakdownPower').addClass("radiusBorder_");
							FirstBreakDown = false;
						};
					};
			}
		});
	}else{
		takeAuth('Control');
		//requestEnv()
	    clearInterval(BreakFlagIntervalId);
		$('#checkboxes').css('visibility', 'hidden');
		$('#subbreakdownAdm').css('visibility','hidden');
		menuset.style.visibility = "hidden";
//		if (checkBoxChanged){
//			writeCheckBoxToIni();
//		}
	}	
}

function UploadBar(doing){ //открытие - закрытие   оповещения  о  загрузке  файла
	if (doing == "show"){
		var panel = document.getElementById('responseUpload');
        var doc = panel.contentDocument? panel.contentDocument : panel.contentWindow.document;
        if (doc) {
			doc.open(); 	
			doc.write('<button class="menuButtons" onclick="window.parent.UploadBar(\'hide\')">Ok</button>');
			doc.close();
		}
		$('#responseUpload').css('visibility', 'visible');
		$('#uploadButton').css('visibility', 'hidden');
//		panel.location.reload();
	} else {
		$('#responseUpload').css('visibility', 'hidden');
		$('#uploadButton').css('visibility', 'visible');
	}
}

function showAdm(doing){ //открытие - закрытие панели "управление"
	if (doing == "show"){
		if (Auth =="Admin"){	

/*var DevType = Device['type'];
	if (DevType == "Receiver") 	{ $('#showTblBtn').css('visibility','hidden');} 
	else {$('#showTblBtn').css('visibility','visible');}*/
		
			$('#Administration').css('visibility', 'visible');
			$('#uploadButton').css('visibility', 'visible');
			
			var DevType = Device['type'];
			
			if (DevType != "Receiver"){
		//$('#showTblBtn').removeAttr("disabled");
		$('#showTblBtn').css('visibility','visible');
	} else {//$('#showTblBtn').attr('disabled', 'disabled');
			$('#showTblBtn').css('visibility','hidden');}
			
			$.ajax({
			url:'var/log/Datron.bak',
			type:'HEAD',
			error: 		function(){ $("#bak_file_link").removeAttr("href");},
			success: 	function(){ $("#bak_file_link").attr("href", "var/log/Datron.bak");}
			});
			
			$.ajax({
			url:'var/log/Datron.log',
			type:'HEAD',
			error: 		function(){ $("#log_file_link").removeAttr("href");},
			success: 	function(){ 
			
									$("#log_file_link").attr("href", "var/log/Datron.log");
									$("#log_file_link").attr("target", "_blank");
			
								}
			});
			
		}else{
			NoAccess();
		}
	} else {
	
			$('#Administration').css('visibility', 'hidden');
			$('#uploadButton').css('visibility', 'hidden');
			$('#showTblBtn').css('visibility','hidden');
	}	
}



function fixEvent(e) {
    // получить объект событие для IE
    e = e || window.event;
    // получить источник для IE
	if (!e.target)
	   e.target = e.srcElement; 
    // добавить which для IE
    if (!e.which && e.button) {
        e.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) );
    }
    return e
}

function MouseDown(e) {
	e = fixEvent(e);
	if (e) {
		var target = e.target;
		if (target) {
            var parent = target.parentNode;
		    var className = target.className;
			if (parent.className == "hid") {
				var pid = parent.id + "p";
				var obj = document.getElementById(pid);
				if (obj) {
					obj.style.visibility = "visible"; //Показываем нажатие
					obj.down = true;
				}
				return false;
			}if (className.indexOf("clicked") >= 0) {
				var style = target.style;
				style.borderLeftWidth = 2;
				style.borderTopWidth = 2;
				style.borderBottomWidth = 0;
				style.borderRightWidth = 0;
				target.push = true;
				return false;
			};
		};
	}
	return true;
 };
 
function doMouseUp(e, TrueUp) {
	e = fixEvent(e);
	if (e) {
		var target = e.target;
		if (target) {
            var parent = target.parentNode;
			if (parent.down) {
				parent.down=false;
				parent.style.visibility = "hidden"; //скрываем нажатие
				if (TrueUp)
					BtnDo(parent.id);
			} else if (target.push) {
				target.push = false;
				var style = target.style;
				style.borderLeftWidth = 0;
				style.borderTopWidth = 0;
				style.borderBottomWidth = 2;
				style.borderRightWidth = 2;
			}
		};
	}
	return true;
};

function MouseUp(e) {
	doMouseUp(e, true);
	return true;
};

function MouseOut(e) {
	doMouseUp(e, false);
	return true;
 };

function MouseInit() {
	document.onmousedown = MouseDown;
	document.onmouseup = MouseUp;
	document.onmouseout  = MouseOut;
};
 
function clearAll() {
	clearTimeout(takeSettingsIntervalIdFast); 
	clearTimeout(takeSettingsIntervalIdSlow);
	clearInterval(RestartIntervalId);
	clearInterval(BreakFlagIntervalId);
	NowUnload = true;
};
