import createInjectLinkAtPosition from '<tools>/renderMermaidDiagrams/updateMarkdown/injectImageLinks/injectLinkAtPosition'; // eslint-disable-line max-len

describe( 'The <tools>/renderMermaidDiagrams/updateMarkdown/injectImageLinks function', ()=>{

  const imageLinkText = '![alt Title1](where/to/copy/rendered/markdown/file/media/title-1.svg)';
  const textToReplace = '1234567890';
  
  it( 'should inject imageLinkText at the beginning, if the startIndex is 0', ()=>{

    const diagramInfo = { startIndex: 0, length: textToReplace.length, output: { imageLinkText } };
    const input       = `${ textToReplace } some other text`;

    expect( createInjectLinkAtPosition( input )( '', diagramInfo ) )
      .to.equal( imageLinkText );

  } );

  it( 'should allow access to next index to read from the input markdown text', ()=>{

    const diagramInfo          = { startIndex: 0, length: textToReplace.length, output: { imageLinkText } };
    const input                = `${ textToReplace } some other text`;
    const injectLinkAtPosition = createInjectLinkAtPosition( input );

    expect( injectLinkAtPosition.markdownTextPosition )
      .to.equal( 0 );
    
    injectLinkAtPosition( '', diagramInfo );

    expect( injectLinkAtPosition.markdownTextPosition )
      .to.equal( textToReplace.length );

  } );

  it( 'should prepend input text before the imageLinkText if the startIndex is > 0', ()=>{

    const prefix      = 'some text before \n\n';
    const diagramInfo = { startIndex: prefix.length, length: textToReplace.length, output: { imageLinkText } };
    const input       = `${ prefix }${ textToReplace } text`;
    const expected    = `${ prefix }${ imageLinkText }`;

    expect( createInjectLinkAtPosition( input )( '', diagramInfo ) )
      .to.equal( expected );

  } );

  it( 'should replace multiple entries', ()=>{

    const prefix       = '123456789 ';
    const diagramInfos = [
      { startIndex: 0, length: textToReplace.length, output: { imageLinkText } },
      { startIndex: prefix.length + textToReplace.length, length: textToReplace.length, output: { imageLinkText } },
      { startIndex: ( prefix.length  + textToReplace.length ) * 2, length: textToReplace.length, output: { imageLinkText } } // eslint-disable-line max-len

    ];

    const input    = `${ textToReplace }${ prefix }${ textToReplace }${ prefix }${ textToReplace }`;
    const expected = `${ imageLinkText }${ prefix }${ imageLinkText }${ prefix }${ imageLinkText }`;

    const actual = diagramInfos.reduce( createInjectLinkAtPosition( input ), '' );

    expect( actual )
      .to.equal( expected );

  } );


} );
