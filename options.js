// Default configuration
const defaultConfig = {
  backgroundImage: '',
  colors: {
    background: '#24283b',
    overlay: '#24283b',
    header: '#7dcfff',
    link: '#bb9af7',
    linkHover: '#7aa2f7',
    branch: '#565f89',
    prompt: '#bb9af7',
    lambda: '#7aa2f7'
  },
  trees: [
    {
      sections: [
        {
          name: 'social',
          links: [
            { name: 'github', url: 'https://github.com/' },
            { name: 'reddit', url: 'https://reddit.com/' }
          ]
        },
        {
          name: 'productivity',
          links: [
            { name: 'gmail', url: 'https://mail.google.com/' },
            { name: 'drive', url: 'https://drive.google.com/' }
          ]
        }
      ]
    },
    {
      sections: [
        {
          name: 'media',
          links: [
            { name: 'youtube', url: 'https://www.youtube.com/' },
            { name: 'spotify', url: 'https://open.spotify.com/' }
          ]
        }
      ]
    }
  ]
};

let config = JSON.parse(JSON.stringify(defaultConfig));
let saveTimeout = null;

// Debounced autosave
function scheduleAutosave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveSettings(true);
  }, 500);
}

// Load settings from storage
async function loadSettings() {
  try {
    const result = await browser.storage.local.get('config');
    if (result.config) {
      config = { ...defaultConfig, ...result.config };
      config.colors = { ...defaultConfig.colors, ...result.config.colors };
    }
    renderTrees();
    loadFormValues();
  } catch (e) {
    console.error('Error loading settings:', e);
  }
}

// Load form values from config
function loadFormValues() {
  document.getElementById('bgImage').value = config.backgroundImage || '';
  document.getElementById('colorBackground').value = config.colors.background;
  document.getElementById('colorOverlay').value = config.colors.overlay;
  document.getElementById('colorHeader').value = config.colors.header;
  document.getElementById('colorLink').value = config.colors.link;
  document.getElementById('colorLinkHover').value = config.colors.linkHover;
  document.getElementById('colorBranch').value = config.colors.branch;
  document.getElementById('colorPrompt').value = config.colors.prompt;
  document.getElementById('colorLambda').value = config.colors.lambda;
}

// Save settings to storage
async function saveSettings(silent = false) {
  try {
    // Get background image
    config.backgroundImage = document.getElementById('bgImage').value || '';
    
    // Get colors
    config.colors = {
      background: document.getElementById('colorBackground').value,
      overlay: document.getElementById('colorOverlay').value,
      header: document.getElementById('colorHeader').value,
      link: document.getElementById('colorLink').value,
      linkHover: document.getElementById('colorLinkHover').value,
      branch: document.getElementById('colorBranch').value,
      prompt: document.getElementById('colorPrompt').value,
      lambda: document.getElementById('colorLambda').value
    };
    
    // Get trees data from DOM
    config.trees = [];
    const treeElements = document.querySelectorAll('.tree-block');
    
    treeElements.forEach(treeEl => {
      const tree = { sections: [] };
      const sectionElements = treeEl.querySelectorAll('.section-block');
      
      sectionElements.forEach(sectionEl => {
        const section = {
          name: sectionEl.querySelector('.section-name').value,
          links: []
        };
        
        const linkElements = sectionEl.querySelectorAll('.link-row');
        linkElements.forEach(linkEl => {
          section.links.push({
            name: linkEl.querySelector('.link-name').value,
            url: linkEl.querySelector('.link-url').value
          });
        });
        
        tree.sections.push(section);
      });
      
      config.trees.push(tree);
    });
    
    await browser.storage.local.set({ config });
    if (!silent) {
      showStatus('Saved', 'success');
    }
  } catch (e) {
    console.error('Error saving settings:', e);
    showStatus('Error saving', 'error');
  }
}

// Reset to defaults
async function resetSettings() {
  if (confirm('Reset all settings to default?')) {
    config = JSON.parse(JSON.stringify(defaultConfig));
    await browser.storage.local.set({ config });
    loadSettings();
    showStatus('Reset', 'success');
  }
}

// Show status message
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
  setTimeout(() => {
    status.textContent = '';
    status.className = 'status';
  }, 3000);
}

// Render all trees
function renderTrees() {
  const container = document.getElementById('trees-container');
  container.innerHTML = '';
  
  config.trees.forEach((tree, treeIndex) => {
    container.appendChild(createTreeElement(tree, treeIndex));
  });
}

// Create tree element
function createTreeElement(tree, treeIndex) {
  const treeDiv = document.createElement('div');
  treeDiv.className = 'tree-block';
  treeDiv.dataset.index = treeIndex;
  
  const header = document.createElement('div');
  header.className = 'tree-header';
  
  const h3 = document.createElement('h3');
  h3.textContent = 'Tree ' + (treeIndex + 1);
  header.appendChild(h3);
  
  const removeTreeBtn = document.createElement('button');
  removeTreeBtn.type = 'button';
  removeTreeBtn.className = 'btn btn-small btn-danger remove-tree';
  removeTreeBtn.textContent = 'Remove Tree';
  header.appendChild(removeTreeBtn);
  
  treeDiv.appendChild(header);
  
  const sectionsContainer = document.createElement('div');
  sectionsContainer.className = 'sections-container';
  
  tree.sections.forEach((section, sectionIndex) => {
    sectionsContainer.appendChild(createSectionElement(section, sectionIndex));
  });
  
  treeDiv.appendChild(sectionsContainer);
  
  const addSectionBtn = document.createElement('button');
  addSectionBtn.type = 'button';
  addSectionBtn.className = 'btn btn-small btn-secondary add-section';
  addSectionBtn.textContent = '+ Add Section';
  addSectionBtn.addEventListener('click', () => {
    const newSection = { name: '', links: [{ name: '', url: '' }] };
    sectionsContainer.appendChild(createSectionElement(newSection, sectionsContainer.children.length));
  });
  treeDiv.appendChild(addSectionBtn);
  
  // Remove tree handler
  removeTreeBtn.addEventListener('click', () => {
    treeDiv.remove();
  });
  
  return treeDiv;
}

