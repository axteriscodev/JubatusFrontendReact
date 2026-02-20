import React, { useState, createContext } from 'react';

interface TabsContextValue {
  activeKey: string | undefined;
  onSelect: (key: string) => void;
}

const TabsContext = createContext<TabsContextValue>({
  activeKey: undefined,
  onSelect: () => undefined,
});

export interface TabProps {
  children?: React.ReactNode;
  eventKey: string;
  title: React.ReactNode;
  disabled?: boolean;
}

export const Tab = (_props: TabProps): null => {
  return null;
};

interface TabsComponent extends React.FC<TabsProps> {
  Tab: typeof Tab;
}

export interface TabsProps {
  children: React.ReactNode;
  defaultActiveKey?: string;
  activeKey?: string;
  onSelect?: (key: string) => void;
  className?: string;
}

const Tabs: TabsComponent = ({ children, defaultActiveKey, activeKey: controlledActiveKey, onSelect, className = '', ...props }) => {
  const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey);

  const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey;

  const handleSelect = (key: string) => {
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
            const { eventKey, title, disabled } = child.props as TabProps;

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
            const { eventKey } = child.props as TabProps;

            if (activeKey !== eventKey) return null;

            return (
              <div
                role="tabpanel"
                id={`tab-panel-${eventKey}`}
                className="animate-fadeIn"
              >
                {(child.props as TabProps).children}
              </div>
            );
          })}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

Tabs.Tab = Tab;

export default Tabs;
