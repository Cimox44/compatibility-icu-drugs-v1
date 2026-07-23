/* ============================================================================
   ICU Pharma Cardio — app.js
   Database farmacologico + motore di compatibilità in Y + accessi vascolari
   ----------------------------------------------------------------------------
   CAMPI DELLA SCHEDA
     id    identificativo interno
     n     nome (DCI)                s   sinonimi/commerciali per la ricerca
     c     classe                    cat categoria per i filtri
     prep  preparazione standard ICU solv solventi ammessi
     dose  mantenimento              tit  schema di titolazione
     bolo  bolo / dose di carico
     ph    pH della soluzione        osm  osmolarita' indicativa (mOsm/L)
     ves   rischio vescicante: alto | mod | cauto | no   (INS/VTF 2024)
     cvc pvc picc mid : pref | si | temp | cauto | no
     ded   true = linea/lume dedicato raccomandato
     rub   condotta al rubinetto a tre vie
     inc[] incompatibilita' in Y documentate   com[] compatibilita' in Y documentate
     note  avvertenze operative     ant  gestione stravaso / antidoto
   ----------------------------------------------------------------------------
   Le compatibilita' si riferiscono alle concentrazioni standard riportate.
   ASSENZA DI DATO NON EQUIVALE A COMPATIBILITA'.
   ========================================================================== */

const BUILD = "2026.07";

const CATEGORIE = {
  vaso:  "Vasopressori e inotropi",
  vdil:  "Vasodilatatori e antipertensivi",
  arit:  "Antiaritmici e cronotropi",
  sed:   "Sedazione e analgesia",
  nmb:   "Bloccanti neuromuscolari",
  neuro: "Neurologici e antiepilettici",
  coag:  "Emostasi e anticoagulazione",
  emoc:  "Emocomponenti, emoderivati e volume",
  anti:  "Antimicrobici",
  elet:  "Elettroliti, soluzioni, metabolico",
  resp:  "Respiratorio e inalatori",
  antid: "Antidoti e trattamento dello stravaso",
  vari:  "Diuretici, steroidi, gastro, altri"
};

