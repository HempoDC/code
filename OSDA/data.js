const osdaData = {
  topics: [
    {
      id: "network",
      title: "Network Traffic Analysis",
      description: "Analyzing packet captures and network flows to identify reconnaissance, scanning activity, and active command and control (C2) channels.",
      subtopics: [
        {
          name: "Tcpdump Packet Capture",
          details: "Capturing and parsing raw network packets from command line terminals in Linux network interfaces.",
          commands: [
            { cmd: "tcpdump -i eth0 -n", desc: "Monitor raw traffic on eth0 without resolving names (-n)" },
            { cmd: "tcpdump -r capture.pcap -n 'tcp port 80 or tcp port 443'", desc: "Read PCAP file and filter for web traffic (ports 80 and 443)" },
            { cmd: "tcpdump -r capture.pcap -n 'src 10.10.14.5 and dst port 445'", desc: "Filter packet reads by source IP and destination SMB port (445)" },
            { cmd: "tcpdump -c 100 -i eth0 'ip proto \\tcp and port 22'", desc: "Capture exactly 100 TCP packets on SSH port 22" }
          ],
          tips: [
            "Use '-nn' to disable both DNS and port service name resolutions, speeding up packet parsing under load.",
            "Write captures to disk using '-w traffic.pcap' for advanced analysis in graphical Wireshark panels."
          ]
        },
        {
          name: "Wireshark Display Filters",
          details: "Filtering PCAP files dynamically inside Wireshark to locate malicious payload packet payloads.",
          commands: [
            { cmd: "ip.addr == 10.10.14.5 && tcp.port == 4444", desc: "Filter for all traffic involving attacking IP on common reverse shell port 4444" },
            { cmd: "http.request.method == \"POST\" && http.request.uri contains \"upload\"", desc: "Filter for HTTP POST requests involving file uploads" },
            { cmd: "dns.flags.response == 0 && dns.qry.name contains \"c2\"", desc: "Find outgoing DNS query requests looking for suspected C2 domains" },
            { cmd: "smb.cmd == 0x75 || smb2.cmd == 3", desc: "Filter for SMB tree connect requests (corresponds to share enumeration sweeps)" }
          ],
          tips: [
            "Always follow TCP stream (Right Click -> Follow -> TCP Stream) on alerts to inspect plain-text reverse shells or HTTP payloads.",
            "Analyze protocol hierarchy statistics to see if a specific protocol has anomalous volume (indicator of tunneling)."
          ]
        }
      ]
    },
    {
      id: "windows",
      title: "Windows Endpoint Auditing",
      description: "Correlating Windows Event logs and Sysmon telemetry to track suspicious process creation, logon types, registry modifications, and service installs.",
      subtopics: [
        {
          name: "Process Auditing (Event ID 4688 / Sysmon 1)",
          details: "Analyzing process execution logs to identify shell launches, administrative command bypasses, and credential harvesting.",
          commands: [
            { cmd: "EventID: 4688 AND ProcessName: (cmd.exe OR powershell.exe)", desc: "SIEM query to find shell launches (standard process auditing)" },
            { cmd: "EventID: 1 AND CommandLine: (*whoami* OR *ipconfig* OR *net* OR *nltest*)", desc: "Sysmon query to detect target reconnaissance commands" },
            { cmd: "EventID: 1 AND ParentProcessName: (*w3wp.exe* OR *tomcat.exe* OR *httpd.exe*)", desc: "Sysmon query detecting web server processes launching shells (web shell indicator)" },
            { cmd: "EventID: 1 AND CommandLine: (*-ep bypass* OR *-encodedcommand*)", desc: "Detect PowerShell script execution bypasses or obfuscated scripts" }
          ],
          tips: [
            "Normal users rarely run commands like 'whoami' or 'nltest'. These are strong signals of attacker enumeration.",
            "Compare ParentProcessName with ProcessName. If explorer.exe launches cmd.exe, it is normal user activity. If sqlserver.exe launches cmd.exe, it is a server compromise."
          ]
        },
        {
          name: "Windows Logon Auditing (Event ID 4624 / 4625)",
          details: "Correlating successful and failed authentication attempts to detect brute force, lateral movement, or pass-the-hash.",
          commands: [
            { cmd: "EventID: 4625 AND LogonType: 3", desc: "Detect failed network logons (potential brute force indicator)" },
            { cmd: "EventID: 4624 AND LogonType: 3 AND AuthenticationPackageName: NTLM", desc: "Identify network logins using NTLM authentication (common lateral movement check)" },
            { cmd: "EventID: 4624 AND LogonType: 9", desc: "Logon Type 9 indicates a login via RunAs / NewCredentials (frequently used by Mimikatz Pass-the-Hash)" },
            { cmd: "EventID: 4624 AND LogonType: 10", desc: "Logon Type 10 represents Remote Desktop (RDP) successful connections" }
          ],
          tips: [
            "Logon Type 3 is Network (e.g. accessing SMB shares or WinRM commands).",
            "Logon Type 5 is Service (services running as user accounts).",
            "Logon Type 2 is Interactive (local keyboard/screen login)."
          ]
        },
        {
          name: "Service & Registry Auditing",
          details: "Detecting persistence mechanisms like service creations (Event ID 7045) and registry modifications.",
          commands: [
            { cmd: "EventID: 7045 AND ServiceFileName: (*cmd.exe* OR *powershell.exe* OR *nc.exe*)", desc: "Detect malicious service creation (e.g., PsExec installs a service to get administrative cmd)" },
            { cmd: "EventID: 4697 AND ServiceName: *PSEXEC*", desc: "Standard Windows Security audit event for service install matching PsExec" },
            { cmd: "EventID: 13 AND TargetObject: *\\Software\\Microsoft\\Windows\\CurrentVersion\\Run*", desc: "Sysmon Registry value set audit looking for startup persistence additions" }
          ],
          tips: [
            "Attackers often write local admin shells as custom services. Keep a close eye on Event ID 7045 (New Service Created)."
          ]
        }
      ]
    },
    {
      id: "linux",
      title: "Linux Endpoint Auditing",
      description: "Correlating Syslog, auth.log, and auditd configurations to trace local exploit footprints, account modifications, and SUID abuse.",
      subtopics: [
        {
          name: "Auth Log Analysis",
          details: "Analyzing /var/log/auth.log or /var/log/secure to track shell logins, sudo attempts, and credential attacks.",
          commands: [
            { cmd: "grep -i \"failed\" /var/log/auth.log", desc: "Audit auth.log for ssh failed login attempts" },
            { cmd: "grep -i \"accepted\" /var/log/auth.log", desc: "Audit auth.log for successful logins" },
            { cmd: "grep \"COMMAND=\" /var/log/auth.log", desc: "Trace executed sudo commands by logged users" },
            { cmd: "grep -i \"useradd\" /var/log/auth.log", desc: "Look for user additions or group modifications in logs" }
          ],
          tips: [
            "Attackers getting footholds will often add their own administrative accounts to /etc/passwd or sudoers.",
            "Verify all accepted SSH connections match known management IP ranges."
          ]
        },
        {
          name: "Linux Auditd Logs",
          details: "Querying auditd logs to find SUID executions, file modifications, or socket openings.",
          commands: [
            { cmd: "ausearch -m SYSCALL -f /etc/passwd", desc: "Search auditd logs for events that accessed /etc/passwd" },
            { cmd: "aureport -x", desc: "Run a summary report of all executed programs captured by auditd" },
            { cmd: "ausearch -m PATH -f /usr/bin/find", desc: "Audit auditd logs to see if SUID binary 'find' was run" }
          ],
          tips: [
            "Auditd provides powerful system-level telemetry. Ensure key rules are enabled in /etc/audit/rules.d/audit.rules before monitoring."
          ]
        }
      ]
    },
    {
      id: "ad_defense",
      title: "Active Directory Attacks Detection",
      description: "Detecting domain privilege escalation, ticket creation abuses, and credential theft inside AD domains.",
      subtopics: [
        {
          name: "AS-REP Roasting & Kerberoasting Detection",
          details: "Tracking Kerberos ticket request logs to discover offline credential extraction attacks.",
          commands: [
            { cmd: "EventID: 4769 AND TicketEncryptionType: 0x17 AND ServiceName: (*$* == false)", desc: "Detect Kerberoasting: Event 4769 (TGS requested) with weak RC4 encryption (0x17) and ServiceName is not a computer account (does not end with $)" },
            { cmd: "EventID: 4768 AND TicketEncryptionType: 0x17 AND PreAuthType: 0", desc: "Detect AS-REP Roasting: Event 4768 (TGT request) with RC4 encryption (0x17) and Pre-Authentication Disabled (PreAuthType: 0)" }
          ],
          tips: [
            "Look for a high frequency of Event 4769 from a single source computer targeting multiple different SPNs in a short period."
          ]
        },
        {
          name: "AD Lateral Movement Detection",
          details: "Tracking attacker lateral movement mechanisms (PsExec, WMI, WinRM) using Windows Event logs.",
          commands: [
            { cmd: "EventID: 3 AND DestinationPort: 5985 OR 5986", desc: "Sysmon network log detecting active WinRM remote command sessions" },
            { cmd: "EventID: 1 AND ParentProcessName: *wmiprvse.exe*", desc: "Sysmon process creation where WMI provider host spawned commands (WMI lateral movement)" },
            { cmd: "EventID: 4624 AND LogonType: 3 AND ShareName: *\\ADMIN$", desc: "Detect PsExec network share connects (attaching to ADMIN$ share to copy service executable)" }
          ],
          tips: [
            "WMI executions spawn as children of wmiprvse.exe.",
            "PsExec executions copy an executable to ADMIN$ share, install a service, and communicate via pipe."
          ]
        }
      ]
    },
    {
      id: "web_defense",
      title: "Web Attacks Detection",
      description: "Analyzing web server logs (Apache, Nginx, IIS) to discover exploit attempts, payloads, and malicious script uploads.",
      subtopics: [
        {
          name: "Web Server Log Auditing",
          details: "Parsing access logs for malicious parameters and patterns in GET and POST requests.",
          commands: [
            { cmd: "grep -E \"\\.\\./|etc/passwd\" /var/log/apache2/access.log", desc: "Detect Local File Inclusion (LFI) traversal indicators in access logs" },
            { cmd: "grep -E \"UNION|SELECT|INSERT\" /var/log/apache2/access.log", desc: "Search for basic SQL Injection patterns in GET parameters" },
            { cmd: "grep -E \"whoami|id|ipconfig|sysctl\" /var/log/apache2/access.log", desc: "Search log files for potential web command injections" },
            { cmd: "awk '{print $7}' /var/log/nginx/access.log | grep -E \"\\.php|\\.aspx|\\.jsp\"", desc: "Filter access logs to trace accessed dynamic script extensions" }
          ],
          tips: [
            "Attackers testing LFI often send requests containing multiple '../' sequences. Filter for %2e%2e%2f url-encoded patterns.",
            "Examine response status codes. A 200 OK after a command injection payload is a high-priority incident indicator."
          ]
        }
      ]
    }
  ],
  moments: [
    {
      moment: "Exam Start & SIEM Setup",
      timeframe: "0 - 1 Hours",
      objective: "Establish connectivity, connect to proctors, and verify target SIEM ingestion.",
      checklist: [
        "Connect to the proctoring platform and clear webcam rooms sweeps.",
        "Launch the exam dashboard VPN and log into Splunk / Kibana SIEM console.",
        "Run ingestion tests: verify you are receiving logs from all target endpoints (Windows/Linux).",
        "Write down all target system Hostnames, IPs, and OS types in your documentation notes."
      ]
    },
    {
      moment: "Recon & Scan Detection",
      timeframe: "1 - 3 Hours",
      objective: "Locate target port sweeps or directory busts running against network assets.",
      checklist: [
        "Query firewall or network log sensors for rapid connection attempts from external IPs.",
        "Search web access logs for heavy HTTP 404 responses (indicator of directory brute-forcing/Gobuster).",
        "Document attacker scanning IPs and locate the timestamp when scanning initiated."
      ]
    },
    {
      moment: "Detecting Initial Access",
      timeframe: "3 - 6 Hours",
      objective: "Identify the vulnerable application exploit used to compromise the first host.",
      checklist: [
        "Search web server logs for HTTP 200 responses returning command execution keywords.",
        "Identify uploaded malicious shells (.php, .aspx) inside process creation or file writes logs.",
        "Isolate the attacker's foothold IP, the compromised local user, and the targeted service."
      ]
    },
    {
      moment: "Detecting Local Escalations",
      timeframe: "6 - 10 Hours",
      objective: "Trace the privilege escalation exploit path that led to administrator or root level.",
      checklist: [
        "Search Windows event logs for Event ID 7045 or Sysmon Event ID 1 executing elevated shells.",
        "Audit command parameters for SUID run escapes (on Linux) or unquoted path service swaps (on Windows).",
        "Capture Event ID screenshots showing the exact elevated shell spawn, user account, and PID."
      ]
    },
    {
      moment: "Analyst Mid-Exam Rest",
      timeframe: "10 - 11 Hours",
      objective: "Eat, hydrate, and audit captured logs to clear analytical fatigue.",
      checklist: [
        "Inform proctors about taking a break and step away from your monitors.",
        "Organize the timeline structure: ensure all incidents documented have correct matching timestamps.",
        "Verify your SIEM queries are saved in a text document so they can be re-run quickly."
      ]
    },
    {
      moment: "Detecting Active Directory lateral hops",
      timeframe: "11 - 16 Hours",
      objective: "Trace network pivots, Pass-the-Hash logons, and Domain Controller compromise.",
      checklist: [
        "Query Event ID 4624 Type 3 network logons or Type 9 Mimikatz lateral movement signals.",
        "Search AD Directory Services logs for Event ID 4662 (detecting unauthorized DCSync requests).",
        "Locate Kerberos ticket request anomalies (AS-REP or TGS roasting) from the compromised footholds.",
        "Grab DC flags and complete the incident exploitation chain overview."
      ]
    },
    {
      moment: "Incident Report Compilation",
      timeframe: "16 - 22 Hours",
      objective: "Verify timestamps, draw network attack diagrams, and structure the reporting documents.",
      checklist: [
        "Verify every attack step has: Attacker IP, Target IP, Account used, Timestamp, Event ID, and Action.",
        "Draft the remediation recommendations for every vulnerability exploited.",
        "Export high-contrast screenshots of the SIEM queries showing the malicious events.",
        "Confirm all proof answers submitted in the control panel match the report timeline exactly."
      ]
    },
    {
      moment: "Final Audits & PDF Upload",
      timeframe: "22 - 24 Hours",
      objective: "Compile your Markdown report to PDF and upload to OffSec portal.",
      checklist: [
        "Generate the PDF report using the official OSDA Markdown Template.",
        "Double check naming rules: file must be named OSDA-HW-XXXXX-Report.pdf.",
        "Upload the PDF, verify formatting, and confirm submission receipt."
      ]
    }
  ],
  vulnerableMachines: [
    { name: "Active Directory Intrusion", platform: "CyberDefenders", difficulty: "Medium", os: "Windows", focus: "Detecting AS-REP roasting, Kerberoasting, and psexec logs" },
    { name: "Apache Web Log Analysis", platform: "CyberDefenders", difficulty: "Easy", os: "Linux", focus: "Analyzing access logs for SQLi, directory traversals, and reverse shells" },
    { name: "Brutus", platform: "Hack The Box (Sherlock)", difficulty: "Easy", os: "Linux", focus: "Detecting SSH brute force attacks and local user add logs" },
    { name: "RogueOne", platform: "Hack The Box (Sherlock)", difficulty: "Medium", os: "Windows", focus: "Detecting Sysmon file writes, DLL side-loading, and startup persistence" },
    { name: "LogParser Practice", platform: "Proving Grounds", difficulty: "Easy", os: "Linux", focus: "Parsing auditd logs and auth logs using command line filters" }
  ]
};
