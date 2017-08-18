<?php
/**
 * The template for displaying product content within loops
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you (the theme developer).
 * will need to copy the new files to your theme to maintain compatibility. We try to do this.
 * as little as possible, but it does happen. When this occurs the version of the template file will.
 * be bumped and the readme will list any important changes.
 *
 * @see     http://docs.woothemes.com/document/template-structure/
 * @author  WooThemes
 * @package WooCommerce/Templates
 * @version 2.5.0
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

global $product, $woocommerce_loop;

// Store loop count we're currently on
if (empty($woocommerce_loop['loop'])) {
    $woocommerce_loop['loop'] = 0;
}

// Ensure visibility
if (!$product || !$product->is_visible()) {
    return;
}

// Increase loop count
$woocommerce_loop['loop'] ++;


// Extra post classes
$classes = array();
$classes[] = 'isotope-item';


// Product type - Buttons ---------------------------------
if (!$product->is_in_stock() || mfn_opts_get('shop-catalogue') || in_array($product->product_type, array('external', 'grouped', 'variable'))) {
    //AGREGADO POR MI PARA QUE NO MUSTRE EL PRODUCTO
    return false;
    $add_to_cart = false;
    $image_frame = false;
} else {

    if ($product->supports('ajax_add_to_cart')) {
        $add_to_cart = '<a rel="nofollow" href="' . apply_filters('add_to_cart_url', esc_url($product->add_to_cart_url())) . '" data-quantity="1" data-product_id="' . esc_attr($product->id) . '" class="add_to_cart_button ajax_add_to_cart product_type_simple"><i class="icon-basket"></i></a>';
    } else {
        $add_to_cart = '<a rel="nofollow" href="' . apply_filters('add_to_cart_url', esc_url($product->add_to_cart_url())) . '" data-quantity="1" data-product_id="' . esc_attr($product->id) . '" class="add_to_cart_button product_type_simple"><i class="icon-basket"></i></a>';
    }

    $image_frame = 'double';
}

$tallas = explode(", ", $product->get_attribute('pa_tallas'));
$classTallas = [
    'XS' => 'size-one',
    'S' => 'size-two',
    'M' => 'size-three',
    'L' => 'size-fourth',
    'XL' => 'size-five',
    'XXL' => 'size-six',
];
//var_dump($product);exit;
?>

<div class="column mcb-column one-third column_photo_box item-product">
    <div class="photo_box  pb_left">
        <div class="image_frame">
            <div class="image_wrapper">
                <div class="mask"></div>
                <?= the_post_thumbnail('post_thumbnail', array('class' => 'scale-with-grid', 'style' => ' height: auto;max-width: 100%; ')); ?>
                <!--<img class="scale-with-grid" src="http://pcfklovers.com.co/wp-content/uploads/2017/04/productItem1.jpg" alt="productItem1" width="1500" height="2250">-->
            </div>
        </div>
        <?php
        /**
         * woocommerce_before_shop_loop_item hook.
         *
         * @hooked woocommerce_template_loop_product_link_open - 10
         */
