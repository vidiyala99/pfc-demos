<?php
$post = pfc_resolve_featured( $attributes['slug'] ?? '' );
if ( is_wp_error( $post ) ) {
	if ( current_user_can( 'edit_posts' ) ) echo '<p class="placeholder" style="min-height:200px">' . esc_html( $post->get_error_message() ) . '</p>';
	return;
}
$v      = pfc_project_view( $post );
$others = array_values( array_filter( pfc_projects( array( 'meta_key' => 'pfc_show_in_also_showing', 'meta_value' => '1' ) ), function ( $o ) use ( $v ) { return $o['slug'] !== $v['slug']; } ) );
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
