const last = require( 'lodash/last' );

const TitlePattern = '#+ +([^\n]+)\n\n';
const TitleIndex   = 2;

const MermaidPattern = '```mermaid\n([^`]*)```';
const MermaidIndex   = 4;

const SearchPattern = `(${ TitlePattern })?(${ MermaidPattern })`;


function findUniqueMermaidDiagramTextBlocks( markdownText ){
  
  const matchMermaidBlock = new RegExp( SearchPattern, 'gm' ); 
  const matches           = [];

  let match = matchMermaidBlock.exec( markdownText );

  while( match ){
  
    const newEntry = createEntryFor( match );
    
    const updateMatches = newEntry.title == null
      ? updateNoTitleMatches
      : updateTitleMatches;

    updateMatches( matches, newEntry );

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

function updateTitleMatches( matches, newEntry ){

  const existingEntries = matches
    .filter( ( { title } )=>title == null || title.startsWith( newEntry.title ) );

  if( existingEntries.length === 0 ) return matches.push( newEntry );
 
  const textMatch = existingEntries.find( e=>e.text === newEntry.text );
  if( textMatch != null ) return updateExistingTitleEntry( matches, textMatch, newEntry ); 
  
  const title = generateModifiedTitle( textMatch, newEntry.title );
  matches.push( Object.assign( {}, newEntry, { title }  ) ); // eslint-disable-line

}

function updateNoTitleMatches( matches, newEntry ){

  const textMatch = matches
    .find( ( { text } )=>text === newEntry.text );

  if( textMatch == null ) return matches.push( newEntry );
  textMatch.rangesInFile.push( ...newEntry.rangesInFile );
 
}

function updateExistingTitleEntry( matches, textMatch, newEntry ){

  textMatch.title = textMatch.title == null 
    ? newEntry.title
    : textMatch.title;

  if( textMatch.title == newEntry.title ) return textMatch.rangesInFile.push( ...newEntry.rangesInFile );
  matches.push( newEntry );

} 

function generateModifiedTitle( textMatch, title ){

  const lastNumber    = last( /_(\d+)$/g.exec( last( textMatch ) ) );
  const titleModifier = lastNumber == null
    ? 2
    : parseInt( lastNumber );

  return `${ title }_${ titleModifier }`;

}
