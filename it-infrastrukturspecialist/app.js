import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjzH0TAsPe9wurm8A9chMnObvec7W-Zsc",
  authDomain: "oscp-9eb23.firebaseapp.com",
  projectId: "oscp-9eb23",
  storageBucket: "oscp-9eb23.firebasestorage.app",
  messagingSenderId: "660646456701",
  appId: "1:660646456701:web:234125dbaa52cb551cf014"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

let currentUser = null;

// IT Infrastructure Specialist Study Portal - Database & App Logic

// 1. Study Modules Database (with self-contained reading content)
const MODULES_DATA = [
    {
        id: 1,
        title: "Nätverksteknik & Protokoll",
        time: "Rek. tid: 4 veckor",
        desc: "Lär dig grunderna för hur nätverk designas, ansluts och felsöks med fokus på routing, switching och TCP/IP.",
        topics: [
            "TCP/IP & OSI-modellen: Datakommunikation i sju lager.",
            "Subnätning & IP-adressering: Design av IPv4- och IPv6-nätverk.",
            "VLANs & Trunking (IEEE 802.1Q): Logisk uppdelning av nätverkstrafik.",
            "Routingprotokoll: Statisk routing samt OSPF.",
            "Nätverkstjänster: Hur DNS, DHCP och NAT/PAT fungerar bakom kulisserna."
        ],
        resources: [
            { 
                title: "Guide: IPv4 Subnetting & Supernetting från grunden", 
                type: "theory", 
                diff: "junior",
                content: `
                    <p>Subnätning är konsten att dela upp ett stort IP-nätverk i mindre, mer lätthanterliga och isolerade delnätverk. Detta minskar broadcast-trafik och förbättrar säkerheten.</p>
                    <h3>Varför subnätar vi?</h3>
                    <ul>
                        <li><strong>Säkerhet:</strong> Isolera servrar, klienter och gästnätverk från varandra.</li>
                        <li><strong>Prestanda:</strong> Begränsa storleken på broadcastdomäner.</li>
                        <li><strong>Adresshushållning:</strong> Effektivt utnyttja tillgängliga IPv4-adresser.</li>
                    </ul>
                    <h3>CIDR (Classless Inter-Domain Routing)</h3>
                    <p>Idag används CIDR-notering (t.ex. <code>/24</code>) istället för de föråldrade klasserna (Klass A, B, C). Snedstrecket anger hur många bitar i den 32-bitar långa IP-adressen som tillhör nätverksdelen (resten är värddelen).</p>
                    <h3>Subnätstabell (Klassiska masker)</h3>
                    <table>
                        <thead>
                            <tr><th>CIDR</th><th>Nätmask</th><th>Totalt antal adresser</th><th>Användbara värdadresser</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>/30</td><td>255.255.255.252</td><td>4</td><td>2 (Perfekt för WAN-länkar)</td></tr>
                            <tr><td>/28</td><td>255.255.255.240</td><td>16</td><td>14</td></tr>
                            <tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td></tr>
                            <tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td></tr>
                            <tr><td>/22</td><td>255.255.252.0</td><td>1024</td><td>1022</td></tr>
                        </tbody>
                    </table>
                    <div class="reader-highlight-box">
                        <p><strong>Kom ihåg:</strong> Två adresser i varje subnät kan aldrig tilldelas en dator eller router: <strong>Nätverksadressen</strong> (första adressen) och <strong>Broadcastadressen</strong> (sista adressen).</p>
                    </div>
                `
            },
            { 
                title: "Lab: Cisco Packet Tracer - Konfigurera VLAN, Trunking & OSPF", 
                type: "lab", 
                diff: "mid",
                content: `
                    <p>Denna laboration vägleder dig genom konfigureringen av VLAN-separation på switchar och dynamisk routing med OSPF mellan routrar i en Cisco-miljö.</p>
                    <h3>Topologi</h3>
                    <p>En Switch (2960) ansluten till två datorer i olika VLAN (VLAN 10 och VLAN 20). Switchen ansluter till en Router (1941) som konfigureras med "Router-on-a-Stick" för routing mellan VLAN, samt ansluter till en annan router via en WAN-länk körandes OSPF.</p>
                    <h3>Steg 1: Konfigurera VLAN på switchen</h3>
                    <pre><code>Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name CLIENTS
Switch(config-vlan)# vlan 20
Switch(config-vlan)# name SERVERS
Switch(config-vlan)# exit</code></pre>
                    <h3>Steg 2: Tilldela portar till VLAN</h3>
                    <pre><code>Switch(config)# interface range f0/1 - 10
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# exit
Switch(config)# interface range f0/11 - 20
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20</code></pre>
                    <h3>Steg 3: Konfigurera Trunk-länk mot Routern</h3>
                    <pre><code>Switch(config)# interface g0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# end</code></pre>
                    <h3>Steg 4: Konfigurera sub-interfaces på Routern (Router-on-a-Stick)</h3>
                    <pre><code>Router# configure terminal
Router(config)# interface g0/0
Router(config-if)# no shutdown
Router(config-if)# exit
Router(config)# interface g0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
Router(config-subif)# exit
Router(config)# interface g0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0</code></pre>
                    <h3>Steg 5: Konfigurera OSPF på routern</h3>
                    <pre><code>Router(config)# router ospf 1
Router(config-router)# network 192.168.10.0 0.0.0.255 area 0
Router(config-router)# network 192.168.20.0 0.0.0.255 area 0
Router(config-router)# network 10.0.0.0 0.0.0.3 area 0</code></pre>
                `
            },
            { 
                title: "Fuskblad: Standardportar & Protokoll (TCP/UDP)", 
                type: "cheatsheet", 
                diff: "junior",
                content: `
                    <p>Som IT-infrastrukturspecialist måste du kunna de vanligaste portarna utantill. De behövs för att konfigurera brandväggsregler (Access Control Lists) och felsöka nätverkstrafik.</p>
                    <h3>Kritiska TCP/UDP-portar</h3>
                    <table>
                        <thead>
                            <tr><th>Port</th><th>Protokoll</th><th>Typ</th><th>Beskrivning</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>22</td><td>SSH</td><td>TCP</td><td>Säker fjärrstyrning av servrar</td></tr>
                            <tr><td>25</td><td>SMTP</td><td>TCP</td><td>E-postöverföring</td></tr>
                            <tr><td>53</td><td>DNS</td><td>UDP/TCP</td><td>Namnöversättning (domän till IP)</td></tr>
                            <tr><td>67, 68</td><td>DHCP</td><td>UDP</td><td>Automatisk IP-adressering</td></tr>
                            <tr><td>80</td><td>HTTP</td><td>TCP</td><td>Okrypterad webbtrafik</td></tr>
                            <tr><td>123</td><td>NTP</td><td>UDP</td><td>Tidssynkronisering</td></tr>
                            <tr><td>143</td><td>IMAP</td><td>TCP</td><td>E-posthämtning</td></tr>
                            <tr><td>443</td><td>HTTPS</td><td>TCP</td><td>Krypterad webbtrafik (SSL/TLS)</td></tr>
                            <tr><td>445</td><td>SMB</td><td>TCP</td><td>Fildelning i Windows-nätverk</td></tr>
                            <tr><td>3389</td><td>RDP</td><td>TCP</td><td>Windows Fjärrskrivbord</td></tr>
                        </tbody>
                    </table>
                `
            },
            { 
                title: "Lab: Felsökning med traceroute, ping, tcpdump & Wireshark", 
                type: "lab", 
                diff: "mid",
                content: `
                    <p>Felsökning av nätverksproblem är en av specialistens viktigaste uppgifter. Denna lab visar hur du använder klassiska CLI-verktyg och nätverksanalysatorer.</p>
                    <h3>1. Ping (ICMP Echo Request/Reply)</h3>
                    <p>Används för att testa grundläggande anslutning mot en IP-adress.</p>
                    <pre><code>$ ping -c 4 8.8.8.8</code></pre>
                    <h3>2. Traceroute / Tracert (ICMP/UDP)</h3>
                    <p>Visar vägen (alla routrar/hopp) ett paket tar till destinationen.</p>
                    <pre><code>$ traceroute google.com   # Linux
C:\> tracert google.com     # Windows</code></pre>
                    <h3>3. Tcpdump (CLI-baserad paketsniffare)</h3>
                    <p>Perfekt för att sniffa råtrafik direkt på en Linux-server utan grafiskt gränssnitt.</p>
                    <pre><code>$ sudo tcpdump -i eth0 port 80 -n</code></pre>
                    <p>Detta kommando lyssnar på gränssnittet <code>eth0</code> och visar endast trafik som går via port 80 (HTTP).</p>
                    <h3>4. Wireshark (Grafisk nätverksanalys)</h3>
                    <p>För att analysera en sparad tcpdump-fil (t.ex. <code>capture.pcap</code>) eller sniffa trafik på en klientdator.</p>
                    <ul>
                        <li><strong>Filter för att hitta DNS-problem:</strong> Skriv <code>dns</code> i filterrutan.</li>
                        <li><strong>Filter för TCP handshakes:</strong> Skriv <code>tcp.flags.syn == 1</code> för att hitta anslutningsförsök.</li>
                    </ul>
                `
            },
            { 
                title: "Cisco IOS referensguide för CCNA-certifikat", 
                type: "theory", 
                diff: "senior",
                content: `
                    <p>En översikt av Cisco Internetwork Operating System (IOS) arkitektur, kommandolägen och underhållsrutiner.</p>
                    <h3>Cisco IOS Kommandolägen</h3>
                    <ol>
                        <li><strong>User EXEC Mode (<code>Router></code>):</strong> Endast grundläggande övervakning.</li>
                        <li><strong>Privileged EXEC Mode (<code>Router#</code>):</strong> Tillgång till alla show-kommandon och felsökning. Öppnas med <code>enable</code>.</li>
                        <li><strong>Global Configuration Mode (<code>Router(config)#</code>):</strong> Ändrar globala inställningar på enheten. Öppnas med <code>configure terminal</code>.</li>
                        <li><strong>Interface Configuration Mode (<code>Router(config-if)#</code>):</strong> Ändrar inställningar på enskilda portar.</li>
                    </ol>
                    <h3>Filhantering i Cisco</h3>
                    <p>Cisco-enheter har två primära konfigurationsfiler:</p>
                    <ul>
                        <li><strong>Running Configuration:</strong> Den aktiva konfigurationen i RAM. Tappas vid strömavbrott.</li>
                        <li><strong>Startup Configuration:</strong> Den sparade konfigurationen i NVRAM. Laddas vid boot.</li>
                    </ul>
                    <div class="reader-highlight-box">
                        <p>Kör alltid kommandot <code>copy running-config startup-config</code> (eller kortformen <code>write memory</code>) för att spara dina ändringar permanent!</p>
                    </div>
                `
            }
        ]
    },
    {
        id: 2,
        title: "Systemadministration (Server OS)",
        time: "Rek. tid: 4 veckor",
        desc: "Hantering och drift av moderna servermiljöer baserat på Microsoft Windows Server och Linux-distributioner.",
        topics: [
            "Linux Bash & Administration: Behörigheter (chmod/chown), processer och filsystem.",
            "Active Directory (AD DS): Användare, datorer, säkerhetsgrupper och organisationsenheter (OUs).",
            "Group Policy Objects (GPO): Centraliserad konfiguration av Windows-miljöer.",
            "Kärntjänster i nätverk: Installation och drift av Windows DNS, DHCP och NPS.",
            "Linux Systemd & Tjänster: Hantering av systemtjänster, loggar (journalctl) och SSH-nycklar."
        ],
        resources: [
            { 
                title: "Guide: Linux CLI - De 50 viktigaste Bash-kommandona", 
                type: "theory", 
                diff: "junior",
                content: `
                    <p>Som systemadministratör måste du känna dig hemma i Linux-terminalen. Här är de mest fundamentala kommandona grupperade efter användningsområde.</p>
                    <h3>Filnavigering och hantering</h3>
                    <ul>
                        <li><code>pwd</code> - Visa nuvarande katalog.</li>
                        <li><code>cd [sökväg]</code> - Byt katalog.</li>
                        <li><code>ls -la</code> - Visa filer (inklusive dolda) med detaljerad information.</li>
                        <li><code>mkdir [namn]</code> - Skapa en ny katalog.</li>
                        <li><code>rm -rf [namn]</code> - Ta bort fil eller katalog (används med försiktighet!).</li>
                        <li><code>cp [källa] [destination]</code> - Kopiera filer.</li>
                        <li><code>mv [källa] [destination]</code> - Flytta eller döp om filer.</li>
                    </ul>
                    <h3>Systemstatus & Nätverk</h3>
                    <ul>
                        <li><code>top</code> eller <code>htop</code> - Visa aktiva processer och resursanvändning.</li>
                        <li><code>df -h</code> - Diskutrymme i läsbart format.</li>
                        <li><code>free -m</code> - Minnesanvändning (RAM).</li>
                        <li><code>ip a</code> - Visa nätverkskort och IP-adresser.</li>
                        <li><code>ping [ip]</code> - Kontrollera nätverksanslutning.</li>
                    </ul>
                    <div class="reader-highlight-box">
                        <p><strong>Tips:</strong> Du hittar en fullständig, sökbar lista över Linux-kommandon under fliken <strong>Kommando-Lathundar</strong> i sidomenyn.</p>
                    </div>
                `
            },
            { 
                title: "Lab: Sätt upp Active Directory Domain Services (AD DS) i Windows Server", 
                type: "lab", 
                diff: "mid",
                content: `
                    <p>Active Directory Domain Services (AD DS) är hjärtat i Windows-baserade företagsnätverk och hanterar identiteter, behörigheter och enheter.</p>
                    <h3>Steg 1: Installera AD DS-rollen</h3>
                    <ol>
                        <li>Öppna <strong>Server Manager</strong> på din Windows Server.</li>
                        <li>Klicka på <strong>Add roles and features</strong>.</li>
                        <li>Klicka Next till du når listan över roller, kryssa i <strong>Active Directory Domain Services</strong>.</li>
                        <li>Acceptera alla tillhörande verktyg och klicka Install.</li>
                    </ol>
                    <h3>Steg 2: Befordra servern till domänkontrollant (Domain Controller)</h3>
                    <ol>
                        <li>När installationen är klar, klicka på flagg-ikonen (varning) längst upp i Server Manager.</li>
                        <li>Välj <strong>Promote this server to a domain controller</strong>.</li>
                        <li>Välj <strong>Add a new forest</strong> och ange ett domännamn (t.ex. <code>foretag.local</code>).</li>
                        <li>Ange ett lösenord för DSRM (Directory Services Restore Mode) – spara detta säkert!</li>
                        <li>Gå igenom resten av guiden med standardinställningar och klicka <strong>Install</strong>. Servern startar om automatiskt.</li>
                    </ol>
                    <h3>Steg 3: Skapa en OU-struktur (Organisationsenheter)</h3>
                    <p>När servern startat, öppna verktyget <strong>Active Directory Users and Computers (ADUC)</strong>.</p>
                    <ul>
                        <li>Högerklicka på din domän (<code>foretag.local</code>) -> <strong>New</strong> -> <strong>Organizational Unit</strong>.</li>
                        <li>Skapa en OU som heter <code>Sverige</code>.</li>
                        <li>Inuti <code>Sverige</code>, skapa två OUs: <code>Users</code> och <code>Computers</code>. Detta är kritiskt för att kunna tillämpa olika GPO:er senare.</li>
                    </ul>
                `
            },
            { 
                title: "Lab: Konfigurera och testa Group Policies för IT-miljöer", 
                type: "lab", 
                diff: "mid",
                content: `
                    <p>Group Policy Objects (GPO) gör det möjligt för en administratör att centralt styra inställningar på tusentals Windows-datorer i en domän.</p>
                    <h3>Scenarie</h3>
                    <p>Vi vill tvinga fram en specifik bakgrundsbild på skrivbordet för alla användare samt blockera åtkomst till Kontrollpanelen.</p>
                    <h3>Steg 1: Skapa ett nytt GPO</h3>
                    <ol>
                        <li>Öppna verktyget <strong>Group Policy Management</strong> på din domänkontrollant.</li>
                        <li>Expandera din domän, högerklicka på <strong>Group Policy Objects</strong> och välj <strong>New</strong>.</li>
                        <li>Namnge det till <code>GPO_Sverige_Klienter</code>.</li>
                    </ol>
                    <h3>Steg 2: Redigera policyinställningar</h3>
                    <ol>
                        <li>Högerklicka på ditt nya GPO och välj <strong>Edit</strong>.</li>
                        <li><strong>Blockera Kontrollpanelen:</strong> Navigera till: <code>User Configuration</code> -> <code>Policies</code> -> <code>Administrative Templates</code> -> <code>Control Panel</code>. Dubbelklicka på <strong>Prohibit access to Control Panel and PC settings</strong>, välj <strong>Enabled</strong> och klicka OK.</li>
                        <li><strong>Skrivbordsbakgrund:</strong> Navigera till: <code>User Configuration</code> -> <code>Policies</code> -> <code>Administrative Templates</code> -> <code>Desktop</code> -> <code>Desktop</code>. Dubbelklicka på <strong>Desktop Wallpaper</strong>, välj <strong>Enabled</strong> och ange sökvägen till din bild (t.ex. en UNC-sökväg <code>\\\\server\\share\\wallpaper.jpg</code>).</li>
                    </ol>
                    <h3>Steg 3: Länka GPO:t till din OU</h3>
                    <ol>
                        <li>Gå tillbaka till huvudfönstret i Group Policy Management.</li>
                        <li>Högerklicka på din OU (t.ex. <code>Sverige</code>) och välj <strong>Link an Existing GPO</strong>.</li>
                        <li>Välj <code>GPO_Sverige_Klienter</code> och klicka OK.</li>
                    </ol>
                    <h3>Steg 4: Testa inställningarna på en klientdator</h3>
                    <p>Logga in på en domänansluten Windows-klient och öppna kommandotolken. Kör följande för att tvinga fram uppdateringen omedelbart:</p>
                    <pre><code>C:\> gpupdate /force</code></pre>
                `
            },
            { 
                title: "Guide: Bash Scripting - Automatisera backuper i Linux", 
                type: "theory", 
                diff: "senior",
                content: `
                    <p>Automation är en grundpelare för en infrastrukturtekniker. Denna guide visar hur du skriver ett Bash-skript i Linux för att komprimera och ta backup på en mapp, samt schemalägga det.</p>
                    <h3>Steg 1: Skapa skriptfilen</h3>
                    <pre><code>$ nano backup_script.sh</code></pre>
                    <h3>Steg 2: Skriv Bash-skriptet</h3>
                    <pre><code>#!/bin/bash
# Backup-skript för Linux Server

# Variabler
BACKUP_SRC="/var/www/html"
BACKUP_DST="/backup"
DATE=$(date +%Y-%m-%d_%H%M%S)
FILE="site_backup_\${DATE}.tar.gz"

# Skapa destinationsmapp om den inte finns
mkdir -p \${BACKUP_DST}

# Skapa en komprimerad tarball av källmappen
tar -czf \${BACKUP_DST}/\${FILE} \${BACKUP_SRC}

# Skriv status till en loggfil
if [ $? -eq 0 ]; then
    echo "[\$(date)] SUCCESS: Backup skapad: \${FILE}" >> /var/log/backup.log
else
    echo "[\$(date)] ERROR: Backup misslyckades för \${FILE}" >> /var/log/backup.log
fi</code></pre>
                    <h3>Steg 3: Gör skriptet körbart</h3>
                    <pre><code>$ chmod +x backup_script.sh</code></pre>
                    <h3>Steg 4: Schemalägg skriptet med Cron (varje natt kl 02:00)</h3>
                    <p>Öppna crontab i redigeringsläge:</p>
                    <pre><code>$ sudo crontab -e</code></pre>
                    <p>Lägg till följande rad längst ner i filen:</p>
                    <pre><code>0 2 * * * /home/user/backup_script.sh</code></pre>
                `
            }
        ]
    },
    {
        id: 3,
        title: "Molntjänster & Virtualisering",
        time: "Rek. tid: 3 veckor",
        desc: "Hur modern virtualisering fungerar i lokala datacenter samt integration mot publika moln som Microsoft Azure.",
        topics: [
            "Hypervisorer: Typ-1 (ESXi, Hyper-V) kontra Typ-2 (VirtualBox, VMware Workstation).",
            "Azure VNets & Subnets: Nätverkstopologi och peering i molnet.",
            "Azure Identity (Entra ID): Hantering av molnbaserade identiteter och Single Sign-On (SSO).",
            "Containrar & Docker: Hur Docker-avbildningar byggs och orkestreras lokalt.",
            "Virtual Machine Scale Sets: Hur elastisk skalning (autoscaling) fungerar i Azure."
        ],
        resources: [
            { 
                title: "Guide: Skapa ditt första Azure Virtual Network (VNet)", 
                type: "theory", 
                diff: "junior",
                content: `
                    <p>Ett Virtual Network (VNet) är grundbulten för dina molnresurser i Azure. Det ger isolering, segmentering och möjliggör kommunikation mellan virtuella maskiner och internet.</p>
                    <h3>Struktur för ett Azure VNet</h3>
                    <p>Ett VNet tilldelas ett stort IP-adressområde (t.ex. <code>10.0.0.0/16</code>). Detta nätverk delas sedan in i mindre <strong>Subnets</strong> (t.ex. <code>10.0.1.0/24</code> för webbservrar och <code>10.0.2.0/24</code> för databaser).</p>
                    <h3>Viktiga komponenter</h3>
                    <ul>
                        <li><strong>Network Security Groups (NSG):</strong> Fungerar som en brandvägg på subnet- eller nätverkskortsnivå. Styr inkommande och utgående trafik baserat på IP, port och protokoll.</li>
                        <li><strong>Public IP-adresser:</strong> Tilldelas maskiner som behöver nås direkt utifrån (t.ex. webbservrar eller VPN-gateways).</li>
                        <li><strong>VNet Peering:</strong> Kopplar samman två VNets (även i olika Azure-regioner) så att de kan kommunicera över Microsofts interna nätverk utan att trafiken passerar publika internet.</li>
                    </ul>
                    <div class="reader-highlight-box">
                        <p><strong>Säkerhetstips:</strong> Placera aldrig dina databasservrar i ett subnet som har en NSG-regel som tillåter trafik direkt från internet! Tillåt endast trafik från ditt webb-subnet.</p>
                    </div>
                `
            },
            { 
                title: "Lab: Docker Sandbox - Bygg och driftsätt en Nginx-webbcontainer", 
                type: "lab", 
                diff: "mid",
                content: `
                    <p>Docker är industristandarden för container-virtualisering. I denna lab installerar vi Docker, bygger en egen webb-image och kör den som en container.</p>
                    <h3>Steg 1: Skapa en Dockerfile</h3>
                    <p>Skapa en ny tom mapp och skapa en fil med namnet <code>Dockerfile</code> (utan filändelse):</p>
                    <pre><code>$ mkdir nginx-custom && cd nginx-custom
$ nano Dockerfile</code></pre>
                    <h3>Steg 2: Skriv Dockerfile-instruktionerna</h3>
                    <pre><code># Använd officiell Nginx-image från Docker Hub
FROM nginx:alpine

# Kopiera en lokal HTML-fil till containerns webbkatalog
COPY index.html /usr/share/nginx/html/index.html

# Exponera port 80 i containern
EXPOSE 80</code></pre>
                    <h3>Steg 3: Skapa en enkel hemsida (index.html)</h3>
                    <pre><code>$ nano index.html</code></pre>
                    <p>Skriv en enkel HTML-kod, t.ex. <code>&lt;h1&gt;Min containeriserade webbapp!&lt;/h1&gt;</code>.</p>
                    <h3>Steg 4: Bygg din Docker-image</h3>
                    <pre><code>$ docker build -t min-nginx-app:v1 .</code></pre>
                    <h3>Steg 5: Kör containern</h3>
                    <pre><code>$ docker run -d -p 8080:80 --name web-container min-nginx-app:v1</code></pre>
                    <p>Detta startar containern i bakgrunden (<code>-d</code>), namnger den till <code>web-container</code> och mappar port 8080 på din fysiska maskin till port 80 inuti containern.</p>
                    <p>Öppna din webbläsare och gå till <code>http://localhost:8080</code> för att se resultatet!</p>
                `
            },
            { 
                title: "Lab: ESXi installation och vCenter Management i VMware", 
                type: "lab", 
                diff: "senior",
                content: `
                    <p>VMware vSphere är marknadsledande inom servervirtualisering i lokala datacenter. Denna guide täcker principerna för hypervisorn ESXi och managering via vCenter.</p>
                    <h3>VMware vSphere Arkitektur</h3>
                    <ul>
                        <li><strong>VMware ESXi:</strong> En Typ-1 hypervisor som installeras direkt på den fysiska servern (kallas ofta ESXi-host). Ansvarar för att dela upp hårdvaruresurserna till virtuella maskiner.</li>
                        <li><strong>VMware vCenter Server:</strong> En central administrationsserver som kopplar ihop flera ESXi-hosts och möjliggör avancerade funktioner som vMotion (flytta igångvarande VM mellan servrar) och High Availability (HA).</li>
                    </ul>
                    <h3>Laborationssteg: Skapa en VM i ESXi</h3>
                    <ol>
                        <li>Logga in på din ESXi webbkonsol (<code>https://[esxi-host-ip]</code>).</li>
                        <li>Navigera till <strong>Storage</strong> -> <strong>Datastore Browser</strong> och ladda upp en Linux ISO-fil (t.ex. Ubuntu Server).</li>
                        <li>Gå till <strong>Virtual Machines</strong> -> <strong>Create / Register VM</strong>.</li>
                        <li>Välj <strong>Create a new virtual machine</strong>, namnge den och välj operativsystemtyp.</li>
                        <li>Konfigurera resurser (t.ex. 2 vCPU, 4GB RAM, 20GB disk). Under CD/DVD drive väljer du <strong>Datastore ISO file</strong> och pekar ut din uppladdade ISO.</li>
                        <li>Starta maskinen (Power on) och öppna konsolen för att genomföra installationen av operativsystemet.</li>
                    </ol>
                `
            },
            { 
                title: "Azure AZ-104 Administrations-guide för certifiering", 
                type: "theory", 
                diff: "mid",
                content: `
                    <p>En studieguide anpassad efter kraven för certifieringen Microsoft Certified: Azure Administrator Associate (AZ-104).</p>
                    <h3>Provets fem huvudområden</h3>
                    <ol>
                        <li><strong>Hantera Azure-identiteter och styrning (Governance) (15-20%):</strong> Microsoft Entra ID (tidigare Azure AD), Rollbaserad åtkomstkontroll (RBAC), Azure Policies och Azure-prenumerationer.</li>
                        <li><strong>Implementera och hantera lagring (15-20%):</strong> Azure Storage Accounts, fildelning (Azure Files), Blob Storage samt säkerhetskopiering via Azure Backup och Recovery Services Vaults.</li>
                        <li><strong>Driftsätta och hantera virtuella Azure-resurser (20-25%):</strong> Konfiguration av virtuella maskiner (VMs), Azure App Services samt containertjänster (Azure Container Instances - ACI).</li>
                        <li><strong>Konfigurera och hantera virtuella nätverk (25-30%):</strong> Azure VNets, nätverkssäkerhetsgrupper (NSG), VPN Gateway, Azure DNS samt VNet Peering.</li>
                        <li><strong>Övervaka och säkerhetskopiera Azure-resurser (10-15%):</strong> Azure Monitor, Log Analytics Workspaces samt aviseringar (Alerts).</li>
                    </ol>
                `
            }
        ]
    },
    {
        id: 4,
        title: "DevOps & Infrastructure as Code (IaC)",
        time: "Rek. tid: 4 veckor",
        desc: "Byt ut manuella installationsrutiner mot konfigurationsfiler och skript för automatiserad provisering.",
        topics: [
            "Git Versionshantering: Branching, merge, commits och lagring i GitHub/Azure DevOps.",
            "Infrastructure as Code (IaC): Deklarativ provisering av infrastruktur med Terraform.",
            "Konfigurationshantering: Automatisera serverinstallationer med Ansible Playbooks.",
            "PowerShell Automation: Använda skript och moduler för AD DS- och systemadministration.",
            "CI/CD-Pipelines: Automatiskt bygga, testa och rulla ut kodförändringar."
        ],
        resources: [
            { 
                title: "Guide: Git grundkurs - Hantera kod och versionshistorik", 
                type: "theory", 
                diff: "junior",
                content: `
                    <p>Git är ett distribuerat versionshanteringssystem som är helt nödvändigt i en modern DevOps-miljö för att spara kod, script och konfigurationsfiler.</p>
                    <h3>Livscykeln för filer i Git</h3>
                    <ol>
                        <li><strong>Untracked/Modified:</strong> Filer som har ändrats i din arbetskatalog men inte sparats i Git.</li>
                        <li><strong>Staged:</strong> Filer som har markerats med <code>git add</code> för att inkluderas i nästa commit.</li>
                        <li><strong>Committed:</strong> Filer som sparats säkert i den lokala Git-databasen via <code>git commit</code>.</li>
                    </ol>
                    <h3>De viktigaste arbetsflödeskommandona</h3>
                    <pre><code>$ git init                       # Initiera ett nytt Git-projekt lokalt
$ git status                     # Visa ändrade filer
$ git add .                      # Lägg till alla ändringar till 'staging'
$ git commit -m "Fixa nätverk"   # Spara lokalt i versionshistoriken
$ git push origin main           # Skicka commits till molnet (GitHub)</code></pre>
                    <h3>Branching (Grenar)</h3>
                    <p>För att testa nya inställningar utan att förstöra produktion, skapa en ny branch:</p>
                    <pre><code>$ git checkout -b feature-routing  # Skapa och byt till en ny branch
# Gör ändringar...
$ git add . && git commit -m "Lagt till statisk rutt"
$ git checkout main                # Byt tillbaka till huvudgrenen
$ git merge feature-routing        # Slå ihop ändringarna</code></pre>
                `
            },
            { 
                title: "Lab: Terraform - Driftsätt en virtuell maskin i Azure via kod", 
                type: "lab", 
                diff: "senior",
                content: `
                    <p>Terraform är ett av branschens populäraste verktyg för Infrastructure as Code (IaC). Här är ett fungerande kodexempel som sätter upp en resursgrupp och ett nätverk i Azure.</p>
                    <h3>Steg 1: Skapa Terraform-filen (main.tf)</h3>
                    <pre><code># 1. Definiera Azure-providern
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# 2. Skapa en Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "rg-prod-infra"
  location = "westeurope"
}

# 3. Skapa ett Virtual Network (VNet)
resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-prod"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

# 4. Skapa ett Subnet
resource "azurerm_subnet" "subnet" {
  name                 = "subnet-servers"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}</code></pre>
                    <h3>Steg 2: Kör Terraform-kommandona i terminalen</h3>
                    <pre><code>$ terraform init       # Laddar ner nödvändiga Azure-plugins
$ terraform plan       # Visar vad som kommer att skapas (torrkörning)
$ terraform apply      # Genomför ändringarna och proviserar nätverket i Azure</code></pre>
                `
            },
            { 
                title: "Lab: Ansible - Konfigurera 3 Linux-servrar simultant", 
                type: "lab", 
                diff: "mid",
                content: `
                    <p>Ansible är ett agentlöst verktyg som automatiserar konfigurationen av operativsystem. Det styrs via SSH i Linux-miljöer.</p>
                    <h3>Steg 1: Skapa en inventariefil (hosts)</h3>
                    <p>Skapa en fil med namnet <code>hosts</code> som listar IP-adresserna till dina måldatorer:</p>
                    <pre><code>[webservers]
192.168.1.50
192.168.1.51
192.168.1.52</code></pre>
                    <h3>Steg 2: Skriv en Ansible Playbook (webserver.yml)</h3>
                    <p>Denna Playbook kommer att installera Apache webbserver på alla 3 servrar samtidigt, starta tjänsten och kopiera en hemsida.</p>
                    <pre><code>---
- name: Konfigurera Apache på webbservrar
  hosts: webservers
  become: yes  # Kör som root (sudo)
  tasks:
    - name: Installera Apache
      apt:
        name: apache2
        state: present
        update_cache: yes

    - name: Starta och aktivera Apache-tjänsten
      service:
        name: apache2
        state: started
        enabled: yes

    - name: Kopiera index-fil
      copy:
        content: "&lt;h1&gt;Server konfigurerad automatiskt via Ansible!&lt;/h1&gt;"
        dest: /var/www/html/index.html</code></pre>
                    <h3>Steg 3: Kör din Playbook</h3>
                    <pre><code>$ ansible-playbook -i hosts webserver.yml</code></pre>
                `
            },
            { 
                title: "Fuskblad: PowerShell-skript för administration av Active Directory", 
                type: "cheatsheet", 
                diff: "mid",
                content: `
                    <p>PowerShell är Windows-administratörens bästa vän. Genom modulen <code>ActiveDirectory</code> kan du automatisera nästan allt rutinarbete.</p>
                    <h3>1. Hämta en AD-användare och visa alla attribut</h3>
                    <pre><code>Get-ADUser -Identity "annan" -Properties *</code></pre>
                    <h3>2. Leta upp alla inaktiva användarkonton (ej loggat in på 90 dagar)</h3>
                    <pre><code>Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly</code></pre>
                    <h3>3. Massimportera användare från en CSV-fil</h3>
                    <p>Om du har en CSV-fil (<code>anvandare.csv</code>) med kolumnerna SamAccountName, FirstName, LastName och Path, kan du köra:</p>
                    <pre><code>Import-Csv "C:\\temp\\anvandare.csv" | ForEach-Object {
    $Password = ConvertTo-SecureString "Standard123!" -AsPlainText -Force
    New-ADUser -SamAccountName $_.SamAccountName \`
               -Name ($_.FirstName + " " + $_.LastName) \`
               -GivenName $_.FirstName \`
               -Surname $_.LastName \`
               -Path $_.Path \`
               -AccountPassword $Password \`
               -Enabled $true \`
               -ChangePasswordAtLogon $true
}</code></pre>
                `
            }
        ]
    },
    {
        id: 5,
        title: "Cybersäkerhet & Driftsäkerhet",
        time: "Rek. tid: 3 veckor",
        desc: "Designa säkra system, konfigurera krypterade VPN-tunnlar samt implementera modern monitorering.",
        topics: [
            "Nätverkssäkerhet: Paketfiltrering med brandväggar och Next-Generation Firewalls (NGFW).",
            "Kryptering & VPN: Säkra tunnlar med IPsec och OpenVPN.",
            "Backup-strategier: Implementera 3-2-1 regeln och krypterad backup-lagring.",
            "Monitorering & Loggning: Övervakning av infrastruktur med Prometheus, Grafana och syslog.",
            "Access Control: Principen om minsta behörighet (Least Privilege) och multifaktorsautentisering (MFA)."
        ],
        resources: [
            { 
                title: "Guide: 3-2-1 Backup-regeln och skydd mot Ransomware", 
                type: "theory", 
                diff: "junior",
                content: `
                    <p>I händelse av systemkrasch, radering av data eller en ransomware-infektion är en fungerande och testad backup din sista livlina.</p>
                    <h3>3-2-1 Regeln förklarad</h3>
                    <ul>
                        <li><strong>3: Ha minst tre kopior av din data.</strong> Ett original (aktiv data i drift) samt minst två separata backuper.</li>
                        <li><strong>2: Spara kopiorna på två olika typer av lagringsmedia.</strong> Använd t.ex. en intern RAID-matris i servern och en extern NAS eller bandstation. Det skyddar mot hårdvarufel på specifika medietyper.</li>
                        <li><strong>1: Förvara minst en av kopiorna utanför kontoret (off-site).</strong> Skicka krypterad data till en molntjänst (t.ex. Azure Blob Storage) eller förvara en fysisk backup-disk på ett annat geografiskt kontor. Detta skyddar mot brand, stöld eller naturkatastrofer.</li>
                    </ul>
                    <h3>Skydd mot Ransomware (Immutable Backups)</h3>
                    <p>Moderna utpressningsvirus försöker aktivt hitta och kryptera dina backupfiler i nätverket. För att skydda dig bör du implementera <strong>skrivskyddad lagring (Object Lock / Immutable Storage)</strong> i molnet, vilket gör det omöjligt att modifiera eller radera sparad data under en förinställd tidsperiod.</p>
                `
            },
            { 
                title: "Lab: Sätt upp en pfSense brandvägg med VPN och DMZ-zon", 
                type: "lab", 
                diff: "senior",
                content: `
                    <p>pfSense är en av världens mest använda open-source brandväggar och routrar. Denna lab vägleder dig genom skapandet av en säker zonindelning.</p>
                    <h3>Zon-arkitektur</h3>
                    <ul>
                        <li><strong>WAN (Internet):</strong> Ansluter till det externa nätverket. Implicit Deny (allt blockerat utifrån).</li>
                        <li><strong>LAN (Internt):</strong> Ansluter till dina skyddade klienter och kontorsdatorer.</li>
                        <li><strong>DMZ (Demilitarized Zone):</strong> En isolerad zon för servrar som måste nås utifrån (t.ex. webbservrar).</li>
                    </ul>
                    <h3>Konfigurationssteg</h3>
                    <ol>
                        <li>Logga in på din pfSense webb-GUI (standard <code>192.168.1.1</code>).</li>
                        <li>Navigera till <strong>Interfaces</strong> -> <strong>Assignments</strong> och tilldela ett fysiskt nätverkskort till gränssnittet <code>OPT1</code>. Döp om det till <code>DMZ</code>.</li>
                        <li>Gå till <strong>Firewall</strong> -> <strong>Rules</strong> -> <strong>DMZ</strong> och lägg till en regel som blockerar trafik från DMZ till ditt interna LAN (för att förhindra att en komprometterad webbserver når ditt interna nätverk).</li>
                        <li>Lägg till en tillåtande regel under <strong>Firewall</strong> -> <strong>Rules</strong> -> <strong>WAN</strong> som tillåter trafik på port 443 (HTTPS) till DMZ-serverns IP-adress.</li>
                        <li>Aktivera **OpenVPN Server** genom den inbyggda guiden (Wizard) under <strong>VPN</strong> -> <strong>OpenVPN</strong> för att tillåta säkra distansanslutningar för dina användare.</li>
                    </ol>
                `
            },
            { 
                title: "Lab: Installera Prometheus & Grafana för att övervaka Linux-servrar", 
                type: "lab", 
                diff: "mid",
                content: `
                    <p>Övervakning ger dig insikt i din infrastrukturs hälsa innan fel inträffar. Denna lab sätter upp en komplett Prometheus & Grafana-stack.</p>
                    <h3>Steg 1: Installera Node Exporter på måldatorn (Linux)</h3>
                    <p>Node Exporter samlar in CPU, RAM, nätverk och diskstatistik från servern.</p>
                    <pre><code>$ wget https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz
$ tar -xzf node_exporter-1.5.0.linux-amd64.tar.gz
$ ./node_exporter &    # Kör i bakgrunden</code></pre>
                    <h3>Steg 2: Konfigurera Prometheus-servern (prometheus.yml)</h3>
                    <p>Skapa eller redigera konfigurationsfilen för att läsa data från din måldator (port 9100):</p>
                    <pre><code>global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'linux-servers'
    static_configs:
      - targets: ['192.168.1.50:9100']</code></pre>
                    <h3>Steg 3: Installera och anslut Grafana</h3>
                    <ol>
                        <li>Installera Grafana via pakethanteraren (<code>apt install grafana</code>).</li>
                        <li>Starta tjänsten med <code>sudo systemctl start grafana-server</code>.</li>
                        <li>Öppna din webbläsare på <code>http://localhost:3000</code> (standard inlogg: admin/admin).</li>
                        <li>Gå till <strong>Configuration</strong> -> <strong>Data Sources</strong> och lägg till <strong>Prometheus</strong>. Ange din Prometheus-server URL (t.ex. <code>http://localhost:9090</code>).</li>
                        <li>Importera en färdig Linux-dashboard (t.ex. ID <code>1860</code>) för att omedelbart visualisera CPU, minne och diskaktivitet i realtid.</li>
                    </ol>
                `
            },
            { 
                title: "Fuskblad: Nätverksanalys - Upptäck intrång med Snort och Suricata", 
                type: "cheatsheet", 
                diff: "senior",
                content: `
                    <p>Snort och Suricata är kända Intrusion Detection/Prevention Systems (IDS/IPS) som läser av nätverkstrafik i realtid och larmar vid misstänkt aktivitet.</p>
                    <h3>Vad gör ett IDS/IPS?</h3>
                    <ul>
                        <li><strong>Signature-based:</strong> Jämför nätverkstrafik mot kända signaturer av virus, attacker och skanningar (likt ett antivirus).</li>
                        <li><strong>Anomaly-based:</strong> Larmar om trafiken avviker från ett normalt beteendemönster (t.ex. om en databas plötsligt skickar 10GB data till en okänd extern IP).</li>
                    </ul>
                    <h3>Exempel på en Snort-regel</h3>
                    <p>Regler skrivs i ett specifikt format. Här är en regel som larmar om någon försöker pinga din server med en paketstorlek överstigande det normala:</p>
                    <pre><code>alert icmp $EXTERNAL_NET any -> $HOME_NET any (msg:"ICMP Large Packet Ping Detected"; dsize:>800; sid:1000001; rev:1;)</code></pre>
                    <p><strong>Förklaring av delarna:</strong></p>
                    <ul>
                        <li><code>alert</code>: Åtgärd (generera ett larm i loggen).</li>
                        <li><code>icmp</code>: Protokoll.</li>
                        <li><code>$EXTERNAL_NET any -> $HOME_NET any</code>: Trafikriktning (från valfri extern källa till det interna nätverket).</li>
                        <li><code>dsize:>800</code>: Trigga endast om paketets datastorlek är större än 800 bytes.</li>
                        <li><code>sid:1000001</code>: Unikt regel-ID (Signature ID).</li>
                    </ul>
                `
            }
        ]
    }
];

