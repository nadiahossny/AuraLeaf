import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import { getDeviceState } from './hooks/useAdaptiveDevice';

// Mock HTMLMediaElement methods in JSDOM
beforeAll(() => {
  window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  window.HTMLMediaElement.prototype.pause = jest.fn();
});

const setViewport = (width, height, isCoarse = false) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query === '(pointer: coarse)' ? isCoarse : false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
};

describe('AuraLeaf Mobile-Adaptive Architecture', () => {
  test('getDeviceState classifies mobile, tablet, desktop, and landscape mobile viewports', () => {
    setViewport(375, 812, true);
    const mobileState = getDeviceState();
    expect(mobileState.deviceType).toBe('mobile');
    expect(mobileState.isMobile).toBe(true);
    expect(mobileState.isTouchDevice).toBe(true);

    setViewport(820, 1180, true);
    const tabletState = getDeviceState();
    expect(tabletState.deviceType).toBe('tablet');
    expect(tabletState.isTablet).toBe(true);
    expect(tabletState.isMobile).toBe(false);

    setViewport(1440, 900, false);
    const desktopState = getDeviceState();
    expect(desktopState.deviceType).toBe('desktop');
    expect(desktopState.isDesktop).toBe(true);
    expect(desktopState.isMobile).toBe(false);

    setViewport(812, 375, true);
    const landscapeMobileState = getDeviceState();
    expect(landscapeMobileState.isLandscapeMobile).toBe(true);
    expect(landscapeMobileState.isMobile).toBe(true);
  });

  test('adapts workspace to Mobile Bottom Sheets and anchored Timer on mobile viewports', () => {
    setViewport(375, 812, true);
    const { container } = render(<App />);

    // Start session from Landing Page
    const startBtn = screen.getByRole('button', { name: /start studying/i });
    fireEvent.click(startBtn);

    // Verify timer is anchored (non-draggable mode) and WebGL ripple resolution scales down to 192
    const focusCard = container.querySelector('.focus-card');
    expect(focusCard).toHaveAttribute('data-adaptive-mode', 'mobile-anchored');

    const rippleBg = container.querySelector('.water-ripple-bg');
    expect(rippleBg).toHaveAttribute('data-ripple-resolution', '192');

    // Verify mobile thumb-dock quick-access "Tasks" button opens a Mobile Bottom Sheet dialog
    const tasksBtn = screen.getByRole('button', { name: /tasks & notes/i });
    fireEvent.click(tasksBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(container.querySelector('.mobile-bottom-sheet')).toBeInTheDocument();
  });

  test('renders draggable Timer and right-hand slide-in Sidebar on desktop viewports', () => {
    setViewport(1440, 900, false);
    const { container } = render(<App />);

    const startBtn = screen.getByRole('button', { name: /start studying/i });
    fireEvent.click(startBtn);

    const focusCard = container.querySelector('.focus-card');
    expect(focusCard).toHaveAttribute('data-adaptive-mode', 'desktop-draggable');

    const rippleBg = container.querySelector('.water-ripple-bg');
    expect(rippleBg).toHaveAttribute('data-ripple-resolution', '384');

    // Open overflow menu and click To Do
    const moreBtn = screen.getByRole('button', { name: /more tools/i });
    fireEvent.click(moreBtn);
    const todoBtn = screen.getByRole('button', { name: /to do/i });
    fireEvent.click(todoBtn);

    const sidebar = container.querySelector('.tools-sidebar');
    expect(sidebar).toHaveAttribute('data-adaptive-mode', 'desktop-sidebar');
  });
});
