const path         = require( 'path' );
const { v4: uuid } = require( 'uuid' );
const kebabCase    = require( 'lodash/kebabCase' );
const lowerFirst   = require( 'lodash/lowerFirst' );

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

  return path.join(
    path.dirname( markdownTargetPath ),
    mediaFolderBasename,
    MediaDirname,
    `${ fileBasename }${ OutputFileTypeExtension }`
  );
  
}

module.exports                         = generateMermaidDiagramOutputPath;
module.exports.MediaDirname            = MediaDirname;
module.exports.OutputFileTypeExtension = OutputFileTypeExtension;
