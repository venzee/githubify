import prepareMermaidRenderData  from '<tools>/githubify/renderMermaidDiagrams/prepareMermaidRenderData';
import path from 'path';

describe( 'The <tools>/githubify/renderMermaidDiagrams/prepareMermaidRenderData function', ()=>{
 
  const markdownTargetPath = path.join( 'where', 'to', 'copy', 'rendered', 'markdown', 'file.md' );

  const Title1          = 'Title1';
  const Title2          = 'Title2';
  const TitleTextBlock1 = `## ${ Title1 }`;
  const TitleTextBlock2 = `## ${ Title2 }`;
  const Padding         = '\n\n';

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

  it( 'should generate an object containing mermaid render data and the text for he markdown file to write', ()=>{

    const text = `${ TitleTextBlock1 }${ Padding }${ DiagramTextBlock1 }${
      Padding }${ TitleTextBlock2 }${ Padding }${ DiagramTextBlock2 }${
      Padding }${ DiagramTextBlock1 }`;

    const expected = [ outputInfoDiagram1, outputInfoDiagram2 ];

    expect( prepareMermaidRenderData( { target: markdownTargetPath, text } ) )
      .to.deep.equal( expected );
  
  } );


} );