const FARMACI = [

/* ==================== VASOPRESSORI E INOTROPI ==================== */
{
 id:"nora", n:"Noradrenalina (Norepinefrina)", s:"norepinefrina levophed NA NE noradrenalin", c:"Vasopressore alfa-1 > beta-1", cat:"vaso",
 prep:"8 mg in 50 mL G5% (160 mcg/mL) — alternativa 4 mg/50 mL (80 mcg/mL) o 16 mg/50 mL in restrizione idrica",
 solv:"Glucosata 5% (preferita, stabilizza l'ossidazione) o NaCl 0,9%",
 dose:"0,01–0,5 mcg/kg/min; dosi refrattarie fino a 1–3 mcg/kg/min",
 tit:"Start 0,05 mcg/kg/min. Incrementi di 0,02–0,05 mcg/kg/min ogni 2–5 min su target PAM (di norma 65–75 mmHg; 75–85 se ipertensione cronica o CEC prolungata). Svezzamento a specchio: riduzioni del 10–20% ogni 15–30 min con PAM stabile ≥ target per 30 min. Se >0,5 mcg/kg/min valutare vasopressina 0,03 U/min e/o idrocortisone.",
 bolo:"Infusione continua di regola. Push-dose diluita 5–20 mcg (10 mcg/mL) solo in emergenza, medico presente, monitoraggio invasivo.",
 ph:"3,0–4,5", osm:"≈290–330 (in G5% a 160 mcg/mL)", ves:"alto",
 cvc:"pref", pvc:"temp", picc:"si", mid:"no", ded:false,
 rub:"Lume dedicato o condiviso solo con farmaci compatibili a flusso continuo. MAI bolo, MAI flush e MAI aspirazione sulla via del vasopressore: il bolo occulto genera crisi ipertensiva, l'interruzione genera collasso. Cambio siringa con tecnica di sovrapposizione (double pumping / quick change).",
 inc:["bica","tiop","panto","fenit","amino","insu"],
 com:["adre","dopa","dobu","vaso","feni","milr","ntg","snp","amio","epar","prpf","mida","fent","remi","dexm","cisa","rocu","furo","lido","esmo","keta","morf","nica","argt","vanc","kcl"],
 note:"Concentrazione periferica raccomandata ≤ 32–64 mcg/mL. In periferica: vena prossimale (fossa antecubitale o avambraccio prossimale), catetere ≥20 G, ecoguidato, ritorno ematico verificato, ispezione oraria, durata idealmente ≤24 h (max 48 h) con passaggio a CVC appena possibile. Il midline non è indicato per vasopressori continui (bassa emodiluizione in vena ascellare, difficile riconoscimento precoce dello stravaso).",
 ant:"Stop infusione, non lavare, aspirare dal catetere, poi rimuovere. Fentolamina 5–10 mg in 10–15 mL NaCl 0,9% per infiltrazione sottocutanea dell'area entro 12 h (idealmente <1 h). Alternative: nitroglicerina pomata 2% topica, terbutalina locale. Impacchi tiepidi, arto elevato, marcatura dell'area, sorveglianza neurovascolare 12–24 h."
},
{
 id:"adre", n:"Adrenalina (Epinefrina)", s:"epinefrina adrenalin epi", c:"Catecolamina alfa/beta", cat:"vaso",
 prep:"4 mg in 50 mL (80 mcg/mL) o 5 mg/50 mL; in ACR fiala 1 mg/10 mL pronta",
 solv:"NaCl 0,9% o G5%",
 dose:"Inotropo 0,01–0,1 mcg/kg/min; vasopressore 0,1–0,5 mcg/kg/min",
 tit:"Start 0,02–0,03 mcg/kg/min nel basso portata post-CEC. Incrementi 0,01–0,02 mcg/kg/min ogni 3–5 min su IC/ScvO₂/lattati. Sorvegliare tachiaritmie, iperlattacidemia (effetto beta-2 metabolico, non necessariamente ipoperfusione) e iperglicemia.",
 bolo:"ACR 1 mg ev ogni 3–5 min. Anafilassi 0,5 mg im. Post-CEC push-dose 10–20 mcg (100 mcg/mL) per ipotensione transitoria.",
 ph:"2,5–5,0", osm:"≈280–320", ves:"alto",
 cvc:"pref", pvc:"temp", picc:"si", mid:"no", ded:false,
 rub:"Come noradrenalina: nessun bolo sul lume in infusione. In ACR il bolo va su via dedicata seguito da 20 mL di NaCl e sollevamento dell'arto.",
 inc:["bica","amino","tiop","fenit","panto"],
 com:["nora","dopa","dobu","vaso","milr","ntg","amio","epar","prpf","mida","fent","remi","dexm","cisa","furo","insu","lido"],
 note:"Inattivata rapidamente in ambiente alcalino: mai in linea con bicarbonato. Fotosensibile: proteggere se conservazione prolungata; scartare se rosata/brunita.",
 ant:"Identico alla noradrenalina: fentolamina sottocutanea locale, impacchi tiepidi, no compressione."
},
{
 id:"dopa", n:"Dopamina", s:"dopa revivan", c:"Catecolamina dose-dipendente", cat:"vaso",
 prep:"400 mg in 50 mL (8 mg/mL) o 200 mg/50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"2–5 mcg/kg/min (dopaminergica), 5–10 (beta), >10 (alfa) fino a 20 mcg/kg/min",
 tit:"Incrementi 2–2,5 mcg/kg/min ogni 5–10 min. Uso in netto declino in cardiochirurgia: maggiore incidenza di tachiaritmie rispetto a noradrenalina (SOAP II) e nessun effetto renoprotettivo della cosiddetta dose renale.",
 bolo:"Non indicato.",
 ph:"2,5–5,0", osm:"≈270 (diluita)", ves:"alto",
 cvc:"pref", pvc:"temp", picc:"si", mid:"no", ded:false,
 rub:"Nessun bolo sul lume in infusione.",
 inc:["bica","alte","furo","tiop","amfb","amino","panto"],
 com:["nora","adre","dobu","ntg","snp","amio","epar","prpf","mida","fent","dexm","lido","insu","vanc"],
 note:"Inattivazione in ambiente alcalino (viraggio rosa-viola). Non associare a fenitoina.",
 ant:"Fentolamina locale come per le altre catecolamine."
},
{
 id:"dobu", n:"Dobutamina", s:"dobutrex dobu", c:"Inotropo beta-1", cat:"vaso",
 prep:"250 mg in 50 mL (5 mg/mL) o 500 mg/50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"2,5–20 mcg/kg/min",
 tit:"Start 2,5–5 mcg/kg/min. Incrementi 2,5 mcg/kg/min ogni 10–15 min su IC, ScvO₂, lattati, diuresi. Oltre 10–15 mcg/kg/min il guadagno inotropo si esaurisce e prevalgono tachicardia, aritmie e consumo miocardico di O₂. Attenzione alla tolleranza dopo 48–72 h (down-regulation beta) e all'inefficacia relativa in terapia beta-bloccante cronica (in tal caso preferire levosimendan o milrinone).",
 bolo:"Non indicato.",
 ph:"2,5–5,5", osm:"≈280–360", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Evitare boli e lavaggi sul lume; l'interruzione anche breve determina caduta della portata.",
 inc:["bica","furo","alte","fenit","tiop","amino","epar","aciclo"],
 com:["nora","adre","dopa","milr","ntg","snp","amio","prpf","mida","fent","dexm","lido","insu","vanc","mero"],
 note:"Colorazione rosata della soluzione = ossidazione lieve, non implica perdita di potenza clinicamente rilevante, ma va valutata secondo procedura locale. Incompatibile con tutti gli alcalini.",
 ant:"Fentolamina locale; impacchi tiepidi."
},
{
 id:"milr", n:"Milrinone", s:"corotrop primacor inodilatatore PDE3", c:"Inodilatatore inibitore PDE-3", cat:"vaso",
 prep:"20 mg in 50 mL G5% (400 mcg/mL) o 10 mg/50 mL",
 solv:"G5% (preferita) o NaCl 0,9%",
 dose:"0,125–0,75 mcg/kg/min (tipico 0,25–0,5)",
 tit:"Carico 25–50 mcg/kg in 10–20 min spesso OMESSO in cardiochirurgia per il rischio di ipotensione: si preferisce partire direttamente dal mantenimento 0,25 mcg/kg/min e salire di 0,125 ogni 30–60 min. Emivita 2–3 h, prolungata a 15–20 h nell'insufficienza renale: ridurre a 0,2–0,3 mcg/kg/min se GFR <30. Attendersi calo delle resistenze: prevedere copertura con noradrenalina.",
 bolo:"Carico 25–75 mcg/kg in 10–20 min (usato raramente, mai su paziente ipoteso).",
 ph:"3,2–4,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Compatibile con la maggior parte delle infusioni vasoattive; evitare comunque boli sulla stessa via.",
 inc:["furo","bica","imip","procain"],
 com:["nora","adre","dobu","ntg","epar","prpf","mida","fent","dexm","lido","vaso","insu"],
 note:"Effetto lusitropo (miglioramento del rilasciamento diastolico) e vasodilatazione polmonare: utile nella disfunzione ventricolare destra post-CEC e nell'ipertensione polmonare. Rischio di trombocitopenia e aritmie ventricolari.",
 ant:"Non vescicante; gestione dell'infiltrazione conservativa."
},
{
 id:"levo", n:"Levosimendan", s:"simdax sensibilizzante calcio", c:"Calcio-sensibilizzante / apertore K-ATP", cat:"vaso",
 prep:"12,5 mg (5 mL) in 500 mL G5% = 0,025 mg/mL, oppure in 250 mL = 0,05 mg/mL",
 solv:"ESCLUSIVAMENTE Glucosata 5%",
 dose:"0,05–0,2 mcg/kg/min per 24 h",
 tit:"Carico 6–12 mcg/kg in 10 min di regola OMESSO nel paziente ipoteso o in preoperatorio. Start 0,1 mcg/kg/min; se ben tollerato dopo 30–60 min salire a 0,2; ridurre a 0,05 se ipotensione. Durata standard 24 h. Il metabolita attivo OR-1896 mantiene l'effetto per 7–9 giorni: attendersi vasodilatazione protratta e fabbisogno di noradrenalina anche dopo la sospensione.",
 bolo:"Carico 6–12 mcg/kg in 10 min (opzionale, spesso non somministrato).",
 ph:"≈4,7 (concentrato)", osm:"≈300 (diluito in G5%)", ves:"cauto",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:true,
 rub:"Linea o lume dedicato: dati di compatibilità in Y limitati. Se la via è unica, lavare accuratamente prima e dopo.",
 inc:[], com:["nora","furo"],
 note:"Non diluire in soluzione fisiologica (dati di stabilità riferiti al glucosio). Soluzione giallo-arancio: normale. Controindicato se PAS <85–90 mmHg, ostruzione all'efflusso, tachiaritmie ventricolari, K⁺ <3,5. Monitorare potassio (ipokaliemia) ed emoglobina (emodiluizione).",
 ant:"Non vescicante documentato; gestione conservativa."
},
{
 id:"enox", n:"Enoximone", s:"perfan PDE3", c:"Inibitore PDE-3", cat:"vaso",
 prep:"100 mg (20 mL) diluiti fino a 40 mL con G5% o acqua ppi (2,5 mg/mL)",
 solv:"G5% o acqua per preparazioni iniettabili. NON usare NaCl 0,9% (cristallizzazione).",
 dose:"5–20 mcg/kg/min",
 tit:"Carico 0,5 mg/kg lento (≤12,5 mg/min) frazionato, poi 5–10 mcg/kg/min. Titolare su IC e PAOP.",
 bolo:"0,5–1 mg/kg lento, frazionato.",
 ph:"≈11,8 (concentrato: fortemente alcalino)", osm:"variabile", ves:"alto",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:true,
 rub:"Linea dedicata. Il pH marcatamente alcalino lo rende incompatibile con quasi tutti i farmaci acidi in Y.",
 inc:["nora","adre","dopa","dobu","furo","insu","mida"],
 com:[],
 note:"Reagisce con la plastica di alcuni set: usare siringhe e deflussori compatibili secondo scheda tecnica (evitare PVC dove indicato). Precipita a contatto con soluzioni saline.",
 ant:"pH >9: gestire come stravaso di soluzione fortemente alcalina — stop, aspirazione, impacchi tiepidi, consulenza chirurgica se stadio 3–4."
},
{
 id:"vaso", n:"Vasopressina (Arginina-vasopressina)", s:"AVP ADH pitressina empressin", c:"Agonista V1 non adrenergico", cat:"vaso",
 prep:"20 UI in 50 mL NaCl 0,9% (0,4 UI/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"0,01–0,04 UI/min (fissa, non peso-dipendente); fino a 0,06 UI/min in shock refrattario",
 tit:"Aggiunta come secondo vasopressore quando la noradrenalina supera 0,25–0,5 mcg/kg/min. Dose fissa 0,03 UI/min (= 4,5 mL/h a 0,4 UI/mL): NON titolare aggressivamente. Nello svezzamento sospendere per ultima o comunque con gradualità, perché la sospensione brusca causa ipotensione marcata. Particolarmente utile nella vasoplegia post-CEC e nell'ipertensione polmonare (vasocostrizione sistemica senza aumento delle RVP).",
 bolo:"1–2 UI in arresto/vasoplegia refrattaria solo su indicazione medica; non di routine.",
 ph:"3,4–3,6", osm:"≈290", ves:"alto",
 cvc:"pref", pvc:"temp", picc:"si", mid:"no", ded:false,
 rub:"Nessun bolo sul lume in infusione.",
 inc:["furo","fenit"],
 com:["nora","adre","dobu","milr","ntg","prpf","fent","epar","insu","dexm"],
 note:"Rischio di ischemia digitale, mesenterica e cutanea, iponatriemia, trombocitopenia. Monitorare perfusione periferica e sodiemia.",
 ant:"Fentolamina locale come per le catecolamine."
},
{
 id:"terl", n:"Terlipressina", s:"glypressin", c:"Analogo della vasopressina", cat:"vaso",
 prep:"1 mg in 5–10 mL NaCl 0,9% per bolo; infusione 4–6 mg in 24 h",
 solv:"NaCl 0,9%",
 dose:"Bolo 1 mg ogni 4–6 h oppure infusione continua 2–6 mg/24 h",
 tit:"Nella sindrome epatorenale e nella vasoplegia refrattaria. Sorvegliare ischemia periferica e mesenterica, iponatriemia.",
 bolo:"1–2 mg ev lento in 1–2 min.",
 ph:"≈4", osm:"≈290", ves:"mod",
 cvc:"si", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Bolo consentito su via lavata; non sul lume del vasopressore continuo.",
 inc:[], com:["nora"],
 note:"Emivita lunga: gli effetti ischemici persistono dopo la sospensione.",
 ant:"Impacchi tiepidi; valutare fentolamina se ischemia locale marcata."
},
{
 id:"feni", n:"Fenilefrina", s:"neosinefrina alfa1 puro", c:"Alfa-1 agonista puro", cat:"resp",
 prep:"10 mg in 100 mL (100 mcg/mL) per infusione; siringa push-dose 100 mcg/mL",
 solv:"NaCl 0,9% o G5%",
 dose:"0,1–3 mcg/kg/min (o 20–200 mcg/min)",
 tit:"Push-dose 50–200 mcg ripetibile ogni 1–2 min. Utile quando serve aumentare le resistenze senza cronotropia (stenosi aortica serrata, cardiomiopatia ipertrofica ostruttiva, tachiaritmia). Attendersi bradicardia riflessa e riduzione della portata.",
 bolo:"50–200 mcg ev (diluizione 100 mcg/mL).",
 ph:"3,0–6,5", osm:"≈290", ves:"alto",
 cvc:"pref", pvc:"si", picc:"si", mid:"no", ded:false,
 rub:"Push-dose consentito su via periferica lavata; non sul lume della noradrenalina.",
 inc:["bica","fenit"],
 com:["nora","adre","prpf","fent","remi","mida","epar","cisa","rocu"],
 note:"Alla concentrazione di push-dose (100 mcg/mL) l'uso periferico breve è ampiamente diffuso; l'infusione continua prolungata richiede accesso centrale.",
 ant:"Fentolamina locale."
},
{
 id:"efed", n:"Efedrina", s:"ephedrine", c:"Simpaticomimetico misto indiretto", cat:"vaso",
 prep:"Fiala 50 mg diluita a 10 mL (5 mg/mL)",
 solv:"NaCl 0,9%",
 dose:"Solo in boli",
 tit:"5–10 mg ripetibili ogni 3–5 min fino a 50 mg totali. Tachifilassi rapida per deplezione delle riserve di noradrenalina: dopo 2–3 dosi inefficaci passare a farmaco diretto.",
 bolo:"5–10 mg ev.",
 ph:"4,5–7,0", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo consentito al rubinetto su via lavata.",
 inc:["bica","tiop"], com:["prpf","fent","remi"],
 note:"Aumenta sia PA sia frequenza e portata: da evitare nella tachiaritmia e nella stenosi aortica.",
 ant:"Gestione conservativa."
},
{
 id:"isop", n:"Isoprenalina (Isoproterenolo)", s:"isuprel cronotropo beta", c:"Beta-1/beta-2 agonista puro", cat:"vaso",
 prep:"2 mg in 50 mL G5% (40 mcg/mL) — protetta dalla luce",
 solv:"G5% (preferita)",
 dose:"0,01–0,2 mcg/kg/min (o 2–20 mcg/min)",
 tit:"Start 0,01 mcg/kg/min, incrementi ogni 3–5 min su FC target. Indicazioni: bradicardia refrattaria, blocco AV in attesa di pacing, torsione di punta bradicardia-dipendente, denervazione del cuore trapiantato, ponte al pacemaker temporaneo. Marcata vasodilatazione beta-2: ipotensione attesa.",
 bolo:"Non indicato (eventuale micro-bolo 2–10 mcg solo su indicazione medica).",
 ph:"2,5–5,5", osm:"≈290", ves:"alto",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Nessun bolo sul lume in infusione.",
 inc:["bica","amino"], com:["nora","adre","epar","prpf","fent"],
 note:"Fotosensibile e instabile in ambiente alcalino: scartare se la soluzione vira al rosa. Aumenta marcatamente il consumo miocardico di O₂.",
 ant:"Fentolamina locale."
},
{
 id:"meta", n:"Metaraminolo", s:"aramine", c:"Simpaticomimetico misto prevalentemente alfa", cat:"vaso",
 prep:"10 mg in 20 mL (0,5 mg/mL) per boli; infusione 20–100 mg/50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Boli 0,5–2 mg; infusione 0,5–10 mg/h",
 tit:"Alternativa periferica alle catecolamine in molti centri europei, con profilo di stravaso più favorevole ma comunque vasocostrittore. Titolare su PAM.",
 bolo:"0,5–2 mg ev lenti.",
 ph:"3,2–4,5", osm:"≈290", ves:"mod",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Bolo consentito su via lavata.",
 inc:["bica"], com:["nora","prpf","fent"],
 note:"Effetto ritardato (1–2 min) e prolungato (20–60 min): rischio di accumulo se ri-bolato troppo precocemente.",
 ant:"Fentolamina locale se ischemia."
},
{
 id:"angi", n:"Angiotensina II", s:"giapreza AT2", c:"Vasopressore del sistema renina-angiotensina", cat:"vaso",
 prep:"2,5 mg in 500 mL NaCl 0,9% (5 ng/mL) o 5 mg/250 mL (20 ng/mL)",
 solv:"NaCl 0,9%",
 dose:"Start 20 ng/kg/min; mantenimento 1,25–40 ng/kg/min",
 tit:"Incrementi di 15 ng/kg/min ogni 5 min nelle prime 3 h (max 80 ng/kg/min), poi max 40 ng/kg/min. Svezzare per decrementi di 15 ng/kg/min. Terzo agente nello shock vasoplegico refrattario, incluso quello post-CEC.",
 bolo:"Non indicato.",
 ph:"5,5–6,5", osm:"≈290", ves:"mod",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:false,
 rub:"Lume condiviso solo con vasoattivi compatibili.",
 inc:[], com:["nora","vaso"],
 note:"Profilassi tromboembolica raccomandata (rischio trombotico). Disponibilità limitata in Italia.",
 ant:"Fentolamina locale come per i vasocostrittori."
},

/* ==================== VASODILATATORI E ANTIPERTENSIVI ==================== */
{
 id:"ntg", n:"Nitroglicerina", s:"trinitrina TNT venitrin GTN nitro", c:"Nitrato / donatore di NO", cat:"vdil",
 prep:"50 mg in 50 mL G5% (1 mg/mL) o 25 mg/50 mL",
 solv:"G5% o NaCl 0,9%",
 dose:"0,2–10 mcg/kg/min (o 5–200 mcg/min)",
 tit:"Start 5–10 mcg/min (≈0,1–0,2 mcg/kg/min). Raddoppiare o incrementare di 5–10 mcg/min ogni 3–5 min su PAM/dolore/PAOP. Prevalente venodilatazione a basse dosi (riduce precarico e congestione), arteriolare oltre 100–150 mcg/min. Tolleranza dopo 24–48 h: valutare finestra libera o switch. Controindicata se PAS <90, infarto del ventricolo destro, uso recente di inibitori PDE-5.",
 bolo:"Non in infusione continua. Sublinguale 0,3–0,6 mg come alternativa.",
 ph:"3,0–6,5", osm:"≈290–350", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Compatibile con la gran parte delle infusioni cardiologiche.",
 inc:["alte","fenit"],
 com:["nora","adre","dopa","dobu","milr","vaso","epar","furo","prpf","mida","fent","lido","amio","insu","dexm"],
 note:"Adsorbimento significativo su PVC (fino al 40–80% della dose): usare set in polietilene o PVC-free e non cambiare tipo di deflussore in corso di titolazione. Metaemoglobinemia a dosi elevate e prolungate.",
 ant:"Non vescicante. La pomata di nitroglicerina 2% è essa stessa antidoto topico nello stravaso di vasocostrittori."
},
{
 id:"snp", n:"Nitroprussiato di sodio", s:"nipride nitroprusside SNP", c:"Vasodilatatore misto arterioso-venoso", cat:"vdil",
 prep:"50–100 mg in 250–500 mL G5% (0,2 mg/mL). Proteggere dalla luce con copri-siringa/deflussore ambrato.",
 solv:"ESCLUSIVAMENTE Glucosata 5%",
 dose:"0,3–8 mcg/kg/min (max 10 mcg/kg/min per meno di 10 minuti)",
 tit:"Start 0,3 mcg/kg/min con linea arteriosa obbligatoria. Incrementi di 0,2–0,5 mcg/kg/min ogni 2–3 min: latenza d'azione di 30–60 s ed emivita ultrabreve, la titolazione deve essere battuta per battuta. Sospendere gradualmente per evitare l'ipertensione da rimbalzo. Tossicità da cianuro/tiocianato oltre 2 mcg/kg/min prolungati, nell'insufficienza renale ed epatica: sorvegliare acidosi metabolica inspiegata, aumento della SvO₂ con basso consumo di O₂, confusione. Antidoti: idrossicobalamina, sodio tiosolfato.",
 bolo:"Assolutamente controindicato.",
 ph:"3,5–6,0", osm:"≈290 (in G5%)", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:true,
 rub:"Linea o lume dedicato con deflussore dedicato. Nessun bolo, nessun lavaggio sulla via: un flush corrisponde a un bolo di vasodilatatore potentissimo.",
 inc:["bica"], com:["nora","dobu","dopa","epar","ntg"],
 note:"La soluzione deve essere leggermente brunastra; viraggio a blu, verde o rosso vivo indica degradazione: scartare. Sostituire ogni 24 h (o secondo procedura locale).",
 ant:"Irritante: impacchi tiepidi, sorveglianza."
},
{
 id:"urap", n:"Urapidil", s:"ebrantil", c:"Alfa-1 antagonista + agonista 5-HT1A centrale", cat:"vdil",
 prep:"250 mg in 50 mL (5 mg/mL) o 100 mg/50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"5–40 mg/h (fino a 60 mg/h)",
 tit:"Bolo iniziale 12,5–25 mg in 20 s, ripetibile dopo 5 min; poi infusione 9–30 mg/h titolata su PAM. Vantaggio: non induce tachicardia riflessa né ipertensione endocranica, non richiede protezione dalla luce. Molto usato nella gestione della crisi ipertensiva post-cardiochirurgica e nella dissecazione aortica dopo il beta-blocco.",
 bolo:"12,5–25 mg ev in 20 secondi.",
 ph:"5,5–7,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo consentito su via lavata; non sul lume del vasopressore.",
 inc:["bica"], com:["nora","ntg","epar","fent","prpf"],
 note:"Non associare a soluzioni alcaline (precipitazione).",
 ant:"Non vescicante."
},
{
 id:"clev", n:"Clevidipina", s:"cleviprex", c:"Calcioantagonista diidropiridinico ultrabreve", cat:"vdil",
 prep:"Emulsione lipidica pronta 0,5 mg/mL — NON diluire",
 solv:"Nessuna diluizione ammessa",
 dose:"1–2 mg/h iniziali, fino a 16–32 mg/h",
 tit:"Raddoppiare la dose ogni 90 s fino ad avvicinarsi al target, poi incrementi minori ogni 5–10 min. Emivita 1 min (esterasi ematiche): titolazione estremamente rapida, indipendente da funzione renale ed epatica. Considerare l'apporto lipidico (0,2 g di lipidi per mL) nel bilancio nutrizionale e limitare a 1000 mL/24 h.",
 bolo:"Non indicato.",
 ph:"6,0–8,0", osm:"≈290", ves:"mod",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:true,
 rub:"Linea dedicata come tutte le emulsioni lipidiche. Cambiare flacone e set entro 12 h dall'apertura (rischio microbiologico).",
 inc:["prpf"], com:[],
 note:"Controindicata in allergia a soia/uovo, iperlipidemia grave, pancreatite acuta, stenosi aortica serrata. Non produce shunt intrapolmonare significativo.",
 ant:"Gestione conservativa dell'infiltrazione."
},
{
 id:"nica", n:"Nicardipina", s:"perdipina cardene", c:"Calcioantagonista diidropiridinico", cat:"vdil",
 prep:"25 mg in 250 mL (0,1 mg/mL) o 10 mg/50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"3–5 mg/h iniziali, fino a 15 mg/h",
 tit:"Incrementi di 2,5 mg/h ogni 5–15 min. Emivita di effetto 30–40 min: meno maneggevole di clevidipina e nitroprussiato. Frequente flebite in periferica: ruotare il sito ogni 12 h se non si dispone di accesso centrale.",
 bolo:"Non indicato in infusione continua.",
 ph:"3,7–4,7", osm:"≈290", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Evitare il lume dei farmaci alcalini.",
 inc:["bica","furo","tiop"], com:["nora","ntg","epar","prpf","fent"],
 note:"pH acido: elevata incidenza di flebite chimica per via periferica.",
 ant:"Impacchi tiepidi; irritante."
},
{
 id:"labe", n:"Labetalolo", s:"trandate", c:"Alfa/beta bloccante", cat:"vdil",
 prep:"Fiala 100 mg/20 mL (5 mg/mL); infusione 200 mg in 200 mL (1 mg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"Boli 5–20 mg; infusione 0,5–2 mg/min (fino a 300 mg totali)",
 tit:"Bolo 10 mg in 2 min, raddoppiabile ogni 10 min (10-20-40-80 mg). Prima scelta nella dissecazione aortica acuta (riduce contemporaneamente PA e dP/dt) e nella crisi ipertensiva post-operatoria. Controindicato in bradicardia, blocco AV avanzato, asma grave, scompenso acuto.",
 bolo:"5–20 mg ev in 2 min.",
 ph:"3,0–4,5", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Bolo consentito su via lavata; non associare a bicarbonato o furosemide.",
 inc:["bica","furo","ceftri","tiop"], com:["nora","ntg","epar","prpf","fent","morf","lido"],
 note:"Effetto beta-bloccante 7 volte superiore all'alfa per via ev: attenzione al basso portata post-CEC.",
 ant:"Impacchi tiepidi."
},
{
 id:"esmo", n:"Esmololo", s:"brevibloc", c:"Beta-1 bloccante cardioselettivo ultrabreve", cat:"vdil",
 prep:"2,5 g in 250 mL (10 mg/mL) o 100 mg/10 mL pronto",
 solv:"NaCl 0,9% o G5%",
 dose:"25–300 mcg/kg/min",
 tit:"Carico 500 mcg/kg in 1 min, poi 50 mcg/kg/min per 4 min; se insufficiente ripetere il carico e salire a 100, poi 150, fino a 300 mcg/kg/min. Emivita 9 min (esterasi eritrocitarie): il farmaco ideale quando il beta-blocco può non essere tollerato. Indicazioni: FA/flutter post-cardiochirurgico con risposta rapida, tempesta elettrica, dissecazione aortica, tireotossicosi.",
 bolo:"Carico 500 mcg/kg in 1 min (spesso omesso se emodinamica fragile).",
 ph:"4,5–5,5", osm:"≈290 (a 10 mg/mL)", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Evitare il lume del bicarbonato e della furosemide.",
 inc:["bica","furo","diaze","tiop"], com:["nora","ntg","epar","prpf","fent","mida","amio","insu"],
 note:"Concentrazioni superiori a 10 mg/mL sono irritanti per la vena periferica: preferire accesso centrale se prolungato.",
 ant:"Impacchi tiepidi."
},
{
 id:"meto", n:"Metoprololo ev", s:"seloken lopresor beloc", c:"Beta-1 bloccante", cat:"vdil",
 prep:"Fiala 5 mg/5 mL (1 mg/mL), pronta",
 solv:"NaCl 0,9%",
 dose:"Solo in boli",
 tit:"2,5–5 mg ev in 2 min, ripetibili ogni 5 min fino a 15 mg totali. Controllo di frequenza nella FA post-operatoria in paziente emodinamicamente stabile. Verificare che non vi sia dipendenza dal pacing e che la funzione ventricolare consenta il beta-blocco.",
 bolo:"2,5–5 mg ev lento.",
 ph:"6,0–7,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo consentito al rubinetto su via lavata.",
 inc:["bica"], com:["nora","epar","ntg","fent"],
 note:"Monitoraggio ECG e PA continuo durante e per 15 min dopo il bolo.",
 ant:"Non vescicante."
},
{
 id:"clon", n:"Clonidina", s:"catapresan", c:"Alfa-2 agonista centrale", cat:"vdil",
 prep:"150 mcg/mL; infusione 750 mcg in 50 mL (15 mcg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"0,2–2 mcg/kg/h (o 15–60 mcg/h)",
 tit:"Titolare ogni 30–60 min. Adiuvante sedativo, antiipertensivo e antiastinenziale; riduce il fabbisogno di oppioidi. Sorvegliare bradicardia e ipotensione; sospensione graduale per evitare il rimbalzo ipertensivo.",
 bolo:"75–150 mcg ev in 10 min (rischio di ipotensione e bradicardia marcate).",
 ph:"5,0–7,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Compatibile con la maggior parte delle infusioni sedative.",
 inc:[], com:["fent","morf","mida","prpf","nora"],
 note:"Nel paziente cardiochirurgico può facilitare bradicardia giunzionale: attenzione in assenza di pacing.",
 ant:"Non vescicante."
},
{
 id:"ilop", n:"Iloprost ev", s:"ilomedin", c:"Analogo della prostaciclina", cat:"vdil",
 prep:"50 mcg in 50 mL (1 mcg/mL) o secondo protocollo",
 solv:"NaCl 0,9% o G5%",
 dose:"0,5–2 ng/kg/min ev; per via inalatoria 2,5–5 mcg per dose, 6–9 volte al giorno",
 tit:"Titolazione lenta su PA sistemica: potente vasodilatatore sistemico oltre che polmonare. Nella crisi di ipertensione polmonare post-CEC si preferisce la via inalatoria (selettività polmonare, nessuno shunt).",
 bolo:"Non indicato.",
 ph:"7,0–8,5", osm:"≈290", ves:"cauto",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:true,
 rub:"Linea dedicata: dati di compatibilità scarsi, ipotensione grave in caso di bolo accidentale.",
 inc:[], com:[],
 note:"Effetto antiaggregante: sorvegliare il sanguinamento nel post-operatorio precoce.",
 ant:"Gestione conservativa."
},
{
 id:"no", n:"Ossido nitrico inalatorio", s:"iNO NO inomax", c:"Vasodilatatore polmonare selettivo", cat:"vdil",
 prep:"Erogato dal ventilatore tramite sistema dedicato con monitoraggio di NO/NO₂",
 solv:"Non applicabile (via inalatoria)",
 dose:"5–40 ppm (di norma 10–20 ppm)",
 tit:"Start 10–20 ppm nella disfunzione ventricolare destra e nell'ipertensione polmonare post-CEC. Svezzamento graduale a scalini di 5 ppm, poi 1 ppm sotto i 5 ppm: la sospensione brusca provoca ipertensione polmonare di rimbalzo con collasso del ventricolo destro. Monitorare metaemoglobina (a 4–8 h e poi quotidianamente) e NO₂ (<1–3 ppm).",
 bolo:"Non applicabile.",
 ph:"n.a.", osm:"n.a.", ves:"no",
 cvc:"no", pvc:"no", picc:"no", mid:"no", ded:false,
 rub:"Non applicabile.",
 inc:[], com:[],
 note:"Effetto antiaggregante piastrinico: attenzione al sanguinamento post-CEC. Prevedere sempre un piano di backup (iloprost inalatorio, milrinone) prima dello svezzamento.",
 ant:"Non applicabile."
},

/* ==================== ANTIARITMICI E CRONOTROPI ==================== */
{
 id:"amio", n:"Amiodarone", s:"cordarone amiodar", c:"Antiaritmico classe III", cat:"arit",
 prep:"Carico 300 mg in 250 mL G5%; mantenimento 900–1050 mg in 500 mL G5% /24 h. Concentrazioni >2 mg/mL solo per via centrale.",
 solv:"ESCLUSIVAMENTE Glucosata 5% (in NaCl 0,9% precipita/adsorbe)",
 dose:"900–1200 mg/24 h dopo il carico",
 tit:"FA post-cardiochirurgica: 300 mg (5 mg/kg) in 20–60 min, poi 900–1050 mg/24 h. In ACR da FV/TV refrattaria: 300 mg in bolo, poi 150 mg. Dose cumulativa massima 2,2 g/24 h. Rallentare o sospendere se ipotensione (dovuta al solvente polisorbato 80 e all'alcol benzilico) o bradicardia. Sorvegliare QTc, funzione tiroidea ed epatica se prolungato.",
 bolo:"150–300 mg. In ACR bolo rapido; in ritmo perfondente MAI in meno di 10–20 min (ipotensione grave).",
 ph:"3,5–4,5", osm:"≈300 (in G5%)", ves:"alto",
 cvc:"pref", pvc:"temp", picc:"si", mid:"no", ded:false,
 rub:"Il carico va su via lavata; l'infusione di mantenimento richiede filtro in linea (0,22 µm) secondo scheda tecnica per il rischio di precipitazione.",
 inc:["epar","bica","amino","cefa","imip","fenit","furo","panto","mgso4"],
 com:["nora","adre","dobu","dopa","milr","ntg","insu","prpf","fent","mida","esmo","lido","dexm"],
 note:"Vescicante ad alto rischio secondo la lista INS 2024 (segnalate sindromi compartimentali). Per via periferica: solo per la dose di carico, vena grossa, ≤2 mg/mL, durata limitata, sorveglianza stretta; il mantenimento richiede accesso centrale. Flebite chimica molto frequente.",
 ant:"Stop, aspirazione, non lavare. Impacchi tiepidi, arto elevato. Valutare infiltrazione di ialuronidasi. Consulenza chirurgica precoce se dolore intenso o tensione cutanea: descritte sindromi compartimentali."
},
{
 id:"lido", n:"Lidocaina", s:"xilocaina lignocaina", c:"Antiaritmico classe Ib", cat:"arit",
 prep:"2 g in 500 mL G5% (4 mg/mL) o 1 g/50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"1–4 mg/min",
 tit:"Carico 1–1,5 mg/kg ev, ripetibile 0,5–0,75 mg/kg dopo 5–10 min (max 3 mg/kg). Poi 1–4 mg/min. Ridurre della metà in insufficienza cardiaca, epatica o negli anziani. Segni di tossicità: parestesie periorali, tinnito, disartria, agitazione, convulsioni, blocco cardiaco.",
 bolo:"1–1,5 mg/kg ev.",
 ph:"5,0–7,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo consentito al rubinetto su via lavata.",
 inc:["amfb","fenit"], com:["nora","adre","dobu","ntg","epar","prpf","fent","mida","amio","dexm","insu"],
 note:"Nella cardiochirurgia moderna è di seconda linea rispetto ad amiodarone nelle aritmie ventricolari, ma resta utile nella TV post-ischemica e come adiuvante analgesico.",
 ant:"Non vescicante."
},
{
 id:"mgso4", n:"Magnesio solfato", s:"magnesio MgSO4 solfato di magnesio", c:"Elettrolita / antiaritmico", cat:"arit",
 prep:"1–2 g (4–8 mmol) in 50–100 mL G5% o NaCl 0,9%",
 solv:"G5% o NaCl 0,9%",
 dose:"1–2 g in 15–30 min; mantenimento 0,5–1 g/h nelle torsioni di punta",
 tit:"Profilassi della FA post-cardiochirurgica: mantenere magnesiemia >0,9–1,0 mmol/L. Torsione di punta: 2 g in 1–2 min anche a magnesiemia normale. Ipokaliemia refrattaria: correggere sempre prima il magnesio. Infusione rapida = vasodilatazione, flushing, ipotensione, blocco AV, depressione respiratoria e riduzione dei riflessi osteotendinei (primo segno di sovradosaggio).",
 bolo:"1–2 g in almeno 10–15 min (in 1–2 min solo nella torsione di punta).",
 ph:"5,5–7,0", osm:"≈1000–1600 (soluzione concentrata al 20–50%)", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Somministrare sempre diluito; il concentrato al rubinetto è irritante e pericoloso.",
 inc:["bica","cacl","cagl","fosfk","amio","ceftri"],
 com:["nora","epar","insu","kcl","fent","prpf"],
 note:"Non miscelare con calcio o fosfati nella stessa via: precipitazione. Nel paziente con insufficienza renale ridurre e monitorare la magnesiemia.",
 ant:"Irritante se concentrato: impacchi tiepidi."
},
{
 id:"aden", n:"Adenosina", s:"krenosin adenocor", c:"Nucleoside, blocco AV transitorio", cat:"arit",
 prep:"Fiala 6 mg/2 mL pronta all'uso",
 solv:"NaCl 0,9% (solo per il flush)",
 dose:"Solo in bolo rapidissimo",
 tit:"6 mg in bolo ultrarapido (1–2 s) seguito immediatamente da 20 mL di NaCl 0,9% a pressione e sollevamento dell'arto; se inefficace 12 mg dopo 1–2 min, ripetibile una volta. Emivita <10 s. Da accesso venoso centrale o comunque prossimale dimezzare la dose (3 mg). Rubinetto a tre vie in posizione adiacente al catetere o tecnica a doppia siringa.",
 bolo:"6 mg → 12 mg → 12 mg, sempre con flush rapido di 20 mL.",
 ph:"4,5–7,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"È l'esempio paradigmatico di farmaco da rubinetto: il tre-vie va posizionato il più vicino possibile al sito di inserzione, con la siringa del flush già montata sulla seconda via.",
 inc:[], com:[],
 note:"Avvisare il paziente della sensazione di oppressione toracica e di morte imminente, breve. Registrare ECG a 12 derivazioni durante la somministrazione (valore diagnostico). Controindicata in asma grave, blocco AV di II–III grado senza pacemaker. Effetto potenziato da dipiridamolo e carbamazepina, antagonizzato da teofillina e caffeina. Cuore trapiantato/denervato: massima sensibilità, iniziare da 3 mg o meno.",
 ant:"Non vescicante."
},
{
 id:"digo", n:"Digossina", s:"lanoxin digitale", c:"Glicoside cardioattivo", cat:"arit",
 prep:"Fiala 0,5 mg/2 mL diluita in 10–50 mL",
 solv:"NaCl 0,9% o G5% (almeno 4 volte il volume del farmaco)",
 dose:"Carico 0,5 mg, poi 0,25 mg ogni 6 h fino a 1–1,5 mg totali; mantenimento 0,0625–0,25 mg/die",
 tit:"Digitalizzazione lenta nel controllo di frequenza della FA, soprattutto in scompenso o ipotensione. Aggiustare per funzione renale, età e peso magro. Digossinemia target 0,5–0,9 ng/mL nello scompenso. Sorvegliare potassio e magnesio: l'ipokaliemia potenzia la tossicità.",
 bolo:"0,25–0,5 mg ev in almeno 10–20 min.",
 ph:"6,7–7,3", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo lento su via lavata.",
 inc:["dobu","fenit"], com:["nora","epar","furo","insu"],
 note:"Latenza d'azione 30–60 min: inadatta al controllo acuto della frequenza in FA con instabilità. Antidoto della intossicazione: frammenti Fab anti-digossina.",
 ant:"Non vescicante."
},
{
 id:"atro", n:"Atropina", s:"atropina solfato", c:"Anticolinergico", cat:"arit",
 prep:"Fiala 1 mg/1 mL o 0,5 mg/1 mL, pronta",
 solv:"NaCl 0,9%",
 dose:"Solo in bolo",
 tit:"0,5–1 mg ev rapido, ripetibile ogni 3–5 min fino a 3 mg. Dosi inferiori a 0,5 mg possono causare bradicardia paradossa. Inefficace nel cuore trapiantato/denervato e nel blocco AV infra-hissiano: in questi casi pacing o isoprenalina.",
 bolo:"0,5–1 mg ev rapido.",
 ph:"3,0–6,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo rapido al rubinetto con flush.",
 inc:["bica"], com:["nora","adre","epar","prpf","fent","succ","neos"],
 note:"Nel post-operatorio cardiochirurgico il pacing epicardico temporaneo è quasi sempre preferibile.",
 ant:"Non vescicante."
},
{
 id:"flec", n:"Flecainide ev", s:"almarytm flecainide", c:"Antiaritmico classe Ic", cat:"arit",
 prep:"2 mg/kg (max 150 mg) in 50–100 mL G5%",
 solv:"G5% (in NaCl può precipitare a basse concentrazioni)",
 dose:"2 mg/kg in 10–30 min; mantenimento 1,5 mg/kg/h per 1 h poi 0,1–0,25 mg/kg/h",
 tit:"Cardioversione farmacologica della FA di recente insorgenza SOLO in cuore strutturalmente sano: controindicata in cardiopatia ischemica, disfunzione ventricolare e post-infarto. Nel paziente cardiochirurgico l'indicazione è quindi molto ristretta. Monitorare l'allargamento del QRS (>25% = stop).",
 bolo:"2 mg/kg in almeno 10 min.",
 ph:"≈5,5", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Via lavata; monitoraggio ECG continuo obbligatorio.",
 inc:[], com:["epar","nora"],
 note:"Rischio di flutter atriale 1:1 ad alta frequenza: associare sempre un farmaco frenante il nodo AV.",
 ant:"Non vescicante."
},
{
 id:"prop", n:"Propafenone ev", s:"rytmonorm", c:"Antiaritmico classe Ic", cat:"arit",
 prep:"1–2 mg/kg in 50–100 mL G5%",
 solv:"G5% (NON NaCl 0,9%: precipitazione)",
 dose:"1–2 mg/kg in 10 min; mantenimento 0,5–1 mg/min",
 tit:"Come flecainide: solo in assenza di cardiopatia strutturale. Ha anche modesta azione beta-bloccante.",
 bolo:"1–2 mg/kg in 10 min.",
 ph:"≈5", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Via lavata, monitoraggio ECG.",
 inc:[], com:["epar"],
 note:"Diluire esclusivamente in glucosata: con la fisiologica precipita.",
 ant:"Non vescicante."
},

/* ==================== SEDAZIONE, ANALGESIA, ANTIDOTI ==================== */
{
 id:"prpf", n:"Propofol", s:"diprivan propofol lipuro", c:"Sedativo ipnotico (emulsione lipidica)", cat:"sed",
 prep:"Flacone 1% (10 mg/mL) o 2% (20 mg/mL) pronto, NON diluire di norma",
 solv:"Non diluire; se necessario solo G5% e solo per il 1%",
 dose:"Sedazione 0,5–4 mg/kg/h (fast-track ERAS cardiac: 1–2 mg/kg/h)",
 tit:"Nel fast-track post-cardiochirurgico titolare su RASS -1/0 e obiettivo di estubazione entro 6 h. Ridurre progressivamente dal termine dell'intervento. Sorvegliare ipotensione (vasodilatazione + inotropismo negativo), bradicardia, ipertrigliceridemia (dosare i trigliceridi oltre 48 h). PRIS (sindrome da infusione di propofol): sospetto se acidosi metabolica inspiegata, rabdomiolisi, iperkaliemia, aritmie, Brugada-like all'ECG, tipicamente con dosi >4 mg/kg/h oltre 48 h.",
 bolo:"Induzione 1–2 mg/kg (ridurre a 0,5–1 mg/kg nel cardiopatico). Boli in terapia intensiva sconsigliati per ipotensione.",
 ph:"6,0–8,5", osm:"≈300–400", ves:"alto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:true,
 rub:"Preferibile lume dedicato. L'emulsione lipidica è terreno di crescita microbica: siringa e deflussore vanno sostituiti ogni 12 h; il flacone aperto va usato entro 12 h. Non aspirare né rilanciare dalla via.",
 inc:["cisa","atrac","amik","gent","tobra","cipro","fenit","amfb","*Metotrexato","clev"],
 com:["nora","adre","dobu","milr","ntg","epar","fent","remi","mida","dexm","rocu","insu","morf","keta","vaso"],
 note:"Vescicante ad alto rischio nella lista INS 2024 (natura lipidica: assorbimento tissutale refrattario). Il dolore all'iniezione periferica si riduce con lidocaina o con vena di grosso calibro. Apporto lipidico 0,1 g/mL: da conteggiare nel bilancio nutrizionale.",
 ant:"Stop, aspirazione, non lavare; impacchi tiepidi, arto elevato, sorveglianza prolungata perché il danno lipidico può manifestarsi tardivamente."
},
{
 id:"mida", n:"Midazolam", s:"ipnovel dormicum benzodiazepina", c:"Benzodiazepina a breve durata", cat:"sed",
 prep:"50–100 mg in 50 mL (1–2 mg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"0,02–0,2 mg/kg/h",
 tit:"Titolare su RASS. Accumulo significativo nell'insufficienza renale (metabolita attivo alfa-idrossimidazolam glucuronide) ed epatica: prevedere risvegli prolungati. Nel percorso ERAS cardiac va limitato per il rischio di delirium; preferire propofol o dexmedetomidina.",
 bolo:"1–2,5 mg ev, ripetibili; titolare lentamente nell'anziano.",
 ph:"3,0–3,6", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo consentito su via lavata; non associare a furosemide.",
 inc:["furo","bica","panto","tiop","dexa","ceftri","fenit","*Omeprazolo","*Nafcillina"],
 com:["nora","adre","dobu","ntg","epar","fent","remi","morf","prpf","dexm","cisa","rocu","insu","amio","lido"],
 note:"Nella lista INS 2024 figura tra gli infusati cautelativi (rischio teorico per pH acido, senza casistica consolidata). Antidoto: flumazenil, da usare con estrema cautela (rischio di convulsioni e crisi ipertensiva).",
 ant:"Impacchi tiepidi; gestione conservativa."
},
{
 id:"dexm", n:"Dexmedetomidina", s:"dexdor precedex alfa2", c:"Alfa-2 agonista sedativo", cat:"sed",
 prep:"200 mcg in 50 mL NaCl 0,9% (4 mcg/mL)",
 solv:"NaCl 0,9%",
 dose:"0,2–1,4 mcg/kg/h",
 tit:"Start 0,4 mcg/kg/h SENZA dose di carico (il carico causa ipertensione transitoria seguita da ipotensione e bradicardia). Incrementi di 0,1–0,2 mcg/kg/h ogni 30 min. Sedazione cooperativa, non deprime il drive respiratorio: ideale nello svezzamento e nella prevenzione del delirium post-cardiochirurgico. Sospendere o ridurre se FC <50 bpm o ipotensione persistente; sorvegliare la bradicardia nel paziente beta-bloccato o con pacing-dipendenza.",
 bolo:"Carico 1 mcg/kg in 10 min: di regola OMESSO in cardiochirurgia.",
 ph:"4,5–7,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Compatibile con la maggior parte delle infusioni di terapia intensiva.",
 inc:["amfb","diaze"],
 com:["nora","adre","dobu","milr","ntg","epar","fent","remi","morf","prpf","mida","cisa","rocu","insu","vanc","furo"],
 note:"Adsorbimento trascurabile. Sospensione brusca dopo uso prolungato: possibile agitazione e ipertensione da rimbalzo.",
 ant:"Non vescicante."
},
{
 id:"remi", n:"Remifentanil", s:"ultiva", c:"Oppioide ultrabreve (esterasi)", cat:"sed",
 prep:"2–5 mg in 50 mL (40–100 mcg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"0,05–0,25 mcg/kg/min (fino a 0,5 in stimolazione intensa)",
 tit:"Emivita contesto-sensibile costante (3–4 min) indipendente dalla durata: titolazione immediata e svezzamento rapidissimo. Attenzione: alla sospensione l'analgesia svanisce in minuti — prevedere sempre analgesia ponte (morfina, paracetamolo, blocco loco-regionale) 20–30 min prima. Iperalgesia da remifentanil dopo infusioni prolungate ad alte dosi.",
 bolo:"Boli sconsigliati in terapia intensiva (bradicardia e rigidità toracica).",
 ph:"3,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Nessun bolo/flush sul lume in infusione: un flush equivale a un bolo di oppioide potente.",
 inc:[], com:["nora","adre","prpf","mida","dexm","cisa","rocu","epar","ntg","insu"],
 note:"Usare esclusivamente il peso corporeo ideale/magro per il calcolo nell'obeso.",
 ant:"Non vescicante."
},
{
 id:"fent", n:"Fentanil", s:"fentanest fentanyl", c:"Oppioide sintetico", cat:"sed",
 prep:"1000–2500 mcg in 50 mL (20–50 mcg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"0,5–3 mcg/kg/h",
 tit:"Titolare su scale del dolore (NRS/CPOT/BPS). Emivita contesto-sensibile che si allunga marcatamente dopo 4–6 h di infusione: prevedere risveglio ritardato. Accumulo nel tessuto adiposo.",
 bolo:"25–100 mcg ev.",
 ph:"4,0–7,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo consentito su via lavata; non sul lume del vasopressore.",
 inc:["fenit","tiop"], com:["nora","adre","dobu","milr","ntg","epar","prpf","mida","dexm","remi","cisa","rocu","insu","furo","vanc","keta"],
 note:"Rigidità toracica se bolo rapido ad alte dosi.",
 ant:"Non vescicante."
},
{
 id:"sufe", n:"Sufentanil", s:"sufenta", c:"Oppioide sintetico ad alta potenza", cat:"sed",
 prep:"250 mcg in 50 mL (5 mcg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"0,2–1 mcg/kg/h",
 tit:"Circa 10 volte più potente del fentanil. Titolare su CPOT/BPS.",
 bolo:"5–20 mcg ev.",
 ph:"3,5–6,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Come fentanil.",
 inc:[], com:["prpf","mida","cisa","nora","epar"],
 note:"Elevata liposolubilità: accumulo dopo infusioni prolungate.",
 ant:"Non vescicante."
},
{
 id:"morf", n:"Morfina", s:"morfina cloridrato", c:"Oppioide naturale", cat:"sed",
 prep:"50 mg in 50 mL (1 mg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"1–5 mg/h in infusione; boli 1–3 mg",
 tit:"Analgesia ponte all'estubazione e nel post-operatorio. Metabolita attivo M6G con accumulo nell'insufficienza renale: ridurre e distanziare. Istamino-liberazione: possibile ipotensione e broncospasmo.",
 bolo:"1–3 mg ev lenti, ripetibili ogni 5–10 min.",
 ph:"2,5–6,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo consentito su via lavata.",
 inc:["furo","fenit","tiop","amino"], com:["nora","epar","ntg","prpf","mida","dexm","insu","labe","keta"],
 note:"Antidoto: naloxone.",
 ant:"Non vescicante."
},
{
 id:"keta", n:"Ketamina", s:"ketalar esketamina", c:"Antagonista NMDA", cat:"sed",
 prep:"250–500 mg in 50 mL (5–10 mg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"Analgesia 0,1–0,3 mg/kg/h; sedazione 0,5–2 mg/kg/h",
 tit:"Adiuvante risparmiatore di oppioidi, mantiene il drive respiratorio e il tono simpatico: utile nel paziente emodinamicamente fragile. Attenzione nel paziente con riserva catecolaminergica esaurita (effetto inotropo negativo diretto smascherato). Associare benzodiazepina a basso dosaggio se fenomeni disforici.",
 bolo:"0,25–0,5 mg/kg ev.",
 ph:"3,5–5,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo consentito su via lavata.",
 inc:["bica","diaze"], com:["prpf","mida","fent","morf","nora","epar"],
 note:"Ipersalivazione: valutare atropina/glicopirrolato. Aumento della pressione intraoculare.",
 ant:"Non vescicante."
},
{
 id:"tiop", n:"Tiopentale sodico", s:"pentothal barbiturico", c:"Barbiturico", cat:"sed",
 prep:"500 mg–1 g in 20–50 mL acqua ppi o NaCl 0,9% (2,5% = 25 mg/mL)",
 solv:"Acqua ppi o NaCl 0,9%",
 dose:"Induzione 3–5 mg/kg; coma barbiturico 1–5 mg/kg/h",
 tit:"Uso limitato al controllo dell'ipertensione endocranica refrattaria e allo stato di male. Fortemente inotropo negativo e vasodilatatore: nel cardiopatico ridurre drasticamente la dose.",
 bolo:"3–5 mg/kg (1–2 mg/kg nel paziente instabile).",
 ph:"10,2–11,2 (fortemente alcalino)", osm:"≈290–430", ves:"alto",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:true,
 rub:"Linea dedicata: precipita con quasi tutti i farmaci acidi. Lavare abbondantemente prima e dopo.",
 inc:["nora","adre","dopa","dobu","mida","fent","morf","rocu","succ","vanc","insu","esmo","nica","efed"],
 com:["bica"],
 note:"Lo stravaso provoca necrosi grave; l'iniezione intra-arteriosa accidentale causa vasospasmo e gangrena.",
 ant:"Emergenza: stop, aspirazione, infiltrazione locale di ialuronidasi, consulenza chirurgica precoce."
},
{
 id:"para", n:"Paracetamolo ev", s:"perfalgan acetaminofene tachipirina", c:"Analgesico-antipiretico", cat:"sed",
 prep:"Flacone 1 g/100 mL pronto",
 solv:"Pronto all'uso",
 dose:"1 g ogni 6–8 h (max 4 g/die; 3 g se peso <50 kg, epatopatia, malnutrizione, alcolismo)",
 tit:"Cardine dell'analgesia multimodale ERAS cardiac. Infondere in 15 min: l'infusione rapida può causare ipotensione (fino al 10–20% nei critici).",
 bolo:"Non in bolo: sempre in 15 min.",
 ph:"5,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Compatibile con la maggior parte delle infusioni.",
 inc:[], com:["nora","epar","fent","morf"],
 note:"Verificare la funzione epatica nel paziente con basso portata prolungato.",
 ant:"Non vescicante."
},
{
 id:"ketor", n:"Ketorolac", s:"toradol lixidol FANS", c:"FANS ev", cat:"sed",
 prep:"30 mg diluiti in 50–100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"30 mg ogni 8 h (max 90 mg/die, max 2 giorni ev)",
 tit:"Nel post-cardiochirurgico l'uso è controverso: rischio di sanguinamento (antiaggregazione), danno renale in paziente post-CEC e possibile compromissione della guarigione sternale. Utilizzare solo su indicazione medica esplicita, a emostasi consolidata, funzione renale conservata e senza terapia anticoagulante piena.",
 bolo:"30 mg ev in almeno 15 s (preferibile diluito in 15 min).",
 ph:"6,9–7,9", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; non associare a cisatracurio.",
 inc:["cisa","prpf","fent"], com:["nora","epar"],
 note:"Controindicato in insufficienza renale, sanguinamento attivo, ulcera peptica.",
 ant:"Non vescicante."
},
{
 id:"nalo", n:"Naloxone", s:"narcan", c:"Antagonista oppioide", cat:"antid",
 prep:"0,4 mg/1 mL diluito in 10 mL (40 mcg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"Boli 40–100 mcg titolati; infusione 2/3 della dose efficace per ora",
 tit:"Titolare a piccoli boli di 40 mcg ogni 2–3 min per ripristinare il respiro SENZA annullare l'analgesia: l'antagonizzazione brusca provoca crisi ipertensiva, tachiaritmia, edema polmonare acuto — pericolosissima nel post-cardiochirurgico. Emivita più breve degli oppioidi: sorvegliare la ri-sedazione e valutare l'infusione continua.",
 bolo:"40–100 mcg ev, ripetibili.",
 ph:"3,0–4,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo su via lavata.",
 inc:["bica"], com:["nora","epar"],
 note:"Antidoto di riferimento; disponibile anche im/sc/intranasale.",
 ant:"Non vescicante."
},
{
 id:"flum", n:"Flumazenil", s:"anexate", c:"Antagonista benzodiazepinico", cat:"antid",
 prep:"0,5 mg/5 mL, pronto",
 solv:"NaCl 0,9% o G5%",
 dose:"0,2 mg ev, ripetibile 0,1 mg ogni minuto fino a 1 mg",
 tit:"Uso molto selettivo: controindicato nell'epilettico, nell'uso cronico di benzodiazepine e nell'intossicazione mista con antidepressivi triciclici (rischio di convulsioni). Emivita breve: sorvegliare la ri-sedazione.",
 bolo:"0,2 mg ev in 15 s.",
 ph:"4", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo su via lavata.",
 inc:[], com:["nora","epar"],
 note:"Non usare come test diagnostico di routine nel risveglio ritardato.",
 ant:"Non vescicante."
},

/* ==================== BLOCCANTI NEUROMUSCOLARI ==================== */
{
 id:"rocu", n:"Rocuronio", s:"esmeron rocuronium", c:"Bloccante neuromuscolare non depolarizzante aminosteroideo", cat:"nmb",
 prep:"Fiala 50 mg/5 mL; infusione 500 mg in 50 mL (10 mg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"Infusione 5–12 mcg/kg/min (0,3–0,6 mg/kg/h)",
 tit:"Titolare su TOF (obiettivo 1–2 risposte su 4). Sedazione e analgesia adeguate SEMPRE prima e durante il blocco. Durata prolungata in ipotermia, acidosi, insufficienza epatica.",
 bolo:"Intubazione 0,6–1,2 mg/kg; mantenimento 0,15 mg/kg.",
 ph:"3,8–4,2", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo su via lavata; incompatibile con numerosi farmaci alcalini.",
 inc:["dexa","furo","vanc","tiop","insu","mepr","idro","amfb","diaze","cefa"],
 com:["nora","adre","prpf","fent","remi","mida","dexm","epar","ntg"],
 note:"Antagonizzabile in ogni momento con sugammadex.",
 ant:"Impacchi tiepidi."
},
{
 id:"cisa", n:"Cisatracurio", s:"nimbex cisatracurium", c:"Bloccante neuromuscolare benzilisochinolinico", cat:"nmb",
 prep:"Fiala 10 mg/5 mL o 150 mg/30 mL; infusione 150 mg in 50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"1–3 mcg/kg/min (0,06–0,18 mg/kg/h)",
 tit:"Farmaco di scelta nell'insufficienza renale ed epatica: eliminazione di Hofmann, indipendente dagli organi. Titolare su TOF 1–2/4. Sedazione profonda obbligatoria.",
 bolo:"0,15–0,2 mg/kg.",
 ph:"3,0–3,8", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Non associare a propofol e ketorolac nella stessa via in Y.",
 inc:["prpf","ketor","bica","tiop"],
 com:["nora","adre","dobu","fent","remi","mida","dexm","epar","ntg","insu","vanc"],
 note:"Conservazione a 2–8 °C: perde circa il 5% di potenza al mese a temperatura ambiente. Il metabolita laudanosina si accumula solo con dosi elevatissime e prolungate.",
 ant:"Impacchi tiepidi."
},
{
 id:"succ", n:"Succinilcolina", s:"midarine suxametonio scoline", c:"Bloccante neuromuscolare depolarizzante", cat:"nmb",
 prep:"Fiala 100 mg/2 mL o 500 mg/10 mL",
 solv:"NaCl 0,9%",
 dose:"Solo in bolo",
 tit:"1–1,5 mg/kg per l'intubazione a sequenza rapida. Controindicata se iperkaliemia, ustioni oltre 24–48 h, immobilizzazione prolungata, lesione midollare, ipertermia maligna nota, deficit di colinesterasi.",
 bolo:"1–1,5 mg/kg ev.",
 ph:"3,0–4,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo rapido su via lavata con flush immediato.",
 inc:["bica","tiop"], com:["prpf","fent","atro"],
 note:"Conservazione in frigorifero. Bradicardia soprattutto alla seconda dose: atropina pronta.",
 ant:"Non vescicante."
},
{
 id:"suga", n:"Sugammadex", s:"bridion", c:"Ciclodestrina incapsulante (antagonista selettivo)", cat:"nmb",
 prep:"Fiala 200 mg/2 mL o 500 mg/5 mL, pronta",
 solv:"NaCl 0,9% o G5% se diluito",
 dose:"2 mg/kg (TOF 2 risposte), 4 mg/kg (1–2 post-tetaniche), 16 mg/kg (reversal immediato dopo 1,2 mg/kg di rocuronio)",
 tit:"Bolo unico in 10 s. Efficace solo su rocuronio e vecuronio, non su cisatracurio.",
 bolo:"2–16 mg/kg ev in 10 secondi.",
 ph:"7,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Lavare la via prima e dopo: incompatibile con verapamil, ondansetron e ranitidina.",
 inc:["ondan","verap","*Ranitidina"], com:["nora","epar"],
 note:"Bradicardia grave descritta subito dopo la somministrazione: atropina disponibile. Interferisce con i contraccettivi ormonali.",
 ant:"Non vescicante."
},
{
 id:"neos", n:"Neostigmina", s:"prostigmina", c:"Anticolinesterasico", cat:"nmb",
 prep:"Fiala 0,5–2,5 mg, diluita",
 solv:"NaCl 0,9%",
 dose:"0,04–0,07 mg/kg (max 5 mg)",
 tit:"SEMPRE associata ad atropina 0,015–0,02 mg/kg o glicopirrolato per prevenire bradicardia, ipersecrezione e broncospasmo. Efficace solo se è già ricomparsa attività al TOF.",
 bolo:"2,5 mg ev lento con atropina.",
 ph:"5,0–6,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo lento su via lavata.",
 inc:[], com:["atro","nora","epar"],
 note:"Nel paziente cardiochirurgico con pacing dipendente sorvegliare la risposta cronotropa.",
 ant:"Non vescicante."
},

/* ==================== EMOSTASI E ANTICOAGULAZIONE ==================== */
{
 id:"epar", n:"Eparina sodica non frazionata", s:"eparina UFH liquemin", c:"Anticoagulante (antitrombina-dipendente)", cat:"coag",
 prep:"25.000 UI in 50 mL (500 UI/mL) o 25.000 UI in 250 mL (100 UI/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"Terapeutica 12–18 UI/kg/h; profilattica 5000 UI sc x2–3/die",
 tit:"Post-cardiochirurgia: nomogramma su aPTT ratio 1,5–2,5 o anti-Xa 0,3–0,7 UI/mL; controllo a 6 h dall'inizio e da ogni variazione. Su ECMO e in circolazione extracorporea i target sono specifici (ACT, anti-Xa). In CEC: 300–400 UI/kg con target ACT >400–480 s. Sospettare HIT se il calo piastrinico è >50% tra la 5ª e la 10ª giornata: calcolare il 4T score, sospendere ogni fonte di eparina (inclusi i lavaggi) e passare ad argatroban o bivalirudina.",
 bolo:"Terapeutico 60–80 UI/kg (max 5000 UI). In CEC 300–400 UI/kg.",
 ph:"5,0–7,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Compatibile con molte infusioni, ma per l'accuratezza terapeutica è preferibile un lume dedicato o condiviso solo con farmaci a flusso costante.",
 inc:["vanc","gent","amik","alte","amio","cipro","fenit","diaze","dobu","labe","tobra","halo"],
 com:["nora","adre","dopa","milr","ntg","snp","fent","remi","mida","prpf","dexm","cisa","rocu","insu","furo","kcl","morf","esmo","urap"],
 note:"L'incompatibilità con vancomicina e aminoglicosidi è classica e clinicamente rilevante: lavare la via tra le somministrazioni. Antidoto: protamina.",
 ant:"Non vescicante; l'infiltrazione può causare ematoma."
},
{
 id:"prot", n:"Protamina solfato", s:"protamina", c:"Antagonista dell'eparina", cat:"coag",
 prep:"Fiala 50 mg/5 mL, diluita in 50–100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"1 mg per ogni 100 UI di eparina da neutralizzare (aggiustato per il tempo trascorso)",
 tit:"Somministrare SEMPRE lentamente: massimo 5 mg/min, dose singola non superiore a 50 mg in 10 min. L'infusione rapida provoca ipotensione grave, bradicardia, vasodilatazione, e nell'1–2% dei casi reazioni catastrofiche (ipertensione polmonare acuta con scompenso del ventricolo destro). Fattori di rischio: precedente esposizione, insulina protamina-contenente, allergia al pesce, vasectomia. Preparare vasopressore e avere il chirurgo informato.",
 bolo:"Mai in bolo rapido: sempre in almeno 10 min.",
 ph:"6,0–7,0", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Via lavata, monitoraggio emodinamico continuo, medico presente.",
 inc:["ceftri","cefa"], com:["nora","adre"],
 note:"Eccesso di protamina = effetto anticoagulante paradosso e disfunzione piastrinica.",
 ant:"Non vescicante."
},
{
 id:"txa", n:"Acido tranexamico", s:"tranex ugurol TXA cyklokapron", c:"Antifibrinolitico", cat:"coag",
 prep:"Fiala 500 mg/5 mL o 1 g/10 mL, diluita",
 solv:"NaCl 0,9% o G5%",
 dose:"Cardiochirurgia: 10–30 mg/kg di carico + 1–2 mg/kg/h (o 2 g totali secondo protocollo)",
 tit:"Carico all'induzione in almeno 15–30 min, mantenimento fino alla fine dell'intervento o fino alla chiusura sternale; nel post-operatorio secondo protocollo se sanguinamento. Le dosi elevate (>80–100 mg/kg cumulativi) si associano a convulsioni: ridurre nell'insufficienza renale (aggiustamento per clearance).",
 bolo:"1 g in 10 min (o 10–30 mg/kg).",
 ph:"6,5–8,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; non associare a penicilline e a soluzioni contenenti sangue.",
 inc:["*Penicilline","*Emoderivati"], com:["nora","epar"],
 note:"ATTENZIONE: gravi errori di somministrazione sono descritti per confusione con l'anestetico locale in ambito neurassiale. Doppio controllo dell'etichetta.",
 ant:"Non vescicante."
},
{
 id:"argt", n:"Argatroban", s:"argatra", c:"Inibitore diretto della trombina", cat:"coag",
 prep:"250 mg in 250 mL (1 mg/mL) — diluizione secondo formulazione",
 solv:"NaCl 0,9% o G5%",
 dose:"0,5–2 mcg/kg/min",
 tit:"In terapia intensiva e nella disfunzione epatica iniziare a 0,5 mcg/kg/min (non 2). Target aPTT ratio 1,5–3 volte il basale; primo controllo a 2 h. Metabolismo epatico: nessun aggiustamento renale. Prolunga l'INR: attenzione nel passaggio a warfarin.",
 bolo:"Nessun bolo nella HIT (solo in ambito interventistico).",
 ph:"3,2–7,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Preferibile lume dedicato per la precisione del dosaggio.",
 inc:[], com:["nora","ntg","fent","prpf","dexm","insu"],
 note:"Farmaco di scelta nella HIT con insufficienza renale.",
 ant:"Non vescicante."
},
{
 id:"biva", n:"Bivalirudina", s:"angiox", c:"Inibitore diretto della trombina", cat:"coag",
 prep:"250 mg in 50 mL (5 mg/mL) poi diluita a 0,5 mg/mL",
 solv:"NaCl 0,9% o G5%",
 dose:"HIT in terapia intensiva 0,15–0,2 mg/kg/h; CEC secondo protocollo dedicato",
 tit:"Target aPTT ratio 1,5–2,5. Eliminazione renale ed enzimatica: ridurre se GFR ridotto. In CEC con HIT richiede protocolli specifici con ricircolo continuo del circuito per evitare la trombosi da stasi.",
 bolo:"Solo in ambito interventistico/CEC secondo protocollo.",
 ph:"5,0–6,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Preferibile lume dedicato.",
 inc:["alte","amio","vanc","diaze","*Streptochinasi"], com:["nora","fent","prpf"],
 note:"Nessun antidoto specifico; emivita 25 min in funzione renale normale.",
 ant:"Non vescicante."
},
{
 id:"ddavp", n:"Desmopressina", s:"minirin DDAVP", c:"Analogo della vasopressina (emostatico)", cat:"coag",
 prep:"0,3 mcg/kg in 50–100 mL NaCl 0,9%",
 solv:"NaCl 0,9%",
 dose:"0,3 mcg/kg in 20–30 min",
 tit:"Utile nella disfunzione piastrinica post-CEC, uremica, e in terapia antiaggregante. Infusione rapida = ipotensione e tachicardia. Rischio di iponatriemia da ritenzione idrica: monitorare sodiemia e bilancio, restrizione idrica nelle 24 h successive. Tachifilassi dopo 2–3 dosi.",
 bolo:"Mai rapido: sempre in 20–30 min.",
 ph:"3,5–6,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:[], com:["nora","epar"],
 note:"Non confondere le formulazioni (fiale a diverso dosaggio, uso antidiuretico vs emostatico).",
 ant:"Non vescicante."
},
{
 id:"fibr", n:"Fibrinogeno concentrato", s:"haemocomplettan riastap", c:"Concentrato di fattore I", cat:"emoc",
 prep:"Ricostituito in acqua ppi a 20 mg/mL, non agitare",
 solv:"Acqua per preparazioni iniettabili (fornita)",
 dose:"25–50 mg/kg (2–4 g) guidati da FIBTEM/ROTEM o fibrinogenemia <1,5–2 g/L",
 tit:"Somministrare a velocità massima di 5 mL/min. Target post-CEC: fibrinogeno >1,5–2 g/L o A10 FIBTEM >10 mm.",
 bolo:"Infusione lenta, max 5 mL/min.",
 ph:"6,5–7,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Linea dedicata o via accuratamente lavata: nessun altro farmaco in Y con gli emoderivati.",
 inc:["*emoderivati"], com:[],
 note:"Ricostituzione a 20–37 °C, non scaldare oltre; usare filtro/set fornito.",
 ant:"Non vescicante."
},
{
 id:"ccp", n:"Concentrato di complesso protrombinico", s:"CCP PCC confidex beriplex octaplex", c:"Fattori II, VII, IX, X", cat:"emoc",
 prep:"Ricostituito secondo scheda tecnica",
 solv:"Acqua per preparazioni iniettabili (fornita)",
 dose:"25–50 UI/kg secondo INR e indicazione",
 tit:"Velocità massima 2–8 mL/min secondo prodotto. Indicato nel sanguinamento da antivitamina K e, off-label, nel sanguinamento post-CEC refrattario. Rischio trombotico: dose minima efficace.",
 bolo:"Infusione lenta secondo scheda tecnica.",
 ph:"6,5–7,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Linea dedicata; associare vitamina K se antagonismo di AVK.",
 inc:["*emoderivati"], com:[],
 note:"Non somministrare con eparina in Y se il prodotto ne contiene già.",
 ant:"Non vescicante."
},
{
 id:"alte", n:"Alteplase (rt-PA)", s:"actilyse tpa trombolitico", c:"Trombolitico", cat:"coag",
 prep:"Ricostituito a 1 mg/mL con acqua ppi fornita; per la disostruzione del catetere 2 mg/2 mL",
 solv:"Acqua ppi, poi eventualmente NaCl 0,9%. MAI glucosata.",
 dose:"Secondo indicazione (embolia polmonare massiva 100 mg/2 h; disostruzione CVC 2 mg per lume)",
 tit:"Per la disostruzione del catetere: instillare 2 mg nel lume occluso, lasciare in sede 30–120 min, aspirare, ripetere una volta.",
 bolo:"Secondo protocollo specifico.",
 ph:"7,3", osm:"≈290", ves:"no",
 cvc:"si", pvc:"cauto", picc:"si", mid:"cauto", ded:true,
 rub:"Linea dedicata: incompatibile con dopamina, dobutamina, eparina e nitroglicerina.",
 inc:["dopa","dobu","epar","ntg","biva"], com:[],
 note:"Non agitare durante la ricostituzione (schiuma). Nel post-cardiochirurgico precoce la trombolisi sistemica è di norma controindicata.",
 ant:"Non vescicante; rischio emorragico locale."
},

/* ==================== ANTIMICROBICI ==================== */
{
 id:"vanc", n:"Vancomicina", s:"vancocina glicopeptide", c:"Glicopeptide", cat:"anti",
 prep:"500 mg in 100 mL o 1 g in 250 mL (≤5 mg/mL per via periferica; fino a 10 mg/mL solo in CVC)",
 solv:"NaCl 0,9% o G5%",
 dose:"15–20 mg/kg ogni 8–12 h; carico 25–30 mg/kg nel critico",
 tit:"Velocità massima 10 mg/min, comunque mai meno di 60 min per grammo. Monitoraggio: AUC/MIC 400–600 (preferito) o valle 15–20 mg/L nelle infezioni gravi. Infusione continua alternativa: carico 15–20 mg/kg poi 30–40 mg/kg/24 h con target steady-state 20–25 mg/L. Sindrome dell'uomo rosso da rilascio istaminico se infusione rapida: rallentare e antistaminico, non è allergia.",
 bolo:"Assolutamente controindicato.",
 ph:"2,5–4,5", osm:"≈300 (a 5 mg/mL)", ves:"mod",
 cvc:"pref", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Lavare la via prima e dopo: incompatibile con eparina e piperacillina/tazobactam, associazioni frequentissime in terapia intensiva.",
 inc:["epar","pipe","ceftri","ceftaz","cefep","bica","fenit","amino","albu","tiop","rocu","biva","dexa"],
 com:["nora","dobu","dopa","fent","prpf","dexm","cisa","insu","mida"],
 note:"Vescicante a rischio moderato nella lista INS 2024. Il pH acido rende frequente la flebite chimica: preferire accesso centrale per terapie superiori a 6 giorni. Nefrotossicità sinergica con piperacillina/tazobactam.",
 ant:"Stop, aspirazione; impacchi tiepidi; valutare ialuronidasi nelle infiltrazioni estese."
},
{
 id:"teic", n:"Teicoplanina", s:"targosid", c:"Glicopeptide", cat:"anti",
 prep:"400 mg ricostituiti, poi diluiti in 100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Carico 6–12 mg/kg ogni 12 h per 3–5 dosi, poi 6–12 mg/kg/die",
 tit:"Infusione in 30 min. Valle target 15–30 mg/L (endocardite 30–40). Meglio tollerata della vancomicina in periferica.",
 bolo:"Bolo lento in 3–5 min ammesso da scheda tecnica.",
 ph:"7,2–7,8", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["cipro","pipe"], com:["nora","epar"],
 note:"Il carico è spesso sottodosato: nel critico servono almeno 5 dosi da 12 mg/kg.",
 ant:"Non vescicante."
},
{
 id:"cefa", n:"Cefazolina", s:"cefamezin cefazolina", c:"Cefalosporina di 1ª generazione", cat:"anti",
 prep:"2 g in 100 mL (3 g se peso >120 kg)",
 solv:"NaCl 0,9% o G5%",
 dose:"Profilassi cardiochirurgica 2 g entro 60 min dall'incisione; ri-dose ogni 4 h o dopo CEC; terapia 2 g ogni 8 h",
 tit:"Ri-somministrare dopo la CEC (emodiluizione) e in caso di perdite ematiche massive. Prosecuzione post-operatoria non oltre 24–48 h secondo STS/SHEA.",
 bolo:"Bolo lento in 3–5 min ammesso; preferibile infusione in 15–30 min.",
 ph:"4,5–6,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["amio","rocu","prot","amik","gent"], com:["nora","epar","insu"],
 note:"Cardine della profilassi chirurgica; in caso di MRSA noto associare vancomicina.",
 ant:"Non vescicante."
},
{
 id:"ceftri", n:"Ceftriaxone", s:"rocefin", c:"Cefalosporina di 3ª generazione", cat:"anti",
 prep:"1–2 g in 100 mL",
 solv:"NaCl 0,9% o G5%. MAI Ringer lattato o soluzioni contenenti calcio.",
 dose:"1–2 g ogni 12–24 h",
 tit:"Infusione in 30 min.",
 ph:"6,0–8,0", osm:"≈300", ves:"no",
 bolo:"Preferibile infusione in 30 min.",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"ALLARME: mai nella stessa via, contemporaneamente o in sequenza senza lavaggio, con soluzioni contenenti calcio (cloruro/gluconato di calcio, Ringer lattato, nutrizione parenterale con calcio). Il precipitato di ceftriaxone-calcio è stato causa di decessi. Lavare abbondantemente la via.",
 inc:["cacl","cagl","ringer","vanc","labe","fluc","amino","mida","line","mgso4","prot"],
 com:["nora","epar"],
 note:"Nel paziente cardiochirurgico, che riceve calcio frequentemente, questa incompatibilità è la più critica in assoluto.",
 ant:"Non vescicante."
},
{
 id:"ceftaz", n:"Ceftazidima (± avibactam)", s:"fortum zavicefta", c:"Cefalosporina antipseudomonas", cat:"anti",
 prep:"2 g in 100 mL; infusione estesa 3 h",
 solv:"NaCl 0,9% o G5%",
 dose:"2 g ogni 8 h (infusione estesa 3 h o continua)",
 tit:"L'infusione estesa massimizza il tempo sopra la MIC nei betalattamici tempo-dipendenti. Aggiustare per clearance renale.",
 bolo:"Non indicato.",
 ph:"5,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con vancomicina.",
 inc:["vanc","amino","bica"], com:["nora","epar"],
 note:"Sviluppa CO₂ durante la ricostituzione: sfiatare il flacone.",
 ant:"Non vescicante."
},
{
 id:"pipe", n:"Piperacillina/Tazobactam", s:"tazocin piptazo", c:"Penicillina + inibitore delle betalattamasi", cat:"anti",
 prep:"4,5 g in 100 mL; infusione estesa 4 h o continua",
 solv:"NaCl 0,9% o G5%",
 dose:"4,5 g ogni 6–8 h (estesa 4 h)",
 tit:"Infusione estesa o continua raccomandata nel critico. Aggiustare per funzione renale. Interferisce con il dosaggio del galattomannano.",
 bolo:"Non indicato.",
 ph:"5,5–6,8", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Lavare accuratamente tra piperacillina/tazobactam e vancomicina o aminoglicosidi: incompatibilità e inattivazione.",
 inc:["vanc","gent","amik","tobra","teic","amfb"], com:["nora","epar","insu"],
 note:"Nefrotossicità aumentata in associazione a vancomicina: valutare alternative.",
 ant:"Non vescicante."
},
{
 id:"mero", n:"Meropenem", s:"merrem carbapenemico", c:"Carbapenemico", cat:"anti",
 prep:"1–2 g in 100 mL; infusione estesa 3 h",
 solv:"NaCl 0,9% (preferita; stabilità ridotta in glucosata)",
 dose:"1–2 g ogni 8 h (infusione estesa 3 h)",
 tit:"Instabilità in soluzione: preparare al momento, non oltre 3 h a temperatura ambiente per l'infusione estesa. Aggiustare per clearance renale e per CRRT.",
 bolo:"Bolo in 3–5 min possibile ma sconsigliato (perde il vantaggio PK/PD).",
 ph:"7,3–8,3", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*multipli"], com:["nora","dobu","epar","insu"],
 note:"Riduce i livelli di acido valproico. Rischio convulsivo minore rispetto a imipenem.",
 ant:"Non vescicante."
},
{
 id:"line", n:"Linezolid", s:"zyvoxid", c:"Ossazolidinone", cat:"anti",
 prep:"600 mg/300 mL, sacca pronta",
 solv:"Pronto all'uso",
 dose:"600 mg ogni 12 h",
 tit:"Infusione in 30–120 min. Mielotossicità (piastrinopenia) oltre 10–14 giorni: emocromo bisettimanale. Sindrome serotoninergica con antidepressivi. Acidosi lattica da tossicità mitocondriale.",
 bolo:"Non indicato.",
 ph:"4,8", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Lavare la via: incompatibile con ceftriaxone, trimetoprim/sulfametossazolo, amfotericina, fenitoina, diazepam.",
 inc:["ceftri","amfb","fenit","diaze","tmpsmx","*Eritromicina","panto"], com:["nora","epar"],
 note:"Ottima penetrazione tissutale, utile nelle mediastiniti da Gram-positivi.",
 ant:"Non vescicante."
},
{
 id:"dapt", n:"Daptomicina", s:"cubicin", c:"Lipopeptide", cat:"anti",
 prep:"Ricostituita e diluita in NaCl 0,9%",
 solv:"ESCLUSIVAMENTE NaCl 0,9% o Ringer lattato. NON usare glucosata.",
 dose:"6–10 mg/kg/die (fino a 8–12 nell'endocardite)",
 tit:"Infusione in 30 min (bolo in 2 min ammesso da scheda tecnica). Dosaggio ogni 48 h se GFR <30. Monitorare CPK settimanalmente (rabdomiolisi); sospendere le statine se possibile. Inattivata dal surfattante: NON usare nella polmonite.",
 bolo:"Bolo in 2 min ammesso.",
 ph:"4,0–5,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con soluzioni glucosate.",
 inc:["gluc","*glucosate"], com:["nora","epar"],
 note:"Utile nell'endocardite e nelle infezioni di protesi valvolari da Gram-positivi resistenti.",
 ant:"Non vescicante."
},
{
 id:"gent", n:"Gentamicina", s:"gentalyn aminoglicoside", c:"Aminoglicoside", cat:"anti",
 prep:"Dose in 100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"5–7 mg/kg/die in monosomministrazione (peso corretto)",
 tit:"Infusione in 30–60 min. Monitoraggio: picco 16–24 mg/L (monodose) e valle <1 mg/L. Nefro- e ototossicità: sorvegliare creatinina e bilancio.",
 bolo:"Controindicato.",
 ph:"3,0–5,5", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Non associare a betalattamici e a eparina nella stessa via: inattivazione reciproca e precipitazione. Lavare tra le somministrazioni.",
 inc:["epar","pipe","cefa","amfb","prpf","furo","bica"], com:["nora","insu"],
 note:"Nella lista INS 2024 è tra gli infusati cautelativi.",
 ant:"Impacchi tiepidi."
},
{
 id:"amik", n:"Amikacina", s:"BB-K8 amikin", c:"Aminoglicoside", cat:"anti",
 prep:"Dose in 100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"15–25 mg/kg/die in monosomministrazione",
 tit:"Infusione in 30–60 min. Picco target 56–64 mg/L, valle <4 mg/L.",
 bolo:"Controindicato.",
 ph:"3,5–5,5", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Come gentamicina: lavaggio obbligatorio, mai in Y con betalattamici o eparina.",
 inc:["epar","pipe","cefa","prpf","amfb"], com:["nora","insu"],
 note:"Aggiustare l'intervallo secondo funzione renale.",
 ant:"Impacchi tiepidi."
},
{
 id:"cipro", n:"Ciprofloxacina", s:"ciproxin fluorochinolone", c:"Fluorochinolone", cat:"anti",
 prep:"400 mg/200 mL, sacca pronta",
 solv:"Pronto all'uso",
 dose:"400 mg ogni 8–12 h",
 tit:"Infusione in 60 min: l'infusione rapida causa ipotensione e flebite. Prolunga il QT: attenzione in associazione ad amiodarone.",
 bolo:"Controindicato.",
 ph:"3,9–4,5", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con eparina, furosemide, aminofillina e soluzioni alcaline.",
 inc:["epar","furo","amino","bica","fenit","teic"], com:["nora","insu"],
 note:"Flebite frequente per il pH acido.",
 ant:"Impacchi tiepidi."
},
{
 id:"levof", n:"Levofloxacina", s:"levoxacin tavanic", c:"Fluorochinolone", cat:"anti",
 prep:"500–750 mg/100 mL, sacca pronta",
 solv:"Pronto all'uso",
 dose:"500–750 mg ogni 12–24 h",
 tit:"Infusione in almeno 60 min per 500 mg, 90 min per 750 mg. Prolunga il QT.",
 bolo:"Controindicato.",
 ph:"4,3–5,3", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["epar","bica","furo"], com:["nora"],
 note:"Aggiustare per funzione renale.",
 ant:"Non vescicante."
},
{
 id:"metro", n:"Metronidazolo", s:"flagyl deflamon", c:"Nitroimidazolo", cat:"anti",
 prep:"500 mg/100 mL, sacca pronta",
 solv:"Pronto all'uso",
 dose:"500 mg ogni 8 h",
 tit:"Infusione in 20–60 min.",
 bolo:"Non indicato.",
 ph:"4,5–7,0", osm:"≈310", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; compatibile con molti farmaci.",
 inc:["amfb","dopa"], com:["nora","epar","insu"],
 note:"Effetto disulfiram-simile con l'alcol.",
 ant:"Non vescicante."
},
{
 id:"fluc", n:"Fluconazolo", s:"diflucan", c:"Azolo antifungino", cat:"anti",
 prep:"200–400 mg/100–200 mL, sacca pronta",
 solv:"Pronto all'uso",
 dose:"Carico 12 mg/kg, poi 6–12 mg/kg/die",
 tit:"Infusione a velocità massima 200 mg/h. Prolunga il QT; numerose interazioni (inibizione CYP).",
 bolo:"Controindicato.",
 ph:"4,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["ceftri","amfb","furo","panto"], com:["nora","epar"],
 note:"Aggiustare per funzione renale.",
 ant:"Non vescicante."
},
{
 id:"casp", n:"Caspofungin", s:"cancidas echinocandina", c:"Echinocandina", cat:"anti",
 prep:"Ricostituito e diluito in 250 mL NaCl 0,9%",
 solv:"NaCl 0,9% o Ringer lattato. NON usare glucosata.",
 dose:"Carico 70 mg, poi 50–70 mg/die (70 se peso >80 kg)",
 tit:"Infusione in 60 min. Ridurre a 35 mg/die nell'insufficienza epatica moderata.",
 bolo:"Controindicato.",
 ph:"6,0–7,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Linea lavata; nessun altro farmaco in Y (dati assenti).",
 inc:["gluc","*altri"], com:[],
 note:"Non diluire in soluzioni glucosate.",
 ant:"Non vescicante."
},
{
 id:"amfb", n:"Amfotericina B liposomiale", s:"ambisome amfotericina", c:"Polienico antifungino", cat:"anti",
 prep:"Ricostituita con acqua ppi e diluita ESCLUSIVAMENTE in G5%",
 solv:"ESCLUSIVAMENTE Glucosata 5%. Il contatto con NaCl provoca precipitazione.",
 dose:"3–5 mg/kg/die",
 tit:"Infusione in 30–60 min con filtro ≥1 µm. Premedicazione se reazioni infusionali. Sorvegliare potassio, magnesio e creatinina.",
 bolo:"Controindicato.",
 ph:"5,0–6,0", osm:"≈300 (in G5%)", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:true,
 rub:"Linea dedicata. Se la via è unica, lavare con G5% (mai con NaCl) prima e dopo.",
 inc:["*NaCl 0,9% e ogni soluzione salina","*quasi tutti","dexm","prpf","gent","amik","pipe","line","fluc","metro"],
 com:[],
 note:"Non confondere le formulazioni: la deossicolata convenzionale ha dosi 10 volte inferiori. Errore potenzialmente letale.",
 ant:"Irritante: impacchi tiepidi."
},
{
 id:"coli", n:"Colistimetato sodico", s:"colimicina colistina", c:"Polimixina", cat:"anti",
 prep:"Dose in 50–100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Carico 9 MUI, poi 4,5 MUI ogni 12 h",
 tit:"Infusione in 30–60 min. Marcata nefrotossicità e neurotossicità: aggiustare per clearance renale e monitorare creatinina quotidianamente.",
 bolo:"Controindicato.",
 ph:"7,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*multipli"], com:["nora"],
 note:"Attenzione alle unità: MUI vs mg di colistina base. Errore frequente e grave.",
 ant:"Non vescicante."
},
{
 id:"tige", n:"Tigeciclina", s:"tygacil", c:"Glicilciclina", cat:"anti",
 prep:"50 mg in 100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Carico 100 mg, poi 50 mg ogni 12 h (dosi alte 100 mg x2 in alcune indicazioni)",
 tit:"Infusione in 30–60 min. Nausea e vomito frequenti.",
 bolo:"Controindicato.",
 ph:"7,8", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con amfotericina e alcune associazioni.",
 inc:["amfb","*varie"], com:["nora","epar"],
 note:"Non indicata nelle batteriemie primarie (basse concentrazioni plasmatiche).",
 ant:"Non vescicante."
},

