const createInjectLinkAtPosition = require( './injectLinkAtPosition' ); 

function injectImageLinks( markdownText, renderDataByStartIndex ){

  const injectLinkAtPosition = createInjectLinkAtPosition( markdownText );
  const modifiedMarkdownText = renderDataByStartIndex.reduce( injectLinkAtPosition, '' );

  return `${ modifiedMarkdownText }${ markdownText.substr( injectLinkAtPosition.markdownTextPosition ) }`;


}

module.exports = injectImageLinks;