// Flat list of resources for search features
const ALL_RESOURCES = [];
MODULES_DATA.forEach(m => {
    m.resources.forEach(r => {
        ALL_RESOURCES.push({
            ...r,
            moduleNum: m.id,
            moduleTitle: m.title
        });
    });
});

// 2. Command Database (Cheat Sheets)
const COMMANDS_DATA = {
    cisco: [
        { cmd: "enable", desc: "Växlar från användarläge till privilegierat läge (enable mode).", ex: "Router> enable" },
        { cmd: "configure terminal", desc: "Öppnar globalt konfigurationsläge för att ändra inställningar.", ex: "Router# configure terminal" },
        { cmd: "interface g0/0", desc: "Navigerar in på ett specifikt gränssnitt (t.ex. GigabitEthernet 0/0).", ex: "Router(config)# interface g0/0" },
        { cmd: "ip address 192.168.1.1 255.255.255.0", desc: "Tilldelar en IP-adress och nätmask till ett gränssnitt.", ex: "Router(config-if)# ip address 192.168.1.1 255.255.255.0" },
        { cmd: "no shutdown", desc: "Aktiverar gränssnittet (startar upp det).", ex: "Router(config-if)# no shutdown" },
        { cmd: "vlan 10", desc: "Skapar ett VLAN med ID 10 och öppnar VLAN-konfigurationsläge.", ex: "Switch(config)# vlan 10" },
        { cmd: "switchport mode access", desc: "Sätter en switchport i access-läge (anslutning till klienter).", ex: "Switch(config-if)# switchport mode access" },
        { cmd: "switchport access vlan 10", desc: "Tilldelar en switchport till ett specifikt VLAN (VLAN 10).", ex: "Switch(config-if)# switchport access vlan 10" },
        { cmd: "switchport mode trunk", desc: "Sätter en switchport i trunk-läge (överför flera VLAN mellan switchar).", ex: "Switch(config-if)# switchport mode trunk" },
        { cmd: "show ip interface brief", desc: "Visar en sammanfattning av alla gränssnitt, deras IP och status.", ex: "Router# show ip interface brief" },
        { cmd: "show running-config", desc: "Visar den nuvarande konfigurationen som körs i arbetsminnet.", ex: "Router# show running-config" },
        { cmd: "write memory", desc: "Sparar den aktiva konfigurationen till NVRAM (behålls vid omstart).", ex: "Router# write memory" }
    ],
    linux: [
        { cmd: "ls -la", desc: "Listar alla filer och mappar, inklusive dolda (.filer), med detaljerad info.", ex: "user@linux:~$ ls -la" },
        { cmd: "chmod 755 script.sh", desc: "Ändrar filrättigheter. 755 ger ägaren läs/skriv/kör, övriga läs/kör.", ex: "user@linux:~$ chmod 755 script.sh" },
        { cmd: "chown root:root file.txt", desc: "Ändrar ägare och grupp för en fil till root.", ex: "user@linux:~$ sudo chown root:root file.txt" },
        { cmd: "systemctl status sshd", desc: "Visar status för systemtjänsten SSH (Secure Shell).", ex: "user@linux:~$ systemctl status sshd" },
        { cmd: "systemctl restart apache2", desc: "Startar om en systemtjänst (t.ex. webbservern Apache).", ex: "user@linux:~$ sudo systemctl restart apache2" },
        { cmd: "ip a", desc: "Visar nätverkskort, tilldelade IP-adresser och nätmasker.", ex: "user@linux:~$ ip a" },
        { cmd: "df -h", desc: "Visar tillgängligt och använt diskutrymme på monterade filsystem.", ex: "user@linux:~$ df -h" },
        { cmd: "journalctl -u nginx -n 50", desc: "Visar de senaste 50 loggraderna för tjänsten Nginx.", ex: "user@linux:~$ journalctl -u nginx -n 50" },
        { cmd: "ssh-keygen -t rsa -b 4096", desc: "Genererar ett säkert SSH-nyckelpar (offentlig och privat nyckel).", ex: "user@linux:~$ ssh-keygen -t rsa -b 4096" },
        { cmd: "nano /etc/netplan/01-netcfg.yaml", desc: "Öppnar textredigeraren Nano för att konfigurera nätverk i Ubuntu.", ex: "user@linux:~$ sudo nano /etc/netplan/01-netcfg.yaml" }
    ],
    powershell: [
        { cmd: "Get-Service | Where-Object {$_.Status -eq 'Running'}", desc: "Hämtar alla systemtjänster som är igång just nu.", ex: "PS C:\\> Get-Service | Where-Object {$_.Status -eq 'Running'}" },
        { cmd: "New-ADUser -Name 'Anna Andersson' -SamAccountName 'annan'", desc: "Skapar ett nytt användarkonto i Active Directory.", ex: "PS C:\\> New-ADUser -Name 'Anna Andersson' -SamAccountName 'annan'" },
        { cmd: "Add-ADGroupMember -Identity 'Domain Admins' -Members 'annan'", desc: "Lägger till en AD-användare i säkerhetsgruppen Domain Admins.", ex: "PS C:\\> Add-ADGroupMember -Identity 'Domain Admins' -Members 'annan'" },
        { cmd: "Get-NetIPAddress -AddressFamily IPv4", desc: "Visar IPv4-adresser konfigurerade på datorns nätverkskort.", ex: "PS C:\\> Get-NetIPAddress -AddressFamily IPv4" },
        { cmd: "Test-NetConnection -ComputerName 8.8.8.8 -Port 53", desc: "Testar nätverksanslutning och portöppning (t.ex. Google DNS på DNS-port 53).", ex: "PS C:\\> Test-NetConnection -ComputerName 8.8.8.8 -Port 53" },
        { cmd: "Restart-Service -Name wuauserv", desc: "Startar om tjänsten Windows Update.", ex: "PS C:\\> Restart-Service -Name wuauserv" },
        { cmd: "Get-EventLog -LogName System -Newest 20", desc: "Hämtar de 20 senaste logghändelserna från System-loggen.", ex: "PS C:\\> Get-EventLog -LogName System -Newest 20" }
    ],
    git: [
        { cmd: "git init", desc: "Initierar ett nytt lokalt Git-arkiv i den aktiva mappen.", ex: "user@code:~/project$ git init" },
        { cmd: "git clone https://github.com/user/repo.git", desc: "Klonar ett fjärrarkiv från t.ex. GitHub till datorn.", ex: "user@code:~$ git clone https://github.com/user/repo.git" },
        { cmd: "git status", desc: "Visar ändrade filer och filer som inte har lagts till i versionshanteringen.", ex: "user@code:~/project$ git status" },
        { cmd: "git add .", desc: "Lägger till alla ändrade filer i 'staging area' (förbereder för commit).", ex: "user@code:~/project$ git add ." },
        { cmd: "git commit -m 'Implementera nätverksmodul'", desc: "Sparar ändringarna i versionshistoriken med ett loggmeddelande.", ex: "user@code:~/project$ git commit -m 'Implementera nätverksmodul'" },
        { cmd: "git branch feature-routing", desc: "Skapar en ny utvecklingsgren (branch) med namnet feature-routing.", ex: "user@code:~/project$ git branch feature-routing" },
        { cmd: "git checkout main", desc: "Växlar tillbaka till huvudgrenen (main).", ex: "user@code:~/project$ git checkout main" },
        { cmd: "git push origin main", desc: "Skickar lokala commits till fjärrarkivet (GitHub/Azure DevOps).", ex: "user@code:~/project$ git push origin main" }
    ]
};

