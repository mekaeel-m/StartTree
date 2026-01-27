# StartTree

A minimal new tab page for Firefox. Displays bookmarks in a tree structure inspired by the `tree` command.

![StartTree Screenshot](/images/example.png)

## Features

- Tree-style link organization
- Tokyo Night theme with custom background support
- Settings page for configuring links and sections
- Focus stays on the address bar for quick searches
- Settings persist across sessions

## Installation

### From Firefox Add-ons
1. Visit the [Firefox Add-ons page](#)
2. Click "Add to Firefox"

### Manual / Development
1. Clone or download this repository
2. Open `about:debugging` in Firefox
3. Click "This Firefox" then "Load Temporary Add-on..."
4. Select `manifest.json`

## Configuration

1. Open `about:addons`
2. Find StartTree, click the menu
3. Select Preferences

You can add/remove trees, sections, and links. You can also set a custom background image by uploading a file or pasting a URL.

## Files

```
StartTree/
├── manifest.json
├── index.html
├── main.js
├── style.css
├── options.html
├── options.js
├── options.css
└── images/
```

## Credits

Based on [this start page](https://notabug.org/nytly/home) and the original [StartTree](https://github.com/Paul-Houser/StartTree) project.

## License

MIT
