"""Generates the PFC Programme theme's server-rendered blocks (block.json, render.php, editor JS)."""
import json
import os

BLOCKS = os.path.join(os.path.dirname(__file__), "..", "wp-theme", "pfc-programme", "blocks")

ASSET = "<?php return array( 'dependencies' => array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-data', 'wp-core-data', 'wp-server-side-render' ), 'version' => '0.1.0' );\n"

SSR_JS = """( function ( wp ) {
  var el = wp.element.createElement;
  wp.blocks.registerBlockType( 'NAME', {
    edit: function ( props ) {
      return el( 'div', wp.blockEditor.useBlockProps(), el( wp.serverSideRender, { block: 'NAME', attributes: props.attributes } ) );
    },
    save: function () { return null; }
  } );
} )( window.wp );
"""


def block(name, title, desc, attrs, render, js, view=None):
    d = os.path.join(BLOCKS, name)
    os.makedirs(d, exist_ok=True)
    meta = {
        "$schema": "https://schemas.wp.org/trunk/block.json",
        "apiVersion": 3,
        "name": f"pfc/{name}",
        "title": title,
        "category": "theme",
        "description": desc,
        "attributes": attrs,
        "supports": {"html": False, "align": False},
        "editorScript": "file:./index.js",
        "render": "file:./render.php",
    }
    if view:
        meta["viewScript"] = "file:./view.js"
    with open(os.path.join(d, "block.json"), "w") as f:
        json.dump(meta, f, indent=2)
    with open(os.path.join(d, "render.php"), "w", encoding="utf-8") as f:
        f.write(render)
    with open(os.path.join(d, "index.js"), "w", encoding="utf-8") as f:
        f.write(js)
    with open(os.path.join(d, "index.asset.php"), "w") as f:
        f.write(ASSET)
    if view:
        with open(os.path.join(d, "view.js"), "w", encoding="utf-8") as f:
            f.write(view)
        with open(os.path.join(d, "view.asset.php"), "w") as f:
            f.write("<?php return array( 'dependencies' => array(), 'version' => '0.1.0' );\n")


ALSO = "array( 'meta_key' => 'pfc_show_in_also_showing', 'meta_value' => '1' )"

block(
    "featured",
    "Featured project",
    "The featured screening at the top of the homepage, with Also showing beside it.",
    {"slug": {"type": "string", "default": "himalayan-kids"}},
    """<?php
$post = pfc_resolve_featured( $attributes['slug'] ?? '' );
if ( is_wp_error( $post ) ) {
	if ( current_user_can( 'edit_posts' ) ) echo '<p class="placeholder" style="min-height:200px">' . esc_html( $post->get_error_message() ) . '</p>';
	return;
}
$v      = pfc_project_view( $post );
$others = array_values( array_filter( pfc_projects( ALSO ), function ( $o ) use ( $v ) { return $o['slug'] !== $v['slug']; } ) );
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'programme' ) ); ?> aria-labelledby="feature-title">
	<article class="feature">
		<figure class="feature__still"><?php echo pfc_image_or_placeholder( $v, 'fetchpriority="high"' ); ?></figure>
		<h1 id="feature-title" class="feature__title display"><a href="<?php echo esc_url( $v['url'] ); ?>"><?php echo esc_html( $v['title'] ); ?></a></h1>
		<p class="feature__credits"><?php echo esc_html( trim( $v['lede'] . ' ' . $v['place'] . '.' ) ); ?></p>
		<div class="feature__actions">
			<?php echo pfc_tab( $v['strand'], true ) . pfc_band_html( $v['band'], true ); ?>
			<span class="sep" aria-hidden="true"></span>
			<?php echo pfc_ticket( 'Donate to this project', true ); ?>
		</div>
	</article>
	<?php echo pfc_also_showing_html( $others ); ?>
</section>
""".replace("ALSO", ALSO),
    """( function ( wp ) {
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
""",
)

block(
    "also-showing",
    "Also showing",
    "Projects flagged to appear in Also showing, at full width.",
    {},
    """<?php
$current = is_singular( 'pfc_project' ) ? get_post_field( 'post_name', get_the_ID() ) : '';
$views   = array_values( array_filter( pfc_projects( ALSO ), function ( $o ) use ( $current ) { return $o['slug'] !== $current; } ) );
echo '<section ' . get_block_wrapper_attributes( array( 'class' => 'section' ) ) . ' aria-label="More from the programme">' . pfc_also_showing_html( array_slice( $views, 0, 4 ), true ) . '</section>';
""".replace("ALSO", ALSO),
    SSR_JS.replace("NAME", "pfc/also-showing"),
)

