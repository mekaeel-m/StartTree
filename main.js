// Default configuration (used if nothing in storage)
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

// Load and render the page
async function init() {
  let config = defaultConfig;
  
  try {
    const result = await browser.storage.local.get('config');
    if (result.config) {
      config = { ...defaultConfig, ...result.config };
      config.colors = { ...defaultConfig.colors, ...result.config.colors };
    }
  } catch (e) {
    console.error('Error loading config:', e);
  }
  
  // Apply colors
  applyColors(config.colors);
  
  // Apply background image
  if (config.backgroundImage) {
    document.body.style.backgroundImage = `url('${config.backgroundImage}')`;
  }
  
  // Render trees
  renderTrees(config.trees);
}

// Apply custom colors to CSS variables
function applyColors(colors) {
  const root = document.documentElement;
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--background-overlay', hexToRgba(colors.overlay, 0.4));
  root.style.setProperty('--header', colors.header);
  root.style.setProperty('--link', colors.link);
  root.style.setProperty('--link-hover', colors.linkHover);
  root.style.setProperty('--branch', colors.branch);
  root.style.setProperty('--prompt-tilde', colors.prompt);
  root.style.setProperty('--prompt-lambda', colors.lambda);
}

// Convert hex to rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Render all trees
function renderTrees(trees) {
  const container = document.getElementById('trees-container');
  container.innerHTML = '';
  
  trees.forEach(tree => {
    const treeDiv = document.createElement('div');
    treeDiv.className = 'tree';
    
    const ul = document.createElement('ul');
    
    tree.sections.forEach(section => {
      const li = document.createElement('li');
      
      const header = document.createElement('span');
      header.className = 'header';
      header.textContent = section.name;
      li.appendChild(header);
      
      const linksUl = document.createElement('ul');
      section.links.forEach(link => {
        const linkLi = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.name;
        linkLi.appendChild(a);
        linksUl.appendChild(linkLi);
      });
      
      li.appendChild(linksUl);
      ul.appendChild(li);
    });
    
    treeDiv.appendChild(ul);
    container.appendChild(treeDiv);
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
