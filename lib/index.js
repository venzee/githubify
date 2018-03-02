const glob         = require( 'glob' );
const fromCallback = require( 'object-streaming-tools/lib/fromCallback' ); 
const flatten      = require( 'object-streaming-tools/lib/flatten' ); 
const apply        = require( 'object-streaming-tools/lib/apply' );
const toArray      = require( 'object-streaming-tools/lib/toArray' );
const asyncify     = require( 'async/asyncify' );
const fs           = require( 'fs-extra' );
const path         = require( 'path' );

const fsOptions    = { encoding: 'utf8' };

const renderMermaidDiagrams = require( './renderMermaidDiagrams' );

/**
 * Transpiles all markdown-it compatible *.md files found inside the source
 * directory to markdown files that can be properly displayed on Github. 
 * 
 * Currently, special support ins only implemented for Mermaid diagram
 * rendering
 * 
 * @param {String} sourceDirectory 
 *  The directory to recursively search for *.md files
 * 
 * @param {String} targetDirectory 
 *  The directory in which to store the render results
 *
 * @param {function} onGitHubified
 *  NodeJs callback, reporting errors if errors occurred, returning nothing if
 *  operation succeeds.
 * 
 * @returns {void} 
 */
function githubify( sourceDirectory, targetDirectory, onGitHubified ){

  fromCallback( glob.bind( glob, `${ sourceDirectory }/**/*.md` ) )
    .on( 'error', onGitHubified )
    .pipe( flatten() )
    .on( 'error', onGitHubified )
    .pipe( apply( asyncify( source=>( { source, target: source.replace( sourceDirectory, targetDirectory ) } ) ) ) )
    .on( 'error', onGitHubified )
    .pipe( apply( appendSourceFileText ) )
    .on( 'error', onGitHubified )
    .pipe( apply( renderMermaidDiagrams ) )
    .on( 'error', onGitHubified )
    .pipe( apply( writeTargetFile ) )
    .on( 'error', onGitHubified )
    .pipe( toArray() )
    .on( 'error', onGitHubified )
    .on( 'data', outputPaths=>onGitHubified( null, outputPaths ) );

}

module.exports = githubify;

function appendSourceFileText( fileContext, next ){
  
  fs.readFile( fileContext.source, fsOptions, ( err, text )=>{

    if( err ) return next( err );
    return next( null, Object.assign( {}, fileContext, { text } ) );

  } );

}

function writeTargetFile( { target, text }, next ){

  fs.mkdirp( path.dirname( target ), err=>{

    if( err ) return next( err );
    fs.writeFile( target, text, err=>{

      if( err ) return next( err );
      next( null, target );

    } );

  } );

}

if( module === require.main ){

  const [ sourceDirectory, targetDirectory ] = require( 'yargs' ).argv._;

  githubify(
    sourceDirectory,
    targetDirectory,
    ( err, result )=>( err ? console.error( String( err ) ) : console.info( result ) ) // eslint-disable-line no-console
  );

}
