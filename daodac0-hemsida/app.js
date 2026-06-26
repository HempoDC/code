// Course Syllabus Data Model
const COURSE_DATA = {
    courseCode: "DAODAC0",
    points: 100,
    title: "Dator- och nätverksteknik",
    modules: [
        {
            id: 1,
            num: "Del 1",
            title: "Datorsystems uppbyggnad hårdvara",
            time: "ca 25%",
            syllabus: [
                "Hårdvaruinstallation, uppbyggnad, konfigurering och uppgradering av datorer och datorsystem.",
                "Olika processortyper och deras användningsområden.",
                "Prestanda för olika datalagringmedia. Lagring av data på optiska medier.",
                "Interna och externa bussar, deras användningsområden och prestanda.",
                "Datorns start- och bootsekvenser samt inställning och uppgradering av dess BIOS (Basic Input/Output System) eller firmware."
            ],
            resources: [
                { title: "Datorteknik (2019) Översikt av persondatorn", type: "video", url: "videos/pc/pc16.html", diff: "enkel" },
                { title: "Praktisk uppgift - Undersök en Persondator", type: "lab", url: "labbar/doc-Övningar_Undersök_persondator.pdf", diff: "enkel" },
                { title: "Datorteknik (2019) Datorns historik och utveckling", type: "video", url: "videos/pc/pc17.html", diff: "enkel" },
                { title: "Datorteknik (2019) Binär data och lagring", type: "video", url: "videos/pc/pc18.html", diff: "enkel" },
                { title: "Persondatorn, historik och lagring", type: "quiz", url: "quiz/quiz27.html", diff: "enkel" },
                { title: "Datorteknik (2019) Räkna binärt", type: "video", url: "videos/pc/pc19.html", diff: "enkel" },
                { title: "Talsystem - Binära tal med övningar", type: "lab", url: "labbar/doc-Talsystem-Binära_Tal_med_övningar.pdf", diff: "enkel" },
                { title: "Datorteknik (2019) Moderkortet Del 1", type: "video", url: "videos/pc/pc20.html", diff: "enkel" },
                { title: "Datorteknik (2019) Moderkortet Del 2", type: "video", url: "videos/pc/pc21.html", diff: "enkel" },
                { title: "Binära tal och moderkortet", type: "quiz", url: "quiz/quiz28.html", diff: "enkel" },
                { title: "Övningar - Datorteknik, datorsystem, moderkortet, binära tal", type: "lab", url: "labbar/doc-Övningar_datorteknik_datorsystem_moderkort_binära_tal.pdf", diff: "enkel" },
                { title: "Övningar - Praktiskt om moderkortet", type: "lab", url: "labbar/doc-Övningar_datorteknik_Moderkortet.pdf", diff: "enkel" },
                { title: "Datorteknik (2019) Processorn Del 1", type: "video", url: "videos/pc/pc22.html", diff: "enkel" },
                { title: "Datorteknik (2019) Processorn Del 2", type: "video", url: "videos/pc/pc23.html", diff: "enkel" },
                { title: "Datorteknik (2019) Arbetsminnet (RAM)", type: "video", url: "videos/pc/pc24.html", diff: "enkel" },
                { title: "Processorn och arbetsminnet", type: "quiz", url: "quiz/quiz29.html", diff: "enkel" },
                { title: "Datorteknik (2019) Hårddisken (HDD)", type: "video", url: "videos/pc/pc25.html", diff: "enkel" },
                { title: "M.2 Gränssnittet", type: "video", url: "videos/pc/pc15.html", diff: "enkel" },
                { title: "Datorteknik (2019) Nätaggregatet (PSU)", type: "video", url: "videos/pc/pc26.html", diff: "enkel" },
                { title: "Hårddisken och Nätaggregatet", type: "quiz", url: "quiz/quiz30.html", diff: "enkel" },
                { title: "Datorteknik (2019) Grafikkort och expansionskort", type: "video", url: "videos/pc/pc27.html", diff: "enkel" },
                { title: "Köpa dator i delar", type: "lab", url: "labbar/Laboration-Köpa_dator_i_delar.pdf", diff: "enkel" },
                { title: "Datorteknik (2019) ESD", type: "video", url: "videos/pc/pc28.html", diff: "enkel" },
                { title: "Bygga dator", type: "lab", url: "labbar/Laboration-Bygga_dator.pdf", diff: "enkel" },
                { title: "Datorteknik (2019) USB och Externa gränssnitt", type: "video", url: "videos/pc/pc29.html", diff: "enkel" },
                { title: "Grafikkort, ESD och Externa gränssnitt", type: "quiz", url: "quiz/quiz31.html", diff: "enkel" },
                { title: "Datorteknik (2019) Möss, tangentbord och bildskärmar", type: "video", url: "videos/pc/pc30.html", diff: "enkel" },
                { title: "Övningar - Datorteknik HDD, RAM och externa enheter", type: "lab", url: "labbar/doc-Övningar_datorteknik_RAM_HDD_externa_enheter.pdf", diff: "enkel" },
                { title: "Övningar - Datorteknik nätaggregat", type: "lab", url: "labbar/doc-Övningar_datorteknik_nätaggregat.pdf", diff: "enkel" },
                { title: "Övningar - Datorteknik processorer", type: "lab", url: "labbar/doc-Övningar_datorteknik_processorer.pdf", diff: "enkel" },
                { title: "Övningar - Datorteknik RAM", type: "lab", url: "labbar/doc-Övningar_datorteknik_RAM.pdf", diff: "enkel" },
                { title: "Driftsäkerhet - Hårdvara", type: "video", url: "videos/misc/misc08.html", diff: "enkel" }
            ],
            matrix: [
                {
                    e: "Eleven beskriver översiktligt hur datorer är uppbyggda och fungerar samt hur driftsäkerhet uppnås.",
                    c: "Eleven beskriver utförligt hur datorer är uppbyggda och fungerar samt hur driftsäkerhet uppnås.",
                    a: "Eleven beskriver utförligt och nyanserat hur datorer är uppbyggda och fungerar samt hur driftsäkerhet uppnås."
                },
                {
                    e: "Eleven planerar och utför i samråd med handledare och med visst handlag hårdvaruinstallation, uppbyggnad, konfigurering, uppgradering och optimering i datorer och datorsystem.",
                    c: "Eleven planerar och utför efter samråd med handledare och med visst handlag hårdvaruinstallation, uppbyggnad, konfigurering, uppgradering och optimering i datorer och datorsystem.",
                    a: "Eleven planerar och utför efter samråd med handledare och med visst handlag hårdvaruinstallation, uppbyggnad, konfigurering, uppgradering och optimering i datorer och datorsystem."
                },
                {
                    e: "Eleven hanterar med visst handlag utrustning och verktyg samt utför arbetet på ett säkert sätt.",
                    c: "Eleven hanterar med gott handlag utrustning och verktyg samt utför arbetet på ett säkert sätt.",
                    a: "Eleven hanterar med mycket gott handlag utrustning och verktyg samt utför arbetet på ett säkert sätt."
                }
            ],
            assessment: "Prov som med fördel kan baseras på övningsuppgifterna samt praktiskt prov och inlämningar.",
            comments: "Bör kompletteras med mer praktiska uppgifter om BIOS. Lite nyare siffror på lagringsmedia, kapacitet och priser har ändrats lite. Nyare versioner av PCI-express men sammantaget inga större förändringar på hårdvarusidan."
        },
        {
            id: 2,
            num: "Del 2",
            title: "Datorsystems uppbyggnad OS",
            time: "ca 25%",
            syllabus: [
                "Vanliga operativsystem och deras egenskaper.",
                "Mjukvaruinstallation, uppbyggnad, konfigurering och uppgradering av datorer och datorsystem.",
                "Säkerhetskopiering och virusskydd.",
                "Konfigurering av grafikkort."
            ],
            resources: [
                { title: "Operativsystem - Introduktion och viktiga begrepp", type: "video", url: "videos/windows/win01.html", diff: "enkel" },
                { title: "Operativsystem - Intro och viktiga begrepp", type: "quiz", url: "quiz/quiz33.html", diff: "enkel" },
                { title: "Windowshistorik - En översikt", type: "video", url: "videos/windows/win02.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 01 Versioner", type: "video", url: "videos/windows/win101.html", diff: "enkel" },
                { title: "Windowshistorik och olika versioner", type: "quiz", url: "quiz/quiz34.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 02 Installation", type: "video", url: "videos/windows/win102.html", diff: "enkel" },
                { title: "Laboration - Windows 10 Installation", type: "lab", url: "labbar/Laboration-Windows_10-Installation.pdf", diff: "svår" },
                { title: "Windows 11 - Nyheter och Översikt", type: "video", url: "videos/windows/win135.html", diff: "enkel" },
                { title: "Windows 11 - Installation", type: "video", url: "videos/windows/win136.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 03 GUI", type: "video", url: "videos/windows/win103.html", diff: "enkel" },
                { title: "Använda Windows 7 del1 (Valfri komplement)", type: "video", url: "videos/windows/win07.html", diff: "enkel" },
                { title: "Använda Windows 7 del2 (Valfri komplement)", type: "video", url: "videos/windows/win08.html", diff: "enkel" },
                { title: "Använda Windows 7 del3 (Valfri komplement)", type: "video", url: "videos/windows/win09.html", diff: "enkel" },
                { title: "Installera och använda Windows 7", type: "quiz", url: "quiz/quiz35.html", diff: "enkel" },
                { title: "DOS kommandon", type: "lab", url: "labbar/doc-DOS_kommandon.pdf", diff: "svår" },
                { title: "Övningar - DOS kommandon", type: "lab", url: "labbar/doc-DOS_kommandon-övningar.pdf", diff: "svår" },
                { title: "Powershell - Introduktion", type: "video", url: "videos/windows/win84.html", diff: "enkel" },
                { title: "Powershell - Filhantering", type: "video", url: "videos/windows/win85.html", diff: "enkel" },
                { title: "Laboration - Powershell Introduktion", type: "lab", url: "labbar/Laboration-Powershell_01-Introduktion.pdf", diff: "svår" },
                { title: "Laboration - Powershell Filhantering", type: "lab", url: "labbar/Laboration-Powershell_02-Filhantering.pdf", diff: "svår" },
                { title: "Starta och avsluta Windows 7 (Valfri komplement)", type: "video", url: "videos/windows/win10.html", diff: "enkel" },
                { title: "Anpassa Windows 7", type: "video", url: "videos/windows/win11.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 04 Medföljande program", type: "video", url: "videos/windows/win104.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 05 Mer om program", type: "video", url: "videos/windows/win105.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 06 Filhantering", type: "video", url: "videos/windows/win106.html", diff: "enkel" },
                { title: "Övningar - Datorteknik Windows", type: "lab", url: "labbar/doc-Övningar_datorteknik_Windows.pdf", diff: "enkel" },
                { title: "Laboration - Windows 10 Inställningar", type: "lab", url: "labbar/Laboration-Windows_10-MD-100_Inställningar.pdf", diff: "svår" },
                { title: "Laboration - Windows 10 Uppdateringar", type: "lab", url: "labbar/Laboration-Windows_10-MD-100_Uppdateringar.pdf", diff: "svår" },
                { title: "Vad är Linux?", type: "video", url: "videos/linux/linux01.html", diff: "enkel" },
                { title: "Översikt av de populäraste linuxdistributionerna", type: "video", url: "videos/linux/linux02.html", diff: "enkel" },
                { title: "Datorsäkerhet - Malware", type: "video", url: "videos/misc/misc06.html", diff: "enkel" },
                { title: "Driftsäkerhet - Mjukvara", type: "video", url: "videos/misc/misc09.html", diff: "enkel" },
                { title: "Microsoft Azure - Introduktion till Molnet (Valfritt)", type: "video", url: "videos/windows/win91.html", diff: "enkel" },
                { title: "Microsoft Azure - Introduktion till Azure (Valfritt)", type: "video", url: "videos/windows/win92.html", diff: "enkel" },
                { title: "Microsoft Azure - Virtuella Maskiner (Valfritt)", type: "video", url: "videos/windows/win139.html", diff: "enkel" },
                { title: "Microsoft 365 - Introduktion till Molnet (Valfritt)", type: "video", url: "videos/windows/win120.html", diff: "enkel" },
                { title: "Microsoft 365 - Introduktion till Microsoft 365 (Valfritt)", type: "video", url: "videos/windows/win121.html", diff: "enkel" },
                { title: "Laboration - Microsoft 365 Skapa en Trial Tenant", type: "lab", url: "labbar/Laboration-Office365-Skapa_Trial_Tenant.pdf", diff: "svår" }
            ],
            matrix: [
                {
                    e: "Eleven beskriver översiktligt hur datorer fungerar samt hur driftsäkerhet uppnås.",
                    c: "Eleven beskriver utförligt hur datorer fungerar samt hur driftsäkerhet uppnås.",
                    a: "Eleven beskriver utförligt och nyanserat hur datorer fungerar samt hur driftsäkerhet uppnås."
                },
                {
                    e: "Eleven planerar och utför i samråd med handledare och med visst handlag mjukvaruinstallation, uppbyggnad, konfigurering, uppgradering och optimering i datorer och datorsystem.",
                    c: "Eleven planerar och utför efter samråd med handledare och med visst handlag mjukvaruinstallation, uppbyggnad, konfigurering, uppgradering och optimering i datorer och datorsystem.",
                    a: "Eleven planerar och utför efter samråd med handledare och med visst handlag mjukvaruinstallation, uppbyggnad, konfigurering, uppgradering och optimering i datorer och datorsystem."
                }
            ],
            assessment: "Prov som med fördel kan baseras på övningsuppgifterna samt praktiskt prov och inlämningar.",
            comments: "Olika operativsystem bör behandlas. Fördelningen mellan Microsoft Windows och Linux kan justeras beroende på ifall eleverna läst andra kurser inom ämnet innan eller ej. I detta upplägg är det fokus på Windows men det finns gott om Linux-material att komplettera med på hemsidan. En tydligare labb med grafikkort kan behövas. Uppdaterat lite om Windows 11 (hösten/våren 2022/2023). Lagt till introduktion till Molnet (Azure/Microsoft 365) samt introduktion till Powershell."
        },
        {
            id: 3,
            num: "Del 3",
            title: "Nätverksuppbyggnad",
            time: "ca 25%",
            syllabus: [
                "Lokala nätverk, uppbyggnad och arbetssätt.",
                "Protokoll för dataöverföring via nätverk.",
                "Begreppen switchning och routning.",
                "Begreppet virtuella nät."
            ],
            resources: [
                { title: "Nätverksteknik 01 - Begrepp och standarder", type: "video", url: "videos/network/network38.html", diff: "enkel" },
                { title: "Protokoll och standarder del1 - Intro och Ethernet", type: "video", url: "videos/network/network2.html", diff: "enkel" },
                { title: "Nätverksteknik 02 - Begrepp del 2", type: "video", url: "videos/network/network39.html", diff: "enkel" },
                { title: "Nätverksteknik 03 - TCP IP Introduktion", type: "video", url: "videos/network/network40.html", diff: "enkel" },
                { title: "Nätverksteknik 05 - Ethernet", type: "video", url: "videos/network/network42.html", diff: "enkel" },
                { title: "Introduktion till nätverk samt Protokoll del1 (Ethernet)", type: "quiz", url: "quiz/quiz38.html", diff: "enkel" },
                { title: "Nätverksteknik 06 - IPv4 Del 1", type: "video", url: "videos/network/network43.html", diff: "enkel" },
                { title: "Nätverksteknik 07 - IPv4 Del 2", type: "video", url: "videos/network/network44.html", diff: "enkel" },
                { title: "Nätverksteknik 08 - IPv4 Del 3", type: "video", url: "videos/network/network45.html", diff: "avancerad" },
                { title: "Nätverksteknik 09 - ARP", type: "video", url: "videos/network/network46.html", diff: "enkel" },
                { title: "IPv4 och ARP", type: "quiz", url: "quiz/quiz39.html", diff: "enkel" },
                { title: "Enkla IPv4-Övningar", type: "lab", url: "labbar/doc-Enkla_IPv4-övningar.pdf", diff: "enkel" },
                { title: "IPv4 - Lätt", type: "quiz", url: "quiz/quiz01.html", diff: "enkel" },
                { title: "Nätverksteknik 11 - UDP", type: "video", url: "videos/network/network48.html", diff: "enkel" },
                { title: "Nätverksteknik 12 - TCP Del 1", type: "video", url: "videos/network/network49.html", diff: "enkel" },
                { title: "Nätverksteknik 13 - TCP Del 2", type: "video", url: "videos/network/network50.html", diff: "avancerad" },
                { title: "TCP, UDP och Tjänster", type: "quiz", url: "quiz/quiz40.html", diff: "enkel" },
                { title: "Protokoll och standarder del4 - Routing och NAT", type: "video", url: "videos/network/network5.html", diff: "enkel" },
                { title: "Protokoll och standarder del5 - IPv6", type: "video", url: "videos/network/network6.html", diff: "avancerad" },
                { title: "Routing, NAT och IPv6", type: "quiz", url: "quiz/quiz41.html", diff: "enkel" },
                { title: "Nätverksteknik 16 - DNS Del 1 av 2", type: "video", url: "videos/network/network53.html", diff: "enkel" },
                { title: "Nätverksteknik 16 - DNS Del 2 av 2", type: "video", url: "videos/network/network54.html", diff: "enkel" },
                { title: "Protokoll och standarder del7 - WLAN", type: "video", url: "videos/network/network8.html", diff: "enkel" },
                { title: "Namnuppslagning och WLAN", type: "quiz", url: "quiz/quiz42.html", diff: "enkel" },
                { title: "OSI-modellen", type: "video", url: "videos/network/network9.html", diff: "enkel" },
                { title: "Nätverksteknik 04 - OSI-Modellen", type: "video", url: "videos/network/network41.html", diff: "enkel" },
                { title: "Nätverksutrustning - del1", type: "video", url: "videos/network/network10.html", diff: "enkel" },
                { title: "Nätverksutrustning - del2 (Kablar och kontakter)", type: "video", url: "videos/network/network11.html", diff: "enkel" },
                { title: "Nätverksutrustning", type: "quiz", url: "quiz/quiz44.html", diff: "enkel" },
                { title: "Internet - En kort översikt", type: "video", url: "videos/network/network12.html", diff: "enkel" },
                { title: "Internet och Felsökning av nätverk", type: "quiz", url: "quiz/quiz45.html", diff: "enkel" },
                { title: "Nätverksdiagnostik i kommandotolken", type: "lab", url: "labbar/Laboration-Nätverkskommandon.pdf", diff: "enkel" },
                { title: "Övningar - grundläggande datorkommunikation", type: "lab", url: "labbar/doc-Övningar_datorkommunikation.pdf", diff: "enkel" },
                { title: "VLAN och Switchar", type: "video", url: "videos/network/network22.html", diff: "enkel" },
                { title: "Routing Fördjupning - Introduktion och statisk routing", type: "video", url: "videos/network/network23.html", diff: "enkel" }
            ],
            matrix: [
                {
                    e: "Eleven beskriver översiktligt hur lokala nätverk är uppbyggda och fungerar samt hur driftsäkerhet uppnås.",
                    c: "Eleven beskriver utförligt hur lokala nätverk är uppbyggda och fungerar samt hur driftsäkerhet uppnås.",
                    a: "Eleven beskriver utförligt och nyanserat hur lokala nätverk är uppbyggda och fungerar samt hur driftsäkerhet uppnås."
                },
                {
                    e: "Dessutom installerar eleven i samråd med handledare datorer i lokala nätverk.",
                    c: "Dessutom installerar eleven efter samråd med handledare datorer i lokala nätverk.",
                    a: "Dessutom installerar eleven efter samråd med handledare datorer i lokala nätverk."
                }
            ],
            assessment: "Prov som med fördel kan baseras på övningsuppgifterna.",
            comments: "Precis som tidigare delar så kan man variera omfattningen och svårighetsgraden vad gäller nätverksteknik beroende på vilka kurser eleverna läst innan. Det finns fler praktiska labbar för routing och switching men kursplanen nämner enbart att eleverna ska kunna dessa begrepp vilket kan tolkas som teoretisk kunskap. Det finns numera många Kahoot-Quizar till genomgångarna om nätverksteknik."
        },
        {
            id: 4,
            num: "Del 4",
            title: "Kringutrustning och Skrivare",
            time: "ca 10%",
            syllabus: [
                "Installation av kringutrustning och uppgradering av drivrutiner.",
                "Installation och underhåll av lokal skrivare."
            ],
            resources: [
                { title: "Datorteknik (2019) Skrivare", type: "video", url: "videos/pc/pc31.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 08 Skrivare", type: "video", url: "videos/windows/win108.html", diff: "enkel" },
                { title: "Datorteknik (2019) Digitalkameror, videokameror och scanners", type: "video", url: "videos/pc/pc32.html", diff: "enkel" },
                { title: "Skrivare och tillbehör", type: "quiz", url: "quiz/quiz32.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 07 Drivrutiner", type: "video", url: "videos/windows/win107.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 11 Lagring Del 1", type: "video", url: "videos/windows/win111.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 12 Lagring Del 2", type: "video", url: "videos/windows/win112.html", diff: "enkel" },
                { title: "Windows 10 (1903) - 13 Lagring Del 3", type: "video", url: "videos/windows/win113.html", diff: "enkel" },
                { title: "Hantera maskinvara i Windows 7 (valfritt komplement)", type: "video", url: "videos/windows/win12.html", diff: "enkel" },
                { title: "Diskhantering i Windows 7 (valfritt komplement)", type: "video", url: "videos/windows/win14.html", diff: "enkel" },
                { title: "Windows 7 - Konfiguration, maskinvara, skrivare och diskar", type: "quiz", url: "quiz/quiz36.html", diff: "enkel" },
                { title: "Laboration - Windows 10 Skrivare", type: "lab", url: "labbar/Laboration-Windows_10-MD-100_Skrivare.pdf", diff: "svår" }
            ],
            matrix: [
                {
                    e: "Eleven planerar och utför i samråd med handledare och med visst handlag hård- och mjukvaruinstallation, uppbyggnad, konfigurering, uppgradering och optimering i datorer och datorsystem.",
                    c: "Eleven planerar och utför efter samråd med handledare och med visst handlag hård- och mjukvaruinstallation, uppbyggnad, konfigurering, uppgradering och optimering i datorer och datorsystem.",
                    a: "Eleven planerar och utför efter samråd med handledare och med visst handlag hård- och mjukvaruinstallation, uppbyggnad, konfigurering, uppgradering och optimering i datorer och datorsystem."
                }
            ],
            assessment: "Prov som med fördel kan baseras på övningsuppgifterna samt praktiskt prov och inlämningar.",
            comments: "Drivrutiner behandlas lite i del 2. Man bör med fördel göra fler praktiska laborationer kring uppgradering av drivrutiner samt installation av diverse kringutrustning."
        },
        {
            id: 5,
            num: "Del 5",
            title: "Felsökning och Optimering",
            time: "ca 5%",
            syllabus: [
                "Kontroll och optimering av datorers och datorsystems prestanda och funktion.",
                "Felsökning i datorer och datorsystem."
            ],
            resources: [
                { title: "Felsökning av nätverk", type: "video", url: "videos/network/network13.html", diff: "enkel" }
            ],
            matrix: [
                {
                    e: "Eleven planerar och utför i samråd med handledare och med visst handlag optimering och felsökning samt åtgärdar fel i datorer och datorsystem.",
                    c: "Eleven planerar och utför efter samråd med handledare och med gott handlag optimering och felsökning samt åtgärdar fel i datorer och datorsystem.",
                    a: "Eleven planerar och utför efter samråd med handledare och med mycket gott handlag optimering och felsökning samt åtgärdar fel i datorer och datorsystem."
                },
                {
                    e: "Eleven hanterar med visst handlag utrustning samt utför arbetet på ett säkert sätt.",
                    c: "Eleven hanterar med gott handlag utrustning samt utför arbetet på ett säkert sätt.",
                    a: "Eleven hanterar med mycket gott handlag utrustning samt utför arbetet på ett säkert sätt."
                }
            ],
            assessment: "Praktiskt prov eller projektuppgift.",
            comments: "Denna delen behöver fyllas på med fler praktiska uppgifter och labbar. Bl.a. labbar med program som SiSoft Sandra för prestandamätningar samt diverse verktyg för diagnostik (Ultimate Boot CD, SMART tester, Minnestester, mm). En labb med Windows Recovery Console för att göra kontroll av filsystem och reparera bootladdare passar också bra."
        },
        {
            id: 6,
            num: "Del 6",
            title: "Slutuppgift",
            time: "ca 10%",
            syllabus: [
                "Bör täcka in det mesta av det centrala innehållet i kursen"
            ],
            resources: [
                { title: "Projekt installation och driftsättning av datorsystem", type: "lab", url: "labbar/doc-Projekt_Installation_och_driftsättning_datorsystem_v2.pdf", diff: "avancerad" },
                { title: "Slutuppgift - Service av Laptop", type: "lab", url: "labbar/Laboration-Service_av_laptop.pdf", diff: "avancerad" }
            ],
            matrix: [
                {
                    e: "Resultatet är tillfredsställande i fråga om funktion, säkerhet och kvalitet.",
                    c: "Resultatet är tillfredsställande i fråga om funktion, säkerhet och kvalitet.",
                    a: "Resultatet är gott i fråga om funktion, säkerhet och kvalitet."
                },
                {
                    e: "I arbetet använder eleven med viss säkerhet instruktioner, manualer, topologier och andra dokument på både svenska och engelska samt gör en enkel dokumentation av sitt arbete.",
                    c: "I arbetet använder eleven med viss säkerhet instruktioner, manualer, topologier och andra dokument på både svenska och engelska samt gör en noggrann dokumentation av sitt arbete.",
                    a: "I arbetet använder eleven med säkerhet instruktioner, manualer, topologier och andra dokument på både svenska och engelska samt gör en noggrann och utförlig dokumentation av sitt arbete."
                },
                {
                    e: "När eleven samråder med handledare bedömer hon eller han med viss säkerhet den egna förmågan och situationens krav.",
                    c: "När eleven samråder med handledare bedömer hon eller han med viss säkerhet den egna förmågan och situationens krav.",
                    a: "När eleven samråder med handledare bedömer hon eller han med säkerhet den egna förmågan och situationens krav."
                }
            ],
            assessment: "Inlämning eller praktiskt prov baserat på Projektet installation och driftsättning av datorsystem. Går utmärkt att kombinera med APL förutsatt att dokumentation görs.",
            comments: "Något lätt modifierad version av slutuppgiften till Datorteknik 1a."
        }
    ]
};

