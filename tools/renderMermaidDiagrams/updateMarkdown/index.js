const mapRenderDataToFileRanges = require( './mapRenderDataToFileRanges' );
const injectImageLinks          = require( './injectImageLinks' );

function createUpdateMarkdown( text ){
  
  return function updateMarkdown( renderData ){

    const renderDataByRanges  = renderData
      .reduce( mapRenderDataToFileRanges, [] )
      .sort( ( lhs, rhs )=>lhs.startIndex - rhs.startIndex );

    return injectImageLinks( text, renderDataByRanges );

  };

}

module.exports = createUpdateMarkdown;