// Create section element
function createSectionElement(section, sectionIndex) {
  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'section-block';
  
  const sectionHeader = document.createElement('div');
  sectionHeader.className = 'section-header';
  
  const sectionNameInput = document.createElement('input');
  sectionNameInput.type = 'text';
  sectionNameInput.className = 'section-name';
  sectionNameInput.value = section.name || '';
  sectionNameInput.placeholder = 'Section name';
  sectionHeader.appendChild(sectionNameInput);
  
  const removeSectionBtn = document.createElement('button');
  removeSectionBtn.type = 'button';
  removeSectionBtn.className = 'btn btn-small btn-danger remove-section';
  removeSectionBtn.textContent = '×';
  sectionHeader.appendChild(removeSectionBtn);
  
  sectionDiv.appendChild(sectionHeader);
  
  const linksContainer = document.createElement('div');
  linksContainer.className = 'links-container';
  
  section.links.forEach((link, linkIndex) => {
    linksContainer.appendChild(createLinkElement(link));
  });
  
  sectionDiv.appendChild(linksContainer);
  
  const addLinkBtn = document.createElement('button');
  addLinkBtn.type = 'button';
  addLinkBtn.className = 'btn btn-small btn-tertiary add-link';
  addLinkBtn.textContent = '+ Add Link';
  addLinkBtn.addEventListener('click', () => {
    linksContainer.appendChild(createLinkElement({ name: '', url: '' }));
  });
  sectionDiv.appendChild(addLinkBtn);
  
  // Remove section handler
  removeSectionBtn.addEventListener('click', () => {
    sectionDiv.remove();
  });
  
  return sectionDiv;
}

// Create link element
function createLinkElement(link) {
  const linkDiv = document.createElement('div');
  linkDiv.className = 'link-row';
  
  const linkNameInput = document.createElement('input');
  linkNameInput.type = 'text';
  linkNameInput.className = 'link-name';
  linkNameInput.value = link.name || '';
  linkNameInput.placeholder = 'Link name';
  linkDiv.appendChild(linkNameInput);
  
  const linkUrlInput = document.createElement('input');
  linkUrlInput.type = 'url';
  linkUrlInput.className = 'link-url';
  linkUrlInput.value = link.url || '';
  linkUrlInput.placeholder = 'https://...';
  linkDiv.appendChild(linkUrlInput);
  
  const removeLinkBtn = document.createElement('button');
  removeLinkBtn.type = 'button';
  removeLinkBtn.className = 'btn btn-small btn-danger remove-link';
  removeLinkBtn.textContent = '×';
  linkDiv.appendChild(removeLinkBtn);
  
  removeLinkBtn.addEventListener('click', () => {
    linkDiv.remove();
  });
  
  return linkDiv;
}

// Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
}

// Handle image file upload
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('bgImage').value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Add new tree
function addTree() {
  const container = document.getElementById('trees-container');
  const newTree = {
    sections: [{ name: '', links: [{ name: '', url: '' }] }]
  };
  container.appendChild(createTreeElement(newTree, container.children.length));
  scheduleAutosave();
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('save').addEventListener('click', () => saveSettings(false));
document.getElementById('reset').addEventListener('click', resetSettings);
document.getElementById('add-tree').addEventListener('click', addTree);
document.getElementById('bgImageFile').addEventListener('change', function(e) {
  handleImageUpload(e);
  scheduleAutosave();
});

// Autosave on input changes
document.getElementById('bgImage').addEventListener('input', scheduleAutosave);
document.getElementById('colorBackground').addEventListener('input', scheduleAutosave);
document.getElementById('colorOverlay').addEventListener('input', scheduleAutosave);
document.getElementById('colorHeader').addEventListener('input', scheduleAutosave);
document.getElementById('colorLink').addEventListener('input', scheduleAutosave);
document.getElementById('colorLinkHover').addEventListener('input', scheduleAutosave);
document.getElementById('colorBranch').addEventListener('input', scheduleAutosave);
document.getElementById('colorPrompt').addEventListener('input', scheduleAutosave);
document.getElementById('colorLambda').addEventListener('input', scheduleAutosave);

// Autosave on tree changes (using event delegation for inputs and clicks)
document.getElementById('trees-container').addEventListener('input', scheduleAutosave);
document.getElementById('trees-container').addEventListener('click', function(e) {
  // Trigger autosave when add/remove buttons are clicked
  if (e.target.matches('.remove-tree, .remove-section, .remove-link, .add-section, .add-link')) {
    scheduleAutosave();
  }
});
