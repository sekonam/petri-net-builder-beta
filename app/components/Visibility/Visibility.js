import React, { PropTypes } from 'react';

export default class Visibility extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    once: PropTypes.bool,
    continuous: PropTypes.bool,
    initialCheck: PropTypes.bool,
    zIndex: PropTypes.number,
    offset: PropTypes.number,
    includeMargin: PropTypes.bool,
    debug: PropTypes.bool,
    onOnScreen: PropTypes.func,
    onOffScreen: PropTypes.func,
    onTopVisible: PropTypes.func,
    onTopPassed: PropTypes.func,
    onBottomVisible: PropTypes.func,
    onPassing: PropTypes.func,
    onBottomPassed: PropTypes.func,
    onTopVisibleReverse: PropTypes.func,
    onTopPassedReverse: PropTypes.func,
    onBottomVisibleReverse: PropTypes.func,
    onPassingReverse: PropTypes.func,
    onBottomPassedReverse: PropTypes.func,
  };

  static defaultProps = {
    once: true,
    continuous: false,
    initialCheck: true,
    zIndex: 1,
    offset: 0,
    debug: false,
  };

  componentWillMount() {
    ::this.screenSize();
    this.boundScrollHandler = ::this.scrollHandler;
    window.addEventListener('scroll', this.boundScrollHandler);
  }

  componentDidMount() {
    if (this.props.initialCheck) {
      ::this.scrollHandler();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.boundScrollHandler);
  }

  cache = {
    element: {},
    screen: {},
    occurred: {},
  };

  elementPosition() {
    const element = this.cache.element;
    const screen = this.screenSize();
    const { width, height } = this.wrapper.getBoundingClientRect();
    const rect = this.wrapper.getBoundingClientRect();
    const doc = document.documentElement;

    element.fits = (element.height < screen.height);
    element.offset = {
      top: rect.top + window.pageYOffset - doc.clientTop,
      left: rect.left + window.pageXOffset - doc.clientLeft,
    };
    element.width = width;
    element.height = height;
    // store
    this.cache.element = element;
    return element;
  }

  elementCalculations() {
    const screen = this.screenCalculations();
    const element = this.elementPosition();
    // offset
    if (this.props.includeMargin) {
      element.margin = {};
      const styles = window.getComputedStyle(this.wrapper);
      element.margin.top = parseInt(styles.getPropertyValue('margin-top'), 10);
      element.margin.bottom = parseInt(styles.getPropertyValue('margin-bottom'), 10);
      element.top = element.offset.top - element.margin.top;
      element.bottom = element.offset.top + element.height + element.margin.bottom;
    } else {
      element.top = element.offset.top;
      element.bottom = element.offset.top + element.height;
    }

    // visibility
    element.topVisible = (screen.bottom >= element.top);
    element.topPassed = (screen.top >= element.top);
    element.bottomVisible = (screen.bottom >= element.bottom);
    element.bottomPassed = (screen.top >= element.bottom);
    element.pixelsPassed = 0;
    element.percentagePassed = 0;

    // meta calculations
    element.onScreen = (element.topVisible && !element.bottomPassed);
    element.passing = (element.topPassed && !element.bottomPassed);
    element.offScreen = (!element.onScreen);

    // passing calculations
    if (element.passing) {
      element.pixelsPassed = (screen.top - element.top);
      element.percentagePassed = (screen.top - element.top) / element.height;
    }

    this.cache.element = element;
    return element;
  }

  screenSize() {
    this.cache.screen.height =
      window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return this.cache.screen;
  }

  screenCalculations() {
    const doc = document.documentElement;
    this.cache.screen.top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    this.cache.screen.bottom = this.cache.screen.top + this.cache.screen.height;
    return this.cache.screen;
  }

  scrollHandler() {
    this.screenCalculations();
    this.elementCalculations();

    // percentage
    this.passed();

    // reverse (must be first)
    this.passingReverse();
    this.topVisibleReverse();
    this.bottomVisibleReverse();
    this.topPassedReverse();
    this.bottomPassedReverse();

    // one time
    this.screen();
    this.offScreen();
    this.passing();
    this.topVisible();
    this.bottomVisible();
    this.topPassed();
    this.bottomPassed();
  }

  passed() {
    // @todo
  }

  screen() {
    if (this.cache.element.onScreen) {
      this.execute(this.props.onOnScreen, 'onScreen');
    } else if (!this.props.once) {
      this.cache.occurred.onScreen = false;
    }
  }

  offScreen() {
    if (this.cache.element.offScreen) {
      this.execute(this.props.onOffScreen, 'offScreen');
    } else if (!this.props.once) {
      this.cache.occurred.offScreen = false;
    }
  }

  passing() {
    if (this.cache.element.passing) {
      this.execute(this.props.onPassing, 'passing');
    } else if (!this.props.once) {
      this.cache.occurred.passing = false;
    }
  }

  topVisible() {
    if (this.cache.element.topVisible) {
      this.execute(this.props.onTopVisible, 'topVisible');
    } else if (!this.props.once) {
      this.cache.occurred.topVisible = false;
    }
  }

  bottomVisible() {
    if (this.cache.element.bottomVisible) {
      this.execute(this.props.onBottomVisible, 'bottomVisible');
    } else if (!this.props.once) {
      this.cache.occurred.bottomVisible = false;
    }
  }

  topPassed() {
    if (this.cache.element.topPassed) {
      this.execute(this.props.onTopPassed, 'topPassed');
    } else if (!this.props.once) {
      this.cache.occurred.topPassed = false;
    }
  }

  bottomPassed() {
    if (this.cache.element.bottomPassed) {
      this.execute(this.props.onBottomPassed, 'bottomPassed');
    } else if (!this.props.once) {
      this.cache.occurred.bottomPassed = false;
    }
  }

  passingReverse() {
    if (!this.cache.element.passing) {
      if (this.cache.occurred.passing) {
        this.execute(this.props.onPassingReverse, 'passingReverse');
      }
    } else if (!this.props.once) {
      this.cache.occurred.passingReverse = false;
    }
  }

  topVisibleReverse() {
    if (!this.cache.element.topVisible) {
      if (this.cache.occurred.topVisible) {
        this.execute(this.props.onTopVisibleReverse, 'topVisibleReverse');
      }
    } else if (!this.props.once) {
      this.cache.occurred.topVisibleReverse = false;
    }
  }

  bottomVisibleReverse() {
    if (!this.cache.element.bottomVisible) {
      if (this.cache.occurred.bottomVisible) {
        this.execute(this.props.onBottomVisibleReverse, 'bottomVisibleReverse');
      }
    } else if (!this.props.once) {
      this.cache.occurred.bottomVisibleReverse = false;
    }
  }

  topPassedReverse() {
    if (!this.cache.element.topPassed) {
      if (this.cache.occurred.topPassed) {
        this.execute(this.props.onTopPassedReverse, 'topPassedReverse');
      }
    } else if (!this.props.once) {
      this.cache.occurred.topPassedReverse = false;
    }
  }

  bottomPassedReverse() {
    if (!this.cache.element.bottomPassed) {
      if (this.cache.occurred.bottomPassed) {
        this.execute(this.props.onBottomPassedReverse, 'bottomPassedReverse');
      }
    } else if (!this.props.once) {
      this.cache.occurred.bottomPassedReverse = false;
    }
  }

  execute(callback, callbackName) {
    if (callback) {
      if (this.props.continuous) {
        this.debug(`Callback being called continuously ${callbackName}`);
        callback(this.wrapper, this.cache.element, this.cache.screen);
      } else if (!this.cache.occurred[callbackName]) {
        this.debug(`Conditions met ${callbackName}`);
        callback(this.wrapper, this.cache.element, this.cache.screen);
      }
      this.cache.occurred[callbackName] = true;
    }
  }

  debug(message) {
    if (this.props.debug) {
      console.log(message);
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div
        ref={(val) => (this.wrapper = val)}>
        {React.Children.map(children, (child) => child)}
      </div>
    );
  }
}

