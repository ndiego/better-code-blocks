<?php
/**
 * Plugin Name:       Better Code Blocks
 * Plugin URI:        https://github.com/ndiego/better-code-blocks
 * Description:       Enhanced code block functionality for WordPress.
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            Nick Diego
 * Author URI:        https://nickdiego.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       better-code-blocks
 *
 * @package           better-code-blocks
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueues the block editor assets.
 *
 * @since 0.1.0
 *
 * @return void
 */
function bcb_enqueue_editor_assets() {
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/editor.asset.php';

	wp_enqueue_script(
		'better-code-blocks-editor',
		plugins_url( 'build/editor.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);
}
add_action( 'enqueue_block_editor_assets', 'bcb_enqueue_editor_assets' );

/**
 * Registers the frontend assets.
 *
 * @since 0.1.0
 *
 * @return void
 */
function bcb_register_frontend_assets() {
	// Get the asset file
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_register_script(
		'bcb-frontend-scripts',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	wp_register_style(
		'bcb-frontend-styles',
		plugins_url( 'build/index.css', __FILE__ ),
		array(),
		filemtime( plugin_dir_path( __FILE__ ) . 'build/index.css' )
	);
}
add_action( 'wp_enqueue_scripts', 'bcb_register_frontend_assets', 100 );

/**
 * Modifies the core code block output and enqueues assets when needed.
 *
 * @since 0.1.0
 *
 * @param string $block_content The block content.
 * @param array  $block         The block data.
 * @return string               Modified block content.
 */
function bcb_render_block( $block_content, $block ) {
	if ( 'core/code' !== $block['blockName'] ) {
		return $block_content;
	}

	// Enqueue assets only when a code block is rendered
	wp_enqueue_script( 'bcb-frontend-scripts' );
	wp_enqueue_style( 'bcb-frontend-styles' );

	$language         = isset( $block['attrs']['language'] ) ? $block['attrs']['language'] : 'nohighlight';
	$title            = isset( $block['attrs']['title'] ) ? $block['attrs']['title'] : '';
	$has_copy         = isset( $block['attrs']['hasCopy'] ) ? $block['attrs']['hasCopy'] : true;
	$has_line_numbers = isset( $block['attrs']['hasLineNumbers'] ) ? $block['attrs']['hasLineNumbers'] : true;
	$has_max_height   = isset( $block['attrs']['hasMaxHeight'] ) ? $block['attrs']['hasMaxHeight'] : false;
	$max_height       = isset( $block['attrs']['maxHeight'] ) ? $block['attrs']['maxHeight'] : 400;
	
	// Create new tag processor instance
	$tags = new WP_HTML_Tag_Processor( $block_content );
	
	// Get existing classes from pre tag and add them to a wrapper
	if ( $tags->next_tag( 'pre' ) ) {
		$existing_classes = $tags->get_attribute( 'class' );
		$existing_styles  = $tags->get_attribute( 'style' );
		
		// Extract font size class if it exists
		$font_size_class = '';
		if ( $existing_classes ) {
			$classes = explode( ' ', $existing_classes );
			foreach ( $classes as $key => $class ) {
				if ( false !== strpos( $class, '-font-size' ) ) {
					$font_size_class = $class;
					// Remove the font size class from existing classes
					unset( $classes[ $key ] );
				}
			}
			$existing_classes = implode( ' ', $classes );
		}

		// Extract font-size style if it exists.
		$font_size_style = '';
		if ( $existing_styles ) {
			if ( preg_match( '/font-size:\s*([^;]+);?/', $existing_styles, $matches ) ) {
				$font_size_style = 'font-size: ' . $matches[1] . ';';
				// Remove the font-size style from existing styles.
				$existing_styles = preg_replace( '/font-size:\s*[^;]+;?/', '', $existing_styles );
			}
		}
		
		// Remove existing classes/styles and add only the ones we want.
		$tags->remove_attribute( 'class' );
		$tags->remove_attribute( 'style' );
		$tags->add_class( 'hljs' );
		$tags->add_class( 'syntax-highlighter' );
		if ( $font_size_class ) {
			$tags->add_class( $font_size_class );
		}
		if ( $font_size_style ) {
			$tags->set_attribute( 'style', $font_size_style );
		}
		
		// Get the updated pre tag content.
		$updated_content = $tags->get_updated_html();

		// Create copy button markup.
		$copy_button = '';
		if ( $has_copy ) {
			$copy_button = sprintf(
				'<button type="button" class="wp-code-block-copy-button" aria-label="%1$s" title="%2$s">
					<span class="wp-code-block-copy-icon">
						<svg stroke-linejoin="round" style="color:currentColor" viewBox="0 0 16 16" aria-hidden="true">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z" fill="currentColor"></path>
						</svg>
					</span>
					<span class="wp-code-block-check-icon">
						<svg stroke-linejoin="round" style="color:currentColor" viewBox="0 0 16 16" aria-hidden="true">
							<path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" fill="currentColor"/>
						</svg>
					</span>
					<span class="screen-reader-text">%2$s</span>
				</button>',
				esc_attr__( 'Copy code to clipboard', 'better-code-blocks' ),
				esc_html__( 'Copy', 'better-code-blocks' )
			);
		}

		// Create expand button markup if max height is set
		$expand_button = '';
		if ( $has_max_height ) {
			$expand_button = sprintf(
				'<button type="button" class="wp-code-block-expand-button" aria-label="%1$s" title="%2$s">
					<span class="wp-code-block-expand-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
					</span>
					<span class="wp-code-block-collapse-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
					</span>
					<span class="screen-reader-text">%2$s</span>
				</button>',
				esc_attr__( 'Toggle code block height', 'better-code-blocks' ),
				esc_html__( 'Expand', 'better-code-blocks' )
			);
		}

		// Build the block structure.
		if ( ! empty( $title ) ) {
			// If there's a title, put the copy button in the header.
			$header = sprintf(
				'<div class="wp-code-block-header">
					<div class="wp-code-block-title">%1$s</div>
					%2$s
				</div>',
				esc_html( $title ),
				$copy_button
			);
		} else {
			$header = '';
		}

		// If there's no title and copy is enabled, wrap copy button in float div.
		$copy_float = ( empty( $title ) && $has_copy ) 
			? sprintf( '<div class="wp-code-block-copy-float">%s</div>', $copy_button )
			: '';

		// Add expand button after body if max height is set
		$expand_float = $has_max_height 
			? sprintf( '<div class="wp-code-block-expand-float">%s</div>', $expand_button )
			: '';

		$body = sprintf(
			'<div class="wp-code-block-body" %7$s>
				<pre class="%2$s"%3$s>
					%4$s
					<code class="language-%5$s">%6$s</code>
				</pre>
			</div>',
			$copy_float,
			esc_attr( 'hljs syntax-highlighter' . ( $font_size_class ? ' ' . $font_size_class : '' ) ),
			$font_size_style ? ' style="' . esc_attr( $font_size_style ) . '"' : '',
			$has_line_numbers ? '<div class="wp-code-block-lines"></div>' : '',
			esc_attr( $language ),
			$updated_content,
			$has_max_height ? sprintf( 'style="max-height: %dpx; overflow-y: auto;"', intval( $max_height ) ) : ''
		);

		// Combine all parts.
		$block_content = sprintf(
			'<div class="%1$s" style="%2$s">%3$s%4$s%5$s%6$s</div>',
			esc_attr( $existing_classes ),
			esc_attr( $existing_styles ),
			$header,
			$copy_float,
			$body,
			$expand_float
		);
	}

	// Create new processor for the code tag.
	$tags = new WP_HTML_Tag_Processor( $block_content );

	// Add language class to code tag.
	if ( $tags->next_tag( 'code' ) ) {
		$tags->add_class( 'language-' . esc_attr( $language ) );
	}
	
	return $tags->get_updated_html();
}
add_filter( 'render_block', 'bcb_render_block', 10, 2 );

/**
 * Remove supports from code blocks.
 *
 * @since 0.1.0
 *
 * @param array  $args       The block arguments for the registered block type.
 * @param string $block_type The block type name, including namespace.
 * @return array             The modified block arguments.
 */
function bcb_modify_core_code_block( $args, $block_type ) {
	if ( 'core/code' === $block_type ) {
		$args['supports'] = isset( $args['supports'] ) ? $args['supports'] : array();

		// Remove color support.
		$args['supports']['color'] = false;
		$args['supports']['color']['text'] = false;
		$args['supports']['color']['background'] = false;

		// Remove border support.
		$args['supports']['__experimentalBorder'] = false;

		// Remove spacing support.
		$args['supports']['spacing']['padding'] = false;

		// Remove typography support.
		$args['supports']['typography']['lineHeight'] = false;
		$args['supports']['typography']['__experimentalFontFamily'] = false;
		$args['supports']['typography']['__experimentalFontWeight'] = false;
		$args['supports']['typography']['__experimentalFontStyle'] = false;
		$args['supports']['typography']['__experimentalTextTransform'] = false;
		$args['supports']['typography']['__experimentalTextDecoration'] = false;
        $args['supports']['typography']['__experimentalLetterSpacing'] = false;
        $args['supports']['typography']['__experimentalDefaultControls']['fontSize'] = false;
		$args['supports']['typography']['defaultControls']['fontSize'] = false;
	}

	return $args;
}
add_filter( 'register_block_type_args', 'bcb_modify_core_code_block', 10, 2 );

/**
 * This function modifies the block editor settings to disable inspector tabs
 * for the 'core/code' block.
 *
 * @since 0.1.0
 *
 * @param array $settings The current block editor settings.
 * @return array          The modified block editor settings.
 */
function bcb_disable_inspector_tabs( $settings ) {
	if ( ! isset( $settings['blockInspectorTabs'] ) ) {
		$settings['blockInspectorTabs'] = array();
	}

	$settings['blockInspectorTabs'] = array_merge(
		$settings['blockInspectorTabs'],
		array( 
			'default'   => true,
			'core/code' => false,
		),
	);

	return $settings;
}
add_filter( 'block_editor_settings_all', 'bcb_disable_inspector_tabs' );