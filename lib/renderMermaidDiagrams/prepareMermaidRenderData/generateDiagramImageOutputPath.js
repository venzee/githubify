const path         = require( 'path' );
const { v4: uuid } = require( 'uuid' );
const kebabCase    = require( 'lodash/kebabCase' );
const lowerFirst   = require( 'lodash/lowerFirst' );
const head         = require( 'lodash/head' );
const tail         = require( 'lodash/tail' );


const MediaDirname            = 'media';
const OutputFileTypeExtension = '.svg';

function generateMermaidDiagramOutputPath( markdownTargetPath, { title } ){

  const fileBasename = title
    ? lowerFirst( kebabCase( title ) )
    : uuid().toLowerCase();

  const mediaFolderBasename = path.basename(
    markdownTargetPath,
    path.extname( markdownTargetPath )
  );

  const pathParts = path
    .dirname( markdownTargetPath )
    .split( path.sep );

  return path.join(
    head( pathParts ),
    MediaDirname,
    ...tail( pathParts ),
    mediaFolderBasename,
    `${ fileBasename }${ OutputFileTypeExtension }`
  );
  
}

module.exports                         = generateMermaidDiagramOutputPath;
module.exports.MediaDirname            = MediaDirname;
module.exports.OutputFileTypeExtension = OutputFileTypeExtension;