Visibility.metadata = {
  children: {
    type: 'node',
    defaultValue: [
      {
        control: 'Image',
      },
      {
        control: 'Container',
      },
      {
        control: 'Image',
      },
      {
        control: 'Container',
      },
      {
        control: 'Image',
      },
      {
        control: 'Container',
      },
      {
        control: 'Image',
      },
      {
        control: 'Container',
      },
      {
        control: 'Image',
      },
      {
        control: 'Container',
      },
      {
        control: 'Image',
      },
      {
        control: 'Container',
      },
    ],
  },
  once: {
    type: 'bool',
    defaultValue: true,
  },
  continuous: {
    type: 'bool',
  },
  type: {
    type: 'oneOf',
    values: [false, 'image', 'fixed'],
  },
  duration: {
    type: 'number',
    defaultValue: 1000,
  },
  initialCheck: {
    type: 'bool',
    defaultValue: true,
  },
  zIndex: {
    type: 'number',
    defaultValue: 1,
  },
  offset: {
    type: 'nuber',
    defaultValue: 0,
  },
  includeMargin: {
    type: 'bool',
  },
  debug: {
    type: 'bool',
    defaultValue: true,
  },
  __events: [
    'onOnScreen',
    'onOffScreen',
    'onTopVisible',
    'onTopPassed',
    'onBottomVisible',
    'onPassing',
    'onBottomPassed',
    'onTopVisibleReverse',
    'onTopPassedReverse',
    'onBottomVisibleReverse',
    'onPassingReverse',
    'onBottomPassedReverse',
  ],
};
