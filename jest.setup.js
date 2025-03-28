// Import Jest DOM utilities
import '@testing-library/jest-dom';

// Polyfill for ResizeObserver (used by TipTap)
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock TipTap commands
jest.mock('@tiptap/react', () => {
  const originalModule = jest.requireActual('@tiptap/react');
  
  return {
    ...originalModule,
    useEditor: () => ({
      chain: () => ({
        focus: () => ({
          toggleBold: () => ({ run: jest.fn() }),
          toggleItalic: () => ({ run: jest.fn() }),
          toggleHeading: () => ({ run: jest.fn() }),
          toggleBulletList: () => ({ run: jest.fn() }),
          toggleOrderedList: () => ({ run: jest.fn() }),
          setLink: () => ({ run: jest.fn() }),
          unsetLink: () => ({ run: jest.fn() })
        })
      }),
      isEmpty: false,
      isActive: jest.fn().mockReturnValue(false),
      getText: jest.fn().mockReturnValue('Editor content'),
      isEditable: true,
      getHTML: jest.fn().mockReturnValue('<p>Editor content</p>')
    })
  };
});

// Mock TipTap extensions
jest.mock('@tiptap/extension-heading', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      name: 'heading',
      configure: jest.fn()
    }))
  };
});

jest.mock('@tiptap/extension-image', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      name: 'image',
      configure: jest.fn()
    }))
  };
});

jest.mock('@tiptap/extension-link', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      name: 'link',
      configure: jest.fn()
    }))
  };
});

jest.mock('@tiptap/extension-placeholder', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      name: 'placeholder',
      configure: jest.fn()
    }))
  };
});

// Mock the API implementation
jest.mock('./utils/api', () => ({
  sendMessageToAI: jest.fn().mockResolvedValue({
    message: 'This is a response from the AI',
    success: true
  })
}));