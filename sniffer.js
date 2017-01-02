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
