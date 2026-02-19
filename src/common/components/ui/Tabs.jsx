import React, { useState, createContext, useContext } from 'react';

/**
 * Tabs component with Tailwind CSS styling
 * Replaces react-bootstrap Tabs/Tab
 *
 * Usage:
 * <Tabs defaultActiveKey="tab1">
 *   <Tab eventKey="tab1" title="Tab 1">Content 1</Tab>
 *   <Tab eventKey="tab2" title="Tab 2">Content 2</Tab>
 * </Tabs>
 */

// Context for sharing tabs state
const TabsContext = createContext();

const Tabs = ({ children, defaultActiveKey, activeKey: controlledActiveKey, onSelect, className = '', ...props }) => {
  const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey);

  // Use controlled if provided, otherwise use internal state
  const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey;

  const handleSelect = (key) => {
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key);
    }
    onSelect?.(key);
  };

  return (
    <TabsContext.Provider value={{ activeKey, onSelect: handleSelect }}>
      <div className={`w-full ${className}`} {...props}>
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 mb-4">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;
            const { eventKey, title, disabled } = child.props;

            const isActive = activeKey === eventKey;

            return (
              <button
                onClick={() => !disabled && handleSelect(eventKey)}
                disabled={disabled}
                className={`
                  px-6 py-3 font-medium text-sm transition-all duration-200
                  border-b-2 -mb-px
                  ${isActive
                    ? 'border-secondary-event text-secondary-event'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tab-panel-${eventKey}`}
              >
                {title}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;
            const { eventKey } = child.props;

            if (activeKey !== eventKey) return null;

            return (
              <div
                role="tabpanel"
                id={`tab-panel-${eventKey}`}
                className="animate-fadeIn"
              >
                {child.props.children}
              </div>
            );
          })}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

const Tab = ({ children, eventKey, title, disabled = false, ...props }) => {
  // This component is just a placeholder for structure
  // The actual rendering is handled by Tabs component
  return null;
};

// Export compound component
Tabs.Tab = Tab;

export { Tab };
export default Tabs;
