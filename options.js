// Default configuration
const defaultConfig = {
  backgroundImage: '',
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

// Load settings from storage
async function loadSettings() {
  try {
    const result = await browser.storage.local.get('config');
    if (result.config) {
      config = result.config;
    }
    renderTrees();
    document.getElementById('bgImage').value = config.backgroundImage || '';
  } catch (e) {
    console.error('Error loading settings:', e);
  }
}

// Save settings to storage
async function saveSettings() {
  try {
    // Get background image
    config.backgroundImage = document.getElementById('bgImage').value || defaultConfig.backgroundImage;
    
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
    showStatus('Settings saved!', 'success');
  } catch (e) {
    console.error('Error saving settings:', e);
    showStatus('Error saving settings', 'error');
  }
}

// Reset to defaults
async function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    config = JSON.parse(JSON.stringify(defaultConfig));
    await browser.storage.local.set({ config });
    loadSettings();
    showStatus('Settings reset to default', 'success');
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
  header.innerHTML = `
    <h3>Tree ${treeIndex + 1}</h3>
    <button type="button" class="btn btn-small btn-danger remove-tree">Remove Tree</button>
  `;
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
  header.querySelector('.remove-tree').addEventListener('click', () => {
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
  sectionHeader.innerHTML = `
    <input type="text" class="section-name" value="${escapeHtml(section.name)}" placeholder="Section name">
    <button type="button" class="btn btn-small btn-danger remove-section">×</button>
  `;
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
  sectionHeader.querySelector('.remove-section').addEventListener('click', () => {
    sectionDiv.remove();
  });
  
  return sectionDiv;
}

// Create link element
function createLinkElement(link) {
  const linkDiv = document.createElement('div');
  linkDiv.className = 'link-row';
  linkDiv.innerHTML = `
    <input type="text" class="link-name" value="${escapeHtml(link.name)}" placeholder="Link name">
    <input type="url" class="link-url" value="${escapeHtml(link.url)}" placeholder="https://...">
    <button type="button" class="btn btn-small btn-danger remove-link">×</button>
  `;
  
  linkDiv.querySelector('.remove-link').addEventListener('click', () => {
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
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('save').addEventListener('click', saveSettings);
document.getElementById('reset').addEventListener('click', resetSettings);
document.getElementById('add-tree').addEventListener('click', addTree);
document.getElementById('bgImageFile').addEventListener('change', handleImageUpload);
