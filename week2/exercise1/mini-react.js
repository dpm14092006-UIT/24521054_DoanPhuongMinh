const TEXT_ELEMENT = 'TEXT_ELEMENT';

// Kiểm tra một giá trị có phải đối tượng thông thường không
function isRecord(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

// Kiểm tra tên thẻ HTML
function isValidTag(type) {
  return (
    typeof type === 'string' &&
    /^[a-z][a-z0-9-]*$/.test(type)
  );
}

// Kiểm tra kiểu dữ liệu của thuộc tính
function isValidProp(key, value) {
  if (key === 'children') return true;

  // Không cho phép gán trực tiếp HTML nguy hiểm
  if (
    ['innerHTML', 'outerHTML', 'srcdoc', 'srcDoc']
      .includes(key)
  ) {
    return false;
  }

  // Event handler phải là một function
  if (/^on/i.test(key)) {
    return (
      /^on[A-Z][A-Za-z]*$/.test(key) &&
      typeof value === 'function'
    );
  }

  return (
    /^[A-Za-z_][A-Za-z0-9_.:-]*$/.test(key) &&
    (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    )
  );
}

// TYPE GUARD: kiểm tra cấu trúc VNode
export function isVNode(value) {
  if (!isRecord(value)) return false;

  if (
    Object.keys(value).length !== 2 ||
    !Object.hasOwn(value, 'type') ||
    !Object.hasOwn(value, 'props')
  ) {
    return false;
  }

  const { type, props } = value;

  if (!isRecord(props)) return false;
  if (!Array.isArray(props.children)) return false;

  // Trường hợp Text VNode
  if (type === TEXT_ELEMENT) {
    return (
      Object.keys(props).length === 2 &&
      typeof props.nodeValue === 'string' &&
      props.children.length === 0
    );
  }

  // Trường hợp Element VNode
  return (
    isValidTag(type) &&
    Object.entries(props).every(
      ([key, value]) => isValidProp(key, value)
    ) &&
    props.children.every(isVNode)
  );
}

// 1. Tạo Text VNode
export function createTextElement(value) {
  if (
    typeof value !== 'string' &&
    typeof value !== 'number'
  ) {
    throw new TypeError(
      'Text must be a string or number'
    );
  }

  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: String(value),
      children: []
    }
  };
}

// 2. Tạo Element VNode
export function createElement(type, props, ...children) {
  if (!isValidTag(type)) {
    throw new TypeError('Invalid element type');
  }

  if (props != null && !isRecord(props)) {
    throw new TypeError('Invalid props');
  }

  const normalizedChildren = children
    .flat(Infinity)
    .filter(
      child =>
        child !== null &&
        child !== undefined &&
        typeof child !== 'boolean'
    )
    .map(child => {
      if (
        typeof child === 'string' ||
        typeof child === 'number'
      ) {
        return createTextElement(child);
      }

      if (isVNode(child)) {
        return child;
      }

      throw new TypeError('Invalid VNode child');
    });

  const vnode = {
    type,
    props: {
      ...(props ?? {}),
      children: normalizedChildren
    }
  };

  if (!isVNode(vnode)) {
    throw new TypeError('Invalid VNode props');
  }

  return vnode;
}
