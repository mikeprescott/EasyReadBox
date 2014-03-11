
if(typeof EasyReadBox=="undefined"){
	var EasyReadBox=EasyReadBox||document.createElement("div");
	var EasyReadBoxModeOn=true;
	var TheText;
	var SpeedLoop;
	var EasyReadBoxWidth=500;
	var Period = false;
	
	EasyReadBox.setAttribute("style","position: fixed; z-index:9999; top: 30px; left: "+(fullWidth()-EasyReadBoxWidth)/2+"px; width: "+EasyReadBoxWidth+"px; height: 110px; background: black; padding: 5px");
	EasyReadBox.setAttribute("id","EasyReadBoxWrapper");
	EasyReadBox.innerHTML="<div id=\"EasyReadBox\" style=\"background: white; width: "+EasyReadBoxWidth+"px; height: 90px; position: relative;\">";
	EasyReadBox.innerHTML+="<style type=\"text/css\">.ERBW_invis{ display: none;} #EasyReadBoxText div{ font-size: 32pt; float: left; height: 1px;} #EasyReadBoxWordCenter{color: red;}</style>";
	EasyReadBox.innerHTML+="<div style=\"width: 2px; background: black; height: 90px; position: absolute; top: 5px; left: "+(EasyReadBoxWidth/2+7)+"px;\"></div>";
	EasyReadBox.innerHTML+="<div id=\"EasyReadBoxText\" style=\" background: white; height: 60px; width: "+EasyReadBoxWidth+"px; position: absolute; top: 22px; left: 5px; \"></div>";
	EasyReadBox.innerHTML+="</div>";
	EasyReadBox.innerHTML+="<div style=\"color: white; padding: 2px 0px 0px 5px;\">select text, press r: read, e: pause</div>";
	EasyReadBox.innerHTML+="<div><input type=\"text\" id=\"SpeedSetter\" value=\"400\" style=\"border: 0px; padding: 0px 4px; text-align: right; width: 50px; position: absolute; bottom: 2px; right: 5px;\" /></div>";
	
	document.body.appendChild(EasyReadBox);
		
	window.onkeyup = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		if (key == 27) { //esc
			var MyClass = document.getElementById("EasyReadBoxWrapper").getAttribute("class");
			if(MyClass == "ERBW_invis"){
				document.getElementById("EasyReadBoxWrapper").setAttribute("class", "");
			}else{			
				document.getElementById("EasyReadBoxWrapper").setAttribute("class", "ERBW_invis");
			}
		}
		if (key == 82) { //r
			EasyReadBoxModeOn = true;
			clearTimeout(SpeedLoop);
			SpeedThatText();
		}
		if (key == 69) { //e
			EasyReadBoxModeOn = !EasyReadBoxModeOn;
		}
	}
	
	var SpeedLoopRoutine = function (){	
		var l = "";//This will represent the last character of the current word.
		if(TheText.length == 0){	
			DisplayWord("");
		}else if(EasyReadBoxModeOn){
			if(Period){
				Period = false;
			}else{
				l = TheText[0].substr(TheText[0].length - 1);
				if(l == "." || l == "?" || l == "!" ){
					Period = true;
				}
				DisplayWord(TheText[0]);
				TheText.shift()}
			}
		var Speed = (1000 * 60) / document.getElementById("SpeedSetter").value;
		SpeedLoop = setTimeout(SpeedLoopRoutine, Speed);
	}
	
	function SpeedThatText(){
		var Speed = (1000 * 60) / document.getElementById("SpeedSetter").value;
		TheText = removeHTMLTags(window.getSelection() + "").replace(/ +(?= )/g,'').split(" ");
		SplitBigWords();
		
		SpeedLoop = setTimeout(SpeedLoopRoutine, Speed);
	}
	
	function DisplayWord(word){
		var OutHTML;
		var redLetter = 1;
		switch (word.length) {
			case 1:
				redLetter = 0; // first
				break;
			case 2:
			case 3:
			case 4:
			case 5:
				redLetter = 1; // second
				break;
			case 6:
			case 7:
			case 8:
			case 9:
				redLetter = 2; // third
				break;
			case 10:
			case 11:
			case 12:
			case 13:
				redLetter = 3; // fourth
				break;
			default:
				redLetter = 4; // fifth
		};
	
		OutHTML = "<div id=\"EasyReadBoxWordSpacer\"></div>" ;
		OutHTML += "<div id=\"EasyReadBoxWordLeft\">";
		OutHTML += word.substring(0, redLetter);
		OutHTML += "</div>";
		OutHTML += "<div id=\"EasyReadBoxWordCenter\">";
		OutHTML += word.substring(redLetter, redLetter + 1);
		OutHTML += "</div>";
		OutHTML += "<div id=\"EasyReadBoxWordRight\">";
		OutHTML += word.substring(redLetter+1, word.length);
		OutHTML += "</div>";
	
		document.getElementById("EasyReadBoxText").innerHTML = OutHTML;
		var L, C;
		L = document.getElementById("EasyReadBoxWordLeft").offsetWidth;
		C = document.getElementById("EasyReadBoxWordCenter").offsetWidth;
		document.getElementById("EasyReadBoxWordSpacer").setAttribute("style", "width: " + (Math.floor((EasyReadBoxWidth - C)/2) - L + 2) + "px");
	}
	
	function SplitBigWords(){
		var adjusted = false;
		var word1;
		var word2;
		for( word in TheText){
			if(TheText[word].length > 13){ //If the word is longer than 13 characters, cut it in half and add a "-" at the end.
				word1 = TheText[word].substring(0, Math.floor(TheText[word].length/2)) + "-";
				word2 = TheText[word].substring(Math.floor(TheText[word].length/2), TheText[word].length);
				TheText.splice(word, 0, word1, word2 );
				adjusted = true;
			}
		}
		if(adjusted){
			SplitBigWords();
		}
	}
	
	function fullWidth(){
		var w = 0;
		if(!window.innerWidth){
			if(!(document.documentElement.clientWidth == 0)){
				w = document.documentElement.clientWidth;
			} else{
				w = document.body.clientWidth;
			}
		} else {
			w = window.innerWidth;
		}
		return w;
	}
	
	function removeHTMLTags(h){
		var d = document.createElement("div");
		d.innerHTML = h;
		return d.textContent || d.innerText;
	}
}