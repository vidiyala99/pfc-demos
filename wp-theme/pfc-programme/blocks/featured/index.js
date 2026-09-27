( function ( wp ) {
  var el = wp.element.createElement;
  wp.blocks.registerBlockType( 'pfc/featured', {
    edit: function ( props ) {
      var projects = wp.data.useSelect( function ( select ) {
        return select( 'core' ).getEntityRecords( 'postType', 'pfc_project', { per_page: -1, orderby: 'title', order: 'asc' } );
      }, [] );
      var options = ( projects || [] ).map( function ( p ) { return { label: p.title.raw || p.title.rendered, value: p.slug }; } );
      return el( 'div', wp.blockEditor.useBlockProps(),
        el( wp.blockEditor.InspectorControls, {},
          el( wp.components.PanelBody, { title: 'Featured project' },
            el( wp.components.SelectControl, {
              label: 'Project shown large at the top of the homepage',
              value: props.attributes.slug,
              options: options.length ? options : [ { label: 'Loading projects...', value: props.attributes.slug } ],
              onChange: function ( slug ) { props.setAttributes( { slug: slug } ); }
            } ) ) ),
        el( wp.serverSideRender, { block: 'pfc/featured', attributes: props.attributes } ) );
    },
    save: function () { return null; }
  } );
} )( window.wp );
