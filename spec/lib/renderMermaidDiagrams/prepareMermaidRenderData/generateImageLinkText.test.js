import generateImageLinkText from '<renderMermaidDiagrams>/prepareMermaidRenderData/generateImageLinkText'; // eslint-disable-line max-len
import path from 'path';

describe( 'The <renderMermaidDiagrams>/prepareMermaidRenderData/generateImageLinkText function', ()=>{ // eslint-disable-line max-len

  const title         = 'title';
  const root          = 'root';
  const subdir        = 'subdir';
  const fileDir       = 'fileDir';
  const diagramTarget = path.join( root, subdir, fileDir );
  const imagePath     = path.posix.join(  subdir, fileDir );   
  
  it( 'should set the alt text to value of "title", if "title" is set', ()=>{

    const expected = `![alt ${ title }]`;

    expect( generateImageLinkText( { title, diagramTarget: '' } ) )
      .to.include( expected );

  }  );

  it( 'should set the image path to a path relative to the output root dir', ()=>{

    const expected = `![alt ${ title }](${ imagePath })`;

    expect( generateImageLinkText( { title, diagramTarget } ) )
      .to.equal( expected );

  } );

  it( 'should set the alt text to the value of the image path if the title is not set', ()=>{

    const expected = `![alt ${ imagePath }](${ imagePath })`;

    expect( generateImageLinkText( { diagramTarget  } ) )
      .to.include( expected );

  }  );


} );