/* ==================== ELETTROLITI, SOLUZIONI, METABOLICO ==================== */
{
 id:"insu", n:"Insulina regolare (umana)", s:"actrapid humulin R insulina rapida", c:"Ormone ipoglicemizzante", cat:"elet",
 prep:"50 UI in 50 mL NaCl 0,9% (1 UI/mL)",
 solv:"NaCl 0,9%",
 dose:"0,5–10 UI/h secondo protocollo",
 tit:"Protocollo glicemico post-cardiochirurgico: target 140–180 mg/dL (in molti centri 110–150 nel diabetico chirurgico). Controlli orari finché instabile, poi ogni 2 h. Variazioni in base a valore assoluto e velocità di variazione. Attenzione all'ipoglicemia durante lo svezzamento dai vasoattivi, alla sospensione della nutrizione e nell'insufficienza renale.",
 bolo:"Boli sconsigliati in terapia intensiva salvo iperkaliemia (10 UI con glucosata).",
 ph:"7,0–7,8", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Preferibile lume dedicato o comunque via a flusso continuo: qualsiasi bolo o flush sulla linea provoca ipoglicemia acuta. Mai interrompere senza sostituire l'apporto glucidico.",
 inc:["rocu","tiop","enox"],
 com:["nora","adre","dopa","dobu","milr","ntg","epar","kcl","fent","prpf","mida","dexm","vanc","mgso4","furo"],
 note:"Adsorbimento su PVC del 20–30%: lavare (purgare) il set con 20 mL della soluzione e scartarli prima di collegare. Sostituire la siringa ogni 24 h.",
 ant:"Non vescicante."
},
{
 id:"kcl", n:"Potassio cloruro concentrato", s:"KCl potassio cloruro", c:"Elettrolita", cat:"elet",
 prep:"Diluizione periferica ≤40 mEq/L; via centrale fino a 100–200 mEq/L in siringa dedicata",
 solv:"NaCl 0,9% (preferita) o G5%",
 dose:"Velocità: periferica ≤10 mEq/h; centrale 10–20 mEq/h con monitoraggio ECG (fino a 40 mEq/h solo in emergenza aritmica, medico presente)",
 tit:"Correggere prima il magnesio. 10 mEq aumentano la kaliemia di circa 0,1 mEq/L nell'adulto normofunzionante. Controllo della kaliemia dopo ogni 40–60 mEq o secondo protocollo. Nel post-CEC il fabbisogno è elevato (diuresi, emodiluizione, insulina, alcalosi).",
 bolo:"MAI IN BOLO. Il potassio concentrato non diluito è letale: rischio di arresto in asistolia.",
 ph:"4,0–8,0", osm:"≈4000 (soluzione 2 mEq/mL)", ves:"cauto",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"cauto", ded:false,
 rub:"Sempre in pompa, mai a caduta libera, mai al rubinetto in siringa. Etichettatura ad alto rischio, doppio controllo indipendente. Conservare le fiale concentrate in area separata e ad accesso controllato.",
 inc:["*precipita con soluzioni contenenti fosfati concentrati"],
 com:["nora","epar","insu","ntg","mgso4","furo","dobu"],
 note:"Nella lista INS 2024 il KCl a concentrazione ≤100 mEq/L è classificato come infusato cautelativo; concentrazioni superiori richiedono la via centrale. In periferica: dolore e flebite frequenti oltre 40 mEq/L.",
 ant:"Impacchi tiepidi; possibile necrosi se alta concentrazione."
},
{
 id:"bica", n:"Sodio bicarbonato 8,4%", s:"bicarbonato NaHCO3 bicarbonato di sodio", c:"Alcalinizzante", cat:"elet",
 prep:"Fiala 1 mEq/mL (8,4%) o soluzione 1,4% isotonica",
 solv:"Diluibile in G5% o acqua ppi; NON in soluzioni contenenti calcio",
 dose:"Secondo deficit di basi: mEq = BE × peso × 0,3 (somministrare la metà e rivalutare)",
 tit:"Indicazioni ristrette: acidosi metabolica grave con pH <7,10–7,15, iperkaliemia con alterazioni ECG, intossicazione da bloccanti dei canali del sodio, alcalinizzazione urinaria. Non correggere l'acidosi lattica da ipoperfusione con bicarbonato: si tratta la causa. Infondere lentamente; l'8,4% va diluito se periferico.",
 bolo:"50 mEq in 5–10 min solo in emergenza; nell'ACR non di routine.",
 ph:"7,0–8,5", osm:"≈2000 (soluzione 8,4%)", ves:"alto",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:true,
 rub:"Lavare abbondantemente prima e dopo. È il farmaco più incompatibile della terapia intensiva: inattiva tutte le catecolamine e precipita con calcio, magnesio e fosfati.",
 inc:["nora","adre","dopa","dobu","cacl","cagl","mgso4","mida","vanc","amio","labe","esmo","nica","urap","atro","keta","succ","cisa","gent","cipro","ceftaz"],
 com:["tiop","furo"],
 note:"Vescicante ad alto rischio: pH alcalino e osmolarità estrema. Effetti collaterali: ipernatriemia, ipokaliemia, ipocalcemia ionizzata, acidosi intracellulare paradossa, spostamento a sinistra della curva dell'emoglobina.",
 ant:"Stravaso grave: stop, aspirazione, NON lavare, impacchi tiepidi, valutare ialuronidasi e consulenza chirurgica precoce."
},
{
 id:"cacl", n:"Calcio cloruro 10%", s:"calcio cloruro CaCl2", c:"Elettrolita (sale di calcio ad alta biodisponibilità)", cat:"elet",
 prep:"Fiala 10 mL = 1 g = 6,8 mmol di Ca²⁺ (13,6 mEq)",
 solv:"Diluibile in NaCl 0,9% o G5%",
 dose:"Post-CEC 0,5–1 g lento; iperkaliemia 1 g; ipocalcemia ionizzata secondo emogas",
 tit:"Somministrare in 5–10 min salvo emergenza. Tre volte più calcio elementare del gluconato a parità di volume. Nel post-CEC correggere il calcio ionizzato (target 1,1–1,3 mmol/L): l'ipocalcemia contribuisce alla vasoplegia e alla disfunzione contrattile. Attenzione al paziente digitalizzato (rischio di aritmie).",
 bolo:"0,5–1 g lento (in emergenza 1 g in 2–3 min con monitoraggio).",
 ph:"5,5–7,5", osm:"≈2000 (soluzione al 10%)", ves:"alto",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:false,
 rub:"Lavare prima e dopo. MAI nella stessa via del ceftriaxone e del bicarbonato. Verificare sempre il ritorno ematico prima della somministrazione.",
 inc:["bica","fosfk","ceftri","mgso4"], com:["nora","adre","epar"],
 note:"Vescicante ad alto rischio nella lista INS 2024 (tutte le forme di calcio): sono descritte sindromi compartimentali e necrosi calcifica da stravaso.",
 ant:"EMERGENZA. Stop, aspirare, non lavare, rimuovere. Ialuronidasi 150 UI infiltrata in 5 aliquote perilesionali. Impacchi tiepidi, arto elevato, consulenza chirurgica precoce, sorveglianza per calcinosi cutanea."
},
{
 id:"cagl", n:"Calcio gluconato 10%", s:"calcio gluconato", c:"Elettrolita (sale di calcio)", cat:"elet",
 prep:"Fiala 10 mL = 1 g = 2,2 mmol di Ca²⁺ (4,6 mEq)",
 solv:"NaCl 0,9% o G5%",
 dose:"1–3 g secondo calcemia ionizzata",
 tit:"Preferito in periferica rispetto al cloruro (meno irritante), ma comunque vescicante. Infondere in 10–30 min diluito.",
 bolo:"1 g in 10 min diluito.",
 ph:"6,0–8,2", osm:"≈680 (soluzione al 10%)", ves:"alto",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Come il cloruro: mai con ceftriaxone, bicarbonato o fosfati.",
 inc:["bica","fosfk","ceftri","mgso4"], com:["nora","adre","epar"],
 note:"Richiede metabolismo epatico per la liberazione del calcio ionizzato: nell'epatopatico grave e nel basso portata preferire il cloruro.",
 ant:"Come per il calcio cloruro: ialuronidasi, impacchi tiepidi, sorveglianza per calcinosi."
},
{
 id:"nacl3", n:"NaCl ipertonico 3% / 7,5%", s:"salina ipertonica ipertonica sodio cloruro 3%", c:"Soluzione ipertonica", cat:"elet",
 prep:"Sacca 3% (513 mEq/L Na⁺) o bolo 7,5% / 20% secondo protocollo",
 solv:"Pronto all'uso",
 dose:"Bolo 2–3 mL/kg di 3% in 10–20 min; infusione continua secondo natriemia",
 tit:"Iponatriemia sintomatica: correzione mirata di 4–6 mEq/L nelle prime ore, mai oltre 8–10 mEq/L nelle 24 h (rischio di sindrome da demielinizzazione osmotica). Natriemia ogni 2–4 h. Nell'ipertensione endocranica: bolo su osmolarità e sodiemia target.",
 bolo:"100–150 mL di NaCl 3% in 10–20 min, ripetibile.",
 ph:"4,5–7,0", osm:"1027 (3%) / 2566 (7,5%)", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Via lavata; monitoraggio della natriemia e del sito di infusione.",
 inc:["amfb"], com:["nora","epar","insu"],
 note:"Osmolarità superiore a 900 mOsm/L: per l'infusione continua è indicato l'accesso centrale. Il bolo periferico in emergenza è accettato in vena di grosso calibro con sorveglianza stretta.",
 ant:"Impacchi tiepidi; sorveglianza prolungata."
},
{
 id:"mann", n:"Mannitolo 18%", s:"mannitolo osmotico", c:"Diuretico osmotico", cat:"elet",
 prep:"Sacca 18% (o 20%)",
 solv:"Pronto all'uso",
 dose:"0,25–1 g/kg in 15–30 min",
 tit:"Monitorare gap osmolare (<10–20), osmolarità plasmatica (<320 mOsm/L), diuresi, sodiemia e funzione renale. Effetto rimbalzo alla sospensione.",
 bolo:"0,25–1 g/kg in 15–30 min con filtro in linea.",
 ph:"4,5–7,0", osm:"≈990 (18%) / 1100 (20%)", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Usare filtro in linea: cristallizza a basse temperature. Se cristallizzato, riscaldare a bagnomaria e raffreddare prima dell'uso.",
 inc:["*emoderivati"], com:["nora"],
 note:"Nella lista INS 2024 il mannitolo >20% è vescicante a rischio moderato.",
 ant:"Impacchi tiepidi; sorveglianza."
},
{
 id:"gluc", n:"Glucosata 33% / 50%", s:"glucosio 33 50 destrosio ipertonica", c:"Soluzione glucidica ipertonica", cat:"elet",
 prep:"Fiala/flacone 33% o 50%",
 solv:"Pronto all'uso",
 dose:"Ipoglicemia: 15–25 g (30–50 mL di 50%); poi infusione di mantenimento",
 tit:"Nell'ipoglicemia da insulina: 20–25 g ev, ricontrollo a 15 min. Nell'iperkaliemia: 25 g con 10 UI di insulina rapida, poi sorveglianza glicemica per 6 h.",
 bolo:"30–50 mL di glucosata 50% ev lento in vena di grosso calibro.",
 ph:"3,5–6,5", osm:"1665 (33%) / 2525 (50%)", ves:"alto",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Verificare il ritorno ematico prima del bolo. Lavare abbondantemente dopo.",
 inc:["dapt","casp","fenit"], com:["insu","nora"],
 note:"Nella lista INS 2024 le soluzioni glucosate >10% sono vescicanti ad alto rischio.",
 ant:"Stop, aspirazione, impacchi tiepidi, sorveglianza per necrosi."
},
{
 id:"npt", n:"Nutrizione parenterale", s:"NPT NP sacca nutrizione parenterale totale", c:"Miscela nutrizionale", cat:"elet",
 prep:"Sacca industriale o galenica; osmolarità tipica 1000–1800 mOsm/L",
 solv:"Non diluire",
 dose:"Secondo fabbisogno calorico-proteico calcolato",
 tit:"Avvio graduale (rischio di sindrome da rialimentazione: sorvegliare fosforo, potassio, magnesio e tiamina). Nel post-cardiochirurgico privilegiare la via enterale precoce.",
 bolo:"Non applicabile.",
 ph:"5,0–6,5", osm:"1000–1800", ves:"cauto",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:true,
 rub:"LUME DEDICATO OBBLIGATORIO. Non usare la via per boli, prelievi o altri farmaci. Set e sacca sostituiti ogni 24 h.",
 inc:["*quasi tutti"], com:[],
 note:"Per via periferica solo miscele con osmolarità <800–850 mOsm/L (ERPIUP/ESPEN) e per periodi brevi. Le sacche con calcio non vanno mai associate al ceftriaxone.",
 ant:"Stravaso: rischio elevato di necrosi per iperosmolarità."
},
{
 id:"albu", n:"Albumina umana 20%", s:"albumina", c:"Colloide / emoderivato", cat:"emoc",
 prep:"Flacone 50–100 mL al 20% (iperoncotica) o 4–5% (iso-oncotica)",
 solv:"Non diluire con acqua ppi (emolisi)",
 dose:"Secondo indicazione clinica e albuminemia",
 tit:"Infusione a velocità massima 1–2 mL/min per il 20%. Indicazioni ristrette nel post-CEC: correzione della ipoalbuminemia con edema refrattario, priming, ipovolemia con restrizione idrica.",
 bolo:"Infusione lenta.",
 ph:"6,4–7,4", osm:"≈300 (ma pressione oncotica elevata)", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Set dedicato con filtro; nessun farmaco in Y con gli emoderivati.",
 inc:["vanc","*farmaci in Y"], com:[],
 note:"Sorvegliare il sovraccarico e l'edema polmonare nel paziente con disfunzione ventricolare.",
 ant:"Non vescicante."
},