// 3. Quiz Bank
const QUIZ_DATA = [
    {
        id: "networking",
        title: "Nätverksteknik & OSPF",
        desc: "Testa dina kunskaper om subnätning, VLANs, TCP/UDP och routingprotokoll.",
        questions: [
            {
                q: "Vilket lager i OSI-modellen ansvarar för IP-adressering och routing?",
                options: ["Lager 2: Datalänk", "Lager 3: Nätverk", "Lager 4: Transport", "Lager 7: Applikation"],
                correct: 1,
                explanation: "Lager 3 (Nätverksskicktet) hanterar logisk adressering (IP-adresser) och vägval (routing) av datapaket."
            },
            {
                q: "Hur många användbara IP-adresser finns i ett subnät med nätmasken /26 (t.ex. 255.255.255.192)?",
                options: ["30 stycken", "62 stycken", "126 stycken", "254 stycken"],
                correct: 1,
                explanation: "Ett /26 subnät har totalt 64 IP-adresser (2^(32-26) = 2^6 = 64). Två adresser går bort: nätverksadressen och broadcastadressen, vilket ger 62 användbara adresser."
            },
            {
                q: "Vad är syftet med VLAN Trunking (t.ex. 802.1Q)?",
                options: ["Att kryptera trafiken i nätverket", "Att dela ut dynamiska IP-adresser automatiskt", "Att överföra data från flera VLAN över en enda fysisk kabel", "Att förhindra loopar i switchade nätverk"],
                correct: 2,
                explanation: "Trunking gör datatrafik tillhörande flera olika logiska nätverk (VLAN) tillgängligt på en enda länk."
            },
            {
                q: "Vilket protokoll använder port 53 (UDP och TCP) som standard?",
                options: ["HTTP", "DNS", "DHCP", "SSH"],
                correct: 1,
                explanation: "DNS (Domain Name System) använder port 53 för namnuppslagningar, oftast via UDP men även TCP."
            },
            {
                q: "Vad kallas den funktion som översätter privata IP-adresser till en offentlig IP för internetåtkomst?",
                options: ["OSPF", "VLAN", "NAT (Network Address Translation)", "ARP"],
                correct: 2,
                explanation: "NAT tillåter privata adresser på insidan av ett nätverk att kommunicera på internet via en publik IP."
            }
        ]
    },
    {
        id: "sysadmin",
        title: "Linux & Windows Server",
        desc: "Frågor kring filrättigheter, systemd, Active Directory, GPO:er och kärntjänster.",
        questions: [
            {
                q: "I Linux, vad ger kommandot 'chmod 755 file.sh' för rättigheter?",
                options: [
                    "Fulla rättigheter (läsa, skriva, köra) till alla användare",
                    "Läs- och skrivrättigheter endast för ägaren",
                    "Ägaren kan läsa, skriva och köra; andra kan endast läsa och köra",
                    "Ingen kan köra filen utan sudo"
                ],
                correct: 2,
                explanation: "Siffran 7 ger ägaren rwx. Siffran 5 ger grupp och övriga rx."
            },
            {
                q: "Vilken Active Directory-komponent används för att tillämpa säkerhetsinställningar centralt på datorer?",
                options: ["Organisationsenheter (OUs)", "Group Policy Objects (GPOs)", "Security Groups", "Domain Controllers"],
                correct: 1,
                explanation: "GPO:er (grupprinciper) tillämpas centralt för att konfigurera säkerhets- och systeminställningar på enheter i domänen."
            },
            {
                q: "Vilket kommando i Linux används för att visa loggar för en systemd-tjänst?",
                options: ["systemctl logs", "journalctl -u [tjänst]", "tail -f /var/log/syslog", "cat /var/log/messages"],
                correct: 1,
                explanation: "journalctl är det centrala systemd-verktyget för loggar. Flaggan '-u' specificerar tjänstens enhet (unit)."
            },
            {
                q: "Vad är skillnaden mellan en säkerhetsgrupp (Security Group) och en distributionsgrupp i Active Directory?",
                options: [
                    "Säkerhetsgrupper kan tilldelas behörigheter i filsystem, det kan inte distributionsgrupper",
                    "Distributionsgrupper krypterar e-postmeddelanden",
                    "Säkerhetsgrupper kan endast innehålla datorer, inte användare",
                    "Det finns ingen funktionell skillnad"
                ],
                correct: 0,
                explanation: "Säkerhetsgrupper kan ges rättigheter till mappar och resurser. Distributionsgrupper saknar SID och används enbart för e-postlistor."
            },
            {
                q: "Vilket nätverksprotokoll använder DORA-processen (Discover, Offer, Request, Acknowledge) för tilldelning av adresser?",
                options: ["DNS", "ARP", "DHCP", "ICMP"],
                correct: 2,
                explanation: "DHCP-klienter erhåller dynamiska adresser genom DORA-meddelandesekvensen."
            }
        ]
    },
    {
        id: "cloud",
        title: "Virtualisering & Cloud",
        desc: "Testa kunskaper inom Azure VNets, hypervisorer, Docker-containrar och molnlagring.",
        questions: [
            {
                q: "Vilken typ av hypervisor installeras direkt på 'bare-metal' (hårdvaran) utan underliggande operativsystem?",
                options: ["Typ 1 hypervisor (t.ex. VMware ESXi)", "Typ 2 hypervisor (t.ex. VirtualBox)", "Applikationscontainer (t.ex. Docker)", "Virtual Machine Scale Set"],
                correct: 0,
                explanation: "Typ 1 hypervisorer (bare-metal) körs direkt på maskinvaran för högsta möjliga prestanda."
            },
            {
                q: "I Microsoft Azure, vad används för att koppla ihop två separata virtuella nätverk (VNets) så de kan kommunicera?",
                options: ["VNet Peering", "VPN Gateway", "Application Gateway", "ExpressRoute"],
                correct: 0,
                explanation: "VNet Peering ansluter två VNets direkt i Azures interna ryggrads-nätverk utan att gå över internet."
            },
            {
                q: "Vad är en av de största skillnaderna mellan en virtuell maskin (VM) och en Docker-container?",
                options: [
                    "En container kräver mer lagringsutrymme",
                    "Virtuella maskiner delar värddatorns operativsystemskärna",
                    "Containrar virtualiserar operativsystemet och delar värdens kärna; virtuella maskiner virtualiserar hårdvaran och kör kompletta OS",
                    "Containrar kan bara köras i Linux-miljöer"
                ],
                correct: 2,
                explanation: "Containrar delar värd-OS-kärnan, medan virtuella maskiner kräver ett eget, fullständigt gästoperativsystem."
            },
            {
                q: "Vad kallas Azures centrala tjänst för molnbaserad identitetshantering?",
                options: ["Azure AD Domain Services", "Microsoft Entra ID", "Azure Key Vault", "Azure Policy"],
                correct: 1,
                explanation: "Microsoft Entra ID är det officiella namnet för Azures molnbaserade identitetshanteringstjänst."
            },
            {
                q: "Vad kallas en konfigurationsfil i YAML-format som används för att definiera och köra Docker-applikationer med flera containrar?",
                options: ["Dockerfile", "Docker Compose (docker-compose.yml)", "Kubernetes Pod", "Docker Image"],
                correct: 1,
                explanation: "Docker Compose använder en central YAML-fil för att konfigurera och orkestrera sammankopplade containrar."
            }
        ]
    },
    {
        id: "devops",
        title: "DevOps & Automation (IaC)",
        desc: "Frågor om Git versionshantering, Terraform, Ansible och PowerShell-scripting.",
        questions: [
            {
                q: "Vilket kommando i Git används för att skicka dina lokalt sparade ändringar till GitHub?",
                options: ["git commit", "git pull", "git push", "git clone"],
                correct: 2,
                explanation: "Kommandot 'git push' laddar upp commits till ditt fjärrarkiv."
            },
            {
                q: "I Terraform, vilken fil lagrar information om den proviserade infrastrukturen för att hålla koll på verkligt tillstånd?",
                options: ["main.tf", "terraform.tfvars", "State-filen (terraform.tfstate)", "variables.tf"],
                correct: 2,
                explanation: "State-filen (tfstate) mappar dina Terraform-filer mot det faktiska tillståndet i molnet."
            },
            {
                q: "Vilket av följande verktyg är bäst lämpat för konfigurationshantering och installation av mjukvara på servrar utan agent?",
                options: ["Terraform", "Ansible", "Git", "Hyper-V"],
                correct: 1,
                explanation: "Ansible är bäst anpassat för OS-konfigurering och ansluter smidigt agentlöst över SSH eller WinRM."
            },
            {
                q: "Vilket tecken i PowerShell används för att skicka utdata från ett kommando som indata till nästa kommando?",
                options: ["> (större än)", "$ (dollartecken)", "| (pipe-tecknet)", "& (och-tecknet)"],
                correct: 2,
                explanation: "Pipe-tecknet '|' överför objekt mellan cmdlets i PowerShell-pipelinen."
            },
            {
                q: "I Ansible, vad kallas den fil där man definierar de uppgifter (tasks) som ska utföras på måldatorerna?",
                options: ["Inventory", "Playbook", "Ad-hoc command", "Manifest"],
                correct: 1,
                explanation: "En Playbook är en YAML-fil som innehåller en strukturerad ordningslista med uppgifter (tasks) som Ansible ska köra."
            }
        ]
    },
    {
        id: "security",
        title: "Säkerhet & Monitorering",
        desc: "Frågor kring brandväggsregler, VPN-tunnlar, backupregler och loggövervakning.",
        questions: [
            {
                q: "Vilken är den gyllene regeln för brandväggskonfigurering när det gäller inkommande trafik?",
                options: [
                    "Implicit Allow (allt tillåts som inte uttryckligen blockeras)",
                    "Implicit Deny (allt blockeras som inte uttryckligen tillåts)",
                    "Stateful Inspection (trafik godkänns om den ser legitim ut)",
                    "Port Forwarding till alla interna adresser"
                ],
                correct: 1,
                explanation: "Implicit Deny innebär att all inkommande trafik blockeras som standard, och regler läggs till specifikt för tillåten trafik."
            },
            {
                q: "Vad innebär den välkända 3-2-1 backup-regeln?",
                options: [
                    "Gör backup var 3:e dag, spara på 2 hårddiskar, ta 1 kopia varje månad",
                    "Spara 3 kopior av datan, på 2 olika medietyper, med minst 1 kopia förvarad off-site",
                    "Ha 3 servrar, 2 brandväggar och 1 internetleverantör",
                    "Kryptera backupen med 3 nycklar, 2 algoritmer, på 1 sekund"
                ],
                correct: 1,
                explanation: "3 kopior (1 original + 2 backuper), 2 olika typer av media, och 1 kopia lagrad geografiskt separat (off-site)."
            },
            {
                q: "Vilket VPN-protokoll arbetar på nätverksskiktet (Lager 3) och används ofta för säkra Site-to-Site tunnlar mellan kontor?",
                options: ["SSL/TLS", "IPsec", "SSH", "L2TP without encryption"],
                correct: 1,
                explanation: "IPsec (Internet Protocol Security) säkrar datatrafiken direkt på IP-nivå och är standard för Site-to-Site tunnlar."
            },
            {
                q: "Vilken mjukvara används för att visualisera tidsseriedata från Prometheus i form av grafer och dashboards?",
                options: ["Syslog", "Grafana", "Wireshark", "Zabbix Agent"],
                correct: 1,
                explanation: "Grafana kopplas till datakällor som Prometheus för att visualisera data i grafer och realtidsdiagram."
            },
            {
                q: "Vad är Multifaktorsautentisering (MFA) och varför är det kritiskt?",
                options: [
                    "Att kräva lösenord med minst 12 tecken och specialtecken",
                    "Att identifiera användaren genom minst två oberoende faktorer (något man vet, har eller är)",
                    "Att begränsa inloggningar till specifika IP-adresser",
                    "Att kryptera användardatabasen i Active Directory"
                ],
                correct: 1,
                explanation: "MFA ger ett starkt extra skyddslager genom att kombinera lösenord med t.ex. en engångskod i en app på mobilen."
            }
        ]
    }
];

