# Better Code Blocks

Enhances the WordPress Code block with syntax highlighting, line numbers, and copy functionality.

> [!NOTE]
> This plugin is designed to be used with block themes that use the `theme-1`, `theme-2`, etc., naming convention for colors in `theme.json`. Examples include [Base](https://github.com/ndiego/base), [Kanso](https://github.com/richtabor/kanso), and the [Assembler](https://github.com/Automattic/themes/tree/trunk/assembler).

## Features

- Syntax highlighting powered by highlight.js
- Optional copy to clipboard button
- Optional title/header for code blocks
- Optional line numbers
- Unnecessary styling options and block supports are removed

## Requirements

- WordPress 6.7+
- PHP 7.4+

## Installation

1. Download the plugin.
2. Upload the `better-code-blocks` folder to your `/wp-content/plugins/` directory.
3. Activate the plugin through the 'Plugins' menu in WordPress.

## Usage

1. Create or edit a post/page in the WordPress block editor.
2. Add a Code block.
3. Select your programming language.
4. Configure additional options in the sidebar:
   - Toggle line numbers
   - Add a title
   - Enable/disable copy button

## Development

1. Clone this repository.
2. Run `npm install`.
3. Run `npm start` for development.
4. Run `npm run build` for production.

## Credits

- Built almost entirely with [Cursor](https://www.cursor.com/).
- Syntax highlighting by [highlight.js](https://highlightjs.org/) 