// Flattened resources list for searching
const ALL_RESOURCES = [];
COURSE_DATA.modules.forEach(m => {
    m.resources.forEach(r => {
        ALL_RESOURCES.push({
            ...r,
            moduleNum: m.id,
            moduleTitle: m.title
        });
    });
});

// Create dynamic background gradient for SVG Gauge
function setupSvgGradients() {
    const svgEl = document.querySelector('.gauge-svg');
    if (!svgEl) return;
    
    // Add SVG Gradient Definitions
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    linearGradient.id = 'gauge-grad';
    linearGradient.setAttribute('x1', '0%');
    linearGradient.setAttribute('y1', '0%');
    linearGradient.setAttribute('x2', '100%');
    linearGradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#00e5ff');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#2979ff');
    
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    defs.appendChild(linearGradient);
    svgEl.appendChild(defs);
}

// App Initialization
document.addEventListener("DOMContentLoaded", () => {
    setupSvgGradients();
    initTheme();
    initTabNavigation();
    renderDashboardModules();
    renderModulesAccordion();
    renderKnowledgeMatrix();
    initSearchFilters();
    animateGauge(95);
    initMobileNav();
    updateStatNumbers();
});

// Update stat counts dynamically
function updateStatNumbers() {
    document.getElementById("stat-modules").textContent = COURSE_DATA.modules.length;
    
    const videosCount = ALL_RESOURCES.filter(r => r.type === 'video').length;
    const labsCount = ALL_RESOURCES.filter(r => r.type === 'lab').length;
    const quizCount = ALL_RESOURCES.filter(r => r.type === 'quiz').length;
    
    document.getElementById("stat-videos").textContent = `${videosCount}+`;
    document.getElementById("stat-labs").textContent = `${labsCount}+`;
    document.getElementById("stat-quizzes").textContent = `${quizCount}+`;
}

