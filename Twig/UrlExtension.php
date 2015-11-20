<?php

namespace Oro\Bundle\UIBundle\Twig;

use Symfony\Component\HttpFoundation\Request;

class UrlExtension extends \Twig_Extension
{
    const NAME = 'oro_ui_url';

    /**
     * @var Request
     */
    protected $request;

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return self::NAME;
    }

    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('oro_url_add_query', [$this, 'addQuery']),
            new \Twig_SimpleFunction('oro_is_url_local', [$this, 'isUrlLocal']),
        ];
    }

    /**
     * @param string $link
     * @return string
     */
    public function addQuery($link)
    {
        if (!$this->request) {
            return $link;
        }

        $parts = parse_url($link);
        $urlQueryParts = [];
        if (!empty($parts['query'])) {
            parse_str($parts['query'], $urlQueryParts);
        }

        $requestQueryParts = $this->request->query->all();
        if ($requestQueryParts && $requestQueryParts != $urlQueryParts) {
            $mergedQueryParts = array_merge($requestQueryParts, $urlQueryParts);

            $basicUrlPart = $parts['path'];
            $updatedUrlPart = $parts['path'] . '?' . http_build_query($mergedQueryParts);

            if (!empty($parts['host'])) {
                $basicUrlPart = $parts['host'] . $basicUrlPart;
                $updatedUrlPart = $parts['host'] . $updatedUrlPart;
            }
            if (!empty($parts['query'])) {
                $basicUrlPart .= '?' . $parts['query'];
            }

            $link = str_replace($basicUrlPart, $updatedUrlPart, $link);
        }

        return $link;
    }

    /**
     * @param Request $request
     */
    public function setRequest(Request $request = null)
    {
        $this->request = $request;
    }

    public function isUrlLocal($link)
    {
        if (!$this->request) {
            return false;
        }

        $parts = parse_url($link);

        if (!empty($parts['host'])) {
            if ($parts['host'] !== $this->request->getHttpHost()) {
                return false;
            }
        }

        // going out from secure connection to unsecure page on same domain is not local
        if (!empty($parts['scheme']) && $this->request->getScheme() === 'https') {
            if ($parts['scheme'] === 'http') {
                return false;
            }
        }

        return true;
    }
}
