const findUniqueMermaidDiagramTextBlocks = require( './findUniqueMermaidDiagramTextBlocks' );
const generateDiagramImageOutputPath     = require( './generateDiagramImageOutputPath' );

function prepareMermaidRenderData( { target, text } ){

  return findUniqueMermaidDiagramTextBlocks( text )
    .map( dtb=>Object.assign( { rangesInFile: dtb.rangesInFile, diagramTarget: generateDiagramImageOutputPath( target, dtb ) }, dtb ) ) // eslint-disable-line max-len
    .map( dtb=>Object.assign( { imageLinkText: `![alt ${ dtb.title || dtb.diagramTarget }](${ dtb.diagramTarget })` }, dtb ) ); // eslint-disable-line max-len

}

module.exports = prepareMermaidRenderData;
