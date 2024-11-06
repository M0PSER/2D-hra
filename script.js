let pozadiModre = false
let home = false
$("#body").css("display","none")

$(document).ready(function (){

    $("#hra").click(function(){
        $("#hra").hide()
        $("#nadpis").hide()
        $("#nastavení").hide()
        $("#ostatni").hide()
        $("body").css("background", "rgb(0, 0, 150)");
        $("#body").css("display","inline")
        home=false;
        pozadiModre = true;
            //HRA
            $("#body").text("Body: 0")
        hra()
    })

    $("#home").click(function(){
        $("#hra").show();
        $("#nadpis").show();
        $("#nastavení").show();
        $("#ostatni").show();
        $("body").css("background", "radial-gradient(circle, purple, rgb(0, 0, 150)")
        $("#canvas").css("display","none")
        pozadiModre = false;
        home = true
     
    });

    let a = document.getElementById('nadpis')

    function nadpis_funkce1(){
        a.style.textDecorationColor = "black";
        if (!pozadiModre) { //tohle je tam pro jistotu, ale v podstatě je to zbytečné, protože ten problém byl jenom u funkce nadpis_funkce2
            $("body").css("background", "radial-gradient(circle, rgb(149, 0, 149), rgb(0, 0, 150))");

        }
    }

    function nadpis_funkce2(){
        a.style.color = "black";
        a.style.textDecorationColor = "rgba(0, 0, 0, 0)";
        if (!pozadiModre) { //když je pozadí modré nebude se tam dělat ten gradient a potom to nebude kvůli tomu blbnout
            $("body").css("background", "radial-gradient(circle, purple, rgb(0, 0, 150))");

        }
    }
    
    $("#hra").mouseenter(function(){nadpis_funkce1()})
    $("#hra").mouseleave(function(){nadpis_funkce2()})

    $(".kontejner").mouseenter(function() {
        $(this).find(".icon").css("filter", "invert(100%)");
    });

    $(".kontejner").mouseleave(function() {
        $(this).find(".icon").css("filter", "none");
    });

    //------------------------------------------------------------- tohle se zbytečne složitě stará o to, aby fungovalo to "dropdown menu"
    $("#ostatni").mouseenter(function() {
        $("#nastavení_menu").css("display", "block");
        $("#most").css("display","block")
    });

    $("#ostatni").mouseleave(function() {
        $("#nastavení_menu").css("display", "none");
        $("#most").css("display","none")
    });

    $("#most").mouseenter(function(){
        $("#nastavení_menu").css("display","block")
    })

    $("#most").mouseleave(function(){
        $("#most").css("display","none") 
    })

    $("#nastavení_menu").mouseleave(function(){
        $("#nastavení_menu").css("display","none")
        $("#most").css("display","none")
    })

    //-------------------------------------Tady začíná hra jako taková--------------------------------------------
    function hra() {
        $("#canvas").css("display", "block");
        const canvas = document.getElementById("canvas");   //načtení kanvy
        const c = canvas.getContext("2d");                  //kontext (tohle tam musí být, aby to fungovalo)

        const pozadi = new Image();                         //proměná pozadí je obrázek
        pozadi.src = "./img/ukradene_pozadi3-oriznute.jpg"  //načtení obrázku (pozadí pro canvu)

        const kure_obrazek = new Image();                           
        kure_obrazek.src ="./img/kuře.png"                          //načítání kuřete (sranda bude až to změním a už to nebude kuře, ale ta proměná se pořád bude jmenovat kuře)

        const obrazek_hrace=new Image();
        obrazek_hrace.src="./img/red_knight.png"                    

        let skore=0;
        let kure_sebrano=false
    
        let hrac = {                                        //vytváření objektu hráč
            x: 50,                                          // počáteční souřadnice x
            y: 700,                                         // počáteční souřadnice y
            sirka: 50,                                      //šířka "hráče"
            vyska: 100,                                     //výška hráče
            zmena_x: 0,                                     //změna pozice (směr x) horizontálně
            zmena_y: 0,                                     //změna pozice (směr y) vertikálně
            rychlost: 5,                                    //rychlost pohybu hráče
            skok: false                                     //skákání (true/false)
        };
        let kure = {
            x: Math.floor(Math.random() * (canvas.width - 50)), // Náhodná pozice x v rámci šířky canvasu
            y: Math.floor(Math.random() * (600 - 367.5)) + 367.5, // Náhodná pozice y v rozmezí od 367.5 do 600  (protože hráč nevyskočí výš než do výšky 367,5 a 600 je výška canvy - podlaha - výška hráče, tedy 800-100-100 ->600) akorát se to počítá od levého horního rohu canvy, takže 0 je úplně nahoře a 800 je úplně dole
            sirka: 50,
            vyska: 50 
        };
    
        let gravitace = 0.5;                                //gravitace, ta se potom bude přičítat při skoku
        let podlaha = 700;                                  //podlaha, myslím že je to v px, ale nemusí se tam psát to px
    
        function vykresleni_hrace() {
            //c.fillStyle = "blue";                               //barva hráče
            //c.fillRect(hrac.x, hrac.y, hrac.sirka, hrac.vyska); //vykreslení obdélníku(fillRect = obdélník), který má reprezentovat hráče
            c.drawImage(obrazek_hrace,hrac.x, hrac.y, hrac.sirka, hrac.vyska)
            c.fillStyle = "rgba(128, 128, 128, 0.5)";
            c.fillRect(0, 700, canvas.width, 100)               //vstupní argumenty = souřadnice x (leveho horniho rohu), souřadnice y, (leveho horniho rohu ), šířka, a výška
        }
        function vykresleni_pozadi() {
             c.drawImage(pozadi, 0, 0, canvas.width, canvas.height); //tahle funkce vykresluje pozadí
            }
    
        function aktualizace_hrace() {
            // Pohyb hráče na ose x, y
            hrac.x += hrac.zmena_x;                             // Přidává změnu pozice na ose x do pozice hráče
            
            if (hrac.x < 0) {                                   // Pokud je pozice hráče vlevo mimo herní pole, nastaví se na 0
                hrac.x = 0;
            } else if (hrac.x > 1000-hrac.sirka) {                          //to samý, ale jen v pravo (-hrac. sirka je tam proto abych mohl změnit kdykoli šířku hráče a fungovalo to, ikdyž tam teď můžu napsat jenom 950, protože hráč má 50)
                hrac.x = 1000-hrac.sirka;
            }
        
            hrac.y += hrac.zmena_y;                             //tohle přidává změnu pozice na ose y do pozice hráče (to se používá na skákání/padání)
        
            // Hráč je ve vzduchu a postupně ho "přitahuje" gravitace
            if (hrac.y + hrac.vyska < podlaha) {
                hrac.zmena_y += gravitace;
            } else {
                // Hráč dopadl na zem
                hrac.zmena_y = 0;               // Zastaví se vertikální pohyb
                hrac.y = podlaha - hrac.vyska;  // Nastavení správné hodnoty y
                hrac.skok = false;              // Hráč neskáče
            }
        
            //console.log("x: " + hrac.x + ", y: " + hrac.y + ", skok: " + hrac.skok);  // Výpis aktuální pozice
        }

        function vykresleni_kurete() {
             c.drawImage(kure_obrazek, kure.x, kure.y, kure.sirka, kure.vyska);
             //console.log("kuře x: "+kure.x+"kuře y: "+kure.y)
            }



        function detekce_kolize_kurete() {
            if (hrac.x < kure.x + kure.sirka && hrac.x + hrac.sirka > kure.x &&
                hrac.y < kure.y + kure.vyska && hrac.y + hrac.vyska > kure.y) {
                if (!kure_sebrano) { // Přičítá body pouze pokud kuře ještě nebylo sebráno (když neni true)s
                    skore += 1;
                    console.log("Přičítání bodů: " + skore);
                    $("#body").text("Body: "+skore)
                    kure.x = Math.floor(Math.random() * (canvas.width - 50)); // Nová náhodná pozice x
                    kure.y = Math.floor(Math.random() * (600 - 367.5)) + 367.5; // Nová náhodná pozice y
                    console.log("kuře x,y= ", kure.x, kure.y);
                    kure_sebrano = true; // Nastaví, že kuře bylo sebráno
                }
            } else {
                kure_sebrano = false; // Resetuje, že kuře nebylo sebráno
            }
        }
            
                
        
    
        function vymazani_canvy() {                             //tahle funkce mi maže tu kanvu (hráče)
            c.clearRect(0, 0, canvas.width, canvas.height);     //to v závorce je oblast kde se maže tedy od bodů 00 do bodu nastavene šířky a výšky
        }
    
        function loop() {                       //funkce, která opakovaně (je to loop) aktualizuje a vykresluje (a maže, aby tam ten hrac nezustal)
            vymazani_canvy();
            vykresleni_pozadi();
            vykresleni_kurete()
            vykresleni_hrace();
            aktualizace_hrace();
            detekce_kolize_kurete()
            if (home===false){                      //když nejsme na domovské obrazovce... (jinak by se to pořád opakovalo na pozadí)
                requestAnimationFrame(loop);        //tohle se stane asi 60x za vteřinu. Problém nastane, když je horší hardware a prohlížeč nastaví automaticky menší "refresh rate". Takže je to pak spomalené. Příště asi použiju set interval
            }
            
              
        }
    
        requestAnimationFrame(loop);            //tohle začne generovat snímky (funkce loop)
                //----------Ovládání postavy (detekce zmáčknutí W,S,A,D / w,s,a,d)----------
        document.addEventListener("keydown", (e) => {       //když se zmáčkne klávesa....
            if (e.key === "d" || e.key === "D") {           //d/D
                hrac.zmena_x = hrac.rychlost;               //zmena pozice = rychlost (ta je nastavená někde před tím)
            } else if (e.key === "a" || e.key === "A") {    //zmáčknutí a/A
                hrac.zmena_x = -hrac.rychlost;              //zmena pozice = rychlost (tentokrát záporná rychlost, aby šel doleva)
            } else if ((e.key === "w" || e.key === "W") && !hrac.skok) {//když je zmáčknutý w a hráč neskáče...
                hrac.skok = true;                                     //hrac skace
                hrac.zmena_y = -15;                                   //zmena pozice na ose y = -15, hrac jde nahoru (skok) Tady můžu upravit to číslo, aby hráč skákal výš/níž
            }
        });
    
        document.addEventListener("keyup", (e) => {                   //když se uvolní klávesa...
            if (e.key === "d" || e.key === "D" || e.key === "a" || e.key === "A") {//když se uvolni a nebo d, zmena pozice na ose x je 0, to znamena, že hráč se zastaví
                hrac.zmena_x = 0;
            }
        });
            
            //---------------epileptický záchvat--------------
                function epileptak(){

                    let barvy = [
                        "#FF5733",  // Oranžová
                        "#33FF57",  // Zelená
                        "#3357FF",  // Modrá
                        "#FF33A1",  // Růžová
                        "#FFFF33",  // Žlutá
                        "#33FFF1",  // Tyrkysová
                        "#F133FF",  // Fialová
                        "#FF8133",  // Světle oranžová
                        "#8133FF",  // Indigo
                        "#33FF97"   // Světle zelená
                      ];
                    let cislo = Math.floor(Math.random() * barvy.length);
                    let barva
                    switch (cislo) {
                        case 0:
                          barva=barvy[0]
                          break;
                        case 1:
                          barva=barvy[1]
                          break;
                        case 2:
                          barva=barvy[2]
                          break;
                        case 3:
                          barva=barvy[3]
                          break;
                        case 4:                
                          barva=barvy[4]
                          break;
                        case 5:
                          barva=barvy[5]
                          break;
                        case 6:
                          barva=barvy[6]
                          break;
                        case 7:
                          barva=barvy[7]
                          break;
                        case 8:                    
                          barva=barvy[8]
                          break;
                        case 9:
                          barva=barvy[9]
                          break;
                        case 10:            
                          barva=barvy[10]
                          break;
                        default:
                          console.log("jine cislo");
                      }
                        $(canvas).css("border","10px solid"+barva)

                }

                setInterval(epileptak,10)














    }
   })