/* ==================== DIURETICI, STEROIDI, GASTRO, NEURO ==================== */
{
 id:"furo", n:"Furosemide", s:"lasix furosemide diuretico ansa", c:"Diuretico dell'ansa", cat:"vari",
 prep:"250 mg in 50 mL (5 mg/mL) o non diluita 10 mg/mL",
 solv:"NaCl 0,9% (preferita). Il pH alcalino la rende instabile in soluzioni acide.",
 dose:"Boli 20–80 mg; infusione 2–20 mg/h (fino a 40 mg/h in resistenza)",
 tit:"Nel post-cardiochirurgico l'infusione continua garantisce una diuresi più stabile e minore ototossicità rispetto ai boli ad alte dosi. Velocità massima del bolo: 4 mg/min (ototossicità). Raddoppiare la dose se risposta insufficiente dopo 1–2 h (approccio a scalini). Sorvegliare potassio, magnesio, sodio, alcalosi metabolica ipocloremica e funzione renale.",
 bolo:"20–40 mg ev lento (max 4 mg/min); dosi maggiori sempre diluite.",
 ph:"8,0–9,3", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"È il farmaco più frequentemente coinvolto in incompatibilità pratiche in terapia intensiva. LAVARE SEMPRE la via prima e dopo. Non somministrare sul lume di midazolam, dobutamina, amiodarone, morfina, vancomicina, milrinone.",
 inc:["mida","dobu","amio","morf","vanc","milr","nica","labe","esmo","ondan","metoclo","gent","cipro","dopa","halo","tiop","fenit","vaso","rocu"],
 com:["nora","ntg","epar","insu","fent","dexm","prpf","kcl","bica","digo"],
 note:"Fotosensibile: proteggere l'infusione prolungata. Soluzione giallo pallido; scartare se ingiallita intensamente.",
 ant:"Irritante per il pH alcalino: impacchi tiepidi."
},
{
 id:"idro", n:"Idrocortisone", s:"flebocortid solu-cortef", c:"Glucocorticoide", cat:"vari",
 prep:"Ricostituito, poi diluito in 50–100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Shock refrattario 200 mg/die (50 mg ogni 6 h o 200 mg/24 h in continua)",
 tit:"Indicato nello shock vasoplegico con fabbisogno crescente di noradrenalina. Sorvegliare glicemia, sodio e potassio. Sospensione graduale se somministrato oltre 5–7 giorni.",
 bolo:"50–100 mg ev lento.",
 ph:"7,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["rocu","fenit"], com:["nora","epar","insu"],
 note:"L'infusione continua riduce le oscillazioni glicemiche rispetto ai boli.",
 ant:"Non vescicante."
},
{
 id:"mepr", n:"Metilprednisolone", s:"solu-medrol urbason", c:"Glucocorticoide", cat:"vari",
 prep:"Ricostituito, diluito in 50–100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Secondo indicazione (0,5–1 mg/kg/die; boli elevati in indicazioni specifiche)",
 tit:"Infusione in 15–30 min per le dosi elevate (rischio di aritmie e ipotensione con i boli rapidi).",
 bolo:"Dosi elevate sempre in almeno 30 min.",
 ph:"7,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["rocu","*varie"], com:["nora","epar"],
 note:"L'uso routinario degli steroidi in CEC non è raccomandato dagli studi randomizzati (SIRS, DECS).",
 ant:"Non vescicante."
},
{
 id:"dexa", n:"Desametasone", s:"decadron soldesam", c:"Glucocorticoide", cat:"vari",
 prep:"Fiala 4–8 mg, diluita",
 solv:"NaCl 0,9% o G5%",
 dose:"4–8 mg secondo indicazione",
 tit:"Antiemetico, antiedemigeno; effetto ritardato di alcune ore.",
 bolo:"4–8 mg ev lento.",
 ph:"7,0–8,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con midazolam e rocuronio.",
 inc:["mida","rocu","vanc"], com:["nora","epar","fent"],
 note:"Sorvegliare la glicemia.",
 ant:"Non vescicante."
},
{
 id:"panto", n:"Pantoprazolo", s:"pantorc peptazol PPI inibitore pompa protonica", c:"Inibitore di pompa protonica", cat:"vari",
 prep:"40 mg ricostituiti in NaCl 0,9%; infusione continua 80 mg carico + 8 mg/h in 50 mL",
 solv:"ESCLUSIVAMENTE NaCl 0,9%",
 dose:"40 mg ogni 12–24 h; sanguinamento acuto 80 mg + 8 mg/h",
 tit:"Infusione del bolo in 2–15 min.",
 bolo:"40–80 mg ev in almeno 2 min.",
 ph:"9,0–10,5 (fortemente alcalino)", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:true,
 rub:"LUME DEDICATO o lavaggio abbondante prima e dopo: il pH alcalino lo rende incompatibile con la maggior parte dei farmaci di terapia intensiva. La soluzione ricostituita deve restare limpida e incolore; se ingiallisce, scartare.",
 inc:["nora","adre","mida","amio","line","fluc","*maggior parte"],
 com:[],
 note:"Non usare glucosata per la ricostituzione (instabilità).",
 ant:"pH >9: gestire l'infiltrazione come soluzione alcalina."
},
{
 id:"ondan", n:"Ondansetron", s:"zofran", c:"Antagonista 5-HT3", cat:"vari",
 prep:"4–8 mg diluiti in 50–100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"4–8 mg ogni 8 h",
 tit:"Infusione in 15 min (il bolo rapido può causare disturbi visivi e prolungamento del QT). Attenzione al QT nel paziente in amiodarone.",
 bolo:"4 mg ev in almeno 30 s (preferibile diluito).",
 ph:"3,3–4,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Lavare la via: incompatibile con furosemide, alcalini e sugammadex.",
 inc:["furo","bica","suga","aciclo","amfb"], com:["nora","epar","fent","mida"],
 note:"Prolunga il QT: ECG se associato ad altri farmaci QT-prolunganti.",
 ant:"Non vescicante."
},
{
 id:"metoclo", n:"Metoclopramide", s:"plasil", c:"Procinetico antagonista D2", cat:"vari",
 prep:"10 mg diluiti in 50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"10 mg ogni 8 h (max 30 mg/die, max 5 giorni)",
 tit:"Infusione in almeno 3 min: il bolo rapido causa acatisia e distonie.",
 bolo:"10 mg ev lento in 3 min.",
 ph:"3,0–5,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Lavare la via; incompatibile con furosemide.",
 inc:["furo","bica","cefa"], com:["nora","epar","fent","mida","insu"],
 note:"Sindrome extrapiramidale: antidoto biperidene.",
 ant:"Non vescicante."
},
{
 id:"halo", n:"Aloperidolo", s:"serenase haldol", c:"Antipsicotico tipico", cat:"neuro",
 prep:"Fiala 5 mg/mL, diluita in 10–50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"0,5–5 mg ev, ripetibili",
 tit:"Delirium iperattivo con rischio per la sicurezza: partire da 0,5–1 mg nell'anziano. ECG obbligatorio (QTc): sospendere se QTc >500 ms. Correggere prima potassio e magnesio. Non riduce la durata del delirium: prima le misure non farmacologiche (orientamento, sonno, mobilizzazione, rimozione dei presidi, gestione del dolore).",
 bolo:"0,5–5 mg ev lento.",
 ph:"3,0–3,8", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Lavare la via: incompatibile con eparina e furosemide.",
 inc:["epar","furo","*Foscarnet"], com:["nora","fent","mida"],
 note:"Via ev formalmente off-label in molte schede tecniche: seguire il protocollo aziendale.",
 ant:"Non vescicante."
},
{
 id:"leve", n:"Levetiracetam", s:"keppra", c:"Antiepilettico", cat:"neuro",
 prep:"500–1500 mg in 100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Carico 20–60 mg/kg, poi 500–1500 mg ogni 12 h",
 tit:"Infusione in 15 min. Aggiustare per funzione renale. Profilo di interazioni molto favorevole rispetto alla fenitoina.",
 bolo:"Infusione in 15 min.",
 ph:"5,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:[], com:["nora","epar","fent","mida"],
 note:"Prima scelta nelle crisi post-operatorie nel cardiochirurgico per l'assenza di effetti emodinamici.",
 ant:"Non vescicante."
},
{
 id:"fenit", n:"Fenitoina", s:"dintoina fenitoina sodica", c:"Antiepilettico classe Ib", cat:"neuro",
 prep:"Diluita ESCLUSIVAMENTE in NaCl 0,9% a ≤10 mg/mL, con filtro in linea 0,22 µm",
 solv:"ESCLUSIVAMENTE NaCl 0,9%. In glucosata precipita.",
 dose:"Carico 15–20 mg/kg, poi 100 mg ogni 6–8 h",
 tit:"Velocità massima 50 mg/min; nell'anziano e nel cardiopatico non superare 25 mg/min (ipotensione grave, bradicardia, asistolia). Monitoraggio ECG e PA continuo obbligatorio. Preferire la fosfenitoina se disponibile.",
 bolo:"Mai rapido: max 25–50 mg/min.",
 ph:"10,0–12,3 (fortemente alcalino)", osm:"≈290 (diluita)", ves:"alto",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:true,
 rub:"LINEA DEDICATA con lavaggio in NaCl 0,9% prima e dopo. Incompatibile con quasi tutti i farmaci e con tutte le soluzioni glucosate.",
 inc:["gluc","*quasi tutti","epar","insu","mida","fent","nora","dobu","vanc","line","lido","morf"],
 com:[],
 note:"Sindrome del guanto violaceo (purple glove syndrome): edema, discromia e dolore dell'arto anche senza stravaso franco. Vescicante ad alto rischio.",
 ant:"EMERGENZA. Stop, aspirazione, non lavare. Impacchi tiepidi, arto elevato, valutazione chirurgica precoce, monitoraggio neurovascolare prolungato."
}
,

/* ==================== VASOPRESSORI E INOTROPI (agg.) ==================== */
{
 id:"blume", n:"Blu di metilene (metiltioninio cloruro)", s:"metilene methylene blue vasoplegia", c:"Inibitore della guanilato ciclasi / NO sintasi", cat:"vaso",
 prep:"1% (10 mg/mL): 1–2 mg/kg diluiti in 50–100 mL G5%",
 solv:"G5% (preferita) o NaCl 0,9%",
 dose:"Bolo 1–2 mg/kg in 20–30 min; eventuale infusione 0,25–1 mg/kg/h per 4–6 h",
 tit:"Sindrome vasoplegica post-CEC refrattaria (fabbisogno elevato di noradrenalina con resistenze basse e portata conservata). Somministrare mai in meno di 20–30 min: il bolo rapido provoca ipertensione, aritmie, dolore precordiale e vasocostrizione polmonare. Dose cumulativa massima consigliata 7 mg/kg. La risposta attesa e' una riduzione del fabbisogno vasopressorio entro 1–2 h.",
 bolo:"1–2 mg/kg in 20–30 min. Mai in bolo rapido.",
 ph:"3,0–4,5", osm:"≈290 (diluito)", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:true,
 rub:"Linea o lume dedicato: dati di compatibilita' scarsi e colorante che maschera qualunque precipitato o torbidita' nella linea.",
 inc:["bica","*ossidanti e alcalini"], com:["nora"],
 note:"Colora urine, saliva, cute e mucose di blu-verde per 24–48 h. Interferisce con la pulsossimetria (SpO2 falsamente bassa per alcuni minuti) e con la co-ossimetria. Controindicato nel deficit di G6PD (emolisi) e nell'associazione con serotoninergici (SSRI, SNRI, IMAO: sindrome serotoninergica). Avvisare il paziente e documentare l'interferenza con il monitoraggio.",
 ant:"Irritante: stop, impacchi tiepidi. La colorazione tissutale locale puo' persistere a lungo."
},
{
 id:"glucag", n:"Glucagone", s:"glucagen glucagone", c:"Ormone iperglicemizzante / inotropo cAMP-mediato", cat:"vaso",
 prep:"Ricostituito 1 mg/mL; infusione 5–10 mg in 50 mL G5%",
 solv:"Acqua ppi fornita, poi G5%",
 dose:"Bolo 3–10 mg; infusione 3–5 mg/h",
 tit:"Antidoto funzionale nell'intossicazione da beta-bloccanti e calcioantagonisti: aumenta il cAMP intracellulare bypassando il recettore beta. Titolare su frequenza e pressione. Vomito quasi costante alle dosi elevate: protezione delle vie aeree. Iperglicemia e ipokaliemia attese.",
 bolo:"3–10 mg ev in 3–5 min (0,05–0,15 mg/kg).",
 ph:"2,5–3,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["bica"], com:["nora","adre"],
 note:"Le scorte ospedaliere sono spesso insufficienti per l'infusione prolungata: verificare la disponibilita' in farmacia all'inizio del trattamento.",
 ant:"Non vescicante."
},
{
 id:"etilef", n:"Etilefrina", s:"effortil", c:"Simpaticomimetico alfa/beta", cat:"vaso",
 prep:"Fiala 10 mg/mL diluita a 1 mg/mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Boli 1–5 mg; infusione 1–10 mg/h",
 tit:"Vasopressore di seconda linea per l'ipotensione transitoria; nel paziente critico e' preferibile un agente diretto titolabile.",
 bolo:"1–5 mg ev lenti.",
 ph:"3,0–5,0", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Bolo su via lavata.",
 inc:["bica"], com:["nora"],
 note:"Tachicardia e aritmie: uso limitato in cardiochirurgia.",
 ant:"Impacchi tiepidi."
},

/* ==================== VASODILATATORI E ANTIPERTENSIVI (agg.) ==================== */
{
 id:"dilt", n:"Diltiazem ev", s:"altiazem dilzene calcioantagonista non diidropiridinico", c:"Calcioantagonista non diidropiridinico", cat:"vdil",
 prep:"100 mg in 100 mL (1 mg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"Bolo 0,25 mg/kg in 2 min, eventuale secondo bolo 0,35 mg/kg dopo 15 min; infusione 5–15 mg/h",
 tit:"Controllo di frequenza nella FA/flutter post-operatorio con funzione sistolica conservata. Titolare di 2,5–5 mg/h ogni 15–30 min su frequenza target. CONTROINDICATO in disfunzione ventricolare sinistra significativa, scompenso acuto, blocco AV avanzato, sindrome di Wolff-Parkinson-White con FA preeccitata. Nel post-CEC valutare sempre l'inotropismo negativo prima di iniziare.",
 bolo:"0,25 mg/kg in 2 min.",
 ph:"3,7–4,1", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; non associare a furosemide e alcalini.",
 inc:["furo","bica","aciclo"], com:["nora","epar","ntg","fent","insu"],
 note:"Conservare la soluzione diluita in frigorifero se non usata subito (stabilita' limitata a 24 h).",
 ant:"Impacchi tiepidi."
},
{
 id:"verap", n:"Verapamil ev", s:"isoptin", c:"Calcioantagonista non diidropiridinico", cat:"vdil",
 prep:"Fiala 5 mg/2 mL, diluita in 10–20 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"2,5–5 mg ev in 2 min, ripetibili dopo 15–30 min (max 20–30 mg)",
 tit:"Alternativa al diltiazem, con inotropismo negativo maggiore. CONTROINDICATO in scompenso, disfunzione sistolica, blocco AV, tachicardia a complessi larghi di origine incerta, FA preeccitata e in associazione a beta-bloccanti ev (asistolia). Avere calcio cloruro pronto come antidoto.",
 bolo:"2,5–5 mg ev in 2 min.",
 ph:"4,0–6,5", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con sugammadex e alcalini.",
 inc:["suga","bica","*albumina"], com:["nora","epar"],
 note:"Il calcio ev antagonizza l'ipotensione senza annullare l'effetto sul nodo AV.",
 ant:"Impacchi tiepidi."
},
{
 id:"idral", n:"Idralazina / Diidralazina", s:"nepresol idralazina", c:"Vasodilatatore arteriolare diretto", cat:"vdil",
 prep:"Fiala 20–25 mg ricostituita e diluita",
 solv:"NaCl 0,9% (in glucosata la stabilita' e' ridotta)",
 dose:"Boli 5–10 mg ogni 20–30 min; infusione 2–20 mg/h",
 tit:"Latenza 10–20 min e durata 4–6 h: poco maneggevole nel paziente instabile. Tachicardia riflessa marcata e aumento della portata: nella dissecazione aortica va usata solo dopo beta-blocco adeguato. Utile nell'ipertensione in gravidanza e nel paziente con insufficienza renale.",
 bolo:"5–10 mg ev lenti.",
 ph:"3,4–4,4", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con glucosata secondo alcune fonti e con i furosemidi.",
 inc:["furo","*glucosate (stabilita')"], com:["nora","epar"],
 note:"Ritenzione idrosalina: spesso richiede associazione con diuretico.",
 ant:"Impacchi tiepidi."
},
{
 id:"enalap", n:"Enalaprilato", s:"enalaprilat ACE-inibitore ev", c:"ACE-inibitore endovenoso", cat:"vdil",
 prep:"Fiala 1,25 mg/mL diluita in 50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"0,625–1,25 mg ogni 6 h (max 5 mg/6 h)",
 tit:"Latenza 15 min, picco a 1–4 h: inadatto alla titolazione rapida. Controindicato in stenosi bilaterale delle arterie renali, iperkaliemia, gravidanza, angioedema pregresso. Nel post-CEC sorvegliare la funzione renale e il potassio.",
 bolo:"0,625–1,25 mg ev in 5 min.",
 ph:"6,5–7,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["amfb"], com:["nora","epar","insu"],
 note:"Prima dose ridotta nel paziente iponatriemico, ipovolemico o gia' in terapia diuretica.",
 ant:"Non vescicante."
},
{
 id:"fenol", n:"Fenoldopam", s:"corlopam DA-1", c:"Agonista dopaminergico DA-1", cat:"vdil",
 prep:"10 mg in 250 mL (40 mcg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"0,03–0,1 mcg/kg/min iniziali, fino a 0,5–1,6 mcg/kg/min",
 tit:"Incrementi di 0,05–0,1 mcg/kg/min ogni 15 min. Vasodilatazione con aumento del flusso renale e della natriuresi: studiato nella prevenzione del danno renale post-CEC con risultati non conclusivi. Nessuna ipertensione da rimbalzo alla sospensione. Controindicato nel glaucoma (aumento della pressione intraoculare).",
 bolo:"Non indicato.",
 ph:"2,8–3,8", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:false,
 rub:"Via lavata.",
 inc:["bica","*alcalini"], com:["nora","epar"],
 note:"Contiene metabisolfito: cautela negli asmatici. Ipokaliemia frequente: controllare il potassio ogni 6 h.",
 ant:"Impacchi tiepidi."
},
{
 id:"isdn", n:"Isosorbide dinitrato ev", s:"carvasin nitrosorbide ISDN", c:"Nitrato organico", cat:"vdil",
 prep:"50 mg in 50 mL (1 mg/mL)",
 solv:"NaCl 0,9% o G5%",
 dose:"2–10 mg/h",
 tit:"Alternativa alla nitroglicerina con durata leggermente superiore. Stessa logica di titolazione: incrementi di 1–2 mg/h ogni 10–15 min su pressione e sintomi. Tolleranza dopo 24–48 h.",
 bolo:"Non indicato.",
 ph:"4,0–6,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Compatibile con la maggior parte delle infusioni cardiologiche.",
 inc:["alte"], com:["nora","epar","furo","fent"],
 note:"Adsorbimento su PVC analogo a quello della nitroglicerina: usare set in polietilene.",
 ant:"Non vescicante."
},
{
 id:"silde", n:"Sildenafil", s:"revatio viagra PDE5", c:"Inibitore della fosfodiesterasi 5", cat:"vdil",
 prep:"Compresse 20 mg; fiala 10 mg/12,5 mL dove disponibile",
 solv:"Pronto all'uso",
 dose:"20 mg ogni 8 h per os / 10 mg ogni 8 h ev",
 tit:"Vasodilatatore polmonare: utile nel facilitare lo svezzamento dall'ossido nitrico inalatorio (iniziare 30–60 min prima della riduzione) e nell'ipertensione polmonare post-operatoria. Effetto sistemico ipotensivante: controindicato l'uso concomitante di nitrati.",
 bolo:"10 mg ev in 10 min dove disponibile la formulazione parenterale.",
 ph:"6,5–7,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:[], com:["nora","epar"],
 note:"Peggiora lo shunt intrapolmonare nel paziente con ARDS: valutare l'ossigenazione dopo l'introduzione.",
 ant:"Non vescicante."
},
{
 id:"epopr", n:"Epoprostenolo", s:"flolan veletri prostaciclina PGI2", c:"Prostaciclina sintetica", cat:"vdil",
 prep:"Ricostituito con il diluente alcalino specifico fornito (pH 10–12); inalatorio 10.000–20.000 ng/mL",
 solv:"ESCLUSIVAMENTE il diluente glicinico fornito dal produttore",
 dose:"Ev 2 ng/kg/min iniziali con incrementi di 1–2 ng/kg/min; inalatorio 10–50 ng/kg/min",
 tit:"Emivita 3–6 minuti: qualsiasi interruzione anche breve dell'infusione ev provoca ipertensione polmonare di rimbalzo e collasso. Avere sempre una seconda pompa e una siringa di riserva pronte. In cardiochirurgia si usa prevalentemente la via inalatoria continua tramite nebulizzatore in linea, che evita l'ipotensione sistemica e lo shunt.",
 bolo:"ASSOLUTAMENTE CONTROINDICATO.",
 ph:"10,0–12,0 (fortemente alcalino)", osm:"variabile", ves:"alto",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:true,
 rub:"LINEA DEDICATA ASSOLUTA. Il pH fortemente alcalino lo rende incompatibile con quasi tutti i farmaci. Nessun bolo, nessun lavaggio, nessuna aspirazione sulla via.",
 inc:["*quasi tutti i farmaci acidi"], com:[],
 note:"Effetto antiaggregante potente: sorvegliare il sanguinamento nel post-operatorio. Instabilita' termica: alcune formulazioni richiedono la sacca refrigerata.",
 ant:"pH >9: gestire come stravaso di soluzione fortemente alcalina, consulenza chirurgica precoce."
},

