import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import yaml from 'highlight.js/lib/languages/yaml';
import './index.scss';

// Register the languages we want to support
hljs.registerLanguage( 'css', css );
hljs.registerLanguage( 'html', html );
hljs.registerLanguage( 'javascript', javascript );
hljs.registerLanguage( 'json', json );
hljs.registerLanguage( 'markdown', markdown );
hljs.registerLanguage( 'php', php );
hljs.registerLanguage( 'scss', scss );
hljs.registerLanguage( 'shell', shell );
hljs.registerLanguage( 'bash', bash );
hljs.registerLanguage( 'sql', sql );
hljs.registerLanguage( 'typescript', typescript );
hljs.registerLanguage( 'yaml', yaml );

/**
 * Clean code content by removing extra whitespace
 * @param {string} content The code content to clean
 * @return {string} The cleaned code content
 */
function cleanCodeContent( content ) {
	const lines = content.split( '\n' );

	// Remove empty lines at start and end
	while ( lines.length > 0 && lines[ 0 ].trim() === '' ) lines.shift();
	while ( lines.length > 0 && lines[ lines.length - 1 ].trim() === '' )
		lines.pop();

	// Find minimum indentation
	const minIndent = lines
		.filter( ( line ) => line.trim().length > 0 )
		.reduce( ( min, line ) => {
			const indent = line.match( /^\s*/ )[ 0 ].length;
			return Math.min( min, indent );
		}, Infinity );

	// Remove common indentation from all lines
	return lines.map( ( line ) => line.slice( minIndent ) ).join( '\n' );
}

/**
 * Initialize copy buttons
 */
function initializeCopyButtons() {
	const copyButtons = document.querySelectorAll(
		'.wp-code-block-copy-button'
	);

	copyButtons.forEach( ( button ) => {
		button.addEventListener( 'click', async () => {
			const codeBlock = button.closest( '.wp-block-code' );
			const codeElement = codeBlock.querySelector( 'code' );

			try {
				await navigator.clipboard.writeText( codeElement.textContent ); // eslint-disable-line no-undef
				button.setAttribute( 'data-copied', 'true' );

				// Reset after animation completes (1.4s = 1.25s + 0.15s)
				setTimeout( () => {
					button.removeAttribute( 'data-copied' );
				}, 1400 );
			} catch ( err ) {
				console.error( 'Failed to copy text: ', err ); // eslint-disable-line no-console
			}
		} );
	} );
}

/**
 * Initialize syntax highlighting
 */
function initializeHighlighting() {
	const codeBlocks = document.querySelectorAll( 'pre.hljs code' );
	if ( codeBlocks.length > 0 ) {
		codeBlocks.forEach( ( block ) => {
			// Only clean and highlight if not already processed
			if ( ! block.classList.contains( 'hljs-highlighted' ) ) {
				block.textContent = cleanCodeContent( block.textContent );
				hljs.highlightElement( block );
				block.classList.add( 'hljs-highlighted' );
			}
		} );
	}
}

/**
 * Initialize line numbers
 */
function initializeLineNumbers() {
	const codeBlocks = document.querySelectorAll( '.wp-block-code pre' );

	codeBlocks.forEach( ( pre ) => {
		const linesDiv = pre.querySelector( '.wp-code-block-lines' );
		const codeElement = pre.querySelector( 'code' );

		// Make sure we have both required elements
		if ( ! linesDiv || ! codeElement ) {
			return;
		}

		// Clean the code content if not already processed
		if ( ! codeElement.classList.contains( 'hljs-highlighted' ) ) {
			codeElement.textContent = cleanCodeContent(
				codeElement.textContent
			);
			hljs.highlightElement( codeElement );
			codeElement.classList.add( 'hljs-highlighted' );
		}

		// Add line numbers based on cleaned content
		const lineCount = codeElement.textContent.split( '\n' ).length;
		const spans = Array( lineCount )
			.fill( '' )
			.map( ( _, i ) => `<span>${ i + 1 }</span>` )
			.join( '' );

		linesDiv.innerHTML = spans;
	} );
}

// Initialize everything when the DOM is ready
document.addEventListener( 'DOMContentLoaded', () => {
	initializeLineNumbers(); // Do this first to clean whitespace
	initializeHighlighting(); // Then do general highlighting for any missed blocks
	initializeCopyButtons();
} );

document.addEventListener( 'click', ( event ) => {
	const button = event.target.closest( '.wp-code-block-expand-button' );
	if ( ! button ) {
		return;
	}

	const block = button.closest( '.wp-block-code' );
	if ( ! block ) {
		return;
	}

	block.classList.toggle( 'has-max-height-100' );
	
	// Update aria-label based on state
	const isExpanded = block.classList.contains( 'has-max-height-100' );
	const newLabel = isExpanded ? 'Collapse code block' : 'Expand code block';
	button.setAttribute( 
		'aria-label', 
		newLabel
	);
	button.setAttribute('title', newLabel);
} );