block(
    "season",
    "Season list",
    "Every project, billed together, with strand filters.",
    {},
    """<?php
$items = '';
foreach ( pfc_projects() as $v ) {
	$go = 'solid' === $v['band']['style']
		? '<a href="' . esc_url( PFC_DONATE_URL ) . '">Give ' . pfc_arrow() . '</a>'
		: '<a href="' . esc_url( $v['url'] ) . '">Read ' . pfc_arrow() . '</a>';
	$items .= sprintf(
		'<li class="entry" id="%1$s" data-strand="%2$s">%3$s<div><h3 class="entry__title display"><a href="%4$s">%5$s</a></h3><p class="entry__place">%6$s</p></div><span class="kind entry__kind">%7$s</span><span class="entry__status">%8$s</span><span class="entry__go">%9$s</span></li>',
		esc_attr( $v['slug'] ), esc_attr( strtolower( $v['strand'] ) ), pfc_tab( $v['strand'] ), esc_url( $v['url'] ), esc_html( $v['title'] ), esc_html( $v['place'] ), esc_html( $v['kind'] ), pfc_band_html( $v['band'] ), $go
	);
}
$filters = '';
foreach ( array( 'all' => 'All', 'education' => 'Education', 'health' => 'Health', 'climate' => 'Climate', 'media' => 'Media' ) as $k => $label ) {
	$filters .= sprintf( '<button class="filter" type="button" data-strand="%s" aria-pressed="%s">%s</button>', esc_attr( $k ), 'all' === $k ? 'true' : 'false', esc_html( $label ) );
}
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'section' ) ); ?> id="season" aria-labelledby="season-title">
	<div class="section__head">
		<div>
			<h2 id="season-title" class="section__title display">The season</h2>
			<p class="section__lede">Every film and project PFC backs, billed together. Statuses are confirmed by PFC before launch.</p>
		</div>
		<div class="filters" role="group" aria-label="Filter by strand"><?php echo $filters; ?></div>
	</div>
	<ol class="season"><?php echo $items; ?></ol>
</section>
""",
    SSR_JS.replace("NAME", "pfc/season"),
    view="""document.querySelectorAll( '.filters' ).forEach( function ( group ) {
  var buttons = group.querySelectorAll( '.filter' );
  var entries = group.closest( 'section' ).querySelectorAll( '.entry' );
  buttons.forEach( function ( b ) {
    b.addEventListener( 'click', function () {
      buttons.forEach( function ( x ) { x.setAttribute( 'aria-pressed', String( x === b ) ); } );
      entries.forEach( function ( e ) { e.toggleAttribute( 'data-dim', b.dataset.strand !== 'all' && e.dataset.strand !== b.dataset.strand ); } );
    } );
  } );
} );
""",
)

block(
    "screening",
    "Project screening",
    "The program page for one project: still, title, credits, status, ticket, text and facts.",
    {},
    """<?php
$post = get_post();
if ( ! $post || 'pfc_project' !== $post->post_type ) return;
$v = pfc_project_view( $post );
?>
<article <?php echo get_block_wrapper_attributes( array( 'class' => 'screening' ) ); ?> aria-labelledby="title">
	<nav class="crumbs" aria-label="Breadcrumb"><a href="<?php echo esc_url( home_url( '/#season' ) ); ?>">Our work</a><span aria-hidden="true">/</span><span><?php echo esc_html( $v['title'] ); ?></span></nav>
	<figure class="screening__still"><?php echo pfc_image_or_placeholder( $v, 'fetchpriority="high"' ); ?></figure>
	<h1 id="title" class="screening__title display"><?php echo esc_html( $v['title'] ); ?></h1>
	<p class="screening__credits"><?php echo esc_html( $v['place'] ); ?></p>
	<div class="screening__meta">
		<?php echo pfc_tab( $v['strand'], true ) . pfc_band_html( $v['band'], true ); ?>
		<span class="sep" aria-hidden="true"></span>
		<?php echo pfc_ticket( 'Donate to this project', true ); ?>
	</div>
	<div class="screening__body">
		<div class="prose"><?php echo apply_filters( 'the_content', $post->post_content ); ?></div>
		<dl class="facts">
			<div><dt>Strand</dt><dd><?php echo esc_html( $v['strand'] ); ?></dd></div>
			<div><dt>Kind</dt><dd><?php echo esc_html( $v['kind'] ); ?></dd></div>
			<div><dt>Status</dt><dd><?php echo esc_html( $v['band']['text'] ); ?></dd></div>
			<div><dt>Last reviewed</dt><dd><time datetime="<?php echo esc_attr( $v['reviewed'] ); ?>"><?php echo esc_html( $v['reviewed'] ); ?></time></dd></div>
		</dl>
	</div>
</article>
""",
    SSR_JS.replace("NAME", "pfc/screening"),
)

print("blocks written")
