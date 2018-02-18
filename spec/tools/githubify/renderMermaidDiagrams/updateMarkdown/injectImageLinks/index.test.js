import injectImageLinks from '<tools>/githubify/renderMermaidDiagrams/updateMarkdown/injectImageLinks';

describe( 'The <tools>/githubify/renderMermaidDiagrams/updateMarkdown/injectImageLinks function', ()=>{

  const Title1          = 'Title1';
  const Title2          = 'Title2';
  const TitleTextBlock1 = `## ${ Title1 }`;
  const TitleTextBlock2 = `## ${ Title2 }`;
  const Padding         = '\n\n';
  const AdditionalText  = '# Some other Header\n\nSome text'; 

  const DiagramText1 = 'graph TD;\n  A-->B;\n  A-->C;\n  B-->D;\n';
  const DiagramText2 = 'graph TD;\n  A-->B;\n  B-->C;\n';

  const DiagramTextBlock1 = `\`\`\`mermaid\n${ DiagramText1 }\`\`\``;
  const DiagramTextBlock2 = `\`\`\`mermaid\n${ DiagramText2 }\`\`\``;
  
  const outputInfoDiagram1 = Object.freeze( {
    diagramTarget: 'where/to/copy/rendered/markdown/file/media/title-1.svg',
    imageLinkText: '![alt Title1](where/to/copy/rendered/markdown/file/media/title-1.svg)',
    text:          'graph TD;\n  A-->B;\n  A-->C;\n  B-->D;\n',
    title:         'Title1',
    rangesInFile:  [ { startIndex: 0, length: 62 }, { startIndex: 119, length: 51  } ] 
  } );

  const outputInfoDiagram2 = Object.freeze( {
    diagramTarget: 'where/to/copy/rendered/markdown/file/media/title-2.svg',
    imageLinkText: '![alt Title2](where/to/copy/rendered/markdown/file/media/title-2.svg)',
    text:          'graph TD;\n  A-->B;\n  B-->C;\n',
    title:         'Title2',
    rangesInFile:  [ { startIndex: 64, length: 53 } ] 
  } );
  
  const sortedByStartIndex = [
    { 
      startIndex: 0,
      length:     62,
      output:     outputInfoDiagram1
    }, 
    { 
      startIndex: 64,
      length:     53,
      output:     outputInfoDiagram2
    },
    { 
      startIndex: 119,
      length:     51,
      output:     outputInfoDiagram1
    }
  ];

  const text = `${ TitleTextBlock1 }${ Padding }${ DiagramTextBlock1 }${
    Padding }${ TitleTextBlock2 }${ Padding }${ DiagramTextBlock2 }${
    Padding }${ DiagramTextBlock1 }${ Padding }${ AdditionalText }`;

  const expected = `${ outputInfoDiagram1.imageLinkText }${ Padding }${
    outputInfoDiagram2.imageLinkText }${ Padding }${
    outputInfoDiagram1.imageLinkText }${ Padding }${ AdditionalText }`;

  it( 'should replace all mermaid text blocks with image links', ()=>{

    const actual = injectImageLinks( text, sortedByStartIndex );

    expect( actual )
      .to.equal( expected );

  } );


} );