/* ==================== ANTIARITMICI (agg.) ==================== */
{
 id:"ibuti", n:"Ibutilide", s:"corvert", c:"Antiaritmico classe III", cat:"arit",
 prep:"1 mg in 50 mL NaCl 0,9% o G5%",
 solv:"NaCl 0,9% o G5%",
 dose:"1 mg in 10 min (0,01 mg/kg se peso <60 kg), ripetibile una volta dopo 10 min",
 tit:"Cardioversione farmacologica di FA e flutter atriale, particolarmente efficace sul flutter. Prerequisiti obbligatori: potassio >4,0 mEq/L, magnesio normale-alto, QTc <440 ms. Monitoraggio ECG continuo durante e per ALMENO 4 ORE dopo (fino a 8 h se QT prolungato): incidenza di torsione di punta del 3–8%. Solfato di magnesio e defibrillatore immediatamente disponibili.",
 bolo:"1 mg in 10 min. Interrompere se aritmia o QT >500 ms.",
 ph:"4,0–6,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; nessun altro farmaco QT-prolungante in corso.",
 inc:[], com:["nora","epar"],
 note:"Controindicata in disfunzione ventricolare severa, QT lungo, ipokaliemia, uso concomitante di antiaritmici classe I o III.",
 ant:"Non vescicante."
},
{
 id:"verna", n:"Vernakalant", s:"brinavess", c:"Antiaritmico atrio-selettivo", cat:"arit",
 prep:"Diluito a 4 mg/mL in NaCl 0,9%, G5% o Ringer lattato",
 solv:"NaCl 0,9%, G5% o Ringer lattato",
 dose:"3 mg/kg in 10 min; se non converte, 2 mg/kg in 10 min dopo 15 min di pausa",
 tit:"Cardioversione della FA di recente insorgenza (≤7 giorni; ≤3 giorni nel post-cardiochirurgico). Conversione tipicamente entro 10–12 min. CONTROINDICATO in: PAS <100 mmHg, scompenso NYHA III–IV, stenosi aortica severa, sindrome coronarica acuta nei 30 giorni precedenti, QT lungo, bradicardia severa. Monitoraggio emodinamico ed ECG continuo per almeno 2 h.",
 bolo:"3 mg/kg in 10 min.",
 ph:"5,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata, monitoraggio continuo.",
 inc:[], com:["nora","epar"],
 note:"Ipotensione transitoria nei primi minuti nel 5–10% dei casi; disgeusia e parestesie frequenti e benigne.",
 ant:"Non vescicante."
},
{
 id:"sotal", n:"Sotalolo ev", s:"sotalex", c:"Beta-bloccante con azione classe III", cat:"arit",
 prep:"Fiala 40 mg diluita in 50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"20–120 mg in 10–20 min, ripetibile ogni 6 h",
 tit:"Doppio effetto beta-bloccante e prolungante il potenziale d'azione. Monitorare QTc (sospendere se >500 ms) e potassio. Aggiustare per funzione renale (eliminazione renale pressoche' totale).",
 bolo:"Infusione lenta in almeno 10 min.",
 ph:"6,0–7,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["bica"], com:["nora","epar"],
 note:"Rischio proaritmico marcato nell'insufficienza renale e nell'ipokaliemia.",
 ant:"Non vescicante."
},
{
 id:"procain", n:"Procainamide", s:"pronestyl procainamide", c:"Antiaritmico classe Ia", cat:"arit",
 prep:"1 g in 50–100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Carico 10–17 mg/kg a 20–50 mg/min; mantenimento 1–4 mg/min",
 tit:"Farmaco di scelta nella FA preeccitata (WPW) e opzione nella TV monomorfa emodinamicamente tollerata (studio PROCAMIO, superiore ad amiodarone per conversione). Interrompere il carico se: conversione del ritmo, ipotensione, allargamento del QRS oltre il 50% del basale, dose totale raggiunta. Ridurre il mantenimento nell'insufficienza renale (accumulo del metabolita NAPA).",
 bolo:"Carico lento, mai oltre 50 mg/min.",
 ph:"4,0–6,0", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con milrinone.",
 inc:["milr","bica"], com:["nora","epar"],
 note:"Disponibilita' limitata in Italia: verificare la presenza in farmacia. Uso prolungato: sindrome lupus-simile.",
 ant:"Impacchi tiepidi."
},

/* ==================== SEDAZIONE E ANALGESIA (agg.) ==================== */
{
 id:"loraz", n:"Lorazepam", s:"tavor lorazepam", c:"Benzodiazepina a durata intermedia", cat:"sed",
 prep:"Fiala 4 mg/mL diluita almeno 1:1",
 solv:"NaCl 0,9% o G5% (diluizione obbligatoria)",
 dose:"Boli 0,5–2 mg; infusione 0,01–0,1 mg/kg/h",
 tit:"Emivita lunga e assenza di metaboliti attivi renali. L'infusione continua prolungata comporta accumulo del solvente glicole propilenico: sorvegliare acidosi metabolica con gap osmolare aumentato, insufficienza renale e iperlattacidemia. Nel post-cardiochirurgico e' preferito il midazolam o il propofol per la maggiore titolabilita'.",
 bolo:"0,5–2 mg ev lenti (max 2 mg/min).",
 ph:"6,0–7,0", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; adsorbimento su PVC significativo.",
 inc:["*numerosi","furo","bica"], com:["nora","epar","fent"],
 note:"Conservazione in frigorifero. Precipita se non diluito.",
 ant:"Il glicole propilenico e' irritante: impacchi tiepidi."
},
{
 id:"diaze", n:"Diazepam", s:"valium ansiolin", c:"Benzodiazepina a lunga durata", cat:"sed",
 prep:"Fiala 10 mg/2 mL, non diluire (precipita)",
 solv:"Somministrare non diluito, lentamente",
 dose:"Boli 2,5–10 mg",
 tit:"Emivita molto lunga con metaboliti attivi: sconsigliato nel critico e nell'anziano per il rischio di sedazione protratta e delirium. Solvente a base di glicole propilenico e alcol benzilico: flebite frequente.",
 bolo:"2,5–10 mg ev lenti (max 5 mg/min).",
 ph:"6,2–6,9", osm:"elevata (solvente organico)", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:true,
 rub:"Somministrare in vena di grosso calibro con lavaggio abbondante. Incompatibile con la quasi totalita' dei farmaci e adsorbito massicciamente da PVC.",
 inc:["*quasi tutti","epar","prpf","dexm","rocu","keta","esmo"], com:[],
 note:"Preferire midazolam o lorazepam in terapia intensiva.",
 ant:"Irritante: impacchi tiepidi."
},
{
 id:"etomi", n:"Etomidate", s:"hypnomidate etomidato", c:"Ipnotico imidazolico", cat:"sed",
 prep:"Fiala 20 mg/10 mL, pronta",
 solv:"Non diluire",
 dose:"Induzione 0,2–0,3 mg/kg",
 tit:"Il piu' stabile dal punto di vista emodinamico per l'induzione nel cardiopatico: minima riduzione della pressione e della portata. Anche la singola dose causa soppressione surrenalica per 24–48 h (inibizione della 11-beta-idrossilasi): valutare l'idrocortisone nel paziente settico o vasoplegico. Mioclonie all'induzione e dolore all'iniezione frequenti.",
 bolo:"0,2–0,3 mg/kg ev in 30–60 s.",
 ph:"6,0–8,1", osm:"elevata (glicole propilenico nelle formulazioni non lipidiche)", ves:"mod",
 cvc:"si", pvc:"cauto", picc:"si", mid:"cauto", ded:false,
 rub:"Bolo su vena di grosso calibro con lavaggio.",
 inc:["*numerosi"], com:["nora","fent"],
 note:"Nella lista INS 2024 figura tra gli infusati cautelativi. Non usare in infusione continua.",
 ant:"Impacchi tiepidi."
},
{
 id:"sevo", n:"Sevoflurano per sedazione inalatoria", s:"anaconda sedaconda sevorane isoflurano", c:"Anestetico alogenato per sedazione in TI", cat:"sed",
 prep:"Erogato con sistema riflettente in linea (AnaConDa / Sedaconda ACD) e siringa dedicata",
 solv:"Non applicabile",
 dose:"Titolato su MAC espiratoria 0,3–0,7% (indicativamente 3–10 mL/h di liquido)",
 tit:"Alternativa alla sedazione endovenosa: risveglio rapido e prevedibile, effetto broncodilatatore e precondizionamento miocardico. Titolare sulla concentrazione espiratoria monitorata e sul RASS. Richiede sistema di captazione dei gas, filtro dedicato e formazione specifica. Sorvegliare ipotensione dose-dipendente, aumento del fluoro inorganico e, raramente, ipertermia maligna.",
 bolo:"Non applicabile.",
 ph:"n.a.", osm:"n.a.", ves:"no",
 cvc:"no", pvc:"no", picc:"no", mid:"no", ded:false,
 rub:"Non applicabile: la siringa alimenta il dispositivo riflettente, non un accesso venoso.",
 inc:[], com:[],
 note:"Aumenta lo spazio morto strumentale (circa 100 mL): rivalutare la ventilazione dopo l'inserimento del dispositivo.",
 ant:"Non applicabile."
},
{
 id:"metad", n:"Metadone", s:"eptadone metadone", c:"Oppioide a lunga durata, antagonista NMDA", cat:"sed",
 prep:"Fiala 10 mg/mL, diluita",
 solv:"NaCl 0,9%",
 dose:"2,5–10 mg ogni 8–12 h",
 tit:"Utile nello svezzamento dagli oppioidi dopo infusioni prolungate e nella prevenzione dell'astinenza iatrogena. Emivita molto variabile (8–60 h): accumulo tardivo. Prolunga il QT in modo dose-dipendente: ECG basale e di controllo.",
 bolo:"2,5–5 mg ev lenti.",
 ph:"3,0–6,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["bica"], com:["nora","epar","fent"],
 note:"Le conversioni di dose dagli altri oppioidi non sono lineari: usare tabelle di equianalgesia validate e ridurre del 25–50%.",
 ant:"Non vescicante."
},
{
 id:"tram", n:"Tramadolo", s:"contramal fortradol", c:"Oppioide debole + inibitore del reuptake monoaminergico", cat:"sed",
 prep:"Fiala 100 mg diluita in 100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"50–100 mg ogni 6–8 h (max 400 mg/die)",
 tit:"Analgesico di secondo gradino nell'analgesia multimodale. Infondere in 15–30 min: il bolo rapido provoca nausea e vomito. Abbassa la soglia convulsiva e puo' causare sindrome serotoninergica in associazione a SSRI, SNRI e blu di metilene.",
 bolo:"Preferibile infusione in 15–30 min.",
 ph:"6,0–7,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*diclofenac","*indometacina"], com:["nora","epar","ondan"],
 note:"L'ondansetron ne riduce l'efficacia analgesica (antagonismo 5-HT3).",
 ant:"Non vescicante."
},
{
 id:"metam", n:"Metamizolo", s:"novalgina dipirone", c:"Analgesico-antipiretico pirazolonico", cat:"sed",
 prep:"Fiala 1 g/2 mL o 2,5 g/5 mL, diluita in 100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"1–2,5 g ogni 6–8 h (max 5 g/die)",
 tit:"Infondere in almeno 15 min: l'iniezione rapida provoca ipotensione grave, talora con collasso. Nel paziente vasoplegico post-CEC il rischio e' amplificato. Agranulocitosi idiosincrasica rara ma grave: sorvegliare l'emocromo nei trattamenti prolungati.",
 bolo:"Mai rapido: infusione in almeno 15 min.",
 ph:"6,0–8,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*numerosi"], com:["nora","epar"],
 note:"Buon effetto risparmiatore di oppioidi e spasmolitico; assenza di gastrolesivita' significativa rispetto ai FANS classici.",
 ant:"Non vescicante."
},
{
 id:"dexket", n:"Dexketoprofene", s:"enantyum keral", c:"FANS ev", cat:"sed",
 prep:"Fiala 50 mg diluita in 30–100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"50 mg ogni 8–12 h (max 150 mg/die, max 2 giorni ev)",
 tit:"Come per il ketorolac, l'uso nel post-cardiochirurgico va valutato caso per caso: rischio emorragico, nefrotossicita' post-CEC e possibile interferenza con la guarigione sternale. Infondere in 10–30 min.",
 bolo:"Infusione in 10–30 min.",
 ph:"6,0–7,5", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; non associare a farmaci acidi o a soluzioni contenenti eparina secondo scheda tecnica.",
 inc:["epar","prpf"], com:["nora"],
 note:"Controindicato in insufficienza renale, sanguinamento attivo, ulcera peptica, scompenso.",
 ant:"Impacchi tiepidi."
},

/* ==================== BLOCCANTI NEUROMUSCOLARI (agg.) ==================== */
{
 id:"atrac", n:"Atracurio", s:"tracrium atracurium", c:"Bloccante neuromuscolare benzilisochinolinico", cat:"nmb",
 prep:"Fiala 50 mg/5 mL; infusione 500 mg in 50 mL",
 solv:"NaCl 0,9% (in glucosata la stabilita' e' ridotta a poche ore)",
 dose:"5–10 mcg/kg/min (0,3–0,6 mg/kg/h)",
 tit:"Eliminazione di Hofmann come il cisatracurio, ma con maggiore rilascio di istamina (ipotensione, broncospasmo, eritema): nel paziente emodinamicamente fragile preferire il cisatracurio. Titolare su TOF 1–2/4.",
 bolo:"0,4–0,5 mg/kg.",
 ph:"3,0–3,8", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Non associare a soluzioni alcaline e a propofol nella stessa via.",
 inc:["prpf","bica","tiop","*alcalini"], com:["nora","fent","mida","epar"],
 note:"Conservazione a 2–8 °C.",
 ant:"Impacchi tiepidi."
},
{
 id:"vecur", n:"Vecuronio", s:"norcuron vecuronium", c:"Bloccante neuromuscolare aminosteroideo", cat:"nmb",
 prep:"Fiala 10 mg liofilizzata, ricostituita; infusione 100 mg in 50 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"0,8–1,7 mcg/kg/min (0,05–0,1 mg/kg/h)",
 tit:"Accumulo del metabolita 3-desacetil nell'insufficienza renale ed epatica con blocco prolungato: nel paziente critico preferire il cisatracurio. Antagonizzabile con sugammadex.",
 bolo:"0,08–0,1 mg/kg.",
 ph:"3,5–4,5", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con alcalini.",
 inc:["bica","tiop","furo","*alcalini"], com:["nora","fent","prpf","epar"],
 note:"Stabile 24 h dopo la ricostituzione.",
 ant:"Impacchi tiepidi."
},
{
 id:"pancu", n:"Pancuronio", s:"pavulon pancuronium", c:"Bloccante neuromuscolare aminosteroideo a lunga durata", cat:"nmb",
 prep:"Fiala 4 mg/2 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Boli 0,04–0,1 mg/kg ogni 60–90 min",
 tit:"Durata lunga ed effetto vagolitico con tachicardia e ipertensione. Accumulo marcato nell'insufficienza renale. Uso residuale in terapia intensiva.",
 bolo:"0,04–0,1 mg/kg.",
 ph:"3,8–4,2", osm:"≈290", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["bica","tiop"], com:["nora","fent","epar"],
 note:"La tachicardia indotta e' mal tollerata nel cardiopatico ischemico.",
 ant:"Impacchi tiepidi."
},

/* ==================== NEUROLOGICI E ANTIEPILETTICI ==================== */
{
 id:"feno", n:"Fenobarbitale", s:"gardenale luminale fenobarbital", c:"Barbiturico antiepilettico", cat:"neuro",
 prep:"Fiala 100–200 mg diluita in 50–100 mL",
 solv:"NaCl 0,9%",
 dose:"Carico 15–20 mg/kg a max 50–100 mg/min; mantenimento 1–3 mg/kg/die",
 tit:"Terza linea nello stato di male. Ipotensione e depressione respiratoria dose-dipendenti: prevedere supporto ventilatorio e vasopressore. Emivita molto lunga (50–120 h).",
 bolo:"Carico lento, monitoraggio emodinamico continuo.",
 ph:"8,5–10,5 (alcalino)", osm:"elevata (glicole propilenico)", ves:"alto",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:true,
 rub:"Linea dedicata: incompatibile con la maggior parte dei farmaci acidi.",
 inc:["*quasi tutti gli acidi","mida","nora","vanc","insu"], com:[],
 note:"Vescicante a rischio moderato nella lista INS 2024. Potente induttore enzimatico: numerose interazioni.",
 ant:"Stravaso: gestire come soluzione alcalina, consulenza chirurgica se stadio avanzato."
},
{
 id:"valpr", n:"Acido valproico ev", s:"depakin valproato", c:"Antiepilettico ad ampio spettro", cat:"neuro",
 prep:"Fiala 400 mg ricostituita, diluita in 50–100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Carico 20–40 mg/kg in 5–10 min; mantenimento 1–2 mg/kg/h",
 tit:"Alternativa nello stato di male con buona stabilita' emodinamica. Sorvegliare iperammoniemia (encefalopatia), epatotossicita', piastrinopenia e disfunzione piastrinica: nel post-cardiochirurgico il rischio emorragico va soppesato.",
 bolo:"Carico in 5–10 min.",
 ph:"7,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*numerosi"], com:["nora","epar"],
 note:"Il meropenem riduce drasticamente i livelli di valproato: associazione da evitare.",
 ant:"Non vescicante."
},
{
 id:"lacos", n:"Lacosamide", s:"vimpat", c:"Antiepilettico, modulatore lento dei canali del sodio", cat:"neuro",
 prep:"Fiala 200 mg/20 mL, diluibile",
 solv:"NaCl 0,9%, G5% o Ringer lattato",
 dose:"Carico 200–400 mg in 15 min; mantenimento 200 mg ogni 12 h",
 tit:"Buona tollerabilita' emodinamica, ma allunga il PR: cautela nei disturbi di conduzione, frequenti nel post-cardiochirurgico. ECG prima e dopo il carico nel paziente con blocco AV di I grado o pacing.",
 bolo:"Carico in 15 min.",
 ph:"3,8–5,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:[], com:["nora","epar","fent"],
 note:"Aggiustare per funzione renale ed emodialisi.",
 ant:"Non vescicante."
},
{
 id:"nimod", n:"Nimodipina", s:"nimotop", c:"Calcioantagonista diidropiridinico neuroselettivo", cat:"neuro",
 prep:"Flacone 10 mg/50 mL pronto (0,2 mg/mL) — richiede set in polietilene o polipropilene",
 solv:"Somministrare tramite raccordo a Y con soluzione di trasporto (NaCl 0,9% o G5%) a 40 mL/h",
 dose:"1 mg/h per 2 h, poi 2 mg/h (0,5 mg/h se peso <70 kg o ipotensione)",
 tit:"Prevenzione del vasospasmo nell'emorragia subaracnoidea; nel post-cardiochirurgico l'indicazione e' rara. Titolare su pressione: ipotensione frequente. La forma orale e' equivalente e preferita se la via enterale e' disponibile.",
 bolo:"Controindicato.",
 ph:"6,0–7,0", osm:"elevata (contiene etanolo e glicole polietilenico)", ves:"mod",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:true,
 rub:"Linea dedicata con set privo di PVC (adsorbimento massivo) e protezione dalla luce.",
 inc:["*quasi tutti"], com:[],
 note:"Il solvente attacca il PVC: usare esclusivamente i set forniti dal produttore.",
 ant:"Irritante per il contenuto alcolico: impacchi tiepidi."
},
{
 id:"quetia", n:"Quetiapina (os)", s:"seroquel", c:"Antipsicotico atipico", cat:"neuro",
 prep:"Compresse 25–100 mg (anche per sondino se a rilascio immediato)",
 solv:"Via orale/enterale",
 dose:"12,5–50 mg ogni 12 h, titolabile",
 tit:"Opzione nel delirium iperattivo persistente quando le misure non farmacologiche non bastano, con minor rischio extrapiramidale rispetto all'aloperidolo. Sorvegliare QTc, sedazione e ipotensione ortostatica. Rivalutare quotidianamente la necessita' e sospendere prima della dimissione dalla terapia intensiva.",
 bolo:"Non applicabile.",
 ph:"n.a.", osm:"n.a.", ves:"no",
 cvc:"no", pvc:"no", picc:"no", mid:"no", ded:false,
 rub:"Non applicabile.",
 inc:[], com:[],
 note:"Nessun antipsicotico ha dimostrato di ridurre la durata del delirium: la priorita' resta il bundle ABCDEF.",
 ant:"Non applicabile."
},
{
 id:"melat", n:"Melatonina / Ramelteon (os)", s:"melatonina circadin", c:"Cronobiotico", cat:"neuro",
 prep:"Compresse 2–5 mg",
 solv:"Via orale/enterale",
 dose:"2–5 mg alle ore 21–22",
 tit:"Misura di igiene del sonno all'interno del bundle di prevenzione del delirium, insieme a riduzione del rumore e della luce notturna, mobilizzazione precoce e riorientamento.",
 bolo:"Non applicabile.",
 ph:"n.a.", osm:"n.a.", ves:"no",
 cvc:"no", pvc:"no", picc:"no", mid:"no", ded:false,
 rub:"Non applicabile.",
 inc:[], com:[],
 note:"Profilo di sicurezza favorevole; evidenza di efficacia modesta ma il rapporto rischio-beneficio e' vantaggioso.",
 ant:"Non applicabile."
},

/* ==================== EMOSTASI E ANTICOAGULAZIONE (agg.) ==================== */
{
 id:"enoxap", n:"Enoxaparina", s:"clexane eparina basso peso molecolare EBPM LMWH", c:"Eparina a basso peso molecolare", cat:"coag",
 prep:"Siringhe preriempite 2000–10.000 UI",
 solv:"Somministrazione sottocutanea",
 dose:"Profilassi 4000 UI/die (2000 se GFR <30 o peso basso); terapia 100 UI/kg ogni 12 h",
 tit:"Nel post-cardiochirurgico avviare la profilassi quando il drenaggio si e' ridotto e l'emostasi e' consolidata, secondo protocollo. Aggiustare per clearance renale (GFR <30: dose dimezzata o passaggio a eparina non frazionata). Monitoraggio con anti-Xa nel paziente obeso, in insufficienza renale o in gravidanza (picco a 4 h).",
 bolo:"Non per via endovenosa nella pratica corrente di terapia intensiva.",
 ph:"5,5–7,5", osm:"≈290", ves:"no",
 cvc:"no", pvc:"no", picc:"no", mid:"no", ded:false,
 rub:"Via sottocutanea: non miscelare con altri farmaci nella stessa siringa.",
 inc:[], com:[],
 note:"Neutralizzazione solo parziale da protamina (circa 60%). Sospendere 12–24 h prima delle procedure neurassiali.",
 ant:"Ematoma nel sito di iniezione: non massaggiare."
},
{
 id:"fonda", n:"Fondaparinux", s:"arixtra", c:"Inibitore selettivo del fattore Xa", cat:"coag",
 prep:"Siringhe preriempite 2,5–7,5 mg",
 solv:"Somministrazione sottocutanea",
 dose:"Profilassi 2,5 mg/die; terapia 5–10 mg/die secondo peso",
 tit:"Opzione nella HIT senza trombosi acuta. Emivita 17–21 h ed eliminazione renale: controindicato se GFR <20–30. Nessun antidoto efficace.",
 bolo:"Non applicabile.",
 ph:"5,0–8,0", osm:"≈290", ves:"no",
 cvc:"no", pvc:"no", picc:"no", mid:"no", ded:false,
 rub:"Via sottocutanea.",
 inc:[], com:[],
 note:"Non neutralizzato dalla protamina.",
 ant:"Ematoma locale."
},
{
 id:"vitk", n:"Fitomenadione (vitamina K1)", s:"konakion vitamina K", c:"Vitamina liposolubile / antidoto AVK", cat:"coag",
 prep:"Fiala 10 mg diluita in 50–100 mL",
 solv:"G5% (preferita)",
 dose:"1–10 mg secondo INR e gravita' del sanguinamento",
 tit:"Infondere in almeno 20–30 min: la somministrazione rapida e' associata a reazioni anafilattoidi con collasso cardiovascolare. Effetto sull'INR in 6–12 h: nel sanguinamento maggiore va sempre associato il concentrato di complesso protrombinico, che agisce in pochi minuti.",
 bolo:"Mai rapido: infusione in 20–30 min.",
 ph:"5,0–7,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; proteggere dalla luce.",
 inc:["*numerosi"], com:["nora","epar"],
 note:"Dosi elevate rendono difficile la ri-anticoagulazione con warfarin per giorni.",
 ant:"Non vescicante."
},
{
 id:"idaruc", n:"Idarucizumab", s:"praxbind", c:"Anticorpo monoclonale antidoto del dabigatran", cat:"coag",
 prep:"Due flaconi da 2,5 g/50 mL, pronti",
 solv:"Non diluire",
 dose:"5 g totali (2 flaconi consecutivi)",
 tit:"Infusione dei due flaconi in successione, ciascuno in 5–10 min, oppure in bolo. Effetto immediato e completo sull'attivita' del dabigatran. Rimbalzo possibile dopo 12–24 h nei pazienti con funzione renale compromessa: rivalutare aPTT e tempo di trombina.",
 bolo:"5 g in bolo o in due infusioni rapide consecutive.",
 ph:"5,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Linea lavata e priva di altri farmaci: nessuna miscelazione ammessa.",
 inc:["*tutti"], com:[],
 note:"Indicato prima della cardiochirurgia in urgenza nel paziente in dabigatran.",
 ant:"Non vescicante."
},
{
 id:"andex", n:"Andexanet alfa", s:"ondexxya", c:"Antidoto degli inibitori del fattore Xa", cat:"coag",
 prep:"Ricostituito secondo protocollo dose bassa/alta",
 solv:"NaCl 0,9%",
 dose:"Bolo 400 o 800 mg a 30 mg/min, poi infusione 4 o 8 mg/min per 120 min",
 tit:"Reversione di apixaban e rivaroxaban nel sanguinamento maggiore. Interferisce con il monitoraggio dell'eparina (lega l'antitrombina): la CEC dopo andexanet e' problematica per resistenza all'eparina, segnalata anche con necessita' di eparina ad alte dosi o di anticoagulanti alternativi. Informare sempre il perfusionista e l'anestesista.",
 bolo:"400–800 mg a 30 mg/min.",
 ph:"7,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Linea dedicata.",
 inc:["*tutti"], com:[],
 note:"Eventi trombotici nel 10% circa: riprendere l'anticoagulazione appena clinicamente possibile.",
 ant:"Non vescicante."
},
{
 id:"rfviia", n:"Fattore VII attivato ricombinante", s:"novoseven rFVIIa", c:"Fattore procoagulante ricombinante", cat:"coag",
 prep:"Ricostituito con il solvente fornito",
 solv:"Solvente specifico del produttore",
 dose:"Off-label nel sanguinamento post-CEC refrattario: 30–90 mcg/kg",
 tit:"Ultima risorsa nel sanguinamento incoercibile dopo che sono stati corretti temperatura, pH, calcio ionizzato, fibrinogeno, piastrine e residuo eparinico. Rischio trombotico significativo (trombosi di graft e protesi valvolari). Decisione sempre collegiale con chirurgo e anestesista.",
 bolo:"Bolo lento in 2–5 min.",
 ph:"5,5–6,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Linea dedicata; nessun farmaco in Y.",
 inc:["*tutti"], com:[],
 note:"Efficacia condizionata da fibrinogeno >1,5 g/L, piastrine >50.000, calcio ionizzato normale, pH >7,2, temperatura >35 °C.",
 ant:"Non vescicante."
},
{
 id:"cangr", n:"Cangrelor", s:"kengrexal", c:"Antagonista P2Y12 endovenoso reversibile", cat:"coag",
 prep:"50 mg ricostituiti e diluiti in 250 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Bolo 30 mcg/kg, poi 4 mcg/kg/min (bridge peri-operatorio: 0,75 mcg/kg/min)",
 tit:"Utilizzato come ponte antiaggregante nel paziente con stent recente che deve sospendere gli inibitori P2Y12 orali prima della cardiochirurgia. Emivita 3–6 min: la funzione piastrinica si normalizza entro 60 min dalla sospensione, che va programmata 1–6 h prima dell'incisione secondo protocollo. Non somministrare clopidogrel o prasugrel durante l'infusione (antagonismo competitivo).",
 bolo:"30 mcg/kg in ambito interventistico.",
 ph:"7,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; preferibile lume separato per la precisione del dosaggio.",
 inc:["*dati limitati"], com:["nora","epar"],
 note:"Sostituire la sacca ogni 12 h.",
 ant:"Non vescicante."
},
{
 id:"tirof", n:"Tirofiban", s:"aggrastat", c:"Inibitore della glicoproteina IIb/IIIa", cat:"coag",
 prep:"Sacca pronta 50 mcg/mL",
 solv:"Pronto all'uso",
 dose:"Carico 25 mcg/kg in 3 min, poi 0,15 mcg/kg/min (0,075 se GFR <30)",
 tit:"Antiaggregazione potente e reversibile in 4–8 h. Sorvegliare piastrinopenia acuta (controllo emocromo a 2–6 h) e sanguinamento. Nel post-cardiochirurgico l'uso e' eccezionale.",
 bolo:"Carico 25 mcg/kg in 3 min.",
 ph:"5,5–6,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; non associare a diazepam.",
 inc:["diaze"], com:["nora","epar","ntg"],
 note:"Sospendere almeno 4 h prima di procedure invasive maggiori.",
 ant:"Non vescicante."
},
{
 id:"asaev", n:"Acido acetilsalicilico ev", s:"aspegic flectadol cardioaspirina lisina acetilsalicilato", c:"Antiaggregante / analgesico", cat:"coag",
 prep:"Fiala 500 mg ricostituita",
 solv:"Solvente fornito o NaCl 0,9%",
 dose:"Antiaggregante 100–325 mg; analgesico-antipiretico 500–1000 mg",
 tit:"Nel post-CABG la ripresa dell'aspirina entro 6–24 h dall'intervento, a emostasi consolidata, migliora la pervieta' dei graft. Via endovenosa utile finche' la via enterale non e' disponibile.",
 bolo:"Infusione lenta in 3–5 min.",
 ph:"5,0–6,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*numerosi"], com:["nora","epar"],
 note:"Verificare drenaggi e conta piastrinica prima della ripresa.",
 ant:"Non vescicante."
},
{
 id:"eaca", n:"Acido epsilon-aminocaproico", s:"EACA amicar caproico", c:"Antifibrinolitico", cat:"coag",
 prep:"Carico 50–100 mg/kg in 100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"Carico 50–100 mg/kg in 20–30 min, poi 15–30 mg/kg/h",
 tit:"Alternativa all'acido tranexamico in CEC dove disponibile. Stesse cautele: aggiustamento renale, sorveglianza neurologica per il rischio convulsivo alle dosi elevate.",
 bolo:"Carico in almeno 20–30 min (l'infusione rapida causa ipotensione e bradicardia).",
 ph:"6,0–7,6", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*emoderivati"], com:["nora","epar"],
 note:"Disponibilita' variabile in Italia.",
 ant:"Non vescicante."
},
{
 id:"aprot", n:"Aprotinina", s:"trasylol", c:"Inibitore delle proteasi seriniche", cat:"coag",
 prep:"Secondo schema di Hammersmith (carico + priming + mantenimento)",
 solv:"NaCl 0,9%",
 dose:"Secondo protocollo di CEC",
 tit:"Reintrodotta in Europa con indicazione ristretta alla cardiochirurgia ad alto rischio emorragico, con registro obbligatorio. Dose test obbligatoria per il rischio anafilattico, particolarmente elevato in caso di ri-esposizione entro 12 mesi.",
 bolo:"Dose test 1 mL con osservazione di 10 min prima del carico.",
 ph:"5,0–7,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:true,
 rub:"Linea dedicata: incompatibile con eparina e corticosteroidi.",
 inc:["epar","*corticosteroidi"], com:[],
 note:"Sorvegliare la funzione renale post-operatoria.",
 ant:"Non vescicante."
},

