// Default configuration (used if nothing in storage)
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

// Load and render the page
async function init() {
  let config = defaultConfig;
  
  try {
    const result = await browser.storage.local.get('config');
    if (result.config) {
      config = result.config;
    }
  } catch (e) {
    console.error('Error loading config:', e);
  }
  
  // Apply background image
  if (config.backgroundImage) {
    document.body.style.backgroundImage = `url('${config.backgroundImage}')`;
  }
  
  // Render trees
  renderTrees(config.trees);
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
