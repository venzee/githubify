import mapRenderDataToFileRanges from '<tools>/renderMermaidDiagrams/updateMarkdown/mapRenderDataToFileRanges'; // eslint-disable-line max-len

describe( 'The <tools>/renderMermaidDiagrams/updateMarkdown/mapRenderDataToFileRanges function', ()=>{
  
  it( 'should map in-text ranges to their respective replacement text' ,()=>{

    const outputInfoDiagram1 = Object.freeze( {
      diagramTarget: 'where/to/copy/rendered/markdown/file/media/title-1.svg',
      imageLinkText: '![alt Title1](where/to/copy/rendered/markdown/file/media/title-1.svg)',
      text:          'graph TD;\n  A-->B;\n  A-->C;\n  B-->D;\n',
      rangesInFile:  [ { startIndex: 0, length: 62 }, { startIndex: 119, length: 51  } ] 
    } );


    const outputInfoDiagram2 = Object.freeze( {
      diagramTarget: 'where/to/copy/rendered/markdown/file/media/title-2.svg',
      imageLinkText: '![alt Title2](where/to/copy/rendered/markdown/file/media/title-2.svg)',
      text:          'graph TD;\n  A-->B;\n  B-->C;\n',
      rangesInFile:  [ { startIndex: 64, length: 53 } ] 
    } );

    const source = [
      outputInfoDiagram1,
      outputInfoDiagram2
    ];

    const expected = [
      {
        startIndex: 0,
        length:     62,
        output:     outputInfoDiagram1
      },
      {
        startIndex: 119,
        length:     51,
        output:     outputInfoDiagram1
      },
      {
        startIndex: 64,
        length:     53,
        output:     outputInfoDiagram2
      }
    ];

    expect( source.reduce( mapRenderDataToFileRanges, [] ) )
      .to.deep.equal( expected );

  } );

} ); 