/* ==================== EMOCOMPONENTI ED EMODERIVATI ==================== */
{
 id:"emazie", n:"Concentrato eritrocitario", s:"emazie sangue trasfusione globuli rossi CE", c:"Emocomponente", cat:"emoc",
 prep:"Unita' da circa 250–300 mL, deflussore con filtro 170–200 µm",
 solv:"ESCLUSIVAMENTE NaCl 0,9%. Mai Ringer lattato (il calcio innesca la coagulazione), mai glucosata (emolisi).",
 dose:"Soglia restrittiva post-cardiochirurgica: Hb 7,5–8 g/dL (7 nel paziente stabile), individualizzata su ischemia, sanguinamento e ScvO₂",
 tit:"Prima 15 minuti a bassa velocita' con sorveglianza continua, poi completare entro 4 h dall'uscita dall'emoteca. Doppio controllo di identita' e compatibilita' al letto del paziente. Sorvegliare TRALI, TACO, reazioni emolitiche e febbrili, iperkaliemia e ipocalcemia da citrato nelle trasfusioni massive.",
 bolo:"Non applicabile.",
 ph:"6,5–7,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"LINEA DEDICATA. Nessun farmaco in Y. Lavare con 20 mL di NaCl 0,9% prima e dopo. Nella trasfusione massiva prevedere calcio e riscaldatore.",
 inc:["*tutti i farmaci","ringer","gluc5"], com:[],
 note:"Nella trasfusione massiva applicare il protocollo aziendale con rapporti bilanciati di plasma e piastrine e monitoraggio viscoelastico (ROTEM/TEG).",
 ant:"Stravaso: interrompere, ghiaccio non indicato; sorveglianza."
},
{
 id:"plasma", n:"Plasma fresco congelato", s:"PFC plasma FFP", c:"Emocomponente", cat:"emoc",
 prep:"Unita' scongelata a 37 °C, da usare entro 4–6 h",
 solv:"Nessuna diluizione",
 dose:"10–15 mL/kg quando indicato",
 tit:"Nel sanguinamento post-CEC il plasma va guidato dal test viscoelastico o dai test coagulativi, non somministrato per profilassi. Il concentrato di fattori e il fibrinogeno sono spesso preferibili per volume e rapidita'.",
 bolo:"Non applicabile.",
 ph:"7,0–7,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Linea dedicata con filtro; nessun farmaco in Y.",
 inc:["*tutti i farmaci"], com:[],
 note:"Rischio di TACO nel paziente con disfunzione ventricolare: valutare velocita' e diuretico.",
 ant:"Non vescicante."
},
{
 id:"piastr", n:"Concentrato piastrinico", s:"piastrine PLT aferesi", c:"Emocomponente", cat:"emoc",
 prep:"Unita' da aferesi o pool; deflussore dedicato con filtro",
 solv:"Nessuna diluizione",
 dose:"1 dose terapeutica; soglia in cardiochirurgia con sanguinamento attivo: piastrine <50–100 x10⁹/L o disfunzione piastrinica documentata",
 tit:"Non refrigerare: conservare a temperatura ambiente in agitazione fino alla trasfusione, infondere rapidamente (20–30 min). Indicazione frequente nel post-CEC per disfunzione piastrinica da circolazione extracorporea o da antiaggreganti, anche a conta normale.",
 bolo:"Non applicabile.",
 ph:"6,8–7,4", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Linea dedicata; mai lo stesso set usato per le emazie.",
 inc:["*tutti i farmaci"], com:[],
 note:"Nel paziente in terapia con ticagrelor l'efficacia trasfusionale e' ridotta (farmaco reversibile circolante).",
 ant:"Non vescicante."
},
{
 id:"crio", n:"Crioprecipitato", s:"crioprecipitato cryo", c:"Emocomponente ricco di fibrinogeno e fattore VIII/vWF", cat:"emoc",
 prep:"Pool scongelato, da usare entro 4 h",
 solv:"Nessuna diluizione",
 dose:"Secondo fibrinogenemia e protocollo",
 tit:"Alternativa al fibrinogeno concentrato dove quest'ultimo non e' disponibile. Target fibrinogeno >1,5–2 g/L nel sanguinamento post-CEC.",
 bolo:"Non applicabile.",
 ph:"7,0–7,4", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Linea dedicata con filtro.",
 inc:["*tutti i farmaci"], com:[],
 note:"Il fibrinogeno concentrato offre dosaggio standardizzato e minore volume.",
 ant:"Non vescicante."
},
{
 id:"gelat", n:"Colloidi sintetici (gelatine)", s:"gelatina emagel geloplasma colloidi", c:"Espansore plasmatico sintetico", cat:"emoc",
 prep:"Sacca pronta",
 solv:"Pronto all'uso",
 dose:"Secondo necessita' volemica, con dose massima giornaliera da scheda tecnica",
 tit:"Uso in netto declino: gli amidi idrossietilici sono controindicati nel paziente critico (danno renale e mortalita'); le gelatine hanno evidenza limitata e rischio anafilattico. Nel post-CEC la rianimazione volemica di prima linea resta il cristalloide bilanciato.",
 bolo:"250–500 mL secondo risposta emodinamica.",
 ph:"7,1–7,7", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; interferisce con la determinazione del gruppo sanguigno se il prelievo e' contaminato.",
 inc:["*emoderivati"], com:["nora"],
 note:"Interferenza con i test viscoelastici e la crossmatch: prelevare prima dell'infusione.",
 ant:"Non vescicante."
},

/* ==================== ANTIDOTI E CHELANTI ==================== */
{
 id:"fentol", n:"Fentolamina", s:"regitina phentolamine antidoto stravaso", c:"Alfa-bloccante non selettivo", cat:"antid",
 prep:"5–10 mg diluiti in 10–15 mL di NaCl 0,9% per l'infiltrazione locale",
 solv:"NaCl 0,9%",
 dose:"Stravaso di vasocostrittori: 5–10 mg infiltrati per via sottocutanea. Crisi adrenergica: 1–5 mg ev ripetibili.",
 tit:"ANTIDOTO DI PRIMA LINEA nello stravaso di noradrenalina, adrenalina, dopamina, fenilefrina e vasopressina. Infiltrare in 5 aliquote nell'area interessata e nei margini con ago sottile, entro 12 h e idealmente entro la prima ora. Il segno di efficacia e' il ritorno immediato del colorito e del calore cutaneo. Sorvegliare l'ipotensione sistemica.",
 bolo:"1–5 mg ev nella crisi ipertensiva da catecolamine.",
 ph:"4,0–6,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Per lo stravaso la via e' sottocutanea perilesionale, non endovenosa.",
 inc:[], com:["nora"],
 note:"Deve essere immediatamente disponibile in ogni terapia intensiva che infonde vasopressori in periferica, insieme al protocollo scritto. Alternativa topica: nitroglicerina pomata 2%.",
 ant:"Non applicabile."
},
{
 id:"ialuro", n:"Ialuronidasi", s:"hyaluronidase ialuronidasi antidoto stravaso", c:"Enzima che depolimerizza l'acido ialuronico", cat:"antid",
 prep:"150 UI diluite in 1–3 mL di NaCl 0,9%",
 solv:"NaCl 0,9%",
 dose:"150 UI infiltrate in 5 aliquote perilesionali",
 tit:"Indicata nello stravaso di soluzioni iperosmolari e irritanti: calcio, potassio concentrato, glucosata ipertonica, nutrizione parenterale, mezzo di contrasto, mannitolo, alcuni antibiotici. NON usare per lo stravaso di vasocostrittori, dove l'antidoto e' la fentolamina. Efficacia massima entro 1 h.",
 bolo:"Infiltrazione sottocutanea perilesionale.",
 ph:"6,4–7,4", osm:"≈290", ves:"no",
 cvc:"no", pvc:"no", picc:"no", mid:"no", ded:false,
 rub:"Via sottocutanea perilesionale, oppure attraverso il catetere ancora in sede se lo stadio lo consente.",
 inc:[], com:[],
 note:"Facilita la dispersione e il riassorbimento del liquido stravasato riducendo la concentrazione tissutale locale.",
 ant:"Non applicabile."
},
{
 id:"idrocob", n:"Idrossocobalamina", s:"cyanokit vitamina B12a antidoto cianuro", c:"Antidoto del cianuro / scavenger di NO", cat:"antid",
 prep:"5 g ricostituiti in 200 mL di NaCl 0,9%",
 solv:"NaCl 0,9%",
 dose:"5 g in 15 min, ripetibili fino a 10 g",
 tit:"Antidoto dell'intossicazione da cianuro, inclusa quella da nitroprussiato ad alte dosi o prolungato. Usata anche off-label nella vasoplegia refrattaria post-CEC come scavenger dell'ossido nitrico, con logica simile al blu di metilene.",
 bolo:"5 g in 15 min.",
 ph:"3,5–7,0", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:true,
 rub:"Linea dedicata: incompatibile con numerosi farmaci e con gli emocomponenti.",
 inc:["*numerosi","tiosolf","*emoderivati"], com:[],
 note:"Colora cute, mucose e urine di rosso intenso per giorni e interferisce con molte determinazioni di laboratorio colorimetriche (bilirubina, creatinina, magnesio) e con l'emodialisi (rilevatore di perdita ematica). Documentare e avvisare il laboratorio.",
 ant:"Impacchi tiepidi."
},
{
 id:"tiosolf", n:"Sodio tiosolfato", s:"tiosolfato antidoto cianuro", c:"Donatore di zolfo (antidoto del cianuro)", cat:"antid",
 prep:"Fiala al 25% o al 10%",
 solv:"NaCl 0,9% o G5%",
 dose:"150 mg/kg (circa 12,5 g nell'adulto) in 10–15 min",
 tit:"Associato o alternativo all'idrossocobalamina nell'intossicazione da cianuro; usato anche in profilassi durante infusioni prolungate di nitroprussiato.",
 bolo:"12,5 g in 10–15 min.",
 ph:"6,0–9,5", osm:"elevata (soluzione concentrata)", ves:"cauto",
 cvc:"si", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Non somministrare nella stessa via dell'idrossocobalamina: incompatibilita' documentata.",
 inc:["idrocob"], com:[],
 note:"Nausea e ipotensione se infuso rapidamente.",
 ant:"Impacchi tiepidi."
},
{
 id:"digifab", n:"Frammenti Fab anti-digossina", s:"digifab digibind antidoto digossina", c:"Anticorpi antidigossina", cat:"antid",
 prep:"Flaconi ricostituiti e diluiti in 100 mL NaCl 0,9%",
 solv:"NaCl 0,9%",
 dose:"Secondo digossinemia e dose ingerita; empiricamente 5–10 flaconi nell'intossicazione acuta pericolosa",
 tit:"Indicazioni: aritmie ventricolari, bradiaritmie refrattarie, iperkaliemia >5–5,5 mEq/L in intossicazione acuta. Infusione in 30 min con filtro 0,22 µm. Dopo la somministrazione la digossinemia totale diventa inutilizzabile per giorni.",
 bolo:"Nell'arresto: bolo rapido.",
 ph:"6,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Linea dedicata con filtro.",
 inc:["*tutti"], com:[],
 note:"Non trattare l'iperkaliemia da digitale con il calcio (rischio teorico di cuore di pietra: la letteratura recente lo ridimensiona ma la prudenza resta).",
 ant:"Non vescicante."
},
{
 id:"biperi", n:"Biperidene", s:"akineton antidoto distonia", c:"Anticolinergico centrale", cat:"antid",
 prep:"Fiala 5 mg/mL",
 solv:"NaCl 0,9%",
 dose:"2,5–5 mg ev lenti, ripetibili",
 tit:"Antidoto delle reazioni distoniche acute da metoclopramide, aloperidolo e altri antidopaminergici. Effetto in pochi minuti.",
 bolo:"2,5–5 mg ev in 2–3 min.",
 ph:"4,5–5,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Bolo su via lavata.",
 inc:[], com:["nora","epar"],
 note:"Puo' aggravare il delirium anticolinergico nell'anziano: dose minima efficace.",
 ant:"Non vescicante."
},

/* ==================== ANTIMICROBICI (agg.) ==================== */
{
 id:"cefep", n:"Cefepime", s:"maxipime", c:"Cefalosporina di 4ª generazione", cat:"anti",
 prep:"2 g in 100 mL; infusione estesa 3 h", solv:"NaCl 0,9% o G5%",
 dose:"2 g ogni 8–12 h",
 tit:"Infusione estesa raccomandata nel critico. Neurotossicita' dose-dipendente (encefalopatia, mioclonie, stato di male non convulsivo) soprattutto se non si aggiusta per funzione renale: sospettarla in ogni alterazione della coscienza inspiegata.",
 bolo:"Non indicato.",
 ph:"4,0–6,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con vancomicina e metronidazolo secondo alcune fonti.",
 inc:["vanc","amino","metro"], com:["nora","epar"],
 note:"Aggiustamento renale obbligatorio.", ant:"Non vescicante."
},
{
 id:"imip", n:"Imipenem/cilastatina", s:"tienam imipenem", c:"Carbapenemico", cat:"anti",
 prep:"500 mg–1 g in 100 mL", solv:"NaCl 0,9%",
 dose:"500 mg–1 g ogni 6–8 h",
 tit:"Infusione in 30–60 min. Soglia convulsiva piu' bassa rispetto al meropenem: cautela nel paziente con lesioni cerebrali o insufficienza renale.",
 bolo:"Controindicato.",
 ph:"6,5–8,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con milrinone, amiodarone e lattato.",
 inc:["milr","amio","*lattato"], com:["nora","epar"],
 note:"Stabilita' in soluzione limitata: usare entro 1–2 h.", ant:"Non vescicante."
},
{
 id:"ertap", n:"Ertapenem", s:"invanz", c:"Carbapenemico", cat:"anti",
 prep:"1 g in 50–100 mL", solv:"ESCLUSIVAMENTE NaCl 0,9% (non glucosata)",
 dose:"1 g ogni 24 h",
 tit:"Infusione in 30 min. Nessuna attivita' su Pseudomonas e Acinetobacter: non adatto alle infezioni nosocomiali della terapia intensiva se questi patogeni sono attesi.",
 bolo:"Controindicato.",
 ph:"7,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; non diluire in glucosata.",
 inc:["gluc","gluc5","*glucosate"], com:["nora","epar"],
 note:"Utile per la de-escalation e la terapia domiciliare.", ant:"Non vescicante."
},
{
 id:"ampsulb", n:"Ampicillina/Sulbactam", s:"unasyn ampicillina sulbactam", c:"Penicillina + inibitore delle betalattamasi", cat:"anti",
 prep:"3 g in 100 mL", solv:"NaCl 0,9% (stabilita' ridotta in glucosata)",
 dose:"3 g ogni 6 h",
 tit:"Infusione in 15–30 min. Il sulbactam ad alte dosi ha attivita' su Acinetobacter baumannii.",
 bolo:"Non indicato.",
 ph:"8,0–10,0", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con aminoglicosidi e con l'acido tranexamico.",
 inc:["gent","amik","tobra","txa","*aminoglicosidi"], com:["nora","epar"],
 note:"Preparare al momento: stabilita' molto breve in soluzione.", ant:"Impacchi tiepidi (pH alcalino)."
},
{
 id:"oxa", n:"Oxacillina / Flucloxacillina", s:"oxacillina flucloxacillina penicillina antistafilococcica", c:"Penicillina penicillinasi-resistente", cat:"anti",
 prep:"2 g in 100 mL", solv:"NaCl 0,9% o G5%",
 dose:"2 g ogni 4–6 h (fino a 12 g/die nell'endocardite)",
 tit:"Farmaco di scelta nelle infezioni da Staphylococcus aureus meticillino-sensibile, comprese endocardite su valvola protesica e mediastinite. Sorvegliare epatotossicita', nefrite interstiziale e neutropenia nelle terapie prolungate.",
 bolo:"Infusione in 30 min.",
 ph:"6,0–8,5", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con aminoglicosidi e midazolam.",
 inc:["gent","amik","tobra","mida"], com:["nora","epar"],
 note:"Nettamente superiore alla vancomicina nelle infezioni da MSSA.", ant:"Impacchi tiepidi."
},
{
 id:"rifa", n:"Rifampicina", s:"rifadin rifampicina", c:"Rifamicina", cat:"anti",
 prep:"600 mg ricostituiti e diluiti in 250 mL", solv:"G5% (preferita)",
 dose:"600 mg ogni 12–24 h",
 tit:"Attivita' sul biofilm: cardine nelle infezioni di protesi valvolari e di dispositivi, sempre in associazione. Potentissimo induttore enzimatico: riduce i livelli di warfarin, amiodarone, calcioantagonisti, statine, corticosteroidi e antifungini azolici. Rivalutare tutte le terapie concomitanti all'inizio e alla sospensione.",
 bolo:"Controindicato: infusione in 2–3 h.",
 ph:"7,8–8,8", osm:"≈300", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"cauto", ded:false,
 rub:"Via lavata; incompatibile con numerosi farmaci.",
 inc:["*numerosi","dilt"], com:["nora"],
 note:"Colora urine, sudore e lacrime di arancione. Epatotossicita' e piastrinopenia da monitorare.", ant:"Irritante: impacchi tiepidi."
},
{
 id:"tmpsmx", n:"Trimetoprim/Sulfametossazolo", s:"bactrim cotrimossazolo TMP-SMX", c:"Antifolico + sulfamidico", cat:"anti",
 prep:"Ogni fiala da 5 mL in almeno 125 mL di G5%", solv:"G5% (rapporto di diluizione obbligato)",
 dose:"Pneumocistosi 15–20 mg/kg/die di trimetoprim in 3–4 dosi",
 tit:"Volume di diluizione elevato: nel paziente con restrizione idrica va concordato con la farmacia. Sorvegliare iperkaliemia, creatinina (aumento anche solo funzionale), mielotossicita' e ipoglicemia.",
 bolo:"Controindicato: infusione in 60–90 min.",
 ph:"9,5–11,0 (fortemente alcalino)", osm:"≈300", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:true,
 rub:"Linea dedicata o lavaggio abbondante: precipita facilmente.",
 inc:["line","*numerosi","fluc"], com:["nora"],
 note:"Precipita se diluito insufficientemente o se refrigerato.", ant:"Impacchi tiepidi."
},
{
 id:"clinda", n:"Clindamicina", s:"dalacin clindamicina", c:"Lincosamide", cat:"anti",
 prep:"600–900 mg in 100 mL", solv:"NaCl 0,9% o G5%",
 dose:"600–900 mg ogni 8 h",
 tit:"Infusione in almeno 30 min (max 30 mg/min): l'infusione rapida provoca ipotensione e arresto. Utile nelle infezioni necrotizzanti dei tessuti molli per l'inibizione della sintesi delle tossine.",
 bolo:"Controindicato.",
 ph:"5,5–7,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*ampicillina","fenit","cipro"], com:["nora","epar"],
 note:"Rischio di colite da Clostridioides difficile.", ant:"Non vescicante."
},
{
 id:"azitro", n:"Azitromicina", s:"zitromax azitromicina", c:"Macrolide", cat:"anti",
 prep:"500 mg in 250–500 mL", solv:"NaCl 0,9% o G5%",
 dose:"500 mg ogni 24 h",
 tit:"Infusione in 60 min (concentrazione ≤2 mg/mL). Prolunga il QT: attenzione in associazione ad amiodarone e fluorochinoloni. Usata anche a basso dosaggio come procinetico gastrico.",
 bolo:"Controindicato.",
 ph:"6,4–6,6", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; nessun altro farmaco in Y.",
 inc:["*tutti (RCP: nessuna miscelazione)"], com:[],
 note:"Flebite frequente se infusa troppo concentrata.", ant:"Impacchi tiepidi."
},
{
 id:"tobra", n:"Tobramicina", s:"nebicina tobramicina", c:"Aminoglicoside", cat:"anti",
 prep:"Dose in 100 mL", solv:"NaCl 0,9% o G5%",
 dose:"5–7 mg/kg/die in monosomministrazione",
 tit:"Infusione in 30–60 min. Monitoraggio di picco e valle come per la gentamicina.",
 bolo:"Controindicato.",
 ph:"3,0–6,5", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Mai in Y con betalattamici o eparina: lavare tra le somministrazioni.",
 inc:["epar","pipe","cefa","ampsulb","oxa","amfb"], com:["nora","insu"],
 note:"Nefro- e ototossicita' cumulative.", ant:"Impacchi tiepidi."
},
{
 id:"ceftolo", n:"Ceftolozano/Tazobactam", s:"zerbaxa", c:"Cefalosporina antipseudomonas + inibitore", cat:"anti",
 prep:"1,5–3 g in 100 mL", solv:"NaCl 0,9% o G5%",
 dose:"1,5–3 g ogni 8 h (3 g nella polmonite)",
 tit:"Infusione in 60 min. Attivo su Pseudomonas multiresistente. Aggiustamento renale rigoroso.",
 bolo:"Controindicato.",
 ph:"5,0–7,0", osm:"≈500", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*dati limitati"], com:["nora","epar"],
 note:"Riservato su indicazione infettivologica.", ant:"Non vescicante."
},
{
 id:"cefider", n:"Cefiderocol", s:"fetcroja", c:"Cefalosporina siderofora", cat:"anti",
 prep:"2 g in 100 mL", solv:"NaCl 0,9% o G5%",
 dose:"2 g ogni 8 h in infusione di 3 h",
 tit:"Attivo su Gram-negativi multiresistenti compresi produttori di metallo-betalattamasi e Acinetobacter. Infusione estesa obbligatoria. Aggiustamento renale bidirezionale (anche aumento della dose se iperfiltrazione).",
 bolo:"Controindicato.",
 ph:"5,0–6,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; nessun altro farmaco in Y.",
 inc:["*tutti"], com:[],
 note:"Ricostituzione con schiuma: attendere la dissoluzione completa.", ant:"Non vescicante."
},
{
 id:"anidula", n:"Anidulafungina", s:"ecalta", c:"Echinocandina", cat:"anti",
 prep:"Ricostituita e diluita a 0,77 mg/mL", solv:"NaCl 0,9% o G5%",
 dose:"Carico 200 mg, poi 100 mg/die",
 tit:"Velocita' massima 1,1 mg/min (circa 1,4 mL/min): l'infusione rapida provoca reazione istaminica con flushing e ipotensione. Degradazione spontanea non enzimatica: nessun aggiustamento renale o epatico, prima scelta nel critico con insufficienza d'organo.",
 bolo:"Controindicato.",
 ph:"3,5–5,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*altri farmaci"], com:["nora"],
 note:"Nessuna interazione farmacologica rilevante.", ant:"Non vescicante."
},
{
 id:"vorico", n:"Voriconazolo", s:"vfend", c:"Triazolo antifungino", cat:"anti",
 prep:"Ricostituito e diluito a ≤5 mg/mL", solv:"NaCl 0,9% o G5%",
 dose:"Carico 6 mg/kg ogni 12 h per 2 dosi, poi 4 mg/kg ogni 12 h",
 tit:"Infusione a velocita' massima 3 mg/kg/h (in almeno 1–2 h). La formulazione ev contiene ciclodestrina, che si accumula se GFR <50: preferire la via orale in questi casi. Monitoraggio dei livelli plasmatici (valle 1–5,5 mg/L). Numerose interazioni: prolunga il QT e interferisce con amiodarone, statine, warfarin.",
 bolo:"Controindicato.",
 ph:"6,0–7,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; non somministrare in Y con emoderivati o soluzioni elettrolitiche concentrate.",
 inc:["*emoderivati","*elettroliti concentrati"], com:["nora"],
 note:"Disturbi visivi e allucinazioni transitorie frequenti; epatotossicita'.", ant:"Non vescicante."
},
{
 id:"isavu", n:"Isavuconazolo", s:"cresemba", c:"Triazolo antifungino ad ampio spettro", cat:"anti",
 prep:"Ricostituito e diluito in 250 mL, con filtro in linea 0,2–1,2 µm", solv:"NaCl 0,9% o G5%",
 dose:"Carico 200 mg ogni 8 h per 6 dosi, poi 200 mg/die",
 tit:"Infusione in almeno 60 min con filtro obbligatorio. Non contiene ciclodestrina: utilizzabile nell'insufficienza renale. ACCORCIA il QT (a differenza degli altri azoli).",
 bolo:"Controindicato.",
 ph:"≈6", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; filtro in linea obbligatorio.",
 inc:["*altri farmaci"], com:["nora"],
 note:"Attivo su mucormicosi e aspergillosi.", ant:"Non vescicante."
},
{
 id:"aciclo", n:"Aciclovir", s:"zovirax acyclovir", c:"Antivirale nucleosidico", cat:"anti",
 prep:"Dose in 100–250 mL (concentrazione ≤7 mg/mL)", solv:"NaCl 0,9% o G5%",
 dose:"5–10 mg/kg ogni 8 h (peso ideale)",
 tit:"Infusione in almeno 60 min con idratazione adeguata: la nefrotossicita' e' da precipitazione intratubulare di cristalli. Aggiustare per clearance renale. Neurotossicita' (confusione, mioclonie, allucinazioni) nell'insufficienza renale.",
 bolo:"ASSOLUTAMENTE CONTROINDICATO.",
 ph:"10,5–11,6 (fortemente alcalino)", osm:"≈300", ves:"alto",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Lavare abbondantemente: pH molto alcalino, incompatibile con la maggior parte dei farmaci.",
 inc:["dobu","dopa","ondan","*numerosi","mero","pipe"], com:["nora"],
 note:"Vescicante: sono descritte necrosi da stravaso per il pH estremo. Non refrigerare la soluzione diluita (precipita).",
 ant:"Stravaso: gestire come soluzione fortemente alcalina, impacchi tiepidi, valutazione chirurgica."
},
{
 id:"ganci", n:"Ganciclovir", s:"cymevene ganciclovir", c:"Antivirale anti-CMV", cat:"anti",
 prep:"Dose in 100 mL (≤10 mg/mL)", solv:"NaCl 0,9% o G5%",
 dose:"5 mg/kg ogni 12 h (induzione)",
 tit:"Infusione in almeno 60 min. Mielotossicita' marcata: emocromo ogni 2–3 giorni. Manipolazione come farmaco citotossico (guanti, protezione).",
 bolo:"Controindicato.",
 ph:"9,0–11,0 (alcalino)", osm:"≈300", ves:"alto",
 cvc:"pref", pvc:"no", picc:"si", mid:"no", ded:false,
 rub:"Lavaggio abbondante; incompatibile con la maggior parte dei farmaci acidi.",
 inc:["*numerosi","fluc","pipe"], com:["nora"],
 note:"Vescicante per il pH estremo.", ant:"Gestire come stravaso di soluzione alcalina."
},
{
 id:"fosfo", n:"Fosfomicina ev", s:"fosfomicina trometamolo", c:"Antibiotico fosfonico", cat:"anti",
 prep:"4–8 g in 250 mL", solv:"G5% (preferita)",
 dose:"12–24 g/die in 3–4 somministrazioni",
 tit:"Infusione in 30–60 min. Elevato carico di sodio (circa 14 mEq per grammo): nel paziente con scompenso o restrizione sodica va computato nel bilancio. Sorvegliare ipokaliemia e sodiemia.",
 bolo:"Controindicato.",
 ph:"6,0–8,0", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["*numerosi"], com:["nora","epar"],
 note:"Usata in associazione nelle infezioni da Gram-negativi multiresistenti e da MRSA.", ant:"Non vescicante."
},

