(()=>{"use strict";const e=window.React,t=window.wp.components,l=window.wp.blockEditor,a=window.wp.hooks,o=window.wp.blocks,n=window.wp.i18n,r=[{label:(0,n.__)("Plain text","better-code-blocks"),value:"nohighlight"},{label:"CSS",value:"css"},{label:"HTML",value:"html"},{label:"JavaScript",value:"javascript"},{label:"JSON",value:"json"},{label:"Markdown",value:"markdown"},{label:"PHP",value:"php"},{label:"SCSS",value:"scss"},{label:"Shell/Bash",value:"shell"},{label:"SQL",value:"sql"},{label:"TypeScript",value:"typescript"},{label:"YAML",value:"yaml"}],c=a=>{const{attributes:c,setAttributes:s,onRemove:i,insertBlocksAfter:b,mergeBlocks:u}=a,{language:d,title:g,hasCopy:p,hasLineNumbers:_}=c,h=(0,l.useBlockProps)();return(0,e.createElement)(e.Fragment,null,(0,e.createElement)(l.InspectorControls,null,(0,e.createElement)(t.PanelBody,{title:(0,n.__)("Code Settings","better-code-blocks"),initialOpen:!0},(0,e.createElement)(t.SelectControl,{label:(0,n.__)("Language","better-code-blocks"),value:d,options:r,onChange:e=>s({language:e}),__nextHasNoMarginBottom:!0,__next40pxDefaultSize:!0}),(0,e.createElement)(t.TextControl,{label:(0,n.__)("Title","better-code-blocks"),value:g,onChange:e=>s({title:e}),__nextHasNoMarginBottom:!0,__next40pxDefaultSize:!0}),(0,e.createElement)(t.ToggleControl,{label:(0,n.__)("Show copy button","better-code-blocks"),checked:p,onChange:e=>s({hasCopy:e}),__nextHasNoMarginBottom:!0}),(0,e.createElement)(t.ToggleControl,{label:(0,n.__)("Show line numbers","better-code-blocks"),checked:_,onChange:e=>s({hasLineNumbers:e}),__nextHasNoMarginBottom:!0}))),(0,e.createElement)("pre",{...h},(0,e.createElement)(l.RichText,{tagName:"code",identifier:"content",value:c.content,onChange:e=>s({content:e}),onRemove:i,onMerge:u,placeholder:(0,n.__)("Write code…","better-code-blocks"),"aria-label":(0,n.__)("Code","better-code-blocks"),preserveWhiteSpace:!0,withoutInteractiveFormatting:!0,allowedFormats:[],__unstablePastePlainText:!0,__unstableOnSplitAtDoubleLineEnd:()=>b((0,o.createBlock)((0,o.getDefaultBlockName)()))})))};(0,a.addFilter)("blocks.registerBlockType","bcb/code-attributes",(e=>"core/code"!==e.name?e:{...e,attributes:{...e.attributes,language:{type:"string",default:"nohighlight"},title:{type:"string",default:""},hasCopy:{type:"boolean",default:!0},hasLineNumbers:{type:"boolean",default:!0}},edit:c}))})();