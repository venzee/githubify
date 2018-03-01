const just     = require( 'object-streaming-tools/lib/just' ); 
const toArray  = require( 'object-streaming-tools/lib/toArray' ); 
const apply    = require( 'object-streaming-tools/lib/apply' ); 
const asyncify = require( 'async/asyncify' );
const fs       = require( 'fs-extra' );
const path     = require( 'path' );
const nrc      = require( 'node-run-cmd' );

const prepareMermaidRenderData = require( './prepareMermaidRenderData' );
const updateMarkdown           = require( './updateMarkdown' );

const TempDirPrefix = 'renderMermaidDiagrams'; 

function renderMermaidDiagrams( { target, text } , onRendered ){

  just( { target, text } )
    .on( 'error', onRendered )
    .pipe( apply( asyncify( prepareMermaidRenderData ) ) )
    .on( 'error', onRendered )
    .pipe( apply( createTempDir ) )
    .on( 'error', onRendered )
    .pipe( apply( renderDiagrams ) )
    .on( 'error', onRendered )
    .pipe( apply( deleteTempDir ) )
    .pipe( apply( asyncify( updateMarkdown( text ) ) ) )
    .on( 'error', onRendered )
    .on( 'data', onRendered.bind( null, null ) );

}

module.exports = renderMermaidDiagrams;

function createTempDir( renderData, next ){

  fs.mkdtemp( TempDirPrefix, ( err, tempDir )=>{

    if( err ) return next( err );
    next( null, { renderData, tempDir } );

  } );

}

function deleteTempDir( { renderData, tempDir }, next ){

  fs.remove( tempDir, err=>{

    if( err ) return next( err );
    next( null, renderData );

  } );

}

function renderDiagrams( { renderData, tempDir }, onDiagramsRendered ){

  just( ...renderData )
    .on( 'error', onDiagramsRendered )
    .pipe( apply( asyncify( appendTempTarget.bind( null, tempDir ) ) ) )
    .on( 'error', onDiagramsRendered )
    .pipe( apply( ensureOutputDirectoryExist( 'tempTarget' ) ) )
    .on( 'error', onDiagramsRendered )
    .pipe( apply( writeTempFile ) )
    .on( 'error', onDiagramsRendered )
    .pipe( apply( ensureOutputDirectoryExist( 'diagramTarget' ) ) )
    .on( 'error', onDiagramsRendered )
    .pipe( apply( renderDiagram ) )
    .on( 'error', onDiagramsRendered )
    .pipe( toArray() )
    .on( 'data', renderData=>onDiagramsRendered( null, { renderData, tempDir } ) )
    .on( 'error', onDiagramsRendered );

}

function appendTempTarget( tempDir, renderData ){

  return Object.assign(
    {},
    renderData,
    { tempTarget: path.join( tempDir, renderData.diagramTarget ) }
  );

}

function writeTempFile( renderData, onTempFileWritten ){
  
  fs.writeFile( renderData.tempTarget, renderData.text, err=>{

    if( err ) return onTempFileWritten( err );
    onTempFileWritten( null, renderData );

  } );

}

function ensureOutputDirectoryExist( key ){

  return function ensureOutputDirectoryExist( renderData, next ){

    fs.mkdirp( path.dirname( renderData[ key ] ), err=>{
      
      if( err ) return next( err );
      next( null, renderData ); 
    
    } );

  };

}

function renderDiagram( renderData, onDiagramRendered ){

  const errors  = [];
  const onError =  errors.push.bind( errors );

  function onDone( code ){

    if( code ) return onDiagramRendered( new Error( errors.join( '' ) ) );
    onDiagramRendered( null, renderData );

  }

  nrc.run(
    `./node_modules/.bin/mmdc -i ${ renderData.tempTarget } -o ${ renderData.diagramTarget }`,
    { onError, onDone }
  );

}
