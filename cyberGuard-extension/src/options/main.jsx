import React from 'react';
import { createRoot } from 'react-dom/client';

function OptionsPage() {
  return <div>Options Page Content</div>;
}

const root = createRoot(document.getElementById('root'));
root.render(<OptionsPage />);