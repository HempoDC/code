/* ==========================================================================
   OSDA PREP PORTAL APPLICATION CONTROLLER (app.js)
   Controls navigation, log queries compilation, practice labs selectors,
   target track scorecards, and local progress storage.
   ========================================================================== */

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
  let masteredSubtopics = safeJSONParse('osda_mastered_subtopics', []);
  let completedPractice = safeJSONParse('osda_completed_practice', []);
  
  // Default Target list for Exam Tracker
  const defaultTargets = [
    { name: 'Target 1 (Web)', type: 'Foothold Audit (20 pts)', points: 20, foothold: false, recon: false, escalation: false, documented: false },
    { name: 'Target 2 (Escalation)', type: 'Privilege Audit (20 pts)', points: 20, foothold: false, recon: false, escalation: false, documented: false },
    { name: 'Target 3 (Pivoting)', type: 'Lateral Hops Audit (20 pts)', points: 20, foothold: false, recon: false, escalation: false, documented: false },
    { name: 'AD Domain DC', type: 'Forest Trust Audit (20 pts)', points: 20, foothold: false, recon: false, escalation: false, documented: false }
  ];
  let targetMachines = safeJSONParse('osda_targets', defaultTargets);

  // DOM Elements cache
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.view-section');
  const clockElement = document.getElementById('clock');
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
    dashboard: { title: 'Dashboard Overview', subtitle: 'Interactive tracker and statistics for your SOC-200 / OSDA prep.' },
    knowledge: { title: 'SOC Knowledge Portal', subtitle: 'Search and review all SOC-200 syllabus points, code blocks, and critical detection queries.' },
    timeline: { title: 'Detection Timeline & Checklist', subtitle: 'Step-by-step milestones to stay on schedule and organize logs timeline during the 24h exam.' },
    generator: { title: 'SIEM Query Builder', subtitle: 'Input attacker attributes to generate custom KQL and Splunk SPL queries.' },
    tracker: { title: 'Live Incident Logs Audit', subtitle: 'Log findings, track machine log sources, and tally your total points dynamically.' },
    practice: { title: 'Defensive Investigation Labs', subtitle: 'Curated list of log challenges from CyberDefenders, HTB, and PG matching SOC skillsets.' },
    resources: { title: 'Quick References & Time Sync', subtitle: 'Crucial reference links, timezone tools, and network audit command scripts.' }
  };

  /* ==========================================================================
     Clock System
     ========================================================================== */
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

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
    osdaData.topics.forEach(topic => {
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
    osdaData.topics.forEach(topic => {
      const chip = document.createElement('div');
      chip.className = `filter-chip ${selectedCategoryFilter === topic.id ? 'active' : ''}`;
      chip.textContent = topic.title.split(' ')[0]; // short representation
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

    osdaData.topics.forEach(topic => {
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
            <h5><i class="fa-solid fa-lightbulb"></i> Analysis Tips & Triggers</h5>
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
    
    localStorage.setItem('osda_mastered_subtopics', JSON.stringify(masteredSubtopics));
    updateMasteryProgressBar();

    // Re-render topic header count tag without completely rebuilding DOM node to keep animation stable
    const parentWrapper = document.getElementById(`topic-${categoryId}`);
    if (parentWrapper) {
      const topicObj = osdaData.topics.find(t => t.id === categoryId);
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

    osdaData.moments.forEach((mom, idx) => {
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
     SIEM Log Queries Constructor
     ========================================================================== */
  const attackerIpInput = document.getElementById('attacker_ip');
  const targetHostInput = document.getElementById('target_host');
  const targetUserInput = document.getElementById('target_user');
  const processNameInput = document.getElementById('process_name');
  
  const qProcess = document.getElementById('q-process');
  const qAuth = document.getElementById('q-auth');
  const qNetwork = document.getElementById('q-network');

  if (attackerIpInput && targetHostInput && targetUserInput && processNameInput) {
    attackerIpInput.addEventListener('input', updateSIEMQueries);
    targetHostInput.addEventListener('input', updateSIEMQueries);
    targetUserInput.addEventListener('input', updateSIEMQueries);
    processNameInput.addEventListener('input', updateSIEMQueries);
  }

  function updateSIEMQueries() {
    const aIp = attackerIpInput.value || '10.10.14.5';
    const tHost = targetHostInput.value || 'WIN-DC01';
    const tUser = targetUserInput.value || 'Administrator';
    const pName = processNameInput.value || 'psexec.exe';

    // 1. Process Creation
    qProcess.textContent = `[Kibana KQL]
event.code: ("4688" OR "1") AND (process.name: "${pName}" OR process.command_line: *${pName}*) AND host.name: "${tHost}"

[Splunk SPL]
index=windows (EventCode=4688 OR EventCode=1) (NewProcessName="*${pName}" OR Image="*${pName}" OR CommandLine="*${pName}*") Computer="${tHost}"`;

    // 2. Authentication Logons
    qAuth.textContent = `[Kibana KQL]
event.code: ("4624" OR "4625") AND user.name: "${tUser}" AND source.ip: "${aIp}"

[Splunk SPL]
index=windows (EventCode=4624 OR EventCode=4625) TargetUserName="${tUser}" SourceAddress="${aIp}"`;

    // 3. Network Connections
    qNetwork.textContent = `[Kibana KQL]
event.code: "3" AND destination.ip: "${aIp}" AND (host.name: "${tHost}" OR source.ip: "${tHost}")

[Splunk SPL]
index=windows EventCode=3 DestinationIp="${aIp}" (Computer="${tHost}" OR SourceIp="${tHost}")`;
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
      const name = prompt("Enter Target hostname/incident (e.g. Linux Web server):");
      if (!name) return;

      targetMachines.push({
        name: name,
        type: `Custom Target (20 pts)`,
        points: 20,
        foothold: false,
        recon: false,
        escalation: false,
        documented: false
      });

      saveTargets();
      renderTrackerTable();
    });
  }

  function saveTargets() {
    localStorage.setItem('osda_targets', JSON.stringify(targetMachines));
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
            <i class="fa-solid ${machine.foothold ? 'fa-circle-check' : 'fa-circle'}"></i> ${machine.foothold ? 'Ingested' : 'Log Audit'}
          </button>
        </td>
        <td>
          <button class="toggle-td-btn ${machine.recon ? 'secured' : ''}" data-idx="${idx}" data-field="recon">
            <i class="fa-solid ${machine.recon ? 'fa-circle-check' : 'fa-circle'}"></i> ${machine.recon ? 'Tracked' : 'Recon'}
          </button>
        </td>
        <td>
          <button class="toggle-td-btn ${machine.escalation ? 'secured' : ''}" data-idx="${idx}" data-field="escalation">
            <i class="fa-solid ${machine.escalation ? 'fa-circle-check' : 'fa-circle'}"></i> ${machine.escalation ? 'Traced' : 'PrivEsc'}
          </button>
        </td>
        <td>
          <button class="toggle-td-btn ${machine.documented ? 'secured' : ''}" data-idx="${idx}" data-field="documented">
            <i class="fa-solid ${machine.documented ? 'fa-circle-check' : 'fa-circle'}"></i> ${machine.documented ? 'Logged' : 'Timeline'}
          </button>
        </td>
        <td>
          <button class="btn-icon-only text-red delete-target-btn" data-idx="${idx}" aria-label="Delete Incident Target">
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
        if (confirm(`Remove incident "${machine.name}" from target list?`)) {
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
      // 4 audit steps, each worth 5 points to sum up to 20 pts per machine
      if (machine.foothold) score += 5;
      if (machine.recon) score += 5;
      if (machine.escalation) score += 5;
      if (machine.documented) score += 5;
    });

    // Automatically award 20 report outline points if the candidate completes all incident trackers
    // To keep it simple: maximum score is the sum of completed points (max 100 if 4 targets + 20 report pts)
    // We'll award report compile buffer (20 pts) when target timeline items are logged
    let loggedIncidents = targetMachines.filter(m => m.documented).length;
    if (loggedIncidents === targetMachines.length && targetMachines.length > 0) {
      score += 20; // 20 pts for complete Incident Timeline report outline
    }

    // Update displays
    liveScoreText.textContent = score;
    const progressPercent = Math.min((score / 70) * 100, 100);
    liveScoreBar.style.width = `${progressPercent}%`;

    if (score >= 70) {
      liveScoreStatus.textContent = "PASS SECURED! Ensure timelines contain query logs.";
      liveScoreStatus.className = "score-status text-center passed";
      liveScoreBar.style.background = "linear-gradient(90deg, var(--neon-teal), #22c55e)";
    } else {
      liveScoreStatus.textContent = `${70 - score} Points Remaining to Pass`;
      liveScoreStatus.className = "score-status text-center";
      liveScoreBar.style.background = "linear-gradient(90deg, var(--neon-blue), var(--neon-purple))";
    }
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

    const filtered = osdaData.vulnerableMachines.filter(m => {
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
        <td>${machine.os === 'Linux' ? '<i class="fa-brands fa-linux text-teal"></i> Linux' : 
             machine.os === 'Windows' ? '<i class="fa-brands fa-windows text-blue"></i> Windows' : 
             '<i class="fa-solid fa-server text-purple"></i> Mixed'}</td>
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
      practiceCountSummary.textContent = `Showing ${filtered.length} / ${osdaData.vulnerableMachines.length} Labs (${completedCount} completed)`;
    }
  }

  function togglePracticeMachine(machineName) {
    const idx = completedPractice.indexOf(machineName);
    if (idx > -1) {
      completedPractice.splice(idx, 1);
    } else {
      completedPractice.push(machineName);
    }
    localStorage.setItem('osda_completed_practice', JSON.stringify(completedPractice));
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
        showToast("Copied query to clipboard!");
      } catch (err) {
        showToast("Error copying text");
      }
      document.body.removeChild(textArea);
      return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied query to clipboard!");
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
     Global Reset Control
     ========================================================================== */
  const resetBtn = document.getElementById('reset-data');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("WARNING: Are you sure you want to reset all syllabus progress, exam moments checklist, and target trackers? This cannot be undone.")) {
        localStorage.removeItem('osda_mastered_subtopics');
        localStorage.removeItem('osda_completed_practice');
        localStorage.removeItem('osda_targets');
        
        masteredSubtopics = [];
        completedPractice = [];
        targetMachines = [
          { name: 'Target 1 (Web)', type: 'Foothold Audit (20 pts)', points: 20, foothold: false, recon: false, escalation: false, documented: false },
          { name: 'Target 2 (Escalation)', type: 'Privilege Audit (20 pts)', points: 20, foothold: false, recon: false, escalation: false, documented: false },
          { name: 'Target 3 (Pivoting)', type: 'Lateral Hops Audit (20 pts)', points: 20, foothold: false, recon: false, escalation: false, documented: false },
          { name: 'AD Domain DC', type: 'Forest Trust Audit (20 pts)', points: 20, foothold: false, recon: false, escalation: false, documented: false }
        ];

        saveTargets();
        switchTab('dashboard');
        updateDashboardData();
        showToast("All progress has been reset.");
      }
    });
  }

  // Helper Utilities
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initialize
  renderCategoryFilters();
  updateDashboardData();
  updateSIEMQueries();
});