/* ==================== ELETTROLITI E SOLUZIONI (agg.) ==================== */
{
 id:"fosfk", n:"Fosfato di potassio / sodio", s:"fosfato potassio fosfato sodio fosfati", c:"Elettrolita", cat:"elet",
 prep:"Diluito in 100–250 mL, mai in bolo",
 solv:"NaCl 0,9% o G5%. MAI in soluzioni contenenti calcio.",
 dose:"0,08–0,24 mmol/kg di fosforo in 6 h (tipicamente 20–30 mmol)",
 tit:"L'ipofosfatemia post-CEC e da rialimentazione compromette la contrattilita', lo svezzamento respiratorio e la funzione diaframmatica. Correggere lentamente (mai piu' di 7,5 mmol/h) monitorando calcemia e funzione renale. Conteggiare il potassio veicolato dal sale.",
 bolo:"ASSOLUTAMENTE CONTROINDICATO: precipitazione e ipocalcemia acuta.",
 ph:"5,0–7,5", osm:"elevata (soluzione concentrata >1500 mOsm/L)", ves:"cauto",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:false,
 rub:"Mai nella stessa via del calcio e del bicarbonato: precipitato di fosfato di calcio, potenzialmente embolico.",
 inc:["cacl","cagl","bica","mgso4","ceftri"], com:["nora","insu"],
 note:"La precipitazione con il calcio puo' non essere visibile: la regola vale anche in assenza di torbidita'.",
 ant:"Impacchi tiepidi."
},
{
 id:"ringer", n:"Cristalloidi bilanciati (Ringer lattato / acetato)", s:"ringer lattato acetato sterofundin plasmalyte cristalloidi bilanciati", c:"Soluzione elettrolitica bilanciata", cat:"elet",
 prep:"Sacca pronta",
 solv:"Pronto all'uso",
 dose:"Secondo bilancio e risposta emodinamica",
 tit:"Prima scelta nella rianimazione volemica post-CEC rispetto alla fisiologica (minore acidosi ipercloremica e minor danno renale). Valutare la risposta con indici dinamici (SVV/PPV se condizioni di validita' rispettate, test di sollevamento delle gambe, mini-fluid challenge) prima di ogni carico.",
 bolo:"250–500 mL in 10–15 min come fluid challenge.",
 ph:"5,0–7,5", osm:"≈275–295", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Attenzione: contiene calcio (Ringer lattato). Mai come veicolo per ceftriaxone o per gli emocomponenti.",
 inc:["ceftri","emazie","*farmaci calcio-incompatibili"], com:["nora","epar"],
 note:"Il lattato contenuto puo' confondere l'interpretazione della lattacidemia nelle prime ore.",
 ant:"Non vescicante."
},
{
 id:"gluc5", n:"Glucosata 5% / 10%", s:"glucosata glucosio 5 10 destrosio", c:"Soluzione glucidica isotonica-ipertonica lieve", cat:"elet",
 prep:"Sacca pronta",
 solv:"Pronto all'uso",
 dose:"Secondo fabbisogno idrico e glucidico",
 tit:"Veicolo obbligato per amiodarone, levosimendan, nitroprussiato e amfotericina liposomiale. Come fluido di mantenimento nel post-CEC va limitata (rischio di iponatriemia e iperglicemia).",
 bolo:"Non indicata come espansore volemico.",
 ph:"3,5–6,5", osm:"278 (5%) / 555 (10%)", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Non usare come veicolo per daptomicina, caspofungin, ertapenem e fenitoina.",
 inc:["dapt","casp","ertap","fenit","emazie"], com:["amio","levo","snp","amfb","nora"],
 note:"Le concentrazioni superiori al 10% richiedono accesso centrale.",
 ant:"Non vescicante fino al 10%."
},
{
 id:"lipid", n:"Emulsione lipidica 20%", s:"intralipid smoflipid lipidi ILE", c:"Emulsione lipidica / antidoto della tossicita' da anestetici locali", cat:"elet",
 prep:"Flacone 20% pronto",
 solv:"Non diluire",
 dose:"Nutrizionale: secondo prescrizione. Antidoto (LAST): bolo 1,5 mL/kg in 1 min, poi 0,25 mL/kg/min, ripetibile.",
 tit:"Nella tossicita' sistemica da anestetici locali (LAST) il bolo va ripetuto una o due volte se persiste instabilita', raddoppiando l'infusione; dose massima cumulativa 12 mL/kg. La sacca deve essere disponibile e segnalata in ogni area dove si eseguono blocchi loco-regionali.",
 bolo:"1,5 mL/kg in 1 min nell'emergenza LAST.",
 ph:"6,0–8,9", osm:"≈350", ves:"mod",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:true,
 rub:"Linea dedicata come tutte le emulsioni; set sostituito ogni 12–24 h per il rischio microbiologico.",
 inc:["*elettroliti concentrati","*pH estremi"], com:[],
 note:"Nella lista INS 2024 i lipidi sono vescicanti a rischio moderato. Interferisce con numerosi dosaggi di laboratorio (campione lipemico).",
 ant:"Stravaso: assorbimento tissutale refrattario, sorveglianza prolungata."
},
{
 id:"tiam", n:"Tiamina (vitamina B1)", s:"benerva tiamina B1", c:"Vitamina idrosolubile", cat:"elet",
 prep:"100–500 mg diluiti in 50–100 mL",
 solv:"NaCl 0,9% o G5%",
 dose:"100–300 mg/die; sospetto Wernicke o beriberi: 200–500 mg ogni 8 h",
 tit:"Somministrare PRIMA di ogni carico glucidico nel paziente malnutrito, alcolista o a rischio di sindrome da rialimentazione. Il beriberi cardiaco (shock ad alta portata con acidosi lattica) e' una causa reversibile e sottodiagnosticata di vasoplegia.",
 bolo:"Infusione in 15–30 min.",
 ph:"2,5–4,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; instabile in ambiente alcalino.",
 inc:["bica","*soluzioni alcaline"], com:["nora","epar","gluc5"],
 note:"Reazioni anafilattoidi rare con la somministrazione endovenosa rapida.",
 ant:"Non vescicante."
},

/* ==================== RESPIRATORIO E INALATORI ==================== */
{
 id:"salb", n:"Salbutamolo", s:"ventolin albuterolo broncodilatatore", c:"Beta-2 agonista a breve durata", cat:"resp",
 prep:"Nebulizzazione 2,5–5 mg in 3–5 mL; ev 5 mg in 50 mL",
 solv:"NaCl 0,9%",
 dose:"Nebulizzazione 2,5–5 mg ogni 4–6 h o continua; ev 3–20 mcg/min",
 tit:"Nel paziente ventilato la nebulizzazione va sincronizzata con il circuito (nebulizzatore a rete vibrante posizionato sul ramo inspiratorio) e richiede dosi maggiori per la perdita nel circuito. Sorvegliare tachicardia, tremore, ipokaliemia e iperlattacidemia (effetto metabolico beta-2, non ipoperfusione). Utile anche nel trattamento dell'iperkaliemia acuta.",
 bolo:"Ev sconsigliato di routine: tachiaritmie.",
 ph:"3,0–5,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Per via inalatoria non applicabile; per via ev usare via lavata.",
 inc:["bica"], com:["ipra","nora"],
 note:"L'ipokaliemia indotta e' clinicamente rilevante nel post-cardiochirurgico: controllare il potassio.",
 ant:"Non vescicante."
},
{
 id:"ipra", n:"Ipratropio bromuro", s:"atem atrovent", c:"Anticolinergico inalatorio", cat:"resp",
 prep:"250–500 mcg per nebulizzazione",
 solv:"NaCl 0,9%",
 dose:"500 mcg ogni 6 h",
 tit:"Associato al salbutamolo nel broncospasmo. Effetto additivo, latenza maggiore.",
 bolo:"Non applicabile.",
 ph:"3,4", osm:"≈290", ves:"no",
 cvc:"no", pvc:"no", picc:"no", mid:"no", ded:false,
 rub:"Non applicabile (via inalatoria).",
 inc:[], com:["salb"],
 note:"Evitare il contatto con gli occhi (midriasi, glaucoma acuto): mascherina ben aderente.",
 ant:"Non applicabile."
},
{
 id:"amino", n:"Aminofillina / Teofillina", s:"aminofillina teofillina xantina", c:"Metilxantina", cat:"resp",
 prep:"240 mg in 100 mL", solv:"NaCl 0,9% o G5%",
 dose:"Carico 5 mg/kg in 30 min; mantenimento 0,3–0,7 mg/kg/h",
 tit:"Indice terapeutico stretto (livelli 10–20 mg/L): monitoraggio obbligatorio. Ridurre nel paziente anziano, epatopatico, scompensato o in terapia con macrolidi e chinoloni. Tossicita': tachiaritmie, convulsioni, vomito, ipokaliemia. Uso oggi marginale nel broncospasmo, occasionale nella bradicardia post-trapianto e nel blocco AV.",
 bolo:"Carico in almeno 30 min.",
 ph:"8,6–9,0 (alcalino)", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"cauto", picc:"si", mid:"cauto", ded:false,
 rub:"Lavare la via: incompatibile con la maggior parte dei farmaci acidi e con le catecolamine.",
 inc:["nora","adre","dopa","dobu","isop","amio","vanc","cipro","morf","ceftri","ceftaz","vanc"],
 com:["epar","insu"],
 note:"L'associazione con ciprofloxacina e macrolidi aumenta marcatamente i livelli.",
 ant:"Impacchi tiepidi (pH alcalino)."
},
{
 id:"nac", n:"N-acetilcisteina ev", s:"fluimucil NAC acetilcisteina", c:"Mucolitico / precursore del glutatione", cat:"resp",
 prep:"Dose in 100–250 mL", solv:"G5% (preferita)",
 dose:"Mucolitico 300 mg ogni 12 h; intossicazione da paracetamolo secondo protocollo a 3 fasi",
 tit:"Nell'intossicazione da paracetamolo la prima fase (150 mg/kg) va infusa in 60 min, non in 15: l'infusione rapida e' la causa principale delle reazioni anafilattoidi (flushing, broncospasmo, ipotensione), che si gestiscono rallentando e somministrando antistaminico, non sospendendo.",
 bolo:"Mai rapido.",
 ph:"6,5–7,5", osm:"≈300", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; incompatibile con metalli e ossidanti.",
 inc:["*ossidanti","*metalli"], com:["nora","epar"],
 note:"Odore sulfureo caratteristico; puo' allungare lievemente l'INR.",
 ant:"Non vescicante."
},

/* ==================== DIURETICI, STEROIDI, GASTRO, ALTRI (agg.) ==================== */
{
 id:"canren", n:"Canrenoato di potassio", s:"luvion canrenoato antialdosteronico", c:"Antagonista dell'aldosterone endovenoso", cat:"vari",
 prep:"200 mg diluiti in 50–100 mL", solv:"NaCl 0,9% o G5%",
 dose:"100–400 mg/die",
 tit:"Utile nel post-cardiochirurgico per la diuresi resistente e per il risparmio di potassio. Latenza d'azione di ore. Sorvegliare potassio e creatinina: controindicato se K⁺ >5,5 o GFR <30.",
 bolo:"Infusione lenta in 15–30 min.",
 ph:"9,0–11,0 (alcalino)", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"cauto", picc:"si", mid:"cauto", ded:false,
 rub:"Lavare la via: pH alcalino, incompatibile con farmaci acidi.",
 inc:["*farmaci acidi","nora"], com:["furo","epar"],
 note:"Sinergico con la furosemide nel superare la resistenza diuretica.",
 ant:"Impacchi tiepidi."
},
{
 id:"acetaz", n:"Acetazolamide", s:"diamox", c:"Inibitore dell'anidrasi carbonica", cat:"vari",
 prep:"500 mg ricostituiti, diluiti in 50–100 mL", solv:"Acqua ppi, poi NaCl 0,9%",
 dose:"250–500 mg ogni 12–24 h",
 tit:"Correzione dell'alcalosi metabolica ipocloremica post-diuretica, frequente nel post-cardiochirurgico e causa di ritardato svezzamento respiratorio (depressione del drive). Sorvegliare potassio, cloro e acidosi metabolica.",
 bolo:"Infusione lenta.",
 ph:"9,0–10,0 (alcalino)", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Lavare la via.",
 inc:["*farmaci acidi"], com:["furo","nora","epar"],
 note:"Utile anche come adiuvante diuretico nella resistenza alla furosemide (studio ADVOR nello scompenso).",
 ant:"Impacchi tiepidi."
},
{
 id:"esome", n:"Esomeprazolo", s:"nexium lucen esomeprazolo", c:"Inibitore di pompa protonica", cat:"vari",
 prep:"40 mg ricostituiti in NaCl 0,9%; infusione 80 mg carico + 8 mg/h", solv:"ESCLUSIVAMENTE NaCl 0,9%",
 dose:"40 mg ogni 12–24 h; sanguinamento 80 mg + 8 mg/h per 72 h",
 tit:"Profilassi dell'ulcera da stress indicata nei pazienti ventilati, coagulopatici o in alte dosi di steroidi; da rivalutare quotidianamente e sospendere all'inizio della nutrizione enterale piena.",
 bolo:"40–80 mg in almeno 3 min.",
 ph:"9,0–11,0 (alcalino)", osm:"≈300", ves:"cauto",
 cvc:"si", pvc:"si", picc:"si", mid:"cauto", ded:true,
 rub:"Come il pantoprazolo: lume dedicato o lavaggio abbondante prima e dopo.",
 inc:["*maggior parte","nora","mida"], com:[],
 note:"Non ricostituire in glucosata.",
 ant:"Impacchi tiepidi."
},
{
 id:"famot", n:"Famotidina", s:"famotidina anti-H2", c:"Antagonista dei recettori H2", cat:"vari",
 prep:"20 mg diluiti in 50–100 mL", solv:"NaCl 0,9% o G5%",
 dose:"20 mg ogni 12 h (aggiustata per funzione renale)",
 tit:"Alternativa agli inibitori di pompa nella profilassi dell'ulcera da stress. Tachifilassi dopo 48–72 h.",
 bolo:"20 mg in almeno 2 min.",
 ph:"5,0–5,6", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata.",
 inc:["cefep","amfb"], com:["nora","epar","insu"],
 note:"Confusione e delirium nell'anziano e nell'insufficienza renale.",
 ant:"Non vescicante."
},
{
 id:"octreo", n:"Octreotide", s:"sandostatina", c:"Analogo della somatostatina", cat:"vari",
 prep:"Bolo 50 mcg; infusione 500 mcg in 50 mL", solv:"NaCl 0,9%",
 dose:"Bolo 50 mcg, poi 25–50 mcg/h",
 tit:"Nel post-cardiochirurgico l'indicazione principale e' il chilotorace persistente dopo interventi con dissezione mediastinica, in associazione alla dieta a trigliceridi a catena media. Altre indicazioni: sanguinamento da varici, fistole pancreatiche.",
 bolo:"50 mcg ev lenti.",
 ph:"3,9–4,5", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:false,
 rub:"Via lavata; non associare a nutrizione parenterale.",
 inc:["npt"], com:["nora","epar"],
 note:"Sorvegliare glicemia (iperglicemia o ipoglicemia) e bradicardia.",
 ant:"Non vescicante."
},
{
 id:"ferro", n:"Ferro carbossimaltosio", s:"ferinject ferro carbossimaltosio", c:"Ferro endovenoso", cat:"vari",
 prep:"500–1000 mg in 100–250 mL NaCl 0,9%", solv:"ESCLUSIVAMENTE NaCl 0,9%",
 dose:"Fino a 20 mg/kg (max 1000 mg per somministrazione)",
 tit:"Cardine del patient blood management pre-operatorio: la correzione della carenza marziale 3–4 settimane prima dell'intervento riduce le trasfusioni. Infusione in almeno 15 min. Sorvegliare le reazioni da ipersensibilita' nei primi 30 min e l'ipofosfatemia tardiva (a 2 settimane).",
 bolo:"Infusione in almeno 15 min.",
 ph:"5,0–7,0", osm:"≈300", ves:"mod",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Linea dedicata: nessun altro farmaco in Y. Diluizione minima 2 mg/mL (concentrazioni inferiori sono instabili).",
 inc:["*tutti"], com:[],
 note:"Lo stravaso provoca colorazione brunastra permanente della cute: sorveglianza attenta del sito.",
 ant:"Stravaso: interrompere subito, impacchi freddi in questo caso specifico; la discromia puo' essere definitiva."
},
{
 id:"epo", n:"Eritropoietina", s:"eprex neorecormon EPO darbepoetina", c:"Agente stimolante l'eritropoiesi", cat:"vari",
 prep:"Siringa preriempita", solv:"Somministrazione sottocutanea o endovenosa lenta",
 dose:"Secondo protocollo di patient blood management pre-operatorio",
 tit:"Associata al ferro nel percorso pre-operatorio dell'anemia; nel post-operatorio acuto l'efficacia e' limitata e il rischio trombotico non trascurabile.",
 bolo:"Ev lenta o sottocute.",
 ph:"6,0–7,0", osm:"≈290", ves:"no",
 cvc:"si", pvc:"si", picc:"si", mid:"si", ded:true,
 rub:"Nessuna miscelazione: non agitare (denaturazione proteica).",
 inc:["*tutti"], com:[],
 note:"Conservazione a 2–8 °C, catena del freddo obbligatoria.",
 ant:"Non vescicante."
},
{
 id:"ivig", n:"Immunoglobuline endovena", s:"IVIG immunoglobuline flebogamma privigen", c:"Emoderivato immunomodulante", cat:"vari",
 prep:"Flaconi pronti a concentrazione variabile", solv:"Non diluire salvo indicazione",
 dose:"Secondo indicazione (0,4–1 g/kg/die)",
 tit:"Velocita' crescente secondo scheda tecnica, partendo molto lentamente nei primi 30 min. Sorvegliare reazioni infusionali, sovraccarico, insufficienza renale (formulazioni con saccarosio) ed eventi trombotici. Nella lista INS 2024 sono vescicanti a rischio moderato.",
 bolo:"Controindicato.",
 ph:"4,0–7,2", osm:"variabile (fino a 1250 mOsm/L in alcune formulazioni)", ves:"mod",
 cvc:"pref", pvc:"cauto", picc:"si", mid:"no", ded:true,
 rub:"Linea dedicata con set fornito; nessun farmaco in Y.",
 inc:["*tutti"], com:[],
 note:"Verificare l'osmolarita' della formulazione specifica per la scelta dell'accesso.",
 ant:"Impacchi tiepidi."
}


];

/* ============================================================================
   REGOLE STRUTTURALI DI INCOMPATIBILITA'
   Applicate dal motore anche quando manca il dato coppia-specifico.
   ========================================================================== */
const REGOLE = [
 ["Acido forte + base forte","Farmaco con pH <5 in Y con farmaco a pH >9: la neutralizzazione porta il pH alla zona di minima solubilita' e il soluto precipita.","Fenitoina (pH 10–12) o pantoprazolo (pH 9–10,5) con noradrenalina, midazolam, amiodarone."],
 ["Alcalini + catecolamine","Le catecolamine si ossidano e si inattivano irreversibilmente a pH alcalino, spesso con viraggio di colore.","Bicarbonato 8,4% con noradrenalina, adrenalina, dopamina, dobutamina."],
 ["Calcio + fosfati / bicarbonato","Formazione di sali insolubili (fosfato di calcio, carbonato di calcio) con precipitato non sempre visibile a occhio nudo.","Calcio cloruro con bicarbonato o con nutrizione parenterale ricca di fosfati."],
 ["Ceftriaxone + calcio","Precipitato di ceftriaxone-calcio: reazione con esito fatale documentato. Vale anche per il Ringer lattato.","Ceftriaxone con calcio gluconato, calcio cloruro, Ringer lattato, NPT con calcio."],
 ["Glicopeptidi + betalattamici / eparina","Vancomicina precipita con piperacillina/tazobactam, ceftriaxone, ceftazidima ed eparina.","Vancomicina + piperacillina/tazobactam nella stessa via."],
 ["Aminoglicosidi + betalattamici","Inattivazione chimica reciproca in miscela (non in circolo).","Gentamicina o amikacina con piperacillina o cefalosporine."],
 ["Emulsioni lipidiche","Le emulsioni sono destabilizzate da elettroliti e pH estremi: rottura dell'emulsione con coalescenza dei globuli lipidici (rischio di embolia).","Propofol, clevidipina, sacche lipidiche: linea dedicata."],
 ["Emoderivati e concentrati proteici","Nessun farmaco in Y: rischio di denaturazione, aggregazione o emolisi.","Albumina, fibrinogeno, CCP, plasma, emazie."],
 ["Solvente obbligato","Alcuni farmaci sono stabili in un solo solvente: l'uso dell'altro provoca precipitazione o degradazione.","Amiodarone e levosimendan solo in glucosata 5%; amfotericina liposomiale solo in glucosata; daptomicina e caspofungin mai in glucosata; fenitoina solo in fisiologica."],
 ["Adsorbimento su PVC","Perdita di dose per legame al materiale del deflussore: non e' incompatibilita' chimica ma errore di dosaggio.","Nitroglicerina, insulina, diazepam: usare set dedicati o purgare la linea."]
];

const ACCESSI = [
 ["Agocannula periferica corta (SPC)","Vena periferica","5–9","<600 mOsm/L (rischio moderato gia' da 450)","Non indicata per infusione continua","Vasopressori accettati solo come misura temporanea (idealmente ≤24 h, max 48 h) in vena prossimale, calibro ≥20 G, ritorno ematico verificato, ispezione oraria. Rivalutare il sito ogni 4 h (ogni 1–2 h nel paziente sedato o con deficit cognitivo)."],
 ["Catetere periferico lungo / mini-midline (6–15 cm)","Vena profonda del braccio","5–9","<600–800 mOsm/L","No","Utile nel paziente con patrimonio venoso difficile (DIVA). Stesse limitazioni farmacologiche del periferico corto."],
 ["Midline (>15 cm, punta ascellare/succlavia)","Vena ascellare o succlavia — resta un accesso PERIFERICO","5–9","<800–900 mOsm/L","NO per infusione continua di vescicanti","INS 2024: non utilizzare per vescicanti in continuo, nutrizione parenterale o infusati con pH/osmolarita' estremi. Bassa emodiluizione e riconoscimento tardivo dello stravaso nel braccio."],
 ["PICC (punta in giunzione cavo-atriale)","Vena cava superiore / atrio destro","Qualsiasi","Qualsiasi","Si","Accesso CENTRALE a tutti gli effetti: vasopressori, NPT, soluzioni ipertoniche, farmaci a pH estremo. Consente il monitoraggio della PVC. Preferibile il monolume se la terapia lo consente."],
 ["CVC centrale (giugulare/succlavia)","Vena cava superiore / atrio destro","Qualsiasi","Qualsiasi","Si","Standard in cardiochirurgia. Assegnare i lumi per criticita': distale = vasoattivi, mediale = sedazione/eparina, prossimale = boli/reintegri. Punta verificata radiologicamente."],
 ["CVC femorale (FICC)","Vena cava inferiore","Qualsiasi","Qualsiasi","Si","Accesso centrale; maggiore rischio infettivo e trombotico, da sostituire appena possibile."]
];

const STRAVASO = [
 ["Sospetto","Dolore, bruciore, tensione, edema, pallore o eritema al sito, riduzione del flusso, allarme di occlusione, assenza di ritorno ematico. Nel paziente sedato spesso l'unico segno e' l'edema.","Interrompere immediatamente l'infusione."],
 ["Primi 60 secondi","Non lavare il catetere. Aspirare quanto piu' possibile del farmaco dal catetere e dai tessuti, poi rimuovere il presidio (nello stadio 3–4 lasciarlo in sede per l'eventuale antidoto).","Stimare il volume stravasato."],
 ["Antidoto","Vasocostrittori: fentolamina 5–10 mg in 10–15 mL di NaCl 0,9% infiltrata in 5 punti perilesionali entro 12 h (idealmente entro 1 h). Alternativa: nitroglicerina pomata 2% topica. Soluzioni iperosmolari, calcio, contrasto: ialuronidasi 150 UI perilesionale.","Consulenza farmacista e protocollo aziendale."],
 ["Trattamento locale","Impacchi TIEPIDI per i vescicanti non citotossici (vasopressori, iperosmolari) 15–20 minuti quattro volte al giorno nelle prime 24 h. Arto elevato. Marcare i margini con pennarello dermografico. Non applicare pressione.","Non riutilizzare l'arto per nuovi accessi."],
 ["Sorveglianza","Rivalutare perfusione e stato neurovascolare per almeno 12–24 h (piu' a lungo se non migliora). Stadiazione (1–4) e documentazione fotografica.","Consulenza chirurgica precoce se cute tesa, pallida o dolore sproporzionato: descritte sindromi compartimentali (amiodarone, calcio, vasopressori)."],
 ["Segnalazione","Incident reporting aziendale e analisi degli eventi con danno, con revisione della scelta dell'accesso vascolare.","Segnalazione di farmacovigilanza."]
];

const REGOLE_RUBINETTO = [
 "<strong>Un lume, un rischio.</strong> Nel CVC assegnare stabilmente i lumi: distale ai vasoattivi, mediale a sedazione ed eparina, prossimale a boli, antibiotici e reintegri. Etichettare fisicamente ogni linea al raccordo e alla pompa.",
 "<strong>Mai un bolo sulla via di un vasoattivo.</strong> Il volume morto della prolunga (0,3–1,5 mL) contiene minuti di infusione: un flush si traduce in un bolo di noradrenalina o di remifentanil, un'aspirazione in un vuoto terapeutico.",
 "<strong>Il rubinetto piu' vicino al paziente e' il piu' pericoloso.</strong> Piu' e' distale, minore e' il volume morto a valle e piu' rapido l'effetto del bolo. Per l'adenosina questo e' un vantaggio; per tutto il resto e' un rischio.",
 "<strong>Sequenza SAS/SASH.</strong> Lavaggio con NaCl 0,9% – Farmaco – Lavaggio con NaCl 0,9% (– Heparin lock se previsto dal protocollo). Volume di lavaggio pari ad almeno il doppio del volume interno del sistema (di norma 10 mL, 20 mL dopo emoderivati o prelievi).",
 "<strong>Tecnica pulsata e pressione positiva.</strong> Lavaggio a spinte intermittenti; chiusura della clamp mantenendo la pressione sullo stantuffo per evitare il reflusso ematico e l'occlusione.",
 "<strong>Farmaci a rischio di errore.</strong> Potassio concentrato, insulina, eparina, vasoattivi concentrati: doppio controllo indipendente, etichetta ad alto rischio, pompa dedicata.",
 "<strong>Sostituzione della siringa dei vasoattivi.</strong> Tecnica di sovrapposizione (due pompe, incremento graduale della nuova e decremento della vecchia) o quick change, con monitoraggio pressorio continuo. Mai lo stop-and-go.",
 "<strong>Prima di ogni somministrazione</strong> verificare il ritorno ematico, la pervieta' senza resistenza e l'integrita' del sito. In assenza di ritorno ematico su un vescicante, non somministrare.",
 "<strong>Dopo un farmaco incompatibile</strong> (furosemide, pantoprazolo, fenitoina, bicarbonato, ceftriaxone) lavare abbondantemente prima di riprendere l'infusione successiva: l'incompatibilita' in sequenza esiste quanto quella in Y.",
 "<strong>Assenza di dato non significa compatibilita'.</strong> In mancanza di evidenza, lume separato oppure lavaggio con sospensione temporanea concordata con il medico."
];

/* ============================================================================
   MOTORE
   ========================================================================== */
