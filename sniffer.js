// ==UserScript==
// @name         scannerActif
// @include     https://code.jquery.com/jquery-3.1.1.min.js
// @updateURL   https://openuserjs.org/src/libs/mandalorien/sniffer.js
// @downloadURL https://openuserjs.org/src/libs/mandalorien/sniffer.js
// @version      0.0.2
// @description  Permet de scanner la galaxy et de vérifier qui est actif
// @author       Yoruichi
// @match        https://*.ogame.gameforge.com/game/index.php?page=galaxy*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// ==/UserScript==


var VersionReel = '0.0.2'; // Reel
var Version = VersionReel.split('-')[0]; // MaJ
var www = "";
var scriptGo = false;

$( document ).ready(function()
{
	function $_GET(param)
	{
		var vars = {};
		window.location.href.replace( location.hash, '' ).replace(
			/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
		);
		if ( param ) {
			return vars[param] ? vars[param] : null;
		}
		return vars;
	}

	function sniffer()
	{
		var divGalaxy = $("#galaxyContent");

		//var galaxy = divGalaxy["0"].children;
		var tbody = divGalaxy["0"].children["0"].children["0"].children["2"];
		var galaxie = parseInt(divGalaxy["0"].children["0"].children["0"].dataset.galaxy);
		var system = parseInt(divGalaxy["0"].children["0"].children["0"].dataset.system);
		for(var i=0;i<=14;i++)
		{
			tr = tbody.children[i];
			trClassName = tbody.children[i].className;
			if(!trClassName.match(/empty_filter/))
			{
				planet = parseInt(tr.children[0].innerText);
				planetName = tr.children[2].innerText.trim();
				//gestion de la lune
				if(tr.children[3].dataset.moonId!==undefined)
				{
					moon = tr.children[3].dataset.moonId;
				}

				//gestion du debris
				if(tr.children[4].children[1]!==undefined)
				{
					debris = true;
				}
				else
				{
					debris = false;
				}

				player = tr.children[5].children[0].innerText.trim();
				namePlayer = tr.children[5].children[0].innerText.trim();

				//gestion du nom de l'alliance
				if(tr.children[6].children[0]!==undefined)
				{
					alliance = tr.children[6].children[0].innerText.trim();
				}
				else
				{
					alliance = "";
				}

				//gestion de l'activité niveau lune
				if(tr.children[3].dataset.moonId!==undefined)
				{
					if(tr.children[3].children[0].className.match(/minute15/))
					{
						var maintenant = new Date();
						activite = "actif";
						time = maintenant.getTime();
						maintenant.setTime(time);
						heure=maintenant.getHours();
						minute=maintenant.getMinutes();
						seconde =maintenant.getSeconds();
						date_save = ""+heure+":"+minute+":"+seconde+"";
					}
					else
					{
						var maintenant = new Date();
						activite = "il y a plus de 15 min";
						var minuteLoop = parseInt(tr.children[3].children[0].innerText);
						time = maintenant.getTime() - (minuteLoop * 60 * 1000);
						maintenant.setTime(time);
						heure=maintenant.getHours();
						minute=maintenant.getMinutes();
						seconde =maintenant.getSeconds();
						date_save = ""+heure+":"+minute+":"+seconde+"";
					}
				}
				else
				{
					//gestion de l'activité niveau plapla
					if(tr.children[1].children[0].children[1]!==undefined)
					{
						var d = new Date();
						if(tr.children[1].children[0].children[1].className.match(/minute15/))
						{
							var maintenant = new Date();
							activite = "actif";
							time = maintenant.getTime();
							maintenant.setTime(time);
							heure=maintenant.getHours();
							minute=maintenant.getMinutes();
							seconde =maintenant.getSeconds();
							date_save = ""+heure+":"+minute+":"+seconde+"";
						}
						else
						{
							var maintenant = new Date();
							activite = "il y a plus de 15 min";
							var minuteLoop = parseInt(tr.children[1].children[0].children[1].innerText);
							time = maintenant.getTime() - (minuteLoop * 60 * 1000);
							maintenant.setTime(time);
							heure=maintenant.getHours();
							minute=maintenant.getMinutes();
							seconde =maintenant.getSeconds();
							date_save = ""+heure+":"+minute+":"+seconde+"";
						}
					}
					else
					{
						activite = "";
						time = "";
						date_save = "";
					}
				}

				tab[galaxie +":"+system +":"+planet] = galaxy = {
					galaxie:galaxie,
					system:system,
					planet:planet,
					player:player,
					planetName:planetName,
					moon:moon,
					debris:debris,
					namePlayer:namePlayer,
					alliance:alliance,
					activite:activite,
					time:time,
					date_save:date_save
				};

				if(localStorage.getItem(serveur) !== null)
				{
					localStorage.setItem(serveur,localStorage.getItem(serveur)+","+JSON.stringify(tab[galaxie +":"+system +":"+planet]));
				}
				else
				{
					localStorage.setItem(serveur,JSON.stringify(tab[galaxie +":"+system +":"+planet]));
				}
			}
		}
	}


    var bt_go = "<li>";
    bt_go += '<span class="menu_icon">';
    bt_go += '<a href="#" class="tooltipRight js_hideTipOnMobile " title="Lancer le script">';
    bt_go += '';
    bt_go += '</a>';
    bt_go += '</span>';
    bt_go += '<a id="tcheat" class="menubutton premiumHighligt" href="#">';
    bt_go += '<span class="textlabel">Lancer le script</span>';
    bt_go += '</a>';
    bt_go += "</li>";
    $("#menuTable").append(bt_go);

    var serveur = document.getElementsByName('ogame-universe-name')[0].content;
    var tab = [];
    var tableau = [];
    var galaxie = null;
    var system = null;
    var planet = null;
    var player = {};
    var planetName = null;
    var moon = null;
    var debris = null;
    var namePlayer = null;
    var alliance = null;
    var activite = null;
    var time = null;
    var date_save = "";
    var heure="";
    var minute="";
    var seconde ="";

    var n=Math.floor(Math.random()*11);
    var k = Math.floor(Math.random()* 1000000);
    var m = String.fromCharCode(n)+k;

    var inocupe = "empty_filter";
    var inactif = "inactive_filter";

    $(document).keyup(function( event )
    {
        if(event.which == 39) // droite
        {
            var gala = parseInt($_GET('galaxy'));
            var syst = parseInt($_GET('system')) + 1;
            if(syst == 500)
            {
                syst = 1;
                gala = gala +1;
            }
            window.location.href = 'https://s139-fr.ogame.gameforge.com/game/index.php?page=galaxy&galaxy='+gala+'&system='+syst+'';
            setTimeout(function(){
                sniffer();
            }, 1500);
        }
        else if(event.which == 37)// gauche
        {
            var gala = parseInt($_GET('galaxy'));
            var syst = parseInt($_GET('system')) - 1;
            if(syst < 1)
            {
                syst = 499;
                gala = gala - 1;
            }
            window.location.href = 'https://s139-fr.ogame.gameforge.com/game/index.php?page=galaxy&galaxy='+gala+'&system='+syst+'';
            setTimeout(function(){
                sniffer();
            }, 1500);
        }
        else if(event.which == 38) // haut
        {
            var gala = parseInt($_GET('galaxy')) + 1;
            var syst = parseInt($_GET('system'));
            if(gala == 10)
            {
                syst = 1;
                gala = 1;
            }
            window.location.href = 'https://s139-fr.ogame.gameforge.com/game/index.php?page=galaxy&galaxy='+gala+'&system='+syst+'';
            setTimeout(function(){
                sniffer();
            }, 1500);
        }
        else if(event.which == 40) //bas
        {
            var gala = parseInt($_GET('galaxy')) - 1;
            var syst = parseInt($_GET('system'));
            if(gala < 1)
            {
                syst = 499;
                gala = 9;
            }
            window.location.href = 'https://s139-fr.ogame.gameforge.com/game/index.php?page=galaxy&galaxy='+gala+'&system='+syst+'';
            setTimeout(function(){
                sniffer();
            }, 1500);
        }
    });

    setTimeout(function(){
            sniffer();
            var gala = parseInt($_GET('galaxy'));
            var syst = parseInt($_GET('system')) + 1;

            if(syst > 500)
            {
                syst = 1;
                gala = parseInt(gala) + 1;
            }
            else if(syst < 1)
            {
                syst = 499;
                gala = parseInt(gala) - 1;
            }
            else if(gala > 10)
            {
                syst = 1;
                gala = 1;
            }
            else if(gala < 1)
            {
                syst = 499;
                gala = 9;
            }
        if( gala !== undefined && gala !== syst){
            window.location.href = 'https://s139-fr.ogame.gameforge.com/game/index.php?page=galaxy&galaxy='+gala+'&system='+syst+'';}
        }, 999);
});

$("#tcheat").click(function()
{
    scriptGo = true;
    window.location.href = 'https://s139-fr.ogame.gameforge.com/game/index.php?page=galaxy&galaxy=1&system=1';
});
