import {
  createElement,
  createTextElement,
  isVNode,
  renderToDOM
} from './mini-react.js';

// =======================================
// CHECKPOINT 1: TEST DO DE BAI CUNG CAP
// =======================================

const vApp = createElement(
  'main',
  { id: 'root-view', role: 'main' },

  createElement(
    'header',
    { className: 'hero' },

    createElement(
      'h1',
      null,
      'Mini React Engine'
    ),

    createElement(
      'p',
      null,
      '<img onerror=alert(1)> Safe Text'
    )
  ),

  createElement(
    'button',
    { onClick: () => console.log('Ping') },
    'Click'
  )
);

const root = document.getElementById('app');

root.replaceChildren(renderToDOM(vApp));

console.assert(
  root.querySelector('button') !== null,
  'Mount Failed'
);

// =======================================
// CHECKPOINT 2: TYPE GUARD TESTS
// =======================================

console.assert(
  isVNode(vApp),
  'VNode validation failed'
);

console.assert(
  isVNode(createTextElement('Hello')),
  'Valid text VNode rejected'
);

console.assert(
  !isVNode({
    type: 'main',
    props: { children: 'invalid' }
  }),
  'Invalid children incorrectly accepted'
);

console.assert(
  !isVNode({
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: 123,
      children: []
    }
  }),
  'Invalid text node incorrectly accepted'
);

console.assert(
  !isVNode({
    type: 'button',
    props: {
      onClick: 'alert(1)',
      children: []
    }
  }),
  'Invalid event handler accepted'
);

// =======================================
// CHECKPOINT 3: XSS SECURITY TEST
// =======================================

const payload = '<script>alert(1)</script>';

const xssVNode = createElement(
  'section',
  null,
  payload
);

const xssDOM = renderToDOM(xssVNode);

console.assert(
  xssDOM.textContent === payload,
  'XSS payload text was changed'
);

console.assert(
  xssDOM.querySelector('script') === null,
  'Unsafe script element was created'
);

console.assert(
  xssDOM.firstChild.nodeType === Node.TEXT_NODE,
  'Payload was not rendered as text'
);

console.assert(
  root.querySelector('img') === null,
  'Unsafe img element was created'
);

console.assert(
  root.querySelector('p').textContent ===
    '<img onerror=alert(1)> Safe Text',
  'Text content mismatch'
);

// =======================================
// CHECKPOINT 4: DOM / VNODE TREE AUDIT
// =======================================

function domMatchesVNode(vnode, domNode) {
  if (!domNode) return false;

  if (vnode.type === 'TEXT_ELEMENT') {
    return (
      domNode.nodeType === Node.TEXT_NODE &&
      domNode.nodeValue === vnode.props.nodeValue
    );
  }

  if (
    domNode.nodeType !== Node.ELEMENT_NODE ||
    domNode.tagName.toLowerCase() !== vnode.type
  ) {
    return false;
  }

  const vnodeChildren = vnode.props.children;
  const domChildren = domNode.childNodes;

  if (vnodeChildren.length !== domChildren.length) {
    return false;
  }

  return vnodeChildren.every(
    (child, index) =>
      domMatchesVNode(child, domChildren[index])
  );
}

console.assert(
  root.childNodes.length === 1 &&
    domMatchesVNode(vApp, root.firstChild),
  'DOM / VNode mismatch or orphan nodes'
);

console.log('Checkpoint tests executed.');
