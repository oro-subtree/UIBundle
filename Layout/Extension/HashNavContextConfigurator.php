<?php

namespace Oro\Bundle\UIBundle\Layout\Extension;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\OptionsResolver\Options;

use Oro\Component\Layout\ContextInterface;
use Oro\Component\Layout\ContextConfiguratorInterface;

use Oro\Bundle\NavigationBundle\Event\ResponseHashnavListener;

class HashNavContextConfigurator implements ContextConfiguratorInterface
{
    const HASH_NAVIGATION_HEADER = ResponseHashnavListener::HASH_NAVIGATION_HEADER;

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
                    'hash_navigation' => function (Options $options, $value) {
                        if (null === $value) {
                            $value =
                                $this->request
                                && (
                                    $this->request->headers->get(self::HASH_NAVIGATION_HEADER) == true
                                    || $this->request->get(self::HASH_NAVIGATION_HEADER) == true
                                );
                        }

                        return $value;
                    }
                ]
            )
            ->setAllowedTypes(['hash_navigation' => 'bool']);
    }
}
