import React, {
  Component,
} from 'react';
import Select from 'react-select';
import EchartSample from './EchartSample';
import EchartsData from '../data/echart';

import { DEFAULT_THEME, THEMES } from './EchartSample/themes';

class AllCharts extends Component {
  constructor() {
    super();
    this.state = {
      theme: DEFAULT_THEME,
    };
    this.setTheme = ::this.setTheme;
  }

  setTheme(theme) {
    this.setState({ theme });
  }

  render() {
    return (
      <div>
        <div className="row"><div className="col-md-4">
          <span>Theme:</span>
          <Select
            simpleValue
            value={this.state.theme}
            options={THEMES.map(
              (theme) => ({
                value: theme,
                label: theme,
              })
            )}
            onChange={(val) => this.setTheme(
              val || DEFAULT_THEME
            )}
          />
        </div></div>
        {Object.keys(EchartsData).map(
          (name) => (
            <EchartSample
              key={name}
              theme={this.state.theme}
              {...EchartsData[name]}
            />
          )
        )}
      </div>
    );
  }
}

export default AllCharts;