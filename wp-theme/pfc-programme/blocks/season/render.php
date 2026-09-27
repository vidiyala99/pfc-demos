<?php
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
