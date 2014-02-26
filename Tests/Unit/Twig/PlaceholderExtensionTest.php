<?php
namespace Oro\Bundle\UIBundle\Tests\Unit\Twig;

use Oro\Bundle\UIBundle\Twig\PlaceholderExtension;

class PlaceholderExtensionTest extends \PHPUnit_Framework_TestCase
{
    const PLACEHOLDER_NAME = 'placeholder_name';
    const INVALID_PLACEHOLDER_NAME = 'invalid_placeholder_name';
    const TEMPLATE_NAME = 'FooBarBundle:Test:test.html.twig';
    const ACTION_NAME = 'FooBarBundle:Test:test';
    const DELIMITER = ',';

    /**
     * @var PlaceholderExtension
     */
    protected $extension;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $twig;

    /**
     * @var array
     */
    protected $placehoders = array(
        self::PLACEHOLDER_NAME => array(
            'items' => array(
                array('template' => self::TEMPLATE_NAME),
                array('action' => self::ACTION_NAME),
            )
        ),
        self::INVALID_PLACEHOLDER_NAME => array(
            'items' => array(
                array('foo' => 'bar', 'baz' => 'bar'),
            )
        ),
    );

    protected function setUp()
    {
        $this->twig = $this
            ->getMockBuilder('\Twig_Environment')
            ->disableOriginalConstructor()
            ->getMock();

        $this->extension = new PlaceholderExtension($this->twig, $this->placehoders);
    }

    public function testRenderPlaceholder()
    {
        $variables = array('variables' => 'test');
        $expectedTemplateRender = '<p>template</p>';
        $expectedActionRender = '<p>action</p>';
        $expectedResult = $expectedTemplateRender . self::DELIMITER . $expectedActionRender;

        $this->twig
            ->expects($this->at(0))
            ->method('render')
            ->with(self::TEMPLATE_NAME, $variables)
            ->will($this->returnValue($expectedTemplateRender));

        $httpKernelExtension = $this->getMockBuilder('Symfony\\Bridge\\Twig\\Extension\\HttpKernelExtension')
            ->disableOriginalConstructor()
            ->getMock();

        $this->twig
            ->expects($this->at(1))
            ->method('getExtension')
            ->with(PlaceholderExtension::HTTP_KERNEL_EXTENSION_NAME)
            ->will($this->returnValue($httpKernelExtension));

        $controllerReference = $this->getMockBuilder('Symfony\\Component\\HttpKernel\\Controller\\ControllerReference')
            ->disableOriginalConstructor()
            ->getMock();

        $httpKernelExtension->expects($this->once())
            ->method('controller')
            ->with(self::ACTION_NAME, $variables)
            ->will($this->returnValue($controllerReference));

        $httpKernelExtension->expects($this->once())
            ->method('renderFragment')
            ->with($controllerReference)
            ->will($this->returnValue($expectedActionRender));

        $result = $this->extension->renderPlaceholder(self::PLACEHOLDER_NAME, $variables, self::DELIMITER);

        $this->assertEquals($expectedResult, $result);
    }

    //@codingStandardsIgnoreStart
    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage Cannot render placeholder item with keys "bar", "bar". Expects "template" or "action" key.
     */
    //@codingStandardsIgnoreEnd
    public function testRenderPlaceholderFails()
    {
        $this->extension->renderPlaceholder(self::INVALID_PLACEHOLDER_NAME, array(), self::DELIMITER);
    }

    public function testGetFunctions()
    {
        $this->assertArrayHasKey('placeholder', $this->extension->getFunctions());
    }

    public function testGetName()
    {
        $this->assertEquals(PlaceholderExtension::EXTENSION_NAME, $this->extension->getName());
    }
}