// Helper to safely load JSON
function safeJSONParse(key, defaultValue) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
        console.warn(`Error parsing localStorage key "${key}". Resetting to default.`);
        return defaultValue;
    }
}

// App State Management (Stored in localStorage)
const AppState = {
    completedQuizzes: safeJSONParse("infra_completed_quizzes", []),
    
    markQuizCompleted(quizId) {
        if (!this.completedQuizzes.includes(quizId)) {
            this.completedQuizzes.push(quizId);
            localStorage.setItem("infra_completed_quizzes", JSON.stringify(this.completedQuizzes));
            saveUserData();
        }
    },
    
    getCompletedCount() {
        return this.completedQuizzes.length;
    },
    
    resetProgress() {
        this.completedQuizzes = [];
        localStorage.removeItem("infra_completed_quizzes");
        saveUserData();
    }
};

async function saveUserData() {
  if (!currentUser) return;
  try {
    await setDoc(doc(db, "users", currentUser.uid), {
      completedQuizzes: AppState.completedQuizzes
    }, { merge: true });
  } catch (e) {
    console.error("Error saving to Firestore", e);
  }
}

async function loadUserData() {
  if (!currentUser) return;
  try {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.completedQuizzes) {
        AppState.completedQuizzes = data.completedQuizzes;
        localStorage.setItem("infra_completed_quizzes", JSON.stringify(AppState.completedQuizzes));
      }
      renderDashboardModules();
    }
  } catch (e) {
    console.error("Error loading user data:", e);
  }
}

