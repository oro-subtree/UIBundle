<?php

namespace Oro\Bundle\UIBundle\Tests\Unit\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Yaml\Parser;

use Oro\Bundle\UIBundle\DependencyInjection\OroUIExtension;

class OroUIExtensionTest extends \PHPUnit_Framework_TestCase
{
    private $container;

    public function testLoad()
    {
        $this->container = $this->getMock('Symfony\Component\DependencyInjection\ContainerBuilder');

        $this->container->expects($this->once())
            ->method('getParameter')
            ->will($this->returnValue(array('Oro\Bundle\UIBundle\Tests\Unit\Fixture\UnitTestBundle')));

        $this->container->expects($this->any())
            ->method('setParameter');

        $extension = new OroUIExtension();
        $extension->load(array(), $this->container);
    }
}
