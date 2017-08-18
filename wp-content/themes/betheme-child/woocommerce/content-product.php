<?php
/**
 * The template for displaying product content within loops
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @author  WooThemes
 * @package WooCommerce/Templates
 * @version 3.0.0
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

global $product;

// Ensure visibility
if (empty($product) || !$product->is_visible() || !$product->is_in_stock()) {
    return;
}

$tallas = $product->get_available_variations();
$classTallas = [
    'XS' => 'size-one',
    'S' => 'size-two',
    'M' => 'size-three',
    'L' => 'size-fourth',
    'XL' => 'size-five',
    'XXL' => 'size-six',
];
?>

<div class="column mcb-column one-third column_photo_box item-product">
    <div class="photo_box  pb_left">
        <div class="image_frame">
            <div class="image_wrapper">
                <div class="mask"></div>
                <?=
                the_post_thumbnail('post_thumbnail'
                        , array('class' => 'scale-with-grid',
                    'style' => ' height: auto;max-width: 100%; '));
                ?>
            </div>
        </div>
        <div class="desc">
            <h2>$<?= number_format($product->get_price(), 0, '.', ','); ?><br>
                <span><?php the_title(); ?></span>
            </h2>
            <div class="item-product-car">	
                <div class="box-size">
                    <?php foreach ($tallas as $talla) : ?>
                        <?php
                        if (!$talla['is_in_stock']) {
                            continue;
                        }
                        ?>
                        <div data-size="<?= $talla['attributes']['attribute_pa_tallas']; ?>" 
                             class="<?= $classTallas[strtoupper($talla['attributes']['attribute_pa_tallas'])]; ?>">
                                 <?= strtoupper($talla['attributes']['attribute_pa_tallas']); ?>
                        </div>
                    <?php endforeach; ?>
                </div>
                <div class="btn-buy">
                    <a href="javascript:void(0)" 
                       data-plu="<?= $product->get_sku(); ?>" 
                       data-titu="<?php the_title(); ?>" 
                       data-precio="<?= $product->get_price(); ?>" 
                       data-product_id="<?= $product->get_id(); ?>" 
                       class="on-want">
                        <strong>Seleccionar</strong>
                    </a>		
                </div>
            </div>
        </div>
    </div>
</div>