const IDX = Object.fromEntries(FARMACI.map(f => [f.id, f]));
const norm = s => (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const byName = {};
FARMACI.forEach(f => byName[norm(f.n)] = f.id);

function phRange(s){
  const nums = (s||"").replace(/,/g,".").match(/\d+(\.\d+)?/g);
  if(!nums) return null;
  const v = nums.map(Number);
  return {min: Math.min(...v), max: Math.max(...v)};
}

const VES_LBL = {alto:["Vescicante alto rischio","b-red"], mod:["Vescicante rischio moderato","b-amber"],
                 cauto:["Infusato cautelativo","b-gold"], no:["Non vescicante","b-green"]};
const VIA_LBL = {pref:["Preferita","ok"], si:["Si","ok"], temp:["Solo temporanea","mid"],
                 cauto:["Con cautela","mid"], no:["No","no"]};

/* ---- verdetto compatibilita' in Y ---- */
function verdetto(a, b){
  if(a.id === b.id) return {lvl:"nd", t:"Stesso farmaco", msg:"Seleziona due farmaci diversi."};
  const listato = x => (x||[]).filter(v => !String(v).startsWith("*"));
  const incAB = listato(a.inc).includes(b.id) || listato(b.inc).includes(a.id);
  const comAB = listato(a.com).includes(b.id) || listato(b.com).includes(a.id);

  const extra = [];
  if(a.ded) extra.push(`<strong>${a.n}</strong> richiede linea o lume dedicato.`);
  if(b.ded) extra.push(`<strong>${b.n}</strong> richiede linea o lume dedicato.`);

  const pa = phRange(a.ph), pb = phRange(b.ph);
  let phWarn = null;
  if(pa && pb){
    if((pa.max < 5 && pb.min > 9) || (pb.max < 5 && pa.min > 9))
      phWarn = `Divario di pH estremo (${a.ph} contro ${b.ph}): rischio elevato di precipitazione alla confluenza anche in assenza di dato specifico.`;
    else if((pa.max < 5 && pb.min > 8) || (pb.max < 5 && pa.min > 8))
      phWarn = `Differenza di pH marcata (${a.ph} contro ${b.ph}): valutare lavaggio o lume separato.`;
  }

  if(incAB) return {lvl:"no", t:"INCOMPATIBILE in Y",
    msg:"Incompatibilita' documentata alle concentrazioni standard. Non co-somministrare al raccordo: usare lumi separati oppure sospendere, lavare con 10 mL di NaCl 0,9%, somministrare, lavare nuovamente.",
    extra, phWarn};

  if(comAB) return {lvl:"ok", t:"Compatibile in Y",
    msg:"Compatibilita' documentata alle concentrazioni standard indicate nelle schede. Verificare comunque la concentrazione effettivamente in uso e sorvegliare la linea (torbidita', cristalli, cambio di colore, gas).",
    extra, phWarn};

  if(phWarn) return {lvl:"mid", t:"Dato coppia-specifico assente — allarme strutturale",
    msg:"Non esiste un dato di compatibilita' diretto per questa coppia, ma le caratteristiche fisico-chimiche suggeriscono un rischio concreto.",
    extra, phWarn};

  return {lvl:"nd", t:"Dato non disponibile",
    msg:"Nessuna evidenza di compatibilita' ne' di incompatibilita' per questa coppia nelle fonti utilizzate. <strong>Assenza di dato non equivale a compatibilita'.</strong> Comportamento prudenziale: lume separato, oppure lavaggio con NaCl 0,9% prima e dopo. Consultare il farmacista o Trissel's / King Guide.",
    extra, phWarn};
}

/* ============================================================================
   INTERFACCIA
   ========================================================================== */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
let filtroCat = "all", filtroFlag = null;

/* ---- navigazione ---- */
$$(".tab").forEach(t => t.addEventListener("click", () => {
  $$(".tab").forEach(x => x.classList.remove("is-active"));
  $$(".view").forEach(x => x.classList.remove("is-active"));
  t.classList.add("is-active");
  $("#view-" + t.dataset.view).classList.add("is-active");
  window.scrollTo({top:0, behavior:"smooth"});
}));

/* ---- chip categorie ---- */
function initChips(){
  const wrap = $("#catChips");
  const mk = (k, l) => {
    const b = document.createElement("button");
    b.className = "chip" + (k === "all" ? " is-on" : "");
    b.textContent = l; b.dataset.cat = k;
    b.addEventListener("click", () => {
      filtroCat = k;
      wrap.querySelectorAll(".chip").forEach(c => c.classList.toggle("is-on", c.dataset.cat === k));
      render();
    });
    wrap.appendChild(b);
  };
  mk("all", "Tutte le classi");
  Object.entries(CATEGORIE).forEach(([k, l]) => mk(k, l));

  $$("[data-flag]").forEach(b => b.addEventListener("click", () => {
    const f = b.dataset.flag;
    filtroFlag = (filtroFlag === f) ? null : f;
    $$("[data-flag]").forEach(x => x.classList.toggle("is-on", x.dataset.flag === filtroFlag));
    render();
  }));
}

function passaFlag(f){
  if(!filtroFlag) return true;
  if(filtroFlag === "ves")   return f.ves === "alto" || f.ves === "mod";
  if(filtroFlag === "cvc")   return f.pvc === "no" || f.pvc === "temp" || f.cvc === "pref";
  if(filtroFlag === "perif") return f.pvc === "si";
  if(filtroFlag === "ded")   return !!f.ded;
  return true;
}

/* ---- griglia ---- */
function render(){
  const base = $("#q").value.trim() ? cerca($("#q").value) : FARMACI;
  const out = base.filter(f => (filtroCat === "all" || f.cat === filtroCat) && passaFlag(f));
  $("#count").textContent = out.length + "/" + FARMACI.length;
  const g = $("#grid");
  if(!out.length){ g.innerHTML = '<p class="empty">Nessun farmaco corrisponde ai criteri di ricerca.</p>'; return; }
  g.innerHTML = out.map(f => {
    const [vl, vc] = VES_LBL[f.ves] || VES_LBL.no;
    const badges = [`<span class="badge ${vc}">${vl}</span>`];
    if(f.ded) badges.push('<span class="badge b-gold">Linea dedicata</span>');
    if(f.pvc === "no") badges.push('<span class="badge b-red">Solo centrale</span>');
    else if(f.pvc === "temp") badges.push('<span class="badge b-amber">Periferica temporanea</span>');
    if(f.mid === "si") badges.push('<span class="badge b-teal">Midline OK</span>');
    return `<button class="card" data-id="${f.id}">
      <h3>${f.n}</h3><div class="cls">${f.c}</div>
      <div class="dose">${f.dose}</div>
      <div class="badges">${badges.join("")}</div></button>`;
  }).join("");
  g.querySelectorAll(".card").forEach(c => c.addEventListener("click", () => apriScheda(c.dataset.id)));
}
$("#q").addEventListener("input", render);

/* ---- scheda farmaco ---- */
function nomiDa(ids){
  if(!ids || !ids.length) return '<span class="nd">Nessun dato registrato</span>';
  return `<div class="pill-row">${ids.map(i => {
    if(String(i).startsWith("*")) return `<span class="pill">${String(i).slice(1)}</span>`;
    return `<span class="pill">${IDX[i] ? IDX[i].n : i}</span>`;
  }).join("")}</div>`;
}

function apriScheda(id){
  const f = IDX[id];
  const [vl] = VES_LBL[f.ves] || VES_LBL.no;
  const via = k => { const [l, c] = VIA_LBL[f[k]] || VIA_LBL.no; return `<b class="${c}">${l}</b>`; };
  $("#modalBody").innerHTML = `
    <div class="sheet-h"><h2>${f.n}</h2><div class="cls">${f.c} — ${CATEGORIE[f.cat]}</div></div>

    <div class="sec"><h4>Preparazione standard</h4><p>${f.prep}<br><span class="nd">Solvente:</span> ${f.solv}</p></div>

    <div class="sec"><h4>Proprieta' fisico-chimiche e accesso</h4>
      <div class="kv">
        <div><span>pH</span><b>${f.ph}</b></div>
        <div><span>Osmolarita'</span><b>${f.osm}</b></div>
        <div><span>Rischio vescicante</span><b>${vl}</b></div>
        <div><span>CVC</span>${via("cvc")}</div>
        <div><span>Vena periferica</span>${via("pvc")}</div>
        <div><span>PICC</span>${via("picc")}</div>
        <div><span>Midline</span>${via("mid")}</div>
        <div><span>Linea dedicata</span><b class="${f.ded?"no":"ok"}">${f.ded ? "Si" : "Non richiesta"}</b></div>
      </div></div>

    <div class="sec"><h4>Dose di mantenimento</h4><p>${f.dose}</p></div>
    <div class="sec"><h4>Schema di titolazione</h4><p>${f.tit}</p></div>
    <div class="sec"><h4>Bolo / dose di carico</h4><p>${f.bolo}</p></div>
    <div class="sec"><h4>Condotta al rubinetto e alla linea</h4><p>${f.rub}</p></div>
    <div class="sec"><h4>Incompatibilita' in Y documentate</h4>${nomiDa(f.inc)}</div>
    <div class="sec"><h4>Compatibilita' in Y documentate</h4>${nomiDa(f.com)}</div>
    <div class="sec"><h4>Avvertenze</h4><p>${f.note}</p></div>
    <div class="sec"><h4>Stravaso e antidoto</h4><p>${f.ant}</p></div>`;
  $("#modal").classList.add("is-open");
  $("#modal").setAttribute("aria-hidden","false");
}
$("#modalClose").addEventListener("click", chiudi);
$("#modal").addEventListener("click", e => { if(e.target.id === "modal") chiudi(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") chiudi(); });
function chiudi(){ $("#modal").classList.remove("is-open"); $("#modal").setAttribute("aria-hidden","true"); }

/* ---- ricerca testuale con punteggio ---- */
function cerca(q, limit){
  const n = norm((q||"").trim());
  if(!n) return limit ? FARMACI.slice(0, limit) : FARMACI.slice();
  const out = [];
  FARMACI.forEach(f => {
    const nome = norm(f.n), syn = norm(f.s), cls = norm(f.c + " " + CATEGORIE[f.cat]);
    let sc = -1;
    if(nome.startsWith(n))                             sc = 0;
    else if(nome.split(/[\s(\/-]+/).some(w => w.startsWith(n))) sc = 1;
    else if(nome.includes(n))                          sc = 2;
    else if(syn.split(/\s+/).some(w => w.startsWith(n))) sc = 3;
    else if(syn.includes(n))                           sc = 4;
    else if(cls.includes(n))                           sc = 5;
    if(sc >= 0) out.push([sc, f]);
  });
  out.sort((a, b) => a[0] - b[0] || a[1].n.localeCompare(b[1].n));
  return out.slice(0, limit || out.length).map(x => x[1]);
}

/* ---- combobox: scrittura libera + tendina completa ---- */
function makeCombo(id, onPick){
  const inp  = document.getElementById(id);
  const box  = inp.closest(".combo");
  const list = box.querySelector(".combo-list");
  const tgl  = box.querySelector(".combo-toggle");
  let voci = [], hl = -1;

  const chiudi = () => { box.classList.remove("is-open"); inp.setAttribute("aria-expanded","false"); hl = -1; };
  const evidenzia = i => {
    hl = i;
    Array.from(list.children).forEach((li, k) => li.classList.toggle("is-hl", k === hl));
    const el = list.children[hl];
    if(el && el.scrollIntoView) el.scrollIntoView({block:"nearest"});
  };
  const apri = (q, tutti) => {
    voci = tutti ? FARMACI.slice() : cerca(q, 60);
    if(!voci.length){
      list.innerHTML = '<li class="none">Nessun farmaco corrisponde a questa ricerca</li>';
    } else {
      list.innerHTML = voci.map((f, i) =>
        `<li role="option" data-i="${i}" data-id="${f.id}">${f.n}<small>${f.c}</small></li>`).join("");
      Array.from(list.children).forEach(li => {
        li.addEventListener("mousedown", e => { e.preventDefault(); scegli(+li.dataset.i); });
      });
    }
    box.classList.add("is-open"); inp.setAttribute("aria-expanded","true"); hl = -1;
  };
  const scegli = i => {
    const f = voci[i]; if(!f) return;
    inp.value = f.n; inp.dataset.fid = f.id; chiudi(); onPick && onPick(f);
  };

  inp.addEventListener("input", () => { delete inp.dataset.fid; apri(inp.value, false); onPick && onPick(null); });
  inp.addEventListener("focus", () => { if(inp.value.trim()) apri(inp.value, false); });
  inp.addEventListener("blur",  () => setTimeout(chiudi, 160));
  inp.addEventListener("keydown", e => {
    if(!box.classList.contains("is-open") && (e.key === "ArrowDown" || e.key === "Enter")){ apri(inp.value, false); return; }
    if(e.key === "ArrowDown"){ e.preventDefault(); evidenzia(Math.min(hl + 1, voci.length - 1)); }
    else if(e.key === "ArrowUp"){ e.preventDefault(); evidenzia(Math.max(hl - 1, 0)); }
    else if(e.key === "Enter"){
      e.preventDefault();
      if(hl >= 0) scegli(hl);
      else { const r = cerca(inp.value, 2); if(r.length === 1){ voci = r; scegli(0); } }
    }
    else if(e.key === "Escape") chiudi();
  });
  tgl.addEventListener("click", () => {
    if(box.classList.contains("is-open")){ chiudi(); return; }
    inp.focus();          // il focus puo' aprire l'elenco filtrato...
    apri("", true);       // ...ma la tendina mostra sempre tutti i farmaci
  });
  return inp;
}

/* Risolve il farmaco a partire dal campo: selezione esplicita, nome esatto, o match unico */
function trova(v){
  if(v && typeof v === "object" && v.dataset){
    if(v.dataset.fid) return IDX[v.dataset.fid] || null;
    v = v.value;
  }
  const t = norm((v||"").trim());
  if(!t) return null;
  if(byName[t]) return IDX[byName[t]];
  const r = cerca(v, 2);
  return r.length === 1 ? r[0] : null;
}

/* ---- Y-site ---- */
function boxVerdetto(v, a, b){
  const cls = {ok:"v-ok", no:"v-no", mid:"v-mid", nd:"v-nd"}[v.lvl];
  let h = `<div class="verdict ${cls}"><h3>${a.n} &nbsp;+&nbsp; ${b.n} — ${v.t}</h3><p>${v.msg}</p>`;
  if(v.phWarn) h += `<p><strong>pH:</strong> ${v.phWarn}</p>`;
  if(v.extra && v.extra.length) h += `<ul>${v.extra.map(x => `<li>${x}</li>`).join("")}</ul>`;
  const rub = [a, b].filter(x => x.ded || x.ves === "alto");
  if(rub.length) h += `<ul>${rub.map(x => `<li><strong>${x.n}:</strong> ${x.rub}</li>`).join("")}</ul>`;
  return h + "</div>";
}
function checkY(){
  const a = trova($("#yA")), b = trova($("#yB"));
  if(!a || !b){ $("#yResult").innerHTML = ""; return; }
  $("#yResult").innerHTML = boxVerdetto(verdetto(a, b), a, b);
}
makeCombo("yA", checkY);
makeCombo("yB", checkY);

/* ---- simulatore lume ---- */
let lume = [];
function renderLume(){
  $("#lumeChips").innerHTML = lume.map(id => `<button class="chip" data-rm="${id}">${IDX[id].n}</button>`).join("");
  $("#lumeChips").querySelectorAll("[data-rm]").forEach(b =>
    b.addEventListener("click", () => { lume = lume.filter(x => x !== b.dataset.rm); renderLume(); }));

  if(lume.length < 2){ $("#lumeOut").innerHTML = '<p class="empty">Aggiungi almeno due farmaci per generare la matrice.</p>'; return; }

  let rows = "", allarmi = [];
  for(let i = 0; i < lume.length; i++){
    for(let j = i + 1; j < lume.length; j++){
      const a = IDX[lume[i]], b = IDX[lume[j]], v = verdetto(a, b);
      const cl = {ok:"ok", no:"no", mid:"mid", nd:"nd"}[v.lvl];
      const et = {ok:"Compatibile", no:"INCOMPATIBILE", mid:"Rischio strutturale", nd:"Dato assente"}[v.lvl];
      rows += `<tr><td class="nm">${a.n}</td><td class="nm">${b.n}</td><td class="${cl}">${et}</td></tr>`;
      if(v.lvl === "no") allarmi.push(`Separare <strong>${a.n}</strong> e <strong>${b.n}</strong>: incompatibilita' documentata.`);
      if(v.lvl === "mid") allarmi.push(`Verificare <strong>${a.n}</strong> con <strong>${b.n}</strong>: divario di pH significativo.`);
    }
  }
  lume.map(id => IDX[id]).filter(f => f.ded).forEach(f =>
    allarmi.push(`<strong>${f.n}</strong> richiede linea o lume dedicato: non condividere la via.`));

  const nVes = lume.map(id => IDX[id]).filter(f => f.ves === "alto");
  if(nVes.length) allarmi.push(`Vescicanti ad alto rischio sulla via (${nVes.map(f => f.n).join(", ")}): accesso centrale, verifica del ritorno ematico, ispezione oraria, nessun bolo sul lume.`);

  $("#lumeOut").innerHTML =
    (allarmi.length ? `<div class="verdict v-mid" style="margin:14px 0"><h3>Allarmi di linea</h3><ul>${
      [...new Set(allarmi)].map(a => `<li>${a}</li>`).join("")}</ul></div>` :
      `<div class="verdict v-ok" style="margin:14px 0"><h3>Nessun allarme</h3><p>Nessuna incompatibilita' documentata tra i farmaci selezionati. Sorvegliare comunque la linea e verificare le concentrazioni in uso.</p></div>`) +
    `<div class="table-scroll"><table class="tbl"><thead><tr><th>Farmaco A</th><th>Farmaco B</th><th>Esito</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
makeCombo("lumeAdd", f => {
  if(!f) return;
  if(!lume.includes(f.id)) lume.push(f.id);
  const el = $("#lumeAdd"); el.value = ""; delete el.dataset.fid;
  renderLume();
});
$("#lumeClear").addEventListener("click", () => { lume = []; renderLume(); });

/* ---- tabelle statiche ---- */
$("#regoleY").innerHTML  = REGOLE.map(r => `<tr><td class="nm">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
$("#tblAccessi").innerHTML = ACCESSI.map(r => `<tr><td class="nm">${r[0]}</td><td>${r[1]}</td><td class="mono">${r[2]}</td><td class="mono">${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`).join("");
$("#stravaso").innerHTML = `<div class="table-scroll"><table class="tbl"><thead><tr><th>Fase</th><th>Azione</th><th>Nota</th></tr></thead><tbody>${
  STRAVASO.map(r => `<tr><td class="nm">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table></div>`;
$("#regoleRub").innerHTML = REGOLE_RUBINETTO.map(r => `<li>${r}</li>`).join("");

/* ---- vie ---- */
let accFiltro = "all";
function renderVie(){
  const cell = v => { const [l, c] = VIA_LBL[v] || VIA_LBL.no; return `<td class="${c}">${l}</td>`; };
  const lista = FARMACI.filter(f => {
    if(accFiltro === "cvc") return f.pvc === "no" || f.pvc === "temp";
    if(accFiltro === "pvc") return f.pvc === "si";
    if(accFiltro === "mid") return f.mid === "si";
    return true;
  });
  $("#tblVie").innerHTML = lista.map(f => {
    const [vl, vc] = VES_LBL[f.ves] || VES_LBL.no;
    return `<tr><td class="nm">${f.n}</td><td class="mono">${f.ph}</td><td class="mono">${f.osm}</td>
      <td><span class="badge ${vc}">${vl}</span></td>${cell(f.cvc)}${cell(f.pvc)}${cell(f.picc)}${cell(f.mid)}</tr>`;
  }).join("");
}
$$("#accFilter .chip").forEach(b => b.addEventListener("click", () => {
  accFiltro = b.dataset.acc;
  $$("#accFilter .chip").forEach(x => x.classList.toggle("is-on", x === b));
  renderVie();
}));

/* ---- boli ---- */
function renderBoli(){
  const q = norm($("#qBolo").value.trim());
  const lista = FARMACI.filter(f => !q || norm(f.n + " " + f.s + " " + f.bolo).includes(q));
  $("#tblBoli").innerHTML = lista.map(f =>
    `<tr><td class="nm">${f.n}</td><td>${f.bolo}</td><td>${f.prep}</td><td>${f.ded ? '<span class="no">Lume dedicato</span>' : (f.ves === "alto" ? '<span class="mid">Cautela: vescicante</span>' : '<span class="ok">Consentito su via lavata</span>')}</td></tr>`).join("");
}
$("#qBolo").addEventListener("input", renderBoli);

/* ---- calcolatore ---- */
const PRESET = {
  nora:{mg:8,  vol:50, u:"mg", mode:"mcgkgmin", d:0.1},
  adre:{mg:4,  vol:50, u:"mg", mode:"mcgkgmin", d:0.05},
  dobu:{mg:250,vol:50, u:"mg", mode:"mcgkgmin", d:5},
  dopa:{mg:400,vol:50, u:"mg", mode:"mcgkgmin", d:5},
  milr:{mg:20, vol:50, u:"mg", mode:"mcgkgmin", d:0.375},
  levo:{mg:12.5,vol:250,u:"mg",mode:"mcgkgmin", d:0.1},
  vaso:{mg:20, vol:50, u:"UI", mode:"UImin",    d:0.03},
  ntg: {mg:50, vol:50, u:"mg", mode:"mcgkgmin", d:0.5},
  snp: {mg:50, vol:250,u:"mg", mode:"mcgkgmin", d:0.3},
  esmo:{mg:2500,vol:250,u:"mg",mode:"mcgkgmin", d:50},
  prpf:{mg:1000,vol:50,u:"mg", mode:"mgkgh",    d:2},
  mida:{mg:100,vol:50, u:"mg", mode:"mgkgh",    d:0.05},
  dexm:{mg:200,vol:50, u:"mcg",mode:"mgkgh",    d:0.0007},
  remi:{mg:5,  vol:50, u:"mg", mode:"mcgkgmin", d:0.1},
  fent:{mg:2500,vol:50,u:"mcg",mode:"mgkgh",    d:0.002},
  cisa:{mg:150,vol:50, u:"mg", mode:"mcgkgmin", d:2},
  epar:{mg:25000,vol:50,u:"UI",mode:"UIkgh",    d:15},
  insu:{mg:50, vol:50, u:"UI", mode:"UImin",    d:0.033},
  furo:{mg:250,vol:50, u:"mg", mode:"mgh",      d:5},
  amio:{mg:900,vol:500,u:"mg", mode:"mgh",      d:37.5}
};
const FAT = {mg:1000, mcg:1, g:1e6, UI:1};

function popolaSelect(){
  const s = $("#cFarmaco");
  s.innerHTML = '<option value="">— generico / manuale —</option>' +
    Object.keys(PRESET).map(k => `<option value="${k}">${IDX[k].n}</option>`).join("");
  s.addEventListener("change", () => {
    const p = PRESET[s.value]; if(!p) return;
    $("#cMg").value = p.mg; $("#cVol").value = p.vol; $("#cUnit").value = p.u;
    $("#cMode").value = p.mode; $("#cDose").value = p.d; calcola("dose");
  });
}

function conc(){ // unita' base per mL (mcg/mL, oppure UI/mL)
  const q = parseFloat($("#cMg").value), v = parseFloat($("#cVol").value), u = $("#cUnit").value;
  if(!q || !v) return null;
  return {val: q * FAT[u] / v, isUI: u === "UI"};
}
function calcola(src){
  const c = conc(), peso = parseFloat($("#cPeso").value) || 70, mode = $("#cMode").value;
  const out = $("#cOut");
  if(!c){ out.innerHTML = '<p class="sub">Inserisci quantita\' e volume.</p>'; return; }
  const K = {mcgkgmin: peso*60, mcgmin: 60, mgh: 1/1000, mgkgh: peso/1000, UImin: 60, UIkgh: peso, ngkgmin: peso*60/1000};
  const k = K[mode]; // dose * k = unita' base / ora
  if(src === "dose"){
    const d = parseFloat($("#cDose").value) || 0;
    $("#cRate").value = (d * k / c.val).toFixed(2);
  } else {
    const r = parseFloat($("#cRate").value) || 0;
    $("#cDose").value = (r * c.val / k).toFixed(4);
  }
  const rate = parseFloat($("#cRate").value) || 0;
  const dose = parseFloat($("#cDose").value) || 0;
  const uLbl = c.isUI ? "UI/mL" : "mcg/mL";
  const f = IDX[$("#cFarmaco").value];
  let warn = "";
  if(f){
    if(f.ves === "alto") warn += `<div class="warn">${f.n}: vescicante ad alto rischio — accesso centrale, verifica del ritorno ematico, nessun bolo sul lume.</div>`;
    if(f.ded) warn += `<div class="warn">${f.n}: linea o lume dedicato.</div>`;
    warn += `<div class="warn">Range di riferimento: ${f.dose}</div>`;
  }
  out.innerHTML = `<div class="big">${rate.toFixed(2)} mL/h</div>
    <div class="sub">Concentrazione ${c.val.toFixed(2)} ${uLbl} — dose impostata ${dose} ${$("#cMode").selectedOptions[0].text} — peso ${peso} kg</div>${warn}`;
  ladder(k, c.val, dose);
}
function ladder(k, cval, dose){
  if(!dose){ $("#cLadder").innerHTML = ""; return; }
  const passi = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];
  const rows = passi.map(p => {
    const d = dose * p;
    return `<tr><td class="mono">${(+d.toPrecision(3))}</td><td class="mono">${(d*k/cval).toFixed(2)}</td><td>${p===1?'<span class="ok">dose impostata</span>':(p<1?'riduzione':'incremento')}</td></tr>`;
  }).join("");
  $("#cLadder").innerHTML = `<div class="table-scroll" style="margin-top:16px"><table class="tbl">
    <thead><tr><th>Dose</th><th>mL/h</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
["cPeso","cMg","cVol","cUnit","cMode","cDose"].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener("input", () => calcola("dose"));
  el.addEventListener("change", () => calcola("dose"));
});
$("#cRate").addEventListener("input", () => calcola("rate"));

/* ---- aiuto ---- */
$("#btnHelp").addEventListener("click", () => {
  $("#modalBody").innerHTML = `
   <div class="sheet-h"><h2>Metodo e fonti</h2><div class="cls">Come leggere e come non usare questo strumento</div></div>
   <div class="sec"><h4>Cosa contiene</h4><p>${FARMACI.length} molecole di uso corrente in terapia intensiva cardiochirurgica, con preparazione standard, schema di titolazione, bolo, pH, osmolarita', rischio vescicante, via di somministrazione ammessa e matrice di compatibilita' in Y.</p></div>
   <div class="sec"><h4>Come e' costruito il verdetto in Y</h4><p>Il motore interroga prima la matrice coppia-specifica (incompatibilita' e compatibilita' documentate). In assenza di dato applica le regole strutturali: divario di pH, natura dell'emulsione, presenza di calcio, obbligo di linea dedicata. Un esito &laquo;dato non disponibile&raquo; e' un invito alla prudenza, non un via libera.</p></div>
   <div class="sec"><h4>Limiti</h4><p>I dati di compatibilita' sono concentrazione-, solvente- e tempo-dipendenti. Le fonti primarie riportano condizioni sperimentali (di norma osservazione a 1–4 ore a temperatura ambiente) che non coincidono sempre con la pratica. Alcune incompatibilita' producono precipitati submicroscopici non visibili. Le vie di somministrazione riflettono i criteri INS 2024, ERPIUP e GAVeCeLT 2024, ma la decisione finale spetta al protocollo aziendale.</p></div>
   <div class="sec"><h4>Fonti di riferimento</h4><p>Trissel's Handbook on Injectable Drugs; King Guide to Parenteral Admixtures; Riassunti delle Caratteristiche del Prodotto (AIFA/EMA); INS Infusion Therapy Standards of Practice, 9ª edizione, 2024; Gorski et al., Development of an Evidence-Based List of Non-Antineoplastic Vesicants, 2024 Update, J Infus Nurs; ERPIUP consensus (WoCoVA); Raccomandazioni GAVeCeLT 2024; linee guida ESC/EACTS, STS/SCA/AmSECT, ESAIC, Surviving Sepsis Campaign, ERAS Cardiac Society.</p></div>
   <div class="sec"><h4>Responsabilita'</h4><p>Strumento di supporto formativo e decisionale per professionisti sanitari. Non sostituisce il giudizio clinico, la scheda tecnica, il protocollo aziendale ne' la consulenza del farmacista ospedaliero.</p></div>`;
  $("#modal").classList.add("is-open");
});

/* ---- avvio ---- */
$("#build").textContent = BUILD;
initChips(); render(); renderVie(); renderBoli(); popolaSelect(); calcola("dose"); renderLume();

/* ============================================================================
   PWA INTEGRATA — nessun file esterno richiesto
   Il manifest e le icone sono incorporati qui e vengono generati a runtime.
   Perche' Chrome proponga "Installa app" la pagina deve essere servita da un
   indirizzo https:// (GitHub Pages). Aperta come file locale resta un semplice
   documento HTML: funziona tutto, ma non e' installabile.
   ========================================================================== */
const ICONE = {
  i192: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAIAAADdvvtQAAAEoElEQVR4nO3dMU4cQRBG4cUyZOQEJFhywLF8ByTOgMQdfDBLJuEGhCQOVl4hm+3p7r+6eqr6fRESEgzUo2Z2F4aLq5v7A9Dry+wDQGwEBAkBQUJAkBAQJAQECQFBQkCQEBAkX+d++svr27kHkMP72+usTz0hIKIx9/Fb6hyTX0B04+P0ffYpySMg0pni+G0fndHYgEhnutEZjQqIdHZlXEb2AZHObo3IyPh5IOrZP9sZWQZEPVEYTsrmFEY64Vidzgw2EPXEpc9ODYh6ohMnKAVEPTkoc+wPiHoy6Z4mv84BSWdArJ98+mbaExD1ZNUx2eaAqCe31vlyDQRJW0CsnxU0TZkNBElDQKyfddTPmg0ESW1ArJ/VVE6cDQRJVUCsnzXVzJ0NBAkBQbIdEOevlW1Onw0ECQFBQkCQbATEBRDKDbCBICEgSAgIEgKChIAgISBICAgSAoKEgCAhIEgICBICgoSAICEgSAgIEgKChIAgISBICAgSAoKEgCAhIEgICBICgoSAICEgSAgIEgKChIAgISBICAgSm3/7vQd3z4/HN14enuYeyVKSbKBTPf+8jdHCB/RpLnfPj2TkI3xAh78NceaaInZAnLmmix1QGUk5CBwQfexB4ICwB1GfB7JdPzyH1I0N9O+VOGfGJskDKtdwLhcaqhcyIIcB01ClkAH5oKEa8QKymmvNx6GhTfECckZDZfkDooChggU0pQYSLAgWUEHTc4CtTdDQOZECmjtFGvqU60sZ42Zg9RLEy8NT4SCjNOT5gkykDdQtyuAjyhBQ6w9cuSdeT22SIaATwxOZycdZQfiADIf98UPRUKXwAY1DQzUCB/Ty8FQ/49N1T9MFNQ1tihqQ22ibMl3QxdXNfeHdl9e3bodi5dyOOXZQfi8+9f72eu5dUTcQdmKtgHhG0dxCAVHPCAsFVMAFULeEAVGDp4QBwRMBQUJAkBAQ10ySnAHRhJucAcENAUGyekCc7ESrBwRR2oBYLT7SBgQfSwfEltItHRB0BARJ5oA4QznIHFAZeZlYNyCYICBICAgSAoIkeUDnrpS5graSPCCMlj+g/5cN68dQ/oAO3DlqpIR354A57s6BUQgIEgKChIAgISBICAgSAoKEgCAhIEgICBICgoSAICEgSAgIEtd/uuvj98/vsw+h5NuPX7MPwVK2DbTzeg4RjrBJqoCizCbKcdZIFRD8ERAkGwEVfhl2h6Jcn0Y5zqNyA9k20P5ns/8jbLLxVxkH/jBjeWttIDjbDijWZRBsbU6fDQQJAUFSFRBnsTXVzJ0NBEltQCyh1VROnA0ESUNALKF11M+aDQRJW0AsoRU0TZkNBElzQCyh3Frn27OBaCirjsl2nsJoKJ++mXINBEl/QCyhTLqnKW0gGspBmaN6CqOh6MQJGlwD0VBc+uxs/jb+eBz8+n0gVj/2lo/CWEVRGE7K+GE8De2f7Yzsb+/C6Wy3Rvx4j7o/EBntyrgzw9gbTJHRdKMvKjzuUEZGU/hcj/rd4u709VDSUM6PYybcI/HjV0hMJiY++J18k00e9kfHr3NAQkCQEBAkBAQJAUFCQJAQECQEBMkf+rgznkqBxI8AAAAASUVORK5CYII=",
  i512: "data:image/png;base64,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",
  imask: "data:image/png;base64,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"
};

(function installabile(){
  try{
    const manifest = {
      name: "ICU Pharma Cardio",
      short_name: "ICU Pharma",
      description: "Terapia infusionale in Terapia Intensiva Cardiochirurgica: titolazione, compatibilita in Y, accessi vascolari, boli.",
      lang: "it",
      start_url: location.href.split("#")[0],
      scope: "./",
      id: location.pathname,
      display: "standalone",
      orientation: "portrait-primary",
      background_color: "#061829",
      theme_color: "#0B2545",
      categories: ["medical", "productivity"],
      icons: [
        { src: ICONE.i192,  sizes: "192x192", type: "image/png", purpose: "any" },
        { src: ICONE.i512,  sizes: "512x512", type: "image/png", purpose: "any" },
        { src: ICONE.imask, sizes: "512x512", type: "image/png", purpose: "maskable" }
      ]
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(manifest)], {type:"application/manifest+json"}));
    const l = document.createElement("link"); l.rel = "manifest"; l.href = url;
    document.head.appendChild(l);

    const t = document.createElement("link"); t.rel = "apple-touch-icon"; t.href = ICONE.i192;
    document.head.appendChild(t);
    const fav = document.createElement("link"); fav.rel = "icon"; fav.type = "image/png"; fav.href = ICONE.i192;
    document.head.appendChild(fav);
  } catch(e){ console.warn("Manifest non generato:", e); }
})();
