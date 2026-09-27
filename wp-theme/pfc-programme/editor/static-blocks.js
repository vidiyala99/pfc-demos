( function ( wp ) {
  var el = wp.element.createElement;
  [ 'masthead', 'footer', 'submissions', 'record' ].forEach( function ( slug ) {
    wp.blocks.registerBlockType( 'pfc/' + slug, {
      edit: function () {
        return el( 'div', wp.blockEditor.useBlockProps(), el( wp.serverSideRender, { block: 'pfc/' + slug } ) );
      },
      save: function () { return null; }
    } );
  } );
} )( window.wp );
