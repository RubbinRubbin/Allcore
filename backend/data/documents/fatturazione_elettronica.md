# Fatturazione Elettronica - Guida Completa PMI

## Obbligo di Fatturazione Elettronica

### Soggetti Obbligati (dal 2024)
- Tutte le imprese e professionisti con partita IVA
- Forfettari con ricavi > 25.000 euro (dal 2024 tutti i forfettari)
- Associazioni in regime 398/91

### Soggetti Esclusi
- Operatori sanitari per prestazioni a privati (per tutela privacy)
- Soggetti non residenti senza stabile organizzazione in Italia

## Sistema di Interscambio (SDI)

### Cos'è
Il Sistema di Interscambio è la piattaforma dell'Agenzia delle Entrate che:
- Riceve le fatture elettroniche
- Effettua controlli formali
- Consegna le fatture ai destinatari

### Codice Destinatario
- Codice a 7 caratteri alfanumerici
- Identifica il canale di ricezione del destinatario
- Se non noto: usare "0000000" + PEC destinatario

## Formato XML

### Struttura del File
- Formato: XML conforme a specifiche tecniche AdE
- Nome file: codice paese + identificativo univoco + progressivo
- Esempio: IT01234567890_00001.xml

### Dati Obbligatori
1. Dati identificativi cedente/prestatore
2. Dati identificativi cessionario/committente
3. Data e numero fattura
4. Natura, quantità e qualità beni/servizi
5. Corrispettivi e aliquote IVA
6. Codice destinatario o PEC

## Tempistiche

### Emissione Fattura Immediata
- **Entro 12 giorni** dalla data dell'operazione
- Data documento = data operazione
- Data trasmissione può essere successiva (entro 12 giorni)

### Fattura Differita
- **Entro il 15** del mese successivo
- Per cessioni documentate da DDT
- Per prestazioni con documentazione idonea

### Termini di Trasmissione
| Tipo Operazione | Termine |
|-----------------|---------|
| Operazioni immediate | 12 giorni dalla data operazione |
| Operazioni differite | 15 del mese successivo |
| Autofatture reverse charge | 15 del mese successivo all'operazione |

## Conservazione Digitale

### Obblighi
- Conservazione per **10 anni**
- Formato digitale con firma elettronica
- Rispetto requisiti CAD (Codice Amministrazione Digitale)

### Servizio Gratuito AdE
- L'Agenzia delle Entrate offre conservazione gratuita
- Adesione tramite Fatture e Corrispettivi
- Validità legale garantita

## Codici Natura IVA

### Operazioni senza Addebito IVA
| Codice | Descrizione |
|--------|-------------|
| N1 | Escluse ex art. 15 |
| N2.1 | Non soggette - cessioni extra UE |
| N2.2 | Non soggette - altri casi |
| N3.1 | Non imponibili - esportazioni |
| N3.2 | Non imponibili - cessioni intra UE |
| N3.3 | Non imponibili - San Marino/Vaticano |
| N3.5 | Non imponibili - dichiarazione intento |
| N3.6 | Non imponibili - altre operazioni |
| N4 | Esenti |
| N5 | Regime del margine |
| N6.1 | Reverse charge - cessione rottami |
| N6.2 | Reverse charge - cessione oro/argento |
| N6.3 | Reverse charge - subappalto edilizia |
| N6.9 | Reverse charge - altri casi |
| N7 | IVA assolta in altro stato UE |

## Sanzioni

### Mancata Emissione
- Dal 90% al 180% dell'IVA (minimo 500 euro)
- Per operazioni non imponibili: da 250 a 2.000 euro

### Emissione Tardiva
- Sanzione fissa se la violazione non incide sulla liquidazione IVA
- Regolarizzazione entro termini liquidazione: ravvedimento possibile

### Ravvedimento Operoso
| Termine | Riduzione Sanzione |
|---------|-------------------|
| Entro 90 giorni | 1/9 del minimo |
| Entro 1 anno | 1/8 del minimo |
| Entro 2 anni | 1/7 del minimo |
| Oltre 2 anni | 1/6 del minimo |

## Strumenti e Software

### Gratuiti (Agenzia delle Entrate)
- Portale "Fatture e Corrispettivi"
- App "FatturAE" per smartphone
- Procedura web per creazione e invio

### Software Gestionali
- Integrazione con ERP aziendali
- Invio massivo tramite canali accreditati
- Archiviazione automatica

## Consigli Operativi

1. **Verificare sempre il codice destinatario** prima dell'invio
2. **Controllare le notifiche SDI** (esito positivo/negativo)
3. **Conservare le notifiche** insieme alle fatture
4. **Monitorare il cassetto fiscale** per fatture ricevute
5. **Automatizzare** i processi con software gestionali
