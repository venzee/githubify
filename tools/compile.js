const glob         = require( 'glob' );
const fromCallback = require( 'object-streaming-tools/lib/fromCallback' ); 
const flatten      = require( 'object-streaming-tools/lib/flatten' ); 
const apply        = require( 'object-streaming-tools/lib/apply' );
const path         = require( 'path' );
const fs           = require( 'fs-extra' );
const format       = require( 'string-template' );
const template     = require( './template' );
const startCase    = require( 'lodash/startCase' );
const asyncify     = require( 'async/asyncify' );
const fsOptions    = { encoding: 'utf8' };
const md           = require( 'markdown-it' )( { html: true, linkify: true, typography: true } );

md.use( require( 'markdown-it-emoji' ) );
md.use( require( 'markdown-it-highlightjs' ) );
md.use( require( 'markdown-it-mermaid' ).default );

fromCallback( glob.bind( glob, 'src/**/*.md' ) )
  .pipe( flatten() )
  .pipe( apply( asyncify( prepareOutputNames ) ) )
  .pipe( apply( appendSourceFileText ) )
  .pipe( apply( renderHtml ) )
  .resume();


function prepareOutputNames( source ){

  const basename = path.basename( source, path.extname( source ) );

  return {
    source,
    target: path.join( 'dist', `${ basename }.html` ),
    title:  startCase( basename )
  };

}

function appendSourceFileText( fileContext, next ){
  
  fs.readFile( fileContext.source, fsOptions, ( err, text )=>{

    if( err ) return next( err );
    return next( null, Object.assign( {}, fileContext, { text } ) );

  } );

}

function renderHtml( { target, title, text }, next  ){

  const outputText = format( template, title, md.render( text ) );

  fromCallback( fs.mkdirp.bind( fs, path.dirname( target ) ) )
    .on( 'error', next )
    .pipe( apply( fs.writeFile.bind( fs, target, outputText, fsOptions ) ) )
    .on( 'error', next )
    .on( 'finish', next )
    .resume();

}
