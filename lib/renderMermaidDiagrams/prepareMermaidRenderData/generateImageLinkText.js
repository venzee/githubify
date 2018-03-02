const path    = require( 'path' );
const isEmpty = require( 'lodash/isEmpty' );
const negate  = require( 'lodash/negate' );
const tail    = require( 'lodash/tail' );

function generateImageLinkText( { title, diagramTarget } ){

  const imagePath = path.posix.join(
    ...tail( diagramTarget.split( path.sep ).filter( negate( isEmpty ) ) )
  ); 

  return `![alt ${ title || imagePath }](${ imagePath })`;

}

module.exports = generateImageLinkText;
