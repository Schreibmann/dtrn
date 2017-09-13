var Settings= new Object();
var iniPath = 'ini/';
var SetttingsBtnShowTimeout;
var persent;

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); };

function readSettings(){
/*$( document ).ajaxError(function(event, jqxhr, settings, exception) {
		
		var ReadUrl = settings.url.split('?')[0];
		alert("Ошибка "+exception+" при чтении "+ReadUrl);
	});*/
	
	$.ajaxSetup({
		cache: false
	});	
	var ret=false;
$.ajax({ 
		type: "GET",
		url: iniPath+"settings.ini",
		async: false,
		success:  function(s){ 
				var arrS = s.toString().split(String.fromCharCode(10));
				keyVal(Settings, arrS);
				ret = true;
				},
		error: function(s){
		Settings['grid']='self';
		Settings['frame_1_ip']='self';	
		ret = true;
		}
		});
		return ret;
		//alert(Settings["grid"]);
}

function setGrid(){ // 
	var Grid = Settings['grid'];
	var html_str = '';

		$.ajax({ 
		type: "GET",
		url: Grid+".htm",
		success:  function(s){ 
				html_str = s.toString();
				$('#wrap').html(html_str);
				//$("#wrap").attr("onload", 'showSettingsBtn()');
				}
		});		
	

	
}

function keyVal(obj,arr){ //
	var Res = false;
	for (i = 0; i < arr.length; i++) {
        var elem = arr[i].trim();	
		if (elem == "#FEEFBAAB#") {
			Res = true;
		} else if (elem.length > 0) {
			var nameVal = elem.split("=");
			obj[nameVal['0']]= nameVal['1'];
		}
	}
	return Res;
}

function set_URL(){ 
var URL;
var ret = false;
	for (i=1;i<=12;i++)
	{
		if (Settings["frame_"+i+"_ip"] == 'empty') {URL = 'empty.htm'}
			else if (Settings["frame_"+i+"_ip"] == 'self') {URL = 'main.html'; ;}
				else{URL = 'http://'+Settings["frame_"+i+"_ip"]+"/main.html"; ;} 
		$("#iframe"+i).attr("src", URL);
		
	}
	ret = true;
	return ret;
}

function setMonSettings(){ //
var URL;
	for (i=1;i<=12;i++)
	{
		if (Settings["frame_"+i+"_ip"] != 'empty')
		{URL = Settings["frame_"+i+"_ip"];} else {URL = ''}
		$("#frame_"+i+"_ip").attr("value", URL);		
	}
	
	$("#"+Settings['grid']).click();
	$("#"+persent.toString()).click();
}




function showMonSettings(doing){ //
	if (doing == "show"){ 	
		
	$('body').load('settings.htm');
	
	} 
	else 
	{
	location.reload();
	}	
}

function changeSettings() {
var URL;
var datastr = '';
var persent = $('input:radio[name=scale]:checked').val();
var CookieDate = new Date;

deleteCookie("prs");
//CookieDate.setFullYear(CookieDate.getFullYear() + 10);
document.cookie="prs=" + persent.toString()+"; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT";
//setCookie("prs", persent, CookieDate);

	for (i=1;i<=12;i++)
	{
		URL = $('#frame_'+i+'_ip').val();
		if (URL  == "") 	{URL = "empty"}	
		if (URL  == "localhost") 	{URL = "self"}	
		datastr = datastr + "frame_"+i+"_ip=" + URL + "&"; 
	}
	var value = $('input:radio[name=grid]:checked').val();
	datastr = datastr + "grid=" + value + "&";
	
			$.ajax({ 
				type: "POST",
				url: "change_settings.php",
				data:  datastr+"path="+iniPath,
				success: function(html)
				{ 
					 //alert(html); 
					 setTimeout("location.reload()", 500);
				}
			});
}

