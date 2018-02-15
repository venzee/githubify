const isEqual = require( 'lodash/isEqual' );
const partial = require( 'lodash/partial' );


const TitlePattern = '#+ +([^\n]+)\n\n';
const TitleIndex   = 2;

const MermaidPattern = '```mermaid\n([^`]*)```';
const MermaidIndex   = 4;

const SearchPattern = `(${  TitlePattern })?(${ MermaidPattern })`;


function findUniqueMermaidDiagramTextBlocks( markdownText ){
  
  const matchMermaidBlock = new RegExp( SearchPattern, 'gm' ); 
  const matches           = [];

  let match = matchMermaidBlock.exec( markdownText );

  while( match ){
  
    updateMatches( matches, createEntryFor( match ) );
    match = matchMermaidBlock.exec( markdownText );

  }

  return matches;

}

module.exports = findUniqueMermaidDiagramTextBlocks;


function createEntryFor( match ){

  const title = match[ TitleIndex ];
  const text  = match[ MermaidIndex ];

  const newEntry = Object.assign(
    {},
    title == null ? {} : { title },
    { text }
  );

  return Object.defineProperties( newEntry, {
    rangesInFile: { value: [ { startIndex: match.index, length: match[0].length } ] },
  } );
    
}

function updateMatches( matches, newEntry ){

  const existingEntry = matches.find( partial( isEqual, newEntry ) );

  if( existingEntry == null ) return matches.push( newEntry );
  existingEntry.rangesInFile.push( ...newEntry.rangesInFile );

}
