<?php

namespace Oro\Bundle\UIBundle\DependencyInjection;

use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\Loader;
use Symfony\Component\Yaml\Yaml;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class OroUIExtension extends Extension
{
    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('services.yml');

        $container->setParameter('oro_ui.wrap_class', $config['wrap_class']);

        $this->placeholdersConfig($config, $container);
    }

    /**
     * Add placeholders mapping
     *
     * @param array            $config
     * @param ContainerBuilder $container
     */
    protected function placeholdersConfig(array $config, ContainerBuilder $container)
    {
        $placeholders = array();
        $bundles = $container->getParameter('kernel.bundles');
        foreach ($bundles as $bundle) {
            $reflection = new \ReflectionClass($bundle);
            if (is_file($file = dirname($reflection->getFilename()) . '/Resources/config/placeholders.yml')) {
                $placeholders = array_merge_recursive($placeholders, Yaml::parse(realpath($file)));
            }
        }

        $placeholders = $this->changeOrders($placeholders);

        if (isset($config['placeholders_blocks']) && count($config['placeholders_blocks'])) {
            $placeholders = $this->overwritePlaceholders($config['placeholders_blocks'], $placeholders);
        }

        $container->setParameter('oro_ui.placeholders', $placeholders);
    }

    /**
     * Overwrite placeholders with placeholders from the main config
     *
     * @param array $blocks
     * @param array $placeholders
     *
     * @return array
     */
    protected function overwritePlaceholders($blocks, $placeholders)
    {
        foreach ($blocks as $block) {
            if (isset($block['remove']) && $block['remove']) {
                $placeholders = $this->removeBlock($block['name'], $placeholders);
            } else {
                $placeholders = $this->updateBlock($block, $placeholders);
            }
        }

        return $this->changeOrders($placeholders);
    }

    /**
     * Update block data
     *
     * @param array $block
     * @param array $placeholders
     *
     * @return array
     */
    protected function updateBlock($block, $placeholders)
    {
        $placeholders = $this->removeBlock($block['name'], $placeholders);
        $placeholders[$block['placeholder']][] = $block;

        return $placeholders;
    }

    /**
     * Remove block info
     *
     * @param array $blockName
     * @param array $placeholders
     *
     * @return array mixed
     */
    protected function removeBlock($blockName, $placeholders)
    {
        foreach ($placeholders as $placeholderId => $blocks) {
            foreach ($blocks as $blockId => $block) {
                if ($block['name'] == $blockName) {
                    unset($placeholders[$placeholderId][$blockId]);
                }
            }
        }

        return $placeholders;
    }

    /**
     * Change placeholders block order
     *
     * @param array $placeholders
     *
     * @return array
     */
    protected function changeOrders(array $placeholders)
    {
        foreach ($placeholders as $placeholderName => $placeholderBlocks) {
            foreach ($placeholderBlocks as $blockName => $block) {
                if (!isset($placeholders[$placeholderName][$blockName]['name'])) {
                    $placeholders[$placeholderName][$blockName]['name'] = $blockName;
                }
            }
            usort($placeholders[$placeholderName], array($this, "comparePlaceholderBlocks"));
        }

        return $placeholders;
    }

    /**
     * Compare function
     *
     * @param $a
     * @param $b
     *
     * @return int
     */
    protected function comparePlaceholderBlocks($a, $b)
    {
        $aOrder = isset($a['order']) ? $a['order'] : 0;
        $bOrder = isset($b['order']) ? $b['order'] : 0;

        if ($aOrder == $bOrder) {

            return 0;
        }

        return ($aOrder < $bOrder) ? -1 : 1;
    }
}