//        remove_action('woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10);
//        do_action('woocommerce_before_shop_loop_item');
//
//        $shop_images = mfn_opts_get('shop-images');
//
//        if ($shop_images == 'plugin') {
//            // Disable Image Frames if use external plugin for Featured Images
//
//            echo '<a href="' . apply_filters('the_permalink', get_permalink()) . '">';
//
//            /**
//             * woocommerce_before_shop_loop_item_title hook
//             *
//             * @hooked woocommerce_show_product_loop_sale_flash - 10
//             * @hooked woocommerce_template_loop_product_thumbnail - 10
//             */
//            remove_action('woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10);
//            do_action('woocommerce_before_shop_loop_item_title');
//
//            if ($product->is_on_sale())
//                echo '<span class="onsale"><i class="icon-star"></i></span>';
//
//            echo '</a>';
//        } elseif ($shop_images == 'secondary') {
//            // Show secondary image on hover
//
//            echo '<div class="hover_box hover_box_product" ontouchstart="this.classList.toggle(\'hover\');" >';
//            echo '<a href="' . apply_filters('the_permalink', get_permalink()) . '">';
//            echo '<div class="hover_box_wrapper">';
//
//            the_post_thumbnail('shop_catalog', array('class' => 'visible_photo scale-with-grid'));
//
//            if ($attachment_ids = $product->get_gallery_attachment_ids()) {
//                $secondary_image_id = $attachment_ids['0'];
//                echo wp_get_attachment_image($secondary_image_id, 'shop_catalog', '', $attr = array('class' => 'hidden_photo scale-with-grid'));
//            }
//
//            echo '</div>';
//            echo '</a>';
//
//            if ($product->is_on_sale())
//                echo '<span class="onsale"><i class="icon-star"></i></span>';
//            echo '</div>';
//        } else {
//
//            echo '<div class="image_frame scale-with-grid product-loop-thumb" ontouchstart="this.classList.toggle(\'hover\');">';
//
//            echo '<div class="image_wrapper">';
//
//            echo '<a href="' . apply_filters('the_permalink', get_permalink()) . '">';
//            echo '<div class="mask"></div>';
//            the_post_thumbnail('shop_catalog', array('class' => 'scale-with-grid'));
//            echo '</a>';
//
//            //echo '<div class="image_links ' . $image_frame . '">';
//            //echo $add_to_cart;
//            //echo '<a class="link" href="' . apply_filters('the_permalink', get_permalink()) . '"><i class="icon-link"></i></a>';
//            //echo '</div>';
//
//            echo '</div>';
//
////            if ($product->is_on_sale())
////                echo '<span class="onsale"><i class="icon-star"></i></span>';
////            echo '<a href="' . apply_filters('the_permalink', get_permalink()) . '"><span class="product-loading-icon added-cart"></span></a>';
//
//            echo '</div>';
//        }
        ?>

        <div class="desc">

            <h2>$<?= number_format($product->get_price(), 0, '.', ','); ?><br>
                <span><?php the_title(); ?></span>
            </h2>

            <div class="item-product-car">	
                <div class="box-size">
                    <?php foreach ($tallas as $talla) : ?>
                        <div data-size="<?= $talla; ?>" class="<?= $classTallas[$talla]; ?>"><?= $talla; ?></div>
                    <?php endforeach; ?>
                </div>
                <div class="btn-buy">
                    <a href="javascript:void(0)" data-plu="<?= $product->get_sku(); ?>" data-titu="<?php the_title(); ?>" data-precio="<?= $product->get_price(); ?>" class="on-want">
                        <strong>Seleccionar</strong>
                    </a>		
                </div>
            </div>

            <?php
            /**
             * woocommerce_after_shop_loop_item_title hook
             *
             * @hooked woocommerce_template_loop_rating - 5
             * @hooked woocommerce_template_loop_price - 10
             */
//            do_action('woocommerce_after_shop_loop_item_title');
// excerpt
            if ($_GET && key_exists('mfn-shop', $_GET)) {
                $shop_layout = $_GET['mfn-shop']; // demo
            } else {
                $shop_layout = mfn_opts_get('shop-layout', 'grid');
            }

            if ($_GET && key_exists('mfn-shop-ex', $_GET)) {
                echo '<div class="excerpt">' . apply_filters('woocommerce_short_description', $post->post_excerpt) . '</div>'; // demo
            } elseif (mfn_opts_get('shop-excerpt')) {
                echo '<div class="excerpt">' . apply_filters('woocommerce_short_description', $post->post_excerpt) . '</div>';
            }
            ?>

        </div>

        <?php
        /**
         * woocommerce_after_shop_loop_item hook
         *
         * @hooked woocommerce_template_loop_product_link_close - 5
         * @hooked woocommerce_template_loop_add_to_cart - 10
         */
        remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5);
        if (!mfn_opts_get('shop-button')) {
            remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10);
        }
        do_action('woocommerce_after_shop_loop_item');
        ?>
    </div>
</div>