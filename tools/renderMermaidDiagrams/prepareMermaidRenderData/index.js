const findUniqueMermaidDiagramTextBlocks = require( './findUniqueMermaidDiagramTextBlocks' );
const generateDiagramImageOutputPath     = require( './generateDiagramImageOutputPath' );
const mapRenderDataToFileRanges          = require( './mapRenderDataToFileRanges' );
const injectImageLinks                   = require( './injectImageLinks' );

function prepareMermaidRenderData( { target, text } ){

  const renderData =  findUniqueMermaidDiagramTextBlocks( text )
    .map( dtb=>Object.assign( { rangesInFile: dtb.rangesInFile, diagramTarget: generateDiagramImageOutputPath( target, dtb ) }, dtb ) ) // eslint-disable-line max-len
    .map( dtb=>Object.assign( { imageLinkText: `![alt ${ dtb.title || dtb.diagramTarget }](${ dtb.diagramTarget })` }, dtb ) ); // eslint-disable-line max-len
  
  const renderDataByRanges  = renderData
    .reduce( mapRenderDataToFileRanges, [] )
    .sort( ( lhs, rhs )=>lhs.startIndex - rhs.startIndex );

  const markdownOutputText = injectImageLinks( text, renderDataByRanges );

  return { renderData, markdownOutputText };

}

module.exports = prepareMermaidRenderData;