// UI Initialization
document.addEventListener("DOMContentLoaded", () => {
    setupSvgGradients();
    initTheme();
    initTabNavigation();
    renderDashboardModules();
    renderModulesAccordion();
    initSearchFilters();
    initMobileNav();
    initCheatSheets();
    initQuizEngine();
    initReaderModal();
    updateProgressGauge();
});

// Update stat counts dynamically
function updateStatNumbers() {
    document.getElementById("stat-modules").textContent = MODULES_DATA.length;
    
    const labsCount = ALL_RESOURCES.filter(r => r.type === 'lab').length;
    const theoryCount = ALL_RESOURCES.filter(r => r.type === 'theory').length;
    const cheatsheetCount = ALL_RESOURCES.filter(r => r.type === 'cheatsheet').length;
    
    document.getElementById("stat-videos").textContent = `${theoryCount + labsCount}+`;
    document.getElementById("stat-labs").textContent = `${labsCount}+`;
    document.getElementById("stat-quizzes").textContent = QUIZ_DATA.length;
}

// Interactive SVG Gauge Animation
function updateProgressGauge() {
    const fillCircle = document.getElementById("gauge-fill");
    const valueText = document.getElementById("gauge-value-text");
    const descText = document.getElementById("progress-desc");
    
    if (!fillCircle || !valueText) return;
    
    const totalQuizzes = QUIZ_DATA.length;
    const completedCount = AppState.getCompletedCount();
    const percent = Math.round((completedCount / totalQuizzes) * 100);
    
    const circumference = 2 * Math.PI * 40;
    fillCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    
    const offset = circumference - (percent / 100) * circumference;
    fillCircle.style.strokeDashoffset = offset;
    
    valueText.textContent = `${percent}%`;
    if (descText) {
        descText.textContent = `${completedCount} av ${totalQuizzes} quiz godkända`;
    }
}

