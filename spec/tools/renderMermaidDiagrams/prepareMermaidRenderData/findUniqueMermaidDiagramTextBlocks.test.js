import findUniqueMermaidDiagramTextBlocks from '<tools>/renderMermaidDiagrams/prepareMermaidRenderData/findUniqueMermaidDiagramTextBlocks'; // eslint-disable-line max-len

describe( 'The <tools>/renderMermaidDiagrams/prepareMermaidRenderData/findUniqueMermaidDiagramTextBlocks function', ()=>{ // eslint-disable-line max-len

  const MermaidDiagram = `
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
`;

  const AnotherMermaidDiagram = `
graph TD;
  A-->B;
  A-->C;
`;

  const MermaidDiagramBlock        = `\`\`\`mermaid${ MermaidDiagram }\`\`\``;
  const AnotherMermaidDiagramBlock = `\`\`\`mermaid${ AnotherMermaidDiagram }\`\`\``;

  it( 'should return an empty array if the provided string contains no Mermaid text blocks ', ()=>{

    expect( findUniqueMermaidDiagramTextBlocks( '' ) )
      .to.deep.equal( [] );

  } );


  it( 'should find 1 Mermaid JS diagram text blocks , if 1 is defined', ()=>{

    expect( findUniqueMermaidDiagramTextBlocks(  MermaidDiagramBlock ) )
      .to.have.lengthOf( 1 );
  
  } );

  it( 'should find multiple Mermaid JS diagram text blocks , if multiple are defined', ()=>{

    expect( findUniqueMermaidDiagramTextBlocks( `${ MermaidDiagramBlock }${ AnotherMermaidDiagramBlock }` ) )
      .to.have.lengthOf( 2 );
  
  } );

  it( 'should return only unique Mermaid JS', ()=>{

    expect( findUniqueMermaidDiagramTextBlocks( `${ MermaidDiagramBlock }${ MermaidDiagramBlock }` ) )
      .to.have.lengthOf( 1 );
  
  } );

  it( 'should return the text of unique Mermaid diagram text blocks found', ()=>{

    const expected = [
      { text: MermaidDiagram.substr( 1 )  },
      { text: AnotherMermaidDiagram.substr( 1 ) }
    ];

    const markdownText = `${
      MermaidDiagramBlock }${
      MermaidDiagramBlock }${
      AnotherMermaidDiagramBlock
    }`;

    expect( findUniqueMermaidDiagramTextBlocks( markdownText ) )
      .to.deep.equal( expected );
  
  } );

  it( 'should assign a title if the diagram is flagged with a header', ()=>{

    const title = 'Some Title';

    const expected = [
      { title,  text: MermaidDiagram.substr( 1 ) },
    ];

    const markdownText = `# ${ title }\n\n${ MermaidDiagramBlock }`;

    expect( findUniqueMermaidDiagramTextBlocks( markdownText ) )
      .to.deep.equal( expected );
  
  } );

  it( 'should create two entries with identical text, if the diagram blocks have different titles', ()=>{

    const title        = 'Some Title';
    const anotherTitle = 'Another Title';
    const text         =  MermaidDiagram.substr( 1 );

    const expected = [ { title, text }, { title: anotherTitle, text } ];

    const markdownText = `# ${
      title }\n\n${ MermaidDiagramBlock }\n\n# ${
      anotherTitle }\n\n${ MermaidDiagramBlock }`;

    expect( findUniqueMermaidDiagramTextBlocks( markdownText ) )
      .to.deep.equal( expected );
  
  } );
  

  it( 'should add the startIndex and length of text of each diagram text block found', ()=>{


    const prefix = '# Some Markup\n\nText not related to the diagrams\n\n';

    const markdownText = `${
      prefix }${
      MermaidDiagramBlock }${
      MermaidDiagramBlock }${
      AnotherMermaidDiagramBlock
    }`;

    const startIndexBlock1 = prefix.length;
    const startIndexBlock2 = startIndexBlock1 + MermaidDiagramBlock.length;
    const startIndexBlock3 = startIndexBlock2 + MermaidDiagramBlock.length;
    
    const [
      MermaidDiagramBlockResult,
      AnotherMermaidDiagramBlockResults
    ] = findUniqueMermaidDiagramTextBlocks( markdownText );

    const expectedForMermaidDiagramBlockResult = [
      { startIndex: startIndexBlock1, length: MermaidDiagramBlock.length },
      { startIndex: startIndexBlock2, length: MermaidDiagramBlock.length }
    ];

    const expectedForAnotherMermaidDiagramBlockResult = [
      { startIndex: startIndexBlock3, length: AnotherMermaidDiagramBlock.length }
    ];

    expect( MermaidDiagramBlockResult.rangesInFile )
      .to.deep.equal( expectedForMermaidDiagramBlockResult );

    expect( AnotherMermaidDiagramBlockResults.rangesInFile )
      .to.deep.equal( expectedForAnotherMermaidDiagramBlockResult );
  
  } );

  describe( 'should create 1 entry for 2 identical text blocks,', ()=>{

    const title           = 'Some Title';
    const text            =  MermaidDiagram.substr( 1 );
    const expectedNoTitle = { title, text };

    const padding          = '\n\n';
    const BlockWithTitle   = `# ${ title }${ padding }${ MermaidDiagramBlock }`;
    const BlockWithNoTitle = `${ MermaidDiagramBlock }`;

    it( 'where only the 1st block has a title', ()=>{

      const markdownTextNoTitle  = `${ BlockWithTitle }${ padding }${ BlockWithNoTitle }`;
      const expectedRangesInFile = [
        { startIndex: 0, length: BlockWithTitle.length },
        { startIndex: BlockWithTitle.length + padding.length, length: BlockWithNoTitle.length }
      ];
      
      const [ actual ] = findUniqueMermaidDiagramTextBlocks( markdownTextNoTitle );
 
      expect( actual )
        .to.deep.equal( expectedNoTitle );
  
      expect( actual.rangesInFile )
        .to.deep.equal( expectedRangesInFile );

    } );
    
    it( 'where only the 2nd block has a title', ()=>{
      
      const markdownTextNoTitle  = `${ BlockWithNoTitle }${ padding }${ BlockWithTitle }`;
      const expectedRangesInFile = [
        { startIndex: 0, length: BlockWithNoTitle.length },
        { startIndex: BlockWithNoTitle.length + padding.length, length: BlockWithTitle.length }
      ];

      const [ actual ]          = findUniqueMermaidDiagramTextBlocks( markdownTextNoTitle );
    
      expect( actual )
        .to.deep.equal( expectedNoTitle );
    
      expect( actual.rangesInFile )
        .to.deep.equal( expectedRangesInFile );

    } );

  } );
  
} );
