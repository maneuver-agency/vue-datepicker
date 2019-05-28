import {
  computeYearsScrollPosition,
  computePositionFromParent,
} from '@/utils';

describe('Utils: Functions', () => {
  const createDivParentWithChildren = ({
    childrenWidth = '100px',
    childrenHeight = '100px',
  } = {}) => {
    const parentElement = document.createElement('div');
    parentElement.setAttribute('class', 'parent');
    const childrenElement = document.createElement('div');
    childrenElement.setAttribute('class', 'children');
    parentElement.appendChild(childrenElement);
    childrenElement.style.height = childrenWidth;
    childrenElement.style.width = childrenHeight;

    return {
      parent: parentElement,
      element: childrenElement,
    };
  };

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe('computeYearsScrollPosition', () => {
    it('should return currentYear position from element position', () => {
      const container = { offsetHeight: 200 };
      const elementToShow = { offsetTop: 250, offsetHeight: 50 };
      expect(computeYearsScrollPosition(container, elementToShow)).toEqual(175);
    });
  });

  describe('computePositionFromParent', () => {
    const offset = 0;

    it.each([
      // Should place above
      [
        { width: 300, height: 800 },
        { top: 700, left: 0, bottom: 700, width: 300 },
        { width: 100, height: 400 },
        { top: -400, left: 100, origin: 'bottom center' },
      ],
      // Should place below
      [
        { width: 300, height: 800 },
        { top: 100, left: 0, bottom: 100, width: 300 },
        { width: 100, height: 100 },
        { top: 0, left: 100, origin: 'top center' },
      ],
      // Should place on left
      [
        { width: 800, height: 500 },
        { top: 250, left: 500, bottom: 250, width: 300 },
        { width: 400, height: 400 },
        { top: -250, left: -400, origin: 'top right' },
      ],
      // Should place on right
      [
        { width: 800, height: 500 },
        { top: 250, left: 100, bottom: 250, width: 300 },
        { width: 400, height: 400 },
        { top: -250, left: 300, origin: 'bottom left' },
      ],
    ])(
      'should compute position to an element from parent and window',
      (windowSize, parentRect, elementSize, expectedResult) => {
        Object.defineProperties(window.HTMLElement.prototype, {
          offsetHeight: { get: () => elementSize.height },
          offsetWidth: { get: () => elementSize.width },
        }, { writable: true });

        global.innerWidth = windowSize.width;
        global.innerHeight = windowSize.height;

        const { parent, element } = createDivParentWithChildren();
        jest.spyOn(parent, 'getBoundingClientRect').mockReturnValue(parentRect);
        expect(computePositionFromParent(element, parent, offset)).toEqual(expectedResult);
      },
    );
  });
});