// Global Theme Management
function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    
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
    const themeText = document.querySelector("#theme-toggle .theme-text");
    if (!themeText) return;
    themeText.textContent = theme === "dark" ? "Ljust läge" : "Mörkt läge";
}

// Mobile Responsive Drawer Toggle
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
    
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                sidebar.classList.remove("open");
                overlay.classList.remove("open");
            }
        });
    });
}

// SPA Routing / Navigation
function initTabNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabs = document.querySelectorAll(".tab-content");
    
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            
            navButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            tabs.forEach(tab => {
                if (tab.id === tabId) {
                    tab.classList.add("active");
                    if (tabId === "dashboard") {
                        setTimeout(() => updateProgressGauge(), 100);
                    }
                } else {
                    tab.classList.remove("active");
                }
            });
            
            document.querySelector(".main-content").scrollTop = 0;
        });
    });
}

// Populate Dashboard Cards
function renderDashboardModules() {
    const grid = document.getElementById("dashboard-modules-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    MODULES_DATA.forEach(m => {
        const card = document.createElement("div");
        card.className = "dash-module-card";
        card.innerHTML = `
            <div class="header-row">
                <h3>M${m.id}: ${m.title}</h3>
                <span class="time-badge">${m.time}</span>
            </div>
            <p>${m.desc}</p>
            <div class="footer-row">
                <span>
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    Resurser: ${m.resources.length} st
                </span>
                <span>Visa detaljer &rarr;</span>
            </div>
        `;
        
        card.addEventListener("click", () => {
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

// Populate Accordion Module List
function renderModulesAccordion() {
    const container = document.getElementById("modules-accordion");
    if (!container) return;
    
    container.innerHTML = "";
    
    MODULES_DATA.forEach(m => {
        const item = document.createElement("div");
        item.className = "module-item";
        item.id = `module-${m.id}`;
        
        const getResourceIcon = (type) => {
            if (type === "lab") {
                return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
            } else if (type === "theory") {
                return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`;
            } else {
                return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line></svg>`;
            }
        };

        const syllabusHtml = m.topics.map(t => `<li>${t}</li>`).join("");
        
        const resourcesHtml = m.resources.map((res, index) => `
            <div class="resource-card" onclick="openResource('${m.id}', '${index}')">
                <div class="res-icon-wrapper ${res.type}">
                    ${getResourceIcon(res.type)}
                </div>
                <div class="res-text">
                    <h5>${res.title}</h5>
                    <div class="res-meta">
                        <span class="res-tag ${res.type}">${res.type === 'lab' ? 'Laboration' : res.type === 'theory' ? 'Teoriguide' : 'Lathund'}</span>
                        <span class="diff-badge ${res.diff}">${res.diff}</span>
                    </div>
                </div>
            </div>
        `).join("");
        
        item.innerHTML = `
            <button class="module-trigger">
                <div class="module-trigger-content">
                    <h3>Modul ${m.id}: ${m.title}</h3>
                    <div class="module-meta-badges">
                        <span><strong>${m.time}</strong></span> &bull;
                        <span>Resurser: <strong>${m.resources.length} st</strong></span>
                    </div>
                </div>
                <svg class="icon chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="module-details">
                <div class="module-inner-content">
                    
                    <div class="syllabus-box">
                        <h4>Måldokument & Kursinnehåll</h4>
                        <ul class="syllabus-list">
                            ${syllabusHtml}
                        </ul>
                    </div>
                    
                    <div class="resources-box">
                        <h4>Laborationer, Guider & Dokumentation</h4>
                        <div class="resources-list">
                            ${resourcesHtml}
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                        <button class="quiz-btn primary-btn" onclick="startModuleQuiz('${m.id}')">Gör Modulens Quiz &rarr;</button>
                    </div>
                    
                </div>
            </div>
        `;
        
        const trigger = item.querySelector(".module-trigger");
        trigger.addEventListener("click", () => {
            const isExpanded = item.classList.contains("expanded");
            
            document.querySelectorAll(".module-item").forEach(otherItem => {
                otherItem.classList.remove("expanded");
                otherItem.querySelector(".module-details").style.maxHeight = "0px";
            });
            
            if (!isExpanded) {
                item.classList.add("expanded");
                const details = item.querySelector(".module-details");
                const inner = item.querySelector(".module-inner-content");
                details.style.maxHeight = (inner.getBoundingClientRect().height + 50) + "px";
            }
        });
        
        container.appendChild(item);
    });
}

// Study Reader Modal Initialization & Control
function initReaderModal() {
    const modal = document.getElementById("reader-modal");
    const closeBtn = document.getElementById("close-reader-modal");
    
    if (!modal) return;
    
    if (closeBtn) {
        closeBtn.addEventListener("click", closeReader);
    }
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeReader();
        }
    });
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeReader();
        }
    });
}

function openResource(moduleNum, resIndex) {
    const mod = MODULES_DATA.find(m => m.id === parseInt(moduleNum));
    if (!mod) return;
    const res = mod.resources[parseInt(resIndex)];
    if (!res) return;
    
    const modal = document.getElementById("reader-modal");
    const titleEl = document.getElementById("reader-title");
    const contentEl = document.getElementById("reader-text-content");
    const catEl = document.getElementById("reader-category");
    const diffEl = document.getElementById("reader-difficulty");
    
    if (!modal || !titleEl || !contentEl || !catEl || !diffEl) return;
    
    catEl.textContent = res.type === 'lab' ? 'Laboration' : res.type === 'theory' ? 'Teoriguide' : 'Lathund';
    catEl.className = `res-tag ${res.type}`;
    diffEl.textContent = res.diff.toUpperCase();
    diffEl.className = `diff-badge ${res.diff}`;
    
    titleEl.textContent = res.title;
    contentEl.innerHTML = res.content || "<p>Innehåll under utveckling...</p>";
    
    modal.classList.add("open");
}

function closeReader() {
    const modal = document.getElementById("reader-modal");
    if (modal) {
        modal.classList.remove("open");
    }
}

// Populate Resource Search View
function initSearchFilters() {
    const searchInput = document.getElementById("resource-search");
    const moduleSelect = document.getElementById("filter-module");
    const typeSelect = document.getElementById("filter-type");
    const diffSelect = document.getElementById("filter-difficulty");
    const resultsContainer = document.getElementById("resources-grid-view");
    const infoText = document.getElementById("search-results-info");
    const clearBtn = document.getElementById("clear-search");
    
    if (!searchInput || !resultsContainer) return;
    
    const getResourceIcon = (type) => {
        if (type === "lab") {
            return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
        } else if (type === "theory") {
            return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`;
        } else {
            return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line></svg>`;
        }
    };
    
    const filterAndRender = () => {
        const query = searchInput.value.toLowerCase().trim();
        const selectedModule = moduleSelect.value;
        const selectedType = typeSelect.value;
        const selectedDiff = diffSelect.value;
        
        clearBtn.style.display = query.length > 0 ? "block" : "none";
        
        const filtered = ALL_RESOURCES.filter(res => {
            const textMatch = res.title.toLowerCase().includes(query) || res.moduleTitle.toLowerCase().includes(query);
            const moduleMatch = selectedModule === "all" || res.moduleNum.toString() === selectedModule;
            const typeMatch = selectedType === "all" || res.type === selectedType;
            const diffMatch = selectedDiff === "all" || res.diff === selectedDiff;
            
            return textMatch && moduleMatch && typeMatch && diffMatch;
        });
        
        resultsContainer.innerHTML = "";
        infoText.textContent = `Hittade ${filtered.length} av ${ALL_RESOURCES.length} resurser.`;
        
        if (filtered.length === 0) {
            resultsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
                    <svg class="icon" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    <p>Inga resurser matchar dina filter.</p>
                </div>
            `;
            return;
        }
        
        filtered.forEach(res => {
            const card = document.createElement("div");
            card.className = "resource-card";
            
            // Resolve this resource's array index inside its parent module
            const parentMod = MODULES_DATA.find(m => m.id === res.moduleNum);
            const resIdx = parentMod.resources.findIndex(r => r.title === res.title);
            
            card.onclick = () => openResource(res.moduleNum, resIdx);
            card.innerHTML = `
                <div class="res-icon-wrapper ${res.type}">
                    ${getResourceIcon(res.type)}
                </div>
                <div class="res-text">
                    <span style="font-size: 11px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Modul ${res.moduleNum}</span>
                    <h5 style="margin: 2px 0 4px 0;">${res.title}</h5>
                    <div class="res-meta">
                        <span class="res-tag ${res.type}">${res.type === 'lab' ? 'Laboration' : res.type === 'theory' ? 'Teoriguide' : 'Lathund'}</span>
                        <span class="diff-badge ${res.diff}">${res.diff}</span>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    };
    
    searchInput.addEventListener("input", filterAndRender);
    moduleSelect.addEventListener("change", filterAndRender);
    typeSelect.addEventListener("change", filterAndRender);
    diffSelect.addEventListener("change", filterAndRender);
    
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        filterAndRender();
        searchInput.focus();
    });
    
    filterAndRender();
}

