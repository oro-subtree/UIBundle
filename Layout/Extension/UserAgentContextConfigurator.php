<?php

namespace Oro\Bundle\UIBundle\Layout\Extension;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\OptionsResolver\Options;

use Oro\Component\Layout\ContextInterface;
use Oro\Component\Layout\ContextConfiguratorInterface;

use Oro\Bundle\UIBundle\Provider\UserAgent;

class UserAgentContextConfigurator implements ContextConfiguratorInterface
{
    /** @var Request|null */
    protected $request;

    /**
     * Synchronized DI method call, sets current request for further usage
     *
     * @param Request $request
     */
    public function setRequest(Request $request = null)
    {
        $this->request = $request;
    }

    /**
     * {@inheritdoc}
     */
    public function configureContext(ContextInterface $context)
    {
        $context->getResolver()
            ->setDefaults(
                [
                    'user_agent' => function (Options $options, $value) {
                        if (null === $value) {
                            $value = new UserAgent(
                                $this->request ? $this->request->headers->get('User-Agent') : null
                            );
                        }

                        return $value;
                    }
                ]
            )
            ->setAllowedTypes(['user_agent' => 'Oro\Bundle\UIBundle\Provider\UserAgentInterface']);
    }
}
