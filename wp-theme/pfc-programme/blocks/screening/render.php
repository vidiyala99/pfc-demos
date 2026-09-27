<?php
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