// Interactive SVG Gauge Animation
function animateGauge(targetPercent) {
    const fillCircle = document.getElementById("gauge-fill");
    const valueText = document.getElementById("gauge-value-text");
    
    if (!fillCircle || !valueText) return;
    
    // Circle Radius = 40, Circumference = 2 * PI * 40 ≈ 251.2
    const circumference = 2 * Math.PI * 40;
    fillCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    
    let currentPercent = 0;
    const duration = 2000; // 2 seconds
    const intervalTime = 30; // 30ms step
    const steps = duration / intervalTime;
    const percentStep = targetPercent / steps;
    
    const interval = setInterval(() => {
        currentPercent += percentStep;
        if (currentPercent >= targetPercent) {
            currentPercent = targetPercent;
            clearInterval(interval);
        }
        
        // Render current state
        const offset = circumference - (currentPercent / 100) * circumference;
        fillCircle.style.strokeDashoffset = offset;
        valueText.textContent = `${Math.round(currentPercent)}%`;
    }, intervalTime);
}

// Theme handling
function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeText = document.querySelector(".theme-text");
    
    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeUI(savedTheme);
    
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeUI(newTheme);
    });
}

function updateThemeUI(theme) {
    const themeText = document.querySelector(".theme-text");
    if (!themeText) return;
    
    if (theme === "dark") {
        themeText.textContent = "Ljust läge";
    } else {
        themeText.textContent = "Mörkt läge";
    }
}

