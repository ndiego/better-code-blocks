import { SelectControl, TextControl, ToggleControl, PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
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
    { label: 'YAML', value: 'yaml' }
];

// Add custom attributes to core/code block
addFilter(
    'blocks.registerBlockType',
    'bcb/code-attributes',
    ( settings, name ) => {
        if ( name !== 'core/code' ) {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                language: {
                    type: 'string',
                    default: 'nohighlight'
                },
                title: {
                    type: 'string',
                    default: ''
                },
                hasCopy: {
                    type: 'boolean',
                    default: true
                },
                hasLineNumbers: {
                    type: 'boolean',
                    default: true
                }
            }
        };
    }
);

// Add controls to block settings sidebar
const addInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        if ( props.name !== 'core/code' ) {
            return <BlockEdit { ...props } />;
        }

        const { attributes, setAttributes } = props;
        const { language, title, hasCopy, hasLineNumbers } = attributes;

        return (
            <>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody
                        title={ __( 'Code Settings', 'better-code-blocks' ) }
                        initialOpen={ true }
                    >
                        <SelectControl
                            label={ __( 'Language', 'better-code-blocks' ) }
                            value={ language }
                            options={ languages }
                            onChange={ ( language ) => setAttributes( { language } ) }
                            __nextHasNoMarginBottom
                            __next40pxDefaultSize
                        />
                        <TextControl
                            label={ __( 'Title', 'better-code-blocks' ) }
                            value={ title }
                            onChange={ ( title ) => setAttributes( { title } ) }
                            __nextHasNoMarginBottom
                            __next40pxDefaultSize
                        />
                        <ToggleControl
                            label={ __( 'Show copy button', 'better-code-blocks' ) }
                            checked={ hasCopy }
                            onChange={ ( hasCopy ) => setAttributes( { hasCopy } ) }
                            __nextHasNoMarginBottom
                        />
                        <ToggleControl
                            label={ __( 'Show line numbers', 'better-code-blocks' ) }
                            checked={ hasLineNumbers }
                            onChange={ ( hasLineNumbers ) => setAttributes( { hasLineNumbers } ) }
                            __nextHasNoMarginBottom
                        />
                    </PanelBody>
                </InspectorControls>
            </>
        );
    };
}, 'addInspectorControls' );

addFilter(
    'editor.BlockEdit',
    'bcb/add-inspector-controls',
    addInspectorControls
); 