/* "Project details" sidebar panel for the fields that are not taxonomies. Plain JS on WordPress globals: no build step. */
( function ( wp ) {
  var el = wp.element.createElement;
  var PluginDocumentSettingPanel = ( wp.editor && wp.editor.PluginDocumentSettingPanel ) || wp.editPost.PluginDocumentSettingPanel;

  function ProjectDetails() {
    var postType = wp.data.useSelect( function ( s ) { return s( 'core/editor' ).getCurrentPostType(); }, [] );
    var meta = wp.data.useSelect( function ( s ) { return s( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {}; }, [] );
    var edit = wp.data.useDispatch( 'core/editor' ).editPost;
    if ( postType !== 'pfc_project' ) return null;
    function set( key ) { return function ( value ) { var m = {}; m[ key ] = value; edit( { meta: m } ); }; }

    return el( PluginDocumentSettingPanel, { name: 'pfc-project-details', title: 'Project details', initialOpen: true },
      el( wp.components.TextControl, { label: 'Place or credits line', value: meta.pfc_place || '', onChange: set( 'pfc_place' ) } ),
      el( wp.components.TextControl, { label: 'Active since (year)', type: 'number', value: meta.pfc_since || '', onChange: function ( v ) { set( 'pfc_since' )( parseInt( v, 10 ) || 0 ); } } ),
      el( wp.components.ToggleControl, { label: "Show in 'Also showing' on the homepage", checked: !! meta.pfc_show_in_also_showing, onChange: set( 'pfc_show_in_also_showing' ) } ),
      el( wp.components.TextControl, { label: 'Last reviewed (YYYY-MM-DD)', value: meta.pfc_last_reviewed || '', onChange: set( 'pfc_last_reviewed' ) } ),
      el( 'p', { style: { color: '#3c4a68', fontSize: '12px' } }, 'Set the photo with "Featured image". Leave it empty to show a labelled "from PFC needed" placeholder. Use the Status box: only "Active" shows as current work.' )
    );
  }

  wp.plugins.registerPlugin( 'pfc-project-details', { render: ProjectDetails } );
} )( window.wp );
