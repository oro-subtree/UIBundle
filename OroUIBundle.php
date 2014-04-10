<?php

namespace Oro\Bundle\UIBundle;

use Symfony\Component\DependencyInjection\Compiler\PassConfig;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

use Oro\Bundle\UIBundle\DependencyInjection\Compiler\TwigConfigurationPass;
use Oro\Bundle\UIBundle\DependencyInjection\Compiler\PlaceholderFilterCompilerPass;
use Oro\Bundle\UIBundle\DependencyInjection\Compiler\LazyServicesCompilerPass;

class OroUIBundle extends Bundle
{
    /**
     * {@inheritdoc}
     */
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new TwigConfigurationPass());
        $container->addCompilerPass(new PlaceholderFilterCompilerPass());

        $container->addCompilerPass(new LazyServicesCompilerPass(), PassConfig::TYPE_AFTER_REMOVING);
    }
}
