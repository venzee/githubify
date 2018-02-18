function mapRenderDataToFileRanges( renderDataByFileRanges, renderData ){

  const instanceRenderDataByFileRanges = renderData.rangesInFile
    .map( range=>Object.assign( { output: renderData }, range ) );

  return [ ...renderDataByFileRanges, ...instanceRenderDataByFileRanges ];

}

module.exports = mapRenderDataToFileRanges;
