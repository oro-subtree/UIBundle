<?php
namespace Oro\Bundle\UIBundle\Tests\Unit\Twig\Node;

use Oro\Bundle\UIBundle\Twig\Node\PositionNode;

class PositionNodeTest extends \PHPUnit_Framework_TestCase
{
    protected $compiler;

    protected $blocks;
    protected $variables;
    protected $wrapClassName;
    protected $line;
    protected $tag;

    /**
     * @var \Oro\Bundle\UIBundle\Twig\Node\PositionNode
     */
    protected $node;

    public function setUp()
    {
        $this->compiler = $this->getMockBuilder('Twig_Compiler')
            ->disableOriginalConstructor()
            ->getMock();

        $this->blocks = array(
            array(
                'action' => 'some_action'
            ),
            array(
                'template' => 'some_template'
            )
        );

        $this->line = array(12);
        $this->variables = new \Twig_Node_Expression_Constant(array(), $this->line) ;
        $this->wrapClassName = 'test_class';

        $this->tag = 'test_tag';

        $this->node = new PositionNode(
            $this->blocks,
            $this->variables,
            $this->wrapClassName,
            $this->line,
            $this->tag
        );
    }

    public function testCompile()
    {
        $this->compiler->expects($this->any())
            ->method('write')
            ->will($this->returnValue($this->compiler));

        $this->compiler->expects($this->any())
            ->method('subcompile')
            ->will($this->returnValue($this->compiler));

        $this->compiler->expects($this->any())
            ->method('outdent')
            ->will($this->returnValue($this->compiler));

        $this->compiler->expects($this->any())
            ->method('indent')
            ->will($this->returnValue($this->compiler));

        $this->compiler->expects($this->any())
            ->method('addDebugInfo')
            ->will($this->returnValue($this->compiler));

        $this->compiler->expects($this->any())
            ->method('raw')
            ->will($this->returnValue($this->compiler));

        $this->node->compile($this->compiler);

        $nodeWoVariables = new PositionNode(
            array(array('action' => 'some_action')),
            null,
            $this->wrapClassName,
            $this->line,
            $this->tag
        );
        $nodeWoVariables->compile($this->compiler);
    }
}