function showSettingsBtn() {
 $('#mon_settings').css('visibility','visible');
 $('#mon_settings').attr("disabled", false);
 
 $('iframe[name=iframe1]').each(function(){
	
		if ((persent == 50 ) || (persent == 66 )) {
		
		if ($.browser.mozilla) {

		$(this).contents().find('.nameBt').css('font-size','13px');	
		$(this).contents().find('.nameBt').css('font-variant','small-caps');	
		
		$(this).contents().find('.mdName').css('font-size','10.8pt');	
		$(this).contents().find('.mdName').css('font-family','Small Fonts');	
		
		$(this).contents().find('.standartFont').css('font-size','15px');	
		
		$(this).contents().find('.standartFont_mini').css('font-size','14px');	
		$(this).contents().find('.standartFont_mini').css('font-family','Small Fonts');	
		
		$(this).contents().find('.title').css('font-weight','normal');	
		$(this).contents().find('.title').css('font-size','13px');	
		$(this).contents().find('.divM_sm').css('font-size','11pt');
		$(this).contents().find('.editM_sm').css('font-size','14px');	
		
		$(this).contents().find('.base').css('font-size','14px');	
		
		$(this).contents().find('.alarm').css('font-variant','small-caps');	
		$(this).contents().find('.alarm').css('font-size','11pt');	
		$(this).contents().find('.alarm').css('font-family','Trebuchet MS');	
				
		$(this).contents().find('#pTest').css('font-size','9pt');	
		
		$(this).contents().find('#TarTable').css('margin-bottom','0');	
		
		} else
		
		if ($.browser.msie8 || $.browser.msie9) {
		
		} else {
		
		$(this).contents().find('.nameBt').css('font-size','13px');	
		//$(this).contents().find('.nameBt').css('font-family','Verdana');	
		$(this).contents().find('.nameBt').css('font-variant','small-caps');	
		
		$(this).contents().find('.mdName').css('font-size','10.8pt');	
		$(this).contents().find('.mdName').css('font-family','Lucida Sans Unicode');	
		
		$(this).contents().find('.standartFont').css('font-size','15px');	
		
		$(this).contents().find('.standartFont_mini').css('font-size','14px');	
		$(this).contents().find('.standartFont_mini').css('font-family','Lucida Sans Unicode');	
		
		//$(this).contents().find('.title').css('font-weight','normal');	
		$(this).contents().find('.title').css('font-size','13px');	
		$(this).contents().find('.divM_sm').css('font-size','11pt');
		$(this).contents().find('.editM_sm').css('font-size','14px');	
		
		$(this).contents().find('.base').css('font-size','14px');	
		
		//$(this).contents().find('.alarm').css('font-variant','small-caps');	
		$(this).contents().find('.alarm').css('font-size','10pt');	
		//$(this).contents().find('.alarm').css('font-family','Trebuchet MS');	
				
		$(this).contents().find('#pTest').css('font-size','9pt');	
		
		$(this).contents().find('#TarTable').css('margin-bottom','0');	
		$(this).contents().find('#TarTable').css('font-size','13px');	
		
		$(this).contents().find('#alert_message').css('font-size','15px');
		
		
		}
		
	}	
	}); 
 
 }

function FramesNeedPassCheck()
{

		readSettings();

			$.ajax({ 
				type: "POST",
				url: "lgn.php",
				data: 'pass=check&login=ConfWin',
				success: function(html)
				{
				
				if (html == 'no_pass')
				{
					showMonSettings('show')
				}
				else showFramesAuth();
				}
			});

		
}

function showFramesAuth() {
	var html_str = '';

		$.ajax({ 
		type: "GET",
		url: "frames_auth.html",
		success:  function(s){ 
				html_str = s.toString();
				$('#wrap').html(html_str);
				}
		});		
}

function FramesCheckPass()
{
		var pass = $('#passwrd').val();
			$.ajax({ 
				type: "POST",
				url: "lgn.php",
				data: "pass="+pass+'&login=ConfWin',
				success: function(html)
				{
				
				if ((html == 'good_pass') || (html == 'no_pass'))
				{
					showMonSettings('show')
				}
				else MessageBox(html);
				}
			});

		
}

function changeValue(pid,text){
	if($(pid).is("p")){
		$(pid).html(text);
	} else {
		$(pid).val(text);
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

