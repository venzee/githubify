function createInjectImageLinks( markdownText ){

  let currentPositionInMarkdownText = 0;

  function injectImageLinks( modifiedMarkdownText, diagramInfo ){

    const { startIndex } = diagramInfo;

    const { length }         = diagramInfo;
    const endIndex           = startIndex + length;
    const markdownTextToKeep = markdownText.substring( currentPositionInMarkdownText, startIndex );

    modifiedMarkdownText += `${ markdownTextToKeep }${ diagramInfo.output.imageLinkText }`;

    currentPositionInMarkdownText = endIndex;

    return modifiedMarkdownText;
   
  }

  return Object.defineProperties( injectImageLinks, {
    markdownTextPosition: { get: ()=>currentPositionInMarkdownText } 
  } );

}

module.exports = createInjectImageLinks;

