import {
	SelectControl,
	TextControl,
	ToggleControl,
	PanelBody,
} from '@wordpress/components';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

// Define available languages
const languages = [
	{ label: __( 'Plain text', 'better-code-blocks' ), value: 'nohighlight' },
	{ label: 'CSS', value: 'css' },
	{ label: 'HTML', value: 'html' },
	{ label: 'JavaScript', value: 'javascript' },
	{ label: 'JSON', value: 'json' },
	{ label: 'Markdown', value: 'markdown' },
	{ label: 'PHP', value: 'php' },
	{ label: 'SCSS', value: 'scss' },
	{ label: 'Shell/Bash', value: 'shell' },
	{ label: 'SQL', value: 'sql' },
	{ label: 'TypeScript', value: 'typescript' },
	{ label: 'YAML', value: 'yaml' },
];

const Edit = ( props ) => {
	const {
		attributes,
		setAttributes,
		onRemove,
		insertBlocksAfter,
		mergeBlocks,
	} = props;
	const { language, title, hasCopy, hasLineNumbers, hasMaxHeight, maxHeight } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'better-code-blocks' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Language', 'better-code-blocks' ) }
						value={ language }
						options={ languages }
						onChange={ ( value ) =>
							setAttributes( { language: value } )
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label={ __( 'Title', 'better-code-blocks' ) }
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl
						label={ __( 'Show copy button', 'better-code-blocks' ) }
						checked={ hasCopy }
						onChange={ ( value ) =>
							setAttributes( { hasCopy: value } )
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __(
							'Show line numbers',
							'better-code-blocks'
						) }
						checked={ hasLineNumbers }
						onChange={ ( value ) =>
							setAttributes( { hasLineNumbers: value } )
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Limit height', 'better-code-blocks' ) }
						checked={ hasMaxHeight }
						onChange={ ( value ) => setAttributes( { hasMaxHeight: value } ) }
						__nextHasNoMarginBottom
					/>
					{ hasMaxHeight && (
						<TextControl
							type="number"
							label={ __( 'Maximum height (px)', 'better-code-blocks' ) }
							value={ maxHeight }
							onChange={ ( value ) => setAttributes( { maxHeight: parseInt( value, 10 ) } ) }
							min={ 100 }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<pre { ...blockProps }>
				<RichText
					tagName="code"
					identifier="content"
					value={ attributes.content }
					onChange={ ( content ) => setAttributes( { content } ) }
					onRemove={ onRemove }
					onMerge={ mergeBlocks }
					placeholder={ __( 'Write code…', 'better-code-blocks' ) }
					aria-label={ __( 'Code', 'better-code-blocks' ) }
					preserveWhiteSpace
					withoutInteractiveFormatting
					allowedFormats={ [] }
					__unstablePastePlainText
					__unstableOnSplitAtDoubleLineEnd={ () =>
						insertBlocksAfter(
							createBlock( getDefaultBlockName() )
						)
					}
				/>
			</pre>
		</>
	);
};

// Add custom attributes to core/code block
addFilter( 'blocks.registerBlockType', 'bcb/code-attributes', ( settings ) => {
	if ( settings.name !== 'core/code' ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			language: {
				type: 'string',
				default: 'nohighlight',
			},
			title: {
				type: 'string',
				default: '',
			},
			hasCopy: {
				type: 'boolean',
				default: true,
			},
			hasLineNumbers: {
				type: 'boolean',
				default: true,
			},
			hasMaxHeight: {
				type: 'boolean',
				default: false,
			},
			maxHeight: {
				type: 'number',
				default: 400,
			},
		},
		edit: Edit,
	};
} );
