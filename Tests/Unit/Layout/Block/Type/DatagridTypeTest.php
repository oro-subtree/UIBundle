<?php

namespace Oro\Bundle\UIBundle\Tests\Unit\Layout\Block\Type;

use Oro\Bundle\LayoutBundle\Tests\Unit\BlockTypeTestCase;
use Oro\Bundle\UIBundle\Layout\Block\Type\DatagridType;

class DatagridTypeTest extends BlockTypeTestCase
{
    /** @var \PHPUnit_Framework_MockObject_MockObject */
    protected $nameStrategy;

    protected function setUp()
    {
        parent::setUp();

        $this->nameStrategy = $this->getMock('Oro\Bundle\DataGridBundle\Datagrid\NameStrategyInterface');
    }

    public function testBuildView()
    {
        $this->nameStrategy->expects($this->once())
            ->method('buildGridFullName')
            ->with('test-grid', 'test-scope')
            ->will($this->returnValue('test-grid-test-scope'));

        $view = $this->getBlockView(
            new DatagridType($this->nameStrategy),
            [
                'grid_name'       => 'test-grid',
                'grid_scope'      => 'test-scope',
                'grid_parameters' => ['foo' => 'bar']
            ]
        );

        $this->assertEquals('test-grid', $view->vars['grid_name']);
        $this->assertEquals('test-grid-test-scope', $view->vars['grid_full_name']);
        $this->assertEquals('test-scope', $view->vars['grid_scope']);
        $this->assertEquals(['foo' => 'bar', 'enableFullScreenLayout' => true], $view->vars['grid_parameters']);
    }

    public function testBuildViewWithoutScope()
    {
        $this->nameStrategy->expects($this->never())
            ->method('buildGridFullName');

        $view = $this->getBlockView(
            new DatagridType($this->nameStrategy),
            [
                'grid_name'       => 'test-grid',
                'grid_parameters' => ['foo' => 'bar']
            ]
        );

        $this->assertEquals('test-grid', $view->vars['grid_name']);
        $this->assertEquals('test-grid', $view->vars['grid_full_name']);
        $this->assertFalse(isset($view->vars['grid_scope']));
        $this->assertEquals(['foo' => 'bar', 'enableFullScreenLayout' => true], $view->vars['grid_parameters']);
    }

    public function testBuildViewWithParamsOverwrite()
    {
        $view = $this->getBlockView(
            new DatagridType($this->nameStrategy),
            [
                'grid_name'       => 'test-grid',
                'grid_parameters' => ['enableFullScreenLayout' => false]
            ]
        );
        $this->assertEquals(['enableFullScreenLayout' => false], $view->vars['grid_parameters']);
    }

    /**
     * @expectedException \Symfony\Component\OptionsResolver\Exception\MissingOptionsException
     * @expectedExceptionMessage The required option "grid_name" is missing.
     */
    public function testBuildViewThrowsExceptionIfGridNameIsNotSpecified()
    {
        $this->getBlockView(new DatagridType($this->nameStrategy));
    }

    public function testGetName()
    {
        $type = new DatagridType($this->nameStrategy);

        $this->assertSame(DatagridType::NAME, $type->getName());
    }
}
