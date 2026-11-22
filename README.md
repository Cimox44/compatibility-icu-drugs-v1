# ICU Pharma Cardio — v2.2 (22/11/2026)

PWA di supporto per la terapia infusionale in Terapia Intensiva Cardiochirurgica: 188 farmaci, compatibilità in Y, simulatore di lume, accesso vascolare, calcolatore di titolazione, boli ed emergenze.

> Strumento di supporto decisionale. Non sostituisce RCP, protocolli aziendali né la consulenza del farmacista. Assenza di dato ≠ compatibilità.

## File
| File | Ruolo |
|---|---|
| index.html | interfaccia |
| app.js | dati dei 188 farmaci, motore di compatibilità, calcolatore |
| style.css | grafica |
| manifest.json | installazione come app |
| sw.js | funzionamento offline (cache `icu-pharma-cardio-v2.2`) |
| icon-192.png, icon-512.png, icon-512-maskable.png | icone |
| README.md | questo file |

## Novità v2.2 (22/11/2026)
**Modalità, tempi di somministrazione e stabilità — 112 farmaci**
Categorie complete: vasopressori e inotropi (17), vasodilatatori e antipertensivi (19), antiaritmici (12), sedazione/analgesia/anestetici (19), bloccanti neuromuscolari e reversal (8), antimicrobici (37). Per ognuno:
- modalità (bolo diretto, bolo diluito, infusione intermittente, continua, MAI in bolo);
- tempo del bolo (secondi/minuti, velocità massima);
- durata/velocità dell'infusione;
- stabilità dopo ricostituzione e diluizione (ore, temperatura, regola microbiologica);
- cambio di siringa, sacca e deflussore;
- fonte (RCP AIFA/EMA o SmPC) con link, livello di certezza e «Note di verifica» (differenze tra RCP e scheda, usi off-label).
Visibili nella scheda e nella vista «Boli & emergenze» (nuove colonne e filtri: bolo ammesso, MAI in bolo, intermittente, continua). Le altre categorie saranno completate nella revisione di gennaio 2027.

**Diluenti corretti secondo RCP**: blu di metilene (solo G5%, mai NaCl), vasopressina (solo NaCl 0,9%), fosfomicina ev (G5% o acqua ppi, mai NaCl), cotrimossazolo (anche NaCl 0,9%), idralazina (glucosata incompatibile), sugammadex (diluizione solo NaCl). Matrice soluzioni aggiornata per 24 farmaci (Ringer lattato/acetato, glucosata, acqua ppi).

## Novità v2.1 (22/11/2026)
**Nuova funzione: compatibilità con le soluzioni e vie di infusione**
- Per tutti i 188 farmaci: NaCl 0,9%, glucosata 5%, Ringer lattato, Ringer acetato, acqua ppi (ricostituzione), con codici Sì / Preferita / Stabilità ridotta / No / Dato n.d. / Non applicabile.
- Riepilogo vie: periferica, CVC, midline, PICC.
- Visibile nella scheda farmaco e in una nuova tabella filtrabile nella vista «Accesso vascolare».
- I dati derivano dal campo «solvente» di ogni scheda e dagli RCP citati; per i Ringer il dato è spesso assente («Dato n.d.»): assenza di dato ≠ compatibilità.

**Correzioni**
- Pantoprazolo (RCP Pantorc, par. 6.3 e 6.6): ricostituzione solo con NaCl 0,9%, diluizione in NaCl 0,9% **o G5%**; la soluzione ricostituita è normalmente **giallognola** (la v2.0 indicava di scartarla se ingiallita); stabilità 12 h a 25 °C.
- Motore Y: coppie senza dato in cui un farmaco richiede linea dedicata (emoderivati, propofol, fenitoina…) → «Attenzione — linea dedicata richiesta» invece di «Dato non disponibile».
- Preset bivalirudina allineato alla scheda (250 mg/500 mL = 0,5 mg/mL; 0,15 mg/kg/h).
- Noradrenalina: target PAM nello shock settico secondo Surviving Sepsis Campaign 2026.
- Finestra «Metodo e fonti»: attributo aria-hidden corretto; fonti aggiornate (SSC 2026).

## Novità v2.0
**Calcolatore (riscritto)**
- Le modalità in mg (mg/h, mg/kg/h) davano «0,00 mL/h» (propofol, furosemide, amiodarone, fentanil, dexmedetomidina): ora tutte le unità sono convertite correttamente (ng, mcg, mg, g, UI, mEq; per kg; per min/h).
- Il peso vuoto non viene più sostituito da 70 kg: il calcolo per kg si blocca con un avviso.
- Il cambio di unità converte la dose (la velocità resta invariata).
- Calcolo bidirezionale dose ⇄ mL/h; preset per circa 50 farmaci; avvisi per valori negativi, unità non convertibili, < 0,1 e > 200 mL/h.

**Motore di compatibilità in Y**
- 11 coppie con dati discordanti in letteratura → «Dati discordanti — linee separate».
- Soglie del pH ora inclusive (≥ 9, ≥ 8).
- Farmaci che richiedono linea dedicata: una compatibilità riportata diventa «Attenzione».

**Correzioni cliniche**: enoximone (diluente e contenitori, RCP), fenilefrina (categoria), terlipressina (EMA 2022), angiotensina II (concentrazione × 1000), nitroglicerina, amiodarone (RCP italiano), adenosina (ERC 2021), propofol (PADIS 2025, età ≤16 anni), dexmedetomidina (PADIS 2025, DECADE), cisatracurio (RCP ICU, reversal), eparina (ELSO 2021), calcio gluconato, paracetamolo.

**PWA**: manifest e icone reali, service worker (prima la rete per la pagina, cache per i file), funzionamento offline.

## Aggiornare
1. Caricare tutti i file nella radice della repository (Add file → Upload files → Commit).
2. A ogni modifica aumentare la versione `CACHE` in `sw.js` (es. `icu-pharma-cardio-v2.3`) e `BUILD` in `app.js`.
3. Sul telefono: aprire l'app online e chiuderla/riaprirla due volte; se resta la versione vecchia, disinstallarla e reinstallarla.

## Limiti
Le coppie di compatibilità non sono state riverificate una per una su Trissel's/Stabilis: validarle con la farmacia ospedaliera prima dell'uso clinico.
