const path    = require( 'path' );

function generateImageLinkText( target, { title, diagramTarget } ){

  const imagePath = path.posix.normalize(
    path.relative( path.dirname( target ), diagramTarget )
  ); 

  return `![alt ${ title || imagePath }](${ imagePath })`;

}

module.exports = generateImageLinkText;
