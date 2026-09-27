<?php
// Runs the shared honesty fixtures against the theme's PHP rules. Served by Playground; prints JSON.
require_once '/wordpress/wp-load.php';
header('Content-Type: application/json');

$fx = json_decode(file_get_contents('/wordpress/pfc-fixtures/honesty.json'), true);
$failures = array();
$count = 0;

foreach ($fx['band'] as $f) {
	$count++;
	$got = pfc_band($f['status'], isset($f['since']) ? $f['since'] : null);
	if ($got !== $f['expect']) $failures[] = array('band', $f['name'], $got);
}
foreach ($fx['placeholder'] as $f) {
	$count++;
	$got = pfc_placeholder_label($f['kind']);
	if ($got !== $f['expect']) $failures[] = array('placeholder', $f['name'], $got);
}
foreach ($fx['invalid'] as $f) {
	$count++;
	$err = pfc_validate_project($f['project']);
	if ($err === null || strpos($err, $f['error']) === false) $failures[] = array('invalid', $f['name'], $err);
}
$count++;
$broken = pfc_resolve_featured($fx['featured']['broken_reference']);
if (!is_wp_error($broken) || strpos($broken->get_error_message(), $fx['featured']['error']) === false) {
	$failures[] = array('featured', 'broken reference', $broken);
}
$count++;
$ok = pfc_resolve_featured('himalayan-kids');
if (is_wp_error($ok) || $ok->post_title !== 'Himalayan Kids') $failures[] = array('featured', 'resolves himalayan-kids', $ok);

echo wp_json_encode(array('tests' => $count, 'failures' => $failures));
