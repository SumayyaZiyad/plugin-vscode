import React from 'react';
import ReactDOM from 'react-dom';
import DocPreview from './components/DocPreview';

export function renderDocPreview(html, nodeType, el) {
    ReactDOM.render(<DocPreview html={html} nodeType={nodeType} />, el);
}
