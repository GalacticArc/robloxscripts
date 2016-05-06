// ==UserScript==
// @name        user-to-guest-ratio
// @namespace   userguestratio
// @description Gets the user to guest ratio from all the current online players.
// @include     https://www.roblox.com/games/*
// @include     https://web.roblox.com/games/*
// @version     1
// @grant       none
// ==/UserScript==

var placeID = window.location.pathname.split("/")[2];
var button = 'btn-full-width btn-control-xs rbx-game-server-join';
var domain = "https://www.roblox.com";
if(window.location.toString().indexOf("web.roblox.com") > -1){
	domain = "https://web.roblox.com";
}
function getRatio(pos, cb, d)
{
    $.ajax({
        'url' : domain+'/games/getgameinstancesjson',
        'type' : 'GET',
        'data' : {
            'placeId' : placeID,
            'startindex' : pos
        },
        'success' : function(data) {
            if(data.Collection.length == 0){
                cb(d);
                return;
            }
            d.servers += data.Collection.length;
            
            for(var i in data.Collection){
                for(var s in data.Collection[i].CurrentPlayers){
                    if(data.Collection[i].CurrentPlayers[s].Id < 0){
                        d.guests += 1;    
                    } else if(data.Collection[i].CurrentPlayers[s].Id > 0){
                        d.players += 1;    
                    }
                }
            }
            
            setTimeout(function(){ getRatio(pos + 10, cb, d); }, 100);
        }
    });
}

$(".game-stat-footer").after("<button id=\"buttonGetRatio\" class=\""+button+" buttonGR\" style=\"width: 25%\">Get Ratio</button>");
$(function(){
    $(".buttonGR").click(function(){
      getRatio(0, function(data){
         var r = data.guests / data.players;
         var n = r.toFixed(4);
         alert(+data.players+" players, "+data.guests+" guests in "+data.servers+" servers with a ratio of "+n); 
      }, {players: 0, guests: 0, servers: 0});
    });
});