// Responsive Mobile Nav Drawer
function initMobileNav() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("mobile-overlay");
    
    if (!menuBtn || !sidebar || !overlay) return;
    
    const toggleSidebar = () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("open");
    };
    
    menuBtn.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);
    
    // Close sidebar on clicking navigation link on mobile
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                sidebar.classList.remove("open");
                overlay.classList.remove("open");
            }
        });
    });
}

// Single Page Application Navigation
function initTabNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabs = document.querySelectorAll(".tab-content");
    
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            
            // Toggle buttons active class
            navButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            // Switch tabs
            tabs.forEach(tab => {
                if (tab.id === tabId) {
                    tab.classList.add("active");
                    // Rerun gauge animation if returning to dashboard
                    if (tabId === "dashboard") {
                        setTimeout(() => animateGauge(95), 100);
                    }
                } else {
                    tab.classList.remove("active");
                }
            });
            
            // Scroll back to top
            document.querySelector(".main-content").scrollTop = 0;
        });
    });
}

// Render Dashboard Grid Cards
function renderDashboardModules() {
    const grid = document.getElementById("dashboard-modules-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    COURSE_DATA.modules.forEach(m => {
        const card = document.createElement("div");
        card.className = "dash-module-card";
        card.innerHTML = `
            <div class="header-row">
                <h3>${m.num} - ${m.title}</h3>
                <span class="time-badge">${m.time}</span>
            </div>
            <p>${m.syllabus[0]} (och ${m.syllabus.length - 1} andra punkter...)</p>
            <div class="footer-row">
                <span>
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                    Resurser: ${m.resources.length} st
                </span>
                <span>Utforska del &rarr;</span>
            </div>
        `;
        
        card.addEventListener("click", () => {
            // Switch to module tab and expand this module
            const moduleTabBtn = document.querySelector('[data-tab="modules"]');
            if (moduleTabBtn) {
                moduleTabBtn.click();
                setTimeout(() => {
                    const moduleItem = document.getElementById(`module-${m.id}`);
                    if (moduleItem && !moduleItem.classList.contains("expanded")) {
                        moduleItem.querySelector(".module-trigger").click();
                    }
                    moduleItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            }
        });
        
        grid.appendChild(card);
    });
}

// Render Expandable Modules Accordion
function renderModulesAccordion() {
    const container = document.getElementById("modules-accordion");
    if (!container) return;
    
    container.innerHTML = "";
    
    COURSE_DATA.modules.forEach(m => {
        const item = document.createElement("div");
        item.className = "module-item";
        item.id = `module-${m.id}`;
        
        // Generate SVG Icons for resource types
        const getResourceIcon = (type) => {
            if (type === "video") {
                return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`;
            } else if (type === "lab") {
                return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
            } else { // quiz
                return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line><circle cx="12" cy="12" r="10"></circle></svg>`;
            }
        };

        // Render syllabus items
        const syllabusHtml = m.syllabus.map(item => `<li>${item}</li>`).join("");
        
        // Render resources list
        const resourcesHtml = m.resources.map(res => `
            <div class="resource-card" onclick="window.open('https://itlararen.se/${res.url}', '_blank')">
                <div class="res-icon-wrapper ${res.type}">
                    ${getResourceIcon(res.type)}
                </div>
                <div class="res-text">
                    <h5>${res.title}</h5>
                    <div class="res-meta">
                        <span class="res-tag ${res.type}">${res.type === 'video' ? 'Video' : res.type === 'lab' ? 'Laboration/Övning' : 'Quiz'}</span>
                        <span class="diff-badge ${res.diff}">${res.diff}</span>
                    </div>
                </div>
            </div>
        `).join("");
        
        // Render localized grading matrix
        const matrixRows = m.matrix.map((row, idx) => `
            <div class="matrix-card-mini e">
                <h5>E-Kriterium ${idx+1}</h5>
                <p>${row.e}</p>
            </div>
            <div class="matrix-card-mini c">
                <h5>C-Kriterium ${idx+1}</h5>
                <p>${row.c}</p>
            </div>
            <div class="matrix-card-mini a">
                <h5>A-Kriterium ${idx+1}</h5>
                <p>${row.a}</p>
            </div>
        `).join("");
        
        item.innerHTML = `
            <button class="module-trigger">
                <div class="module-trigger-content">
                    <h3>${m.num} - ${m.title}</h3>
                    <div class="module-meta-badges">
                        <span>Tidsåtgång: <strong>${m.time}</strong></span> &bull;
                        <span>Resurser: <strong>${m.resources.length} st</strong></span>
                    </div>
                </div>
                <svg class="icon chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="module-details">
                <div class="module-inner-content">
                    
                    <div class="syllabus-box">
                        <h4>Centralt Innehåll</h4>
                        <ul class="syllabus-list">
                            ${syllabusHtml}
                        </ul>
                    </div>
                    
                    <div class="resources-box">
                        <h4>Videor, Laborationer & Quizzar</h4>
                        <div class="resources-list">
                            ${resourcesHtml}
                        </div>
                    </div>
                    
                    <div class="matrix-mini-box">
                        <h4>Kunskapskrav i denna del</h4>
                        <div class="matrix-grid">
                            ${matrixRows}
                        </div>
                    </div>
                    
                    <div class="assessment-comments-grid">
                        <div class="sub-card">
                            <h5>Bedömning & Examination</h5>
                            <p>${m.assessment}</p>
                        </div>
                        <div class="sub-card">
                            <h5>Lärarens Kommentarer</h5>
                            <p>${m.comments}</p>
                        </div>
                    </div>
                    
                </div>
            </div>
        `;
        
        // Attach click triggers for accordion expansion
        const trigger = item.querySelector(".module-trigger");
        trigger.addEventListener("click", () => {
            const isExpanded = item.classList.contains("expanded");
            
            // Collapse all other items
            document.querySelectorAll(".module-item").forEach(otherItem => {
                otherItem.classList.remove("expanded");
                otherItem.querySelector(".module-details").style.maxHeight = "0px";
            });
            
            if (!isExpanded) {
                item.classList.add("expanded");
                const details = item.querySelector(".module-details");
                // Animate max height smoothly
                const inner = item.querySelector(".module-inner-content");
                details.style.maxHeight = (inner.getBoundingClientRect().height + 50) + "px";
            }
        });
        
        container.appendChild(item);
    });
}

// Render Knowledge Matrix (Betygskriterier) Tab
function renderKnowledgeMatrix() {
    const tbody = document.getElementById("matrix-tbody");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    COURSE_DATA.modules.forEach(m => {
        m.matrix.forEach((row, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <strong>${m.num}</strong><br>
                    <span style="font-size: 12px; color: var(--text-secondary);">${m.title}</span><br>
                    <span style="font-size: 11px; font-weight: 500; background: var(--hover-bg); padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px;">Kriterium ${index+1}</span>
                </td>
                <td class="cell-e" data-level="E">${row.e}</td>
                <td class="cell-c" data-level="C">${row.c}</td>
                <td class="cell-a" data-level="A">${row.a}</td>
            `;
            tbody.appendChild(tr);
        });
    });
    
    // Matrix Level Filters Logic
    const levelBtns = document.querySelectorAll(".matrix-level-btn");
    levelBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const level = btn.getAttribute("data-level");
            levelBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const cellsE = document.querySelectorAll(".cell-e");
            const cellsC = document.querySelectorAll(".cell-c");
            const cellsA = document.querySelectorAll(".cell-a");
            const colsE = document.querySelectorAll(".col-e");
            const colsC = document.querySelectorAll(".col-c");
            const colsA = document.querySelectorAll(".col-a");
            
            if (level === "all") {
                // Show all columns
                cellsE.forEach(c => c.style.display = "");
                cellsC.forEach(c => c.style.display = "");
                cellsA.forEach(c => c.style.display = "");
                if(colsE[0]) colsE[0].style.display = "";
                if(colsC[0]) colsC[0].style.display = "";
                if(colsA[0]) colsA[0].style.display = "";
            } else {
                // Hide non-relevant columns
                cellsE.forEach(c => c.style.display = level === "E" ? "" : "none");
                cellsC.forEach(c => c.style.display = level === "C" ? "" : "none");
                cellsA.forEach(c => c.style.display = level === "A" ? "" : "none");
                if(colsE[0]) colsE[0].style.display = level === "E" ? "" : "none";
                if(colsC[0]) colsC[0].style.display = level === "C" ? "" : "none";
                if(colsA[0]) colsA[0].style.display = level === "A" ? "" : "none";
            }
        });
    });
}

// Search and Filter View functionality
function initSearchFilters() {
    const searchInput = document.getElementById("resource-search");
    const moduleSelect = document.getElementById("filter-module");
    const typeSelect = document.getElementById("filter-type");
    const diffSelect = document.getElementById("filter-difficulty");
    const resultsContainer = document.getElementById("resources-grid-view");
    const infoText = document.getElementById("search-results-info");
    const clearBtn = document.getElementById("clear-search");
    
    if (!searchInput || !resultsContainer) return;
    
    // Generate icons dynamically
    const getResourceIcon = (type) => {
        if (type === "video") {
            return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`;
        } else if (type === "lab") {
            return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></svg>`;
        } else {
            return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line><circle cx="12" cy="12" r="10"></circle></svg>`;
        }
    };
    
    const filterAndRender = () => {
        const query = searchInput.value.toLowerCase().trim();
        const selectedModule = moduleSelect.value;
        const selectedType = typeSelect.value;
        const selectedDiff = diffSelect.value;
        
        // Show/hide clear search button
        clearBtn.style.display = query.length > 0 ? "block" : "none";
        
        const filtered = ALL_RESOURCES.filter(res => {
            // Text Search Match
            const textMatch = res.title.toLowerCase().includes(query) || res.moduleTitle.toLowerCase().includes(query);
            
            // Module Match
            const moduleMatch = selectedModule === "all" || res.moduleNum.toString() === selectedModule;
            
            // Type Match
            const typeMatch = selectedType === "all" || res.type === selectedType;
            
            // Difficulty Match
            const diffMatch = selectedDiff === "all" || res.diff === selectedDiff;
            
            return textMatch && moduleMatch && typeMatch && diffMatch;
        });
        
        // Render resources
        resultsContainer.innerHTML = "";
        infoText.textContent = `Hittade ${filtered.length} av ${ALL_RESOURCES.length} resurser.`;
        
        if (filtered.length === 0) {
            resultsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
                    <svg class="icon" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    <p>Inga resurser matchar din sökning eller dina filter.</p>
                </div>
            `;
            return;
        }
        
        filtered.forEach(res => {
            const card = document.createElement("div");
            card.className = "resource-card";
            card.onclick = () => window.open(`https://itlararen.se/${res.url}`, '_blank');
            card.innerHTML = `
                <div class="res-icon-wrapper ${res.type}">
                    ${getResourceIcon(res.type)}
                </div>
                <div class="res-text">
                    <span style="font-size: 11px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Del ${res.moduleNum}</span>
                    <h5 style="margin: 2px 0 4px 0;">${res.title}</h5>
                    <div class="res-meta">
                        <span class="res-tag ${res.type}">${res.type === 'video' ? 'Video' : res.type === 'lab' ? 'Laboration/Övning' : 'Quiz'}</span>
                        <span class="diff-badge ${res.diff}">${res.diff}</span>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    };
    
    // Attach Listeners
    searchInput.addEventListener("input", filterAndRender);
    moduleSelect.addEventListener("change", filterAndRender);
    typeSelect.addEventListener("change", filterAndRender);
    diffSelect.addEventListener("change", filterAndRender);
    
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        filterAndRender();
        searchInput.focus();
    });
    
    // Run initial filter (renders everything by default)
    filterAndRender();
}