// 4. Command Cheat Sheets (Kommando-Lathundar) Logic
function initCheatSheets() {
    const tabContainer = document.getElementById("cheatsheet-tabs");
    const searchInput = document.getElementById("cheatsheet-search");
    const tbody = document.getElementById("cheatsheet-tbody");
    
    if (!tabContainer || !tbody) return;
    
    let activeSheet = "cisco";
    
    const showNotification = () => {
        const toast = document.getElementById("toast-notification");
        if (!toast) return;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2000);
    };
    
    const renderCommands = () => {
        const query = searchInput.value.toLowerCase().trim();
        const commands = COMMANDS_DATA[activeSheet];
        
        tbody.innerHTML = "";
        
        const filtered = commands.filter(c => {
            return c.cmd.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query);
        });
        
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-secondary); padding: 30px;">Inga kommandon matchar din sökning.</td></tr>`;
            return;
        }
        
        filtered.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><code class="cmd-code" title="Klicka för att kopiera">${c.cmd}</code></td>
                <td>${c.desc}</td>
                <td><code class="cmd-example">${c.ex}</code></td>
            `;
            
            const codeEl = tr.querySelector(".cmd-code");
            codeEl.addEventListener("click", () => {
                navigator.clipboard.writeText(c.cmd).then(() => {
                    showNotification();
                });
            });
            
            tbody.appendChild(tr);
        });
    };
    
    const tabBtns = tabContainer.querySelectorAll(".sheet-tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeSheet = btn.getAttribute("data-sheet");
            renderCommands();
        });
    });
    
    searchInput.addEventListener("input", renderCommands);
    renderCommands();
}

// 5. Interactive Quiz Engine
let currentQuiz = null;
let currentQuestionIdx = 0;
let score = 0;
let selectedOptionIdx = null;
let isAnswered = false;

function initQuizEngine() {
    const grid = document.getElementById("quiz-selector-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    QUIZ_DATA.forEach(q => {
        const card = document.createElement("div");
        card.className = "quiz-selector-card";
        
        const isDone = AppState.completedQuizzes.includes(q.id);
        const statusText = isDone ? "Avklarat &nbsp;✓" : "Starta test &rarr;";
        
        card.innerHTML = `
            <h4>${q.title}</h4>
            <p>${q.desc}</p>
            <div class="quiz-card-footer">
                <span>5 frågor &bull; Flerval</span>
                <span style="color: ${isDone ? 'var(--diff-junior)' : 'var(--accent-cyan)'}">${statusText}</span>
            </div>
        `;
        
        card.addEventListener("click", () => startQuiz(q.id));
        grid.appendChild(card);
    });
}

function startQuiz(quizId) {
    currentQuiz = QUIZ_DATA.find(q => q.id === quizId);
    if (!currentQuiz) return;
    
    currentQuestionIdx = 0;
    score = 0;
    selectedOptionIdx = null;
    isAnswered = false;
    
    document.getElementById("quiz-selector-view").style.display = "none";
    document.getElementById("quiz-result-view").style.display = "none";
    
    const activeView = document.getElementById("quiz-active-view");
    activeView.style.display = "flex";
    
    document.getElementById("quiz-cat-title").textContent = currentQuiz.title;
    
    renderQuestion();
}

function renderQuestion() {
    const qData = currentQuiz.questions[currentQuestionIdx];
    selectedOptionIdx = null;
    isAnswered = false;
    
    document.getElementById("quiz-progress-lbl").textContent = `Fråga ${currentQuestionIdx + 1} av ${currentQuiz.questions.length}`;
    
    const fillPercent = ((currentQuestionIdx) / currentQuiz.questions.length) * 100;
    document.getElementById("quiz-bar-fill").style.width = `${fillPercent}%`;
    
    document.getElementById("quiz-question-text").textContent = qData.q;
    
    const optionsList = document.getElementById("quiz-options-list");
    optionsList.innerHTML = "";
    
    qData.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-opt-btn";
        btn.innerHTML = `
            <span class="quiz-opt-idx">${String.fromCharCode(65 + idx)}</span>
            <span>${opt}</span>
        `;
        
        btn.addEventListener("click", () => {
            if (isAnswered) return;
            
            document.querySelectorAll(".quiz-opt-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedOptionIdx = idx;
            
            document.getElementById("quiz-next-btn").removeAttribute("disabled");
        });
        
        optionsList.appendChild(btn);
    });
    
    const feedbackBox = document.getElementById("quiz-feedback-box");
    feedbackBox.style.display = "none";
    feedbackBox.className = "quiz-feedback-box";
    
    const nextBtn = document.getElementById("quiz-next-btn");
    nextBtn.textContent = "Svara";
    nextBtn.setAttribute("disabled", "true");
}

document.getElementById("quiz-next-btn").addEventListener("click", () => {
    const qData = currentQuiz.questions[currentQuestionIdx];
    const nextBtn = document.getElementById("quiz-next-btn");
    const feedbackBox = document.getElementById("quiz-feedback-box");
    const feedbackText = document.getElementById("quiz-feedback-text");
    const options = document.querySelectorAll(".quiz-opt-btn");
    
    if (!isAnswered) {
        isAnswered = true;
        
        const isCorrect = selectedOptionIdx === qData.correct;
        if (isCorrect) {
            score++;
            feedbackBox.className = "quiz-feedback-box correct";
            feedbackText.innerHTML = `<strong>Rätt svar!</strong> ${qData.explanation}`;
        } else {
            feedbackBox.className = "quiz-feedback-box incorrect";
            feedbackText.innerHTML = `<strong>Fel svar.</strong> Det rätta svaret är: <em>${qData.options[qData.correct]}</em>. ${qData.explanation}`;
        }
        
        options.forEach((btn, idx) => {
            btn.setAttribute("disabled", "true");
            if (idx === qData.correct) {
                btn.classList.add("correct");
            } else if (idx === selectedOptionIdx) {
                btn.classList.add("incorrect");
            }
        });
        
        feedbackBox.style.display = "block";
        
        const isLastQuestion = currentQuestionIdx === currentQuiz.questions.length - 1;
        nextBtn.textContent = isLastQuestion ? "Visa resultat" : "Nästa fråga &rarr;";
    } else {
        currentQuestionIdx++;
        if (currentQuestionIdx < currentQuiz.questions.length) {
            renderQuestion();
        } else {
            showQuizResults();
        }
    }
});

function showQuizResults() {
    document.getElementById("quiz-active-view").style.display = "none";
    
    const resultView = document.getElementById("quiz-result-view");
    resultView.style.display = "flex";
    
    const scorePct = Math.round((score / currentQuiz.questions.length) * 100);
    const resIcon = document.getElementById("res-icon");
    const resTitle = document.getElementById("quiz-result-title");
    
    document.getElementById("quiz-result-score").textContent = `Du fick ${score} av ${currentQuiz.questions.length} rätt (${scorePct}%).`;
    
    const passed = scorePct >= 80;
    
    if (passed) {
        resTitle.textContent = "Test godkänt!";
        resIcon.style.color = "var(--diff-junior)";
        document.getElementById("quiz-result-desc").textContent = "Grymt jobbat! Du har visat goda teoretiska kunskaper inom detta ämnesområde. Resultatet har registrerats på startsidan.";
        AppState.markQuizCompleted(currentQuiz.id);
        updateProgressGauge();
        initQuizEngine();
    } else {
        resTitle.textContent = "Testet ej godkänt";
        resIcon.style.color = "var(--diff-senior)";
        document.getElementById("quiz-result-desc").textContent = "Du behöver minst 80% rätt (4 av 5) för att klara testet och registrera framsteg på startsidan. Läs igenom studiematerialet och försök igen!";
    }
}

document.getElementById("quiz-restart-btn").addEventListener("click", () => {
    startQuiz(currentQuiz.id);
});

document.getElementById("quiz-exit-btn").addEventListener("click", () => {
    document.getElementById("quiz-result-view").style.display = "none";
    document.getElementById("quiz-selector-view").style.display = "block";
});

// Helper: Setup SVG Gradient
function setupSvgGradients() {
    const svgEl = document.querySelector('.gauge-svg');
    if (!svgEl) return;
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    linearGradient.id = 'gauge-grad';
    linearGradient.setAttribute('x1', '0%');
    linearGradient.setAttribute('y1', '0%');
    linearGradient.setAttribute('x2', '100%');
    linearGradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#00f0ff');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#3b82f6');
    
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    defs.appendChild(linearGradient);
    svgEl.appendChild(defs);
}

// Make openResource globally accessible
window.openResource = openResource;

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/* ==========================================================================
   Settings Modal & Global Reset
   ========================================================================== */
const settingsBtn = document.getElementById('settings-open-btn');

if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    window.open('settings.html', 'Settings', 'width=600,height=400');
  });
}

window.handleDataReset = () => {
  AppState.resetProgress();
  updateProgressGauge();
  renderDashboardModules();
  showToast("Data har återställts.");
};

/* ==========================================================================
   Auth Logic
   ========================================================================== */
const authBtn = document.getElementById('auth-btn');
const authBtnText = document.getElementById('auth-btn-text');

if (authBtn) {
  authBtn.addEventListener('click', () => {
    if (currentUser) {
      signOut(auth).then(() => showToast("Utloggad!"));
    } else {
      signInWithPopup(auth, googleProvider).then(() => {
        showToast("Inloggad!");
      }).catch(err => {
        if (err.code !== 'auth/popup-closed-by-user') {
          showToast("Kunde inte logga in.");
        }
      });
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    if (authBtnText) authBtnText.textContent = "Logga ut";
    loadUserData();
  } else {
    currentUser = null;
    if (authBtnText) authBtnText.textContent = "Logga in";
  }
});
