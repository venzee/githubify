const findUniqueMermaidDiagramTextBlocks = require( './findUniqueMermaidDiagramTextBlocks' );
const generateDiagramImageOutputPath     = require( './generateDiagramImageOutputPath' );
const generateImageLinkText              = require( './generateImageLinkText' );

function prepareMermaidRenderData( { target, text } ){

  return findUniqueMermaidDiagramTextBlocks( text )
    .map( dtb=>Object.assign( { rangesInFile: dtb.rangesInFile, diagramTarget: generateDiagramImageOutputPath( target, dtb ) }, dtb ) ) // eslint-disable-line max-len
    .map( dtb=>Object.assign( { imageLinkText: generateImageLinkText( dtb ) }, dtb ) );

}

module.exports = prepareMermaidRenderData